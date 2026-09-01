import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "@/common/styles/ActionButton.css";
import "@/common/styles/ListComponent.css";
import "@/common/styles/Common.css";
import PageHeader from "@/common/components/PageHeader";
import { Stethoscope } from "lucide-react";

const CHECKUP_API_URL =
  "http://localhost:8006/healthgate/checkups";

const CHANNEL_FILTER_LABELS = {
  ALL: "전체 채널",
  SMS: "SMS",
  EMAIL: "이메일",
};

const TYPE_FILTER_LABELS = {
  ALL: "전체 구분",
  MANUAL: "수동",
  AUTOMATIC: "자동",
};

export default function CheckupReminderHistoryComponent() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloading, setDownloading] = useState(false);

  // 화면 표시용 필터
  const [channelFilter, setChannelFilter] =
    useState("ALL");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  /**
   * 알림 발송 이력 조회
   */
  const loadReminderHistory =
    useCallback(async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get(
          `${CHECKUP_API_URL}/reminders/history`
        );

        setHistoryList(response.data ?? []);
      } catch (error) {
        console.error(
          "알림 발송 이력 조회 실패:",
          error
        );

        setErrorMessage(
          "알림 발송 이력을 불러오지 못했습니다."
        );

        setHistoryList([]);
      } finally {
        setLoading(false);
      }
    }, []);

  /**
   * 화면 최초 출력 시 이력 조회
   */
  useEffect(() => {
    loadReminderHistory();
  }, [loadReminderHistory]);

  /**
   * 선택한 채널과 발송 구분으로 목록 필터링
   */
  const filteredHistoryList = historyList.filter((history) => {
    const channelMatched =
      channelFilter === "ALL" ||
      history.channel === channelFilter;

    const historyType =
      history.manual ? "MANUAL" : "AUTOMATIC";

    const typeMatched =
      typeFilter === "ALL" ||
      historyType === typeFilter;

    return channelMatched && typeMatched;
  });

  /**
   * 현재 필터 조건으로 Excel 로그 다운로드
   */
  const downloadReminderHistoryExcel = async () => {
      setDownloading(true);
      setErrorMessage("");

      try {
        const params = {};

        if (channelFilter !== "ALL") {
          params.channel = channelFilter;
        }

        if (typeFilter === "MANUAL") {
          params.manual = true;
        } else if (typeFilter === "AUTOMATIC") {
          params.manual = false;
        }

        const response = await axios.get(
          `${CHECKUP_API_URL}/reminders/history/excel`,
          {
            params,
            responseType: "blob",
          }
        );

        const blobUrl = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const downloadLink = document.createElement("a");

        const today = new Date()
          .toISOString()
          .slice(0, 10)
          .replaceAll("-", "");

        downloadLink.href = blobUrl;
        downloadLink.download =
          `건강검진_알림발송이력_${today}.xlsx`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error(
          "알림 발송 이력 Excel 다운로드 실패:",
          error
        );

        setErrorMessage(
          "알림 발송 이력 Excel 파일을 다운로드하지 못했습니다."
        );
      } finally {
        setDownloading(false);
      }
  };

  return (
    <div className="list-page">
      {/* 페이지 제목 */}
      <PageHeader title="알림 발송 이력" description="건강검진 대상자에게 발송한 알림 내역을 확인합니다." icon={Stethoscope}/>

      {/* 필터 및 새로고침 */}
      <div className="list-toolbar">
        <div>
          <Select
              value={channelFilter}
              onValueChange={setChannelFilter}
            >
            <SelectTrigger className="w-[140px]" size="sm">
              <SelectValue placeholder="발송 채널">
                {CHANNEL_FILTER_LABELS[channelFilter]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">전체 채널</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="EMAIL">이메일</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
            <SelectTrigger className="w-[140px]" size="sm">
              <SelectValue placeholder="발송 구분">
                {TYPE_FILTER_LABELS[typeFilter]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">전체 구분</SelectItem>
                <SelectItem value="MANUAL">수동</SelectItem>
                <SelectItem value="AUTOMATIC">자동</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={loadReminderHistory}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? "조회 중..." : "새로고침"}
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={downloadReminderHistoryExcel}
          disabled={downloading || loading}
          className="primary-button"
        >
          {downloading ? "다운로드 중..." : "엑셀 다운로드"}
        </Button>
      </div>

      {/* 오류 메시지 */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* 발송 이력 테이블 */}
      <div className="list-table-wrapper">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  번호
                </TableHead>

                <TableHead>
                  검진 ID
                </TableHead>

                <TableHead>
                  채널
                </TableHead>

                <TableHead>
                  메시지 내용
                </TableHead>

                <TableHead>
                  발송 일시
                </TableHead>

                <TableHead>
                  상태
                </TableHead>

                <TableHead>
                  구분
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan="7"
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    알림 발송 이력을 불러오는 중입니다.
                  </TableCell>
                </TableRow>
              ) : filteredHistoryList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan="7"
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    조건에 해당하는 알림 발송 이력이
                    없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistoryList.map((history) => (
                  <TableRow
                    key={history.reminderId}
                    className="
                      border-t border-slate-100
                      text-sm text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <TableCell className="font-medium">
                      {history.reminderId}
                    </TableCell>

                    <TableCell>
                      {history.checkupId}
                    </TableCell>

                    <TableCell>
                      <ChannelBadge
                        channel={history.channel}
                      />
                    </TableCell>

                    <TableCell className="max-w-md whitespace-normal">
                      <p className="whitespace-pre-wrap break-words">
                        {history.content}
                      </p>
                    </TableCell>

                    <TableCell>
                      {formatDateTime(history.sentAt)}
                    </TableCell>

                    <TableCell>
                      <ReminderStatusBadge
                        status={history.status}
                      />
                    </TableCell>

                    <TableCell>
                      <ReminderTypeBadge
                        manual={history.manual}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}

/**
 * 발송 채널 표시
 */
function ChannelBadge({ channel }) {
  const channelName =
    getChannelName(channel);

  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1 text-xs font-semibold
        ${
          channel === "EMAIL"
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700"
        }
      `}
    >
      {channelName}
    </span>
  );
}

/**
 * 발송 성공 여부 표시
 */
function ReminderStatusBadge({ status }) {
  const successful = status === "SUCCESS";

  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1 text-xs font-semibold
        ${
          successful
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-600"
        }
      `}
    >
      {successful ? "성공" : status}
    </span>
  );
}

/**
 * 수동·자동 발송 구분 표시
 */
function ReminderTypeBadge({ manual }) {
  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1 text-xs font-semibold
        ${
          manual
            ? "bg-slate-200 text-slate-700"
            : "bg-amber-100 text-amber-700"
        }
      `}
    >
      {manual ? "수동" : "자동"}
    </span>
  );
}

/**
 * 발송 채널을 한글로 변환
 */
function getChannelName(channel) {
  if (channel === "SMS") {
    return "SMS";
  }

  if (channel === "EMAIL") {
    return "이메일";
  }

  return channel ?? "-";
}

/**
 * 날짜와 시간을 화면 형식으로 변환
 */
function formatDateTime(dateTime) {
  if (!dateTime) {
    return "-";
  }

  return dateTime
    .replace("T", " ")
    .split(".")[0];
}
