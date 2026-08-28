import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import "@/common/styles/ActionButton.css";
import "@/common/styles/Common.css";
import "@/common/styles/ListComponent.css";

const CHECKUP_API_URL = "http://localhost:8006/healthgate/checkups";
const INITIAL_SETTING_FORM = {
  settingType: "INCOMPLETE",
  messageTemplate: "건강검진을 완료해 주세요.",
  scheduleType: "DAILY",
  scheduleDay: "MON",
  scheduleTime: "09:00",
  active: true,
};

export default function CheckupReminderSettingComponent() {
  const [settingList, setSettingList] = useState([]);
  const [editingSettingId, setEditingSettingId] = useState(null);
  const [settingForm, setSettingForm] = useState({ ...INITIAL_SETTING_FORM });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReminderSettings = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(`${CHECKUP_API_URL}/reminder-settings`);
      setSettingList(response.data ?? []);
    } catch (error) {
      console.error("자동 알림 설정 조회 실패:", error);
      setErrorMessage("자동 알림 설정을 불러오지 못했습니다.");
      setSettingList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReminderSettings();
  }, [loadReminderSettings]);

  const changeSettingForm = (event) => {
    const { name, value } = event.target;
    setSettingForm((previous) => ({ ...previous, [name]: value }));
  };

  const resetSettingForm = () => {
    setEditingSettingId(null);
    setSettingForm({ ...INITIAL_SETTING_FORM });
  };

  const startEditingSetting = (setting) => {
    const schedule = parseCronSchedule(setting.cronSchedule);
    setEditingSettingId(setting.settingId);
    setSettingForm({
      settingType: setting.settingType,
      messageTemplate: setting.messageTemplate,
      scheduleType: schedule.scheduleType,
      scheduleDay: schedule.scheduleDay,
      scheduleTime: schedule.scheduleTime,
      active: setting.active,
    });
  };

  const refreshSettings = async () => {
    await loadReminderSettings();
    resetSettingForm();
  };

  const saveReminderSetting = async (event) => {
    event.preventDefault();
    if (!settingForm.messageTemplate.trim()) {
      alert("메시지 템플릿을 입력해 주세요.");
      return;
    }
    if (!settingForm.scheduleTime) {
      alert("실행 시간을 선택해 주세요.");
      return;
    }

    const requestData = {
      settingType: settingForm.settingType,
      messageTemplate: settingForm.messageTemplate.trim(),
      cronSchedule: createCronSchedule(settingForm.scheduleType, settingForm.scheduleDay, settingForm.scheduleTime),
      active: settingForm.active,
    };

    setSaving(true);
    try {
      if (editingSettingId !== null) {
        await axios.put(`${CHECKUP_API_URL}/reminder-settings/${editingSettingId}`, requestData);
        alert("자동 알림 설정이 수정되었습니다.");
      } else {
        await axios.post(`${CHECKUP_API_URL}/reminder-settings`, requestData);
        alert("자동 알림 설정이 등록되었습니다.");
      }
      resetSettingForm();
      await loadReminderSettings();
    } catch (error) {
      console.error("자동 알림 설정 저장 실패:", error);
      alert("자동 알림 설정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const activeCount = settingList.filter((setting) => setting.active).length;

  return (
    <div className="list-page">
      <div className="page-header">
        <h1>자동 알림 설정</h1>
        <p>건강검진 자동 알림의 발송 조건과 일정을 관리합니다.</p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{errorMessage}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-white px-5 py-4">
        <div className="flex items-center gap-5 text-sm">
          <span className="font-semibold">전체 설정 {settingList.length}</span>
          <span className="h-5 w-px bg-slate-200" />
          <span>활성화 <strong className="ml-1 text-emerald-600">{activeCount}</strong></span>
          <span className="h-5 w-px bg-slate-200" />
          <span>비활성화 <strong className="ml-1">{settingList.length - activeCount}</strong></span>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={resetSettingForm}>새 설정 등록</Button>
      </div>

      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
        <section className="min-w-0 rounded-lg border bg-white p-5">
          <h2 className="mb-4 text-base font-bold">등록된 자동 알림 설정</h2>
          <div className="list-table-wrapper">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>설정 종류</TableHead>
                  <TableHead>발송 일정</TableHead>
                  <TableHead>메시지</TableHead>
                  <TableHead className="w-[112px]">상태</TableHead>
                  <TableHead className="w-[88px]">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan="5" className="py-14 text-center text-slate-500">자동 알림 설정을 불러오는 중입니다.</TableCell></TableRow>
                ) : settingList.length === 0 ? (
                  <TableRow><TableCell colSpan="5" className="py-14 text-center text-slate-500">등록된 자동 알림 설정이 없습니다.</TableCell></TableRow>
                ) : settingList.map((setting) => (
                  <TableRow key={setting.settingId} className={editingSettingId === setting.settingId ? "bg-slate-50" : ""}>
                    <TableCell>{getSettingTypeName(setting.settingType)}</TableCell>
                    <TableCell>
                      <p className="font-medium">{getScheduleDescription(setting.cronSchedule)}</p>
                      <p className="mt-1 font-mono text-xs text-slate-400">{setting.cronSchedule}</p>
                    </TableCell>
                    <TableCell title={setting.messageTemplate}>{setting.messageTemplate}</TableCell>
                    <TableCell className="!overflow-visible !text-clip"><ActiveStatusBadge active={setting.active} /></TableCell>
                    <TableCell className="!overflow-visible !text-clip"><Button type="button" variant="outline" size="sm" onClick={() => startEditingSetting(setting)}>수정</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">{editingSettingId !== null ? "알림 설정 수정" : "새 알림 설정 등록"}</h2>
            <Button type="button" variant="outline" size="sm" onClick={refreshSettings} disabled={loading || saving}>
              {loading ? "조회 중..." : "새로고침"}
            </Button>
          </div>

          <form onSubmit={saveReminderSetting} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormSelect id="settingType" name="settingType" label="설정 종류" value={settingForm.settingType} onChange={changeSettingForm}>
                <option value="INCOMPLETE">미검진자 알림</option>
                <option value="BEFORE_CHECKUP">검진일 이전 알림</option>
              </FormSelect>
              <FormSelect id="scheduleType" name="scheduleType" label="실행 주기" value={settingForm.scheduleType} onChange={changeSettingForm}>
                <option value="DAILY">매일</option>
                <option value="WEEKDAY">평일</option>
                <option value="WEEKLY">매주</option>
              </FormSelect>
            </div>

            {settingForm.scheduleType === "WEEKLY" && (
              <FormSelect id="scheduleDay" name="scheduleDay" label="실행 요일" value={settingForm.scheduleDay} onChange={changeSettingForm}>
                <option value="MON">월요일</option><option value="TUE">화요일</option><option value="WED">수요일</option>
                <option value="THU">목요일</option><option value="FRI">금요일</option><option value="SAT">토요일</option><option value="SUN">일요일</option>
              </FormSelect>
            )}

            <div>
              <label htmlFor="scheduleTime" className="mb-2 block text-sm font-semibold">실행 시간</label>
              <input id="scheduleTime" name="scheduleTime" type="time" value={settingForm.scheduleTime} onChange={changeSettingForm}
                className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="messageTemplate" className="text-sm font-semibold">메시지 템플릿</label>
                <span className="text-xs text-slate-400">{settingForm.messageTemplate.length} / 500</span>
              </div>
              <textarea id="messageTemplate" name="messageTemplate" value={settingForm.messageTemplate} onChange={changeSettingForm}
                maxLength="500" rows="5" className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500" />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">자동 알림 상태</p>
              <div className="flex items-center gap-3">
                <Switch id="active" checked={settingForm.active}
                  onCheckedChange={(active) => setSettingForm((previous) => ({ ...previous, active }))} />
                <label htmlFor="active" className="text-sm text-slate-700">{settingForm.active ? "활성화" : "비활성화"}</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={resetSettingForm} disabled={saving}>취소</Button>
              <Button type="submit" className="primary-button" disabled={saving}>
                {saving ? "저장 중..." : editingSettingId !== null ? "저장" : "등록"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function FormSelect({ id, name, label, value, onChange, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>
      <select id={id} name={name} value={value} onChange={onChange}
        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500">
        {children}
      </select>
    </div>
  );
}

function createCronSchedule(scheduleType, scheduleDay, scheduleTime) {
  const [hour, minute] = scheduleTime.split(":");
  if (scheduleType === "WEEKDAY") return `0 ${Number(minute)} ${Number(hour)} * * MON-FRI`;
  if (scheduleType === "WEEKLY") return `0 ${Number(minute)} ${Number(hour)} * * ${scheduleDay}`;
  return `0 ${Number(minute)} ${Number(hour)} * * *`;
}

function parseCronSchedule(cronSchedule) {
  const fallback = { scheduleType: "DAILY", scheduleDay: "MON", scheduleTime: "09:00" };
  if (!cronSchedule) return fallback;
  const parts = cronSchedule.trim().split(/\s+/);
  if (parts.length !== 6) return fallback;
  const minute = String(Number(parts[1])).padStart(2, "0");
  const hour = String(Number(parts[2])).padStart(2, "0");
  if (parts[5] === "MON-FRI") return { scheduleType: "WEEKDAY", scheduleDay: "MON", scheduleTime: `${hour}:${minute}` };
  if (parts[5] !== "*") return { scheduleType: "WEEKLY", scheduleDay: parts[5], scheduleTime: `${hour}:${minute}` };
  return { scheduleType: "DAILY", scheduleDay: "MON", scheduleTime: `${hour}:${minute}` };
}

function getScheduleDescription(cronSchedule) {
  const schedule = parseCronSchedule(cronSchedule);
  const time = formatScheduleTime(schedule.scheduleTime);
  if (schedule.scheduleType === "WEEKDAY") return `평일 ${time}`;
  if (schedule.scheduleType === "WEEKLY") return `매주 ${getDayName(schedule.scheduleDay)} ${time}`;
  return `매일 ${time}`;
}

function formatScheduleTime(scheduleTime) {
  const [hourText, minute] = scheduleTime.split(":");
  const hour = Number(hourText);
  return `${hour < 12 ? "오전" : "오후"} ${hour % 12 || 12}:${minute}`;
}

function getDayName(day) {
  return { MON: "월요일", TUE: "화요일", WED: "수요일", THU: "목요일", FRI: "금요일", SAT: "토요일", SUN: "일요일" }[day] ?? day;
}

function getSettingTypeName(type) {
  if (type === "INCOMPLETE") return "미검진자 알림";
  if (type === "BEFORE_CHECKUP") return "검진일 이전 알림";
  return type;
}

function ActiveStatusBadge({ active }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
      {active ? "활성화" : "비활성화"}
    </span>
  );
}
