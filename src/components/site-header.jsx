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
  "/attendance": ["직원 관리", "출근 조회"],
  "/mypage": ["마이페이지"],
  "/bioinput": ["건강 관리", "건강 데이터 입력"],
  "/employees": ["직원 관리"],
  "/employees/new": ["직원 관리", "직원 등록"],
  "/hospitals/list": ["병원 관리"],
  "/hospitals/new": ["병원 관리", "병원 등록"],
  "/notice/list": ["공지사항"],
  "/consultation/reservation/list": ["보건 상담", "예약 관리"],
  "/consultation/reservation": ["보건 상담", "예약"],
  "/consultation/list": ["보건 상담", "상담 내역"],
  "/checkup/statistics": ["건강검진 관리", "검진 통계"],
  "/checkup/targets": ["건강검진 관리", "검진 대상자"],
  "/checkup/reminder-settings": ["건강검진 관리", "알림 설정"],
  "/checkup/reminders/history": ["건강검진 관리", "알림 이력"],
};

export function SiteHeader() {
  const { pathname } = useLocation();

  function getBreadcrumbItems(pathname) {
  if (pathname === "/employees") {
    return ["직원 관리"];
  }

  if (pathname === "/employees/new") {
    return ["직원 관리", "직원 등록"];
  }

  if (pathname.match(/^\/employees\/[^/]+\/edit$/)) {
    return ["직원 관리", "직원 수정"];
  }

  if (pathname.match(/^\/employees\/[^/]+$/)) {
    return ["직원 관리", "직원 상세"];
  }

  return breadcrumbMap[pathname] || ["HealthGate"];
}

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

function getParentPath(pathname) {
  if (
    pathname.startsWith("/employees")
  ) {
    return "/employees";
  }

  if (
    pathname.startsWith("/hospitals")
  ) {
    return "/hospitals/list";
  }

  if (
    pathname.startsWith("/consultation")
  ) {
    return "/consultation/list";
  }

  if (
    pathname.startsWith("/checkup")
  ) {
    return "/checkup/targets";
  }

  return "#";
}