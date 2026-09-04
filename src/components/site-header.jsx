import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ModeToggle } from "./mode-toggle";

const breadcrumbMap = {
  "/dashboard": ["대시보드"],
  "/attendance": ["출근자 건강 정보"],
  "/mypage": ["마이페이지"],
  "/mypage/password": ["마이페이지", "비밀번호 변경"],
  "/bioinput": ["건강 관리", "건강 데이터 입력"],
  "/employees": ["직원"],
  "/employees/new": ["직원", "직원 등록"],
  "/hospitals/list": ["제휴 병원"],
  "/hospitals/new": ["제휴 병원", "병원 등록"],
  "/consultation/reservation/list": ["보건 상담", "예약 조회"],
  "/consultation/reservation": ["보건 상담", "예약 신청"],
  "/consultation/list": ["보건 상담", "상담 내역"],
  "/checkup/statistics": ["건강검진", "검진 통계"],
  "/checkup/targets": ["건강검진", "검진 대상자"],
  "/checkup/reminder-settings": ["건강검진", "알림 설정"],
  "/checkup/reminders/history": ["건강검진", "알림 이력"],
  "/settings": ["시스템 설정"],
  "/notices/list": ["공지사항"],
  "/notices/new": ["공지사항", "공지사항 등록"],
  "/safety-briefings/today": ["오늘의 안전 브리핑"],
  "/safety-documents": ["안전문서"],
};

export function getBreadcrumbItems(pathname) {
  const routePatterns = [
    { match: /^\/employees\/[^/]+\/edit$/, items: ["직원", "직원 수정"] },
    { match: /^\/employees\/[^/]+$/, items: ["직원", "직원 상세"] },
    { match: /^\/hospitals\/[^/]+\/edit$/, items: ["제휴 병원", "병원 수정"] },
    { match: /^\/hospitals\/\d+$/, items: ["제휴 병원", "병원 상세"] },
    { match: /^\/notices\/[^/]+\/edit$/, items: ["공지사항", "공지사항 수정"] },
    { match: /^\/notices\/\d+$/, items: ["공지사항", "공지사항 상세"] },
    { match: /^\/consultation\/reservation\/detail\/[^/]+$/, items: ["보건 상담", "예약 상세"] },
    { match: /^\/consultation\/reservation\/[^/]+$/, items: ["보건 상담", "예약 수정"] },
    { match: /^\/consultation\/detail\/[^/]+$/, items: ["보건 상담", "상담 상세"] },
    { match: /^\/consultation\/\d+$/, items: ["보건 상담", "상담 일지"] },
  ];

  const matchedRoute = routePatterns.find(({ match }) => match.test(pathname));
  if (matchedRoute) {
    return matchedRoute.items;
  }

  return breadcrumbMap[pathname] || ["HealthGate"];
}

export function SiteHeader() {
  const { pathname } = useLocation();

  const breadcrumbItems = getBreadcrumbItems(pathname);

  const parent = breadcrumbItems.length > 1
    ? breadcrumbItems[0]
    : null;

  const current = breadcrumbItems[breadcrumbItems.length - 1];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            {parent && (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={getParentPath(pathname)}>
                    {parent}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )}

            <BreadcrumbItem>
              <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex-1 flex justify-end items-center pl-4">
            <ModeToggle/>
        </div>
      </div>
    </header>
  );
}

export function getParentPath(pathname) {
  if (pathname.startsWith("/employees")) {
    return "/employees";
  }

  if (pathname.startsWith("/hospitals")) {
    return "/hospitals/list";
  }

  if (pathname.startsWith("/notices")) {
    return "/notices/list";
  }

  if (pathname.startsWith("/consultation/reservation")) {
    return "/consultation/reservation/list";
  }

  if (pathname.startsWith("/consultation")) {
    return "/consultation/list";
  }

  if (pathname.startsWith("/checkup")) {
    return "/checkup/targets";
  }

  if (pathname.startsWith("/mypage")) {
    return "/mypage";
  }

  if (pathname.startsWith("/safety-briefings")) {
    return "/dashboard";
  }

  return "#";
}