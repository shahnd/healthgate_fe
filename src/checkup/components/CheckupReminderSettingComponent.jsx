import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import "@/common/styles/ActionButton.css";
import "@/common/styles/Common.css";
import "@/common/styles/ListComponent.css";
import PageHeader from "@/common/components/PageHeader";
import { Stethoscope } from "lucide-react";

const CHECKUP_API_URL = "/healthgate/checkups";
const INITIAL_SETTING_FORM = {
  settingType: "MISSING_CHECKUP",
  messageTemplate: "건강검진을 완료해 주세요.",
  scheduleType: "MONTHLY",
  scheduleDay: "MON",
  scheduleDate: "1",
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

  const closeSettingForm = () => {
    setEditingSettingId(null);
    setSettingForm({ ...INITIAL_SETTING_FORM });
  };

  const startEditingSetting = (setting) => {
    if (editingSettingId === setting.settingId) {
      closeSettingForm();
      return;
    }

    const schedule = parseCronSchedule(setting.cronSchedule);
    setEditingSettingId(setting.settingId);
    setSettingForm({
      settingType: setting.settingType,
      messageTemplate: setting.messageTemplate,
      scheduleType: schedule.scheduleType,
      scheduleDay: schedule.scheduleDay,
      scheduleDate: schedule.scheduleDate,
      scheduleTime: schedule.scheduleTime,
      active: setting.active,
    });
  };

  const saveReminderSetting = async (event) => {
    event.preventDefault();
    if (editingSettingId === null) {
      return;
    }
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
      cronSchedule: createCronSchedule(settingForm.scheduleType, settingForm.scheduleDay, settingForm.scheduleDate, settingForm.scheduleTime),
      active: settingForm.active,
    };

    setSaving(true);
    try {
      await axios.put(`${CHECKUP_API_URL}/reminder-settings/${editingSettingId}`, requestData);
      alert("자동 알림 설정이 변경되었습니다.");
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
      <PageHeader title="자동 알림 설정" description="건강검진 자동 알림의 발송 조건과 일정을 관리합니다." icon={Stethoscope}/>

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
        <span className="text-sm text-slate-500">설정할 알림 행을 선택하세요.</span>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan="4" className="py-14 text-center text-slate-500">자동 알림 설정을 불러오는 중입니다.</TableCell></TableRow>
                ) : settingList.length === 0 ? (
                  <TableRow><TableCell colSpan="4" className="py-14 text-center text-slate-500">등록된 자동 알림 설정이 없습니다.</TableCell></TableRow>
                ) : settingList.map((setting) => (
                  <TableRow
                    key={setting.settingId}
                    tabIndex={0}
                    aria-selected={editingSettingId === setting.settingId}
                    onClick={() => startEditingSetting(setting)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        startEditingSetting(setting);
                      }
                    }}
                    className={`cursor-pointer transition-colors hover:bg-blue-50 ${
                      editingSettingId === setting.settingId
                        ? "border-l-4 border-l-blue-600 bg-blue-50"
                        : ""
                    }`}
                  >
                    <TableCell>{getSettingTypeName(setting.settingType)}</TableCell>
                    <TableCell>
                      <p className="font-medium">{getScheduleDescription(setting.cronSchedule)}</p>
                    </TableCell>
                    <TableCell title={setting.messageTemplate}>{setting.messageTemplate}</TableCell>
                    <TableCell className="!overflow-visible !text-clip"><ActiveStatusBadge active={setting.active} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5">
          {editingSettingId === null ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <Stethoscope className="mb-4 h-10 w-10 text-slate-300" />
              <h2 className="text-base font-bold text-slate-700">알림 설정을 선택해 주세요</h2>
              <p className="mt-2 text-sm text-slate-500">
                왼쪽 목록에서 변경할 알림 행을 클릭하면 설정 화면이 표시됩니다.
              </p>
            </div>
          ) : (
          <>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">{getSettingTypeName(settingForm.settingType)} 설정</h2>
          </div>

          <form onSubmit={saveReminderSetting} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormSelect id="settingType" name="settingType" label="설정 종류" value={settingForm.settingType} onChange={changeSettingForm} disabled>
                <option value="BEFORE_CHECKUP">검진일 이전 알림</option>
                <option value="MISSING_CHECKUP">미검진자 알림</option>
                <option value="AFTER_CHECKUP">검진 후 알림</option>
              </FormSelect>
              <FormSelect id="scheduleType" name="scheduleType" label="실행 주기" value={settingForm.scheduleType} onChange={changeSettingForm}>
                <option value="DAILY">매일</option>
                <option value="WEEKDAY">평일</option>
                <option value="WEEKLY">매주</option>
                <option value="MONTHLY">매월</option>
              </FormSelect>
            </div>

            {settingForm.scheduleType === "WEEKLY" && (
              <FormSelect id="scheduleDay" name="scheduleDay" label="실행 요일" value={settingForm.scheduleDay} onChange={changeSettingForm}>
                <option value="MON">월요일</option><option value="TUE">화요일</option><option value="WED">수요일</option>
                <option value="THU">목요일</option><option value="FRI">금요일</option><option value="SAT">토요일</option><option value="SUN">일요일</option>
              </FormSelect>
            )}

            {settingForm.scheduleType === "MONTHLY" && (
              <FormSelect id="scheduleDate" name="scheduleDate" label="실행일" value={settingForm.scheduleDate} onChange={changeSettingForm}>
                {Array.from({ length: 28 }, (_, index) => index + 1).map((date) => (
                  <option key={date} value={String(date)}>{date}일</option>
                ))}
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
              <Button type="button" variant="outline" size="sm" onClick={closeSettingForm} disabled={saving}>변경 취소</Button>
              <Button type="submit" size="sm" className="primary-button" disabled={saving}>
                {saving ? "저장 중..." : "변경사항 저장"}
              </Button>
            </div>
          </form>
          </>
          )}
        </section>
      </div>
    </div>
  );
}

function FormSelect({ id, name, label, value, onChange, children, disabled = false }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>
      <select id={id} name={name} value={value} onChange={onChange} disabled={disabled}
        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500">
        {children}
      </select>
    </div>
  );
}

function createCronSchedule(scheduleType, scheduleDay, scheduleDate, scheduleTime) {
  const [hour, minute] = scheduleTime.split(":");
  if (scheduleType === "WEEKDAY") return `0 ${Number(minute)} ${Number(hour)} * * MON-FRI`;
  if (scheduleType === "WEEKLY") return `0 ${Number(minute)} ${Number(hour)} * * ${scheduleDay}`;
  if (scheduleType === "MONTHLY") return `0 ${Number(minute)} ${Number(hour)} ${Number(scheduleDate)} * *`;
  return `0 ${Number(minute)} ${Number(hour)} * * *`;
}

function parseCronSchedule(cronSchedule) {
  const fallback = { scheduleType: "MONTHLY", scheduleDay: "MON", scheduleDate: "1", scheduleTime: "09:00" };
  if (!cronSchedule) return fallback;
  const parts = cronSchedule.trim().split(/\s+/);
  if (parts.length !== 6) return fallback;
  const minute = String(Number(parts[1])).padStart(2, "0");
  const hour = String(Number(parts[2])).padStart(2, "0");
  if (parts[3] !== "*") return { scheduleType: "MONTHLY", scheduleDay: "MON", scheduleDate: parts[3], scheduleTime: `${hour}:${minute}` };
  if (parts[5] === "MON-FRI") return { scheduleType: "WEEKDAY", scheduleDay: "MON", scheduleDate: "1", scheduleTime: `${hour}:${minute}` };
  if (parts[5] !== "*") return { scheduleType: "WEEKLY", scheduleDay: parts[5], scheduleDate: "1", scheduleTime: `${hour}:${minute}` };
  return { scheduleType: "DAILY", scheduleDay: "MON", scheduleDate: "1", scheduleTime: `${hour}:${minute}` };
}

function getScheduleDescription(cronSchedule) {
  const schedule = parseCronSchedule(cronSchedule);
  const time = formatScheduleTime(schedule.scheduleTime);
  if (schedule.scheduleType === "MONTHLY") return `매월 ${schedule.scheduleDate}일 ${time}`;
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
  if (type === "BEFORE_CHECKUP") return "검진일 이전 알림";
  if (type === "MISSING_CHECKUP") return "미검진자 알림";
  if (type === "AFTER_CHECKUP") return "검진 후 알림";
  return type;
}

function ActiveStatusBadge({ active }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
      {active ? "활성화" : "비활성화"}
    </span>
  );
}
