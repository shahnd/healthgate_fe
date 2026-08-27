
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUserInfo } from "@/store/useAuthStore"
import { Settings2Icon, CommandIcon, Building2Icon, MegaphoneIcon, UsersIcon } from "lucide-react"
import { ModeToggle } from "./mode-toggle"


const data = {
  navMain: [
    {
      title: "대시보드",
      isActive: true,
      items: [
        {
          title: "대시보드",
          url: "/dashboard",
        },
        {
          title: "출근자 건강 정보",
          url: "/attendance",
        },
      ],
    },
    {
      title: "보건 상담 관리",
      isActive: true,
      items: [
        {
          title: "상담 예약 조회",
          url: "/consultation/reservation/list",
        },
        {
          title: "상담 예약 신청",
          url: "/consultation/reservation",
        },
        {
          title: "상담 내역 조회",
          url: "/consultation/list",
        },
      ],
    },
    {
      title: "건강검진 관리",
      isActive: true,
      items: [
        {
          title: "검진 완료율 통계",
          url: "/checkup/statistics",
        },
        {
          title: "검진 대상자 목록",
          url: "/checkup/targets",
        },
        {
          title: "자동 알림 설정",
          url: "/checkup/reminder-settings",
        },
        {
          title: "알림 발송 이력",
          url: "/checkup/reminders/history",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "병원 관리",
      url: "/hospitals/list",
      icon: (
        <Building2Icon />
      ),
    },
    {
      title: "공지사항 관리",
      url: "/notice/list",
      icon: (
        <MegaphoneIcon />
      ),
    },
    {
      title: "직원 관리",
      url: "/employees",
      icon: (
        <UsersIcon />
      ),
    },
    {
      title: "시스템 설정",
      url: "/settings",
      icon: (
        <Settings2Icon />
      ),
    },
  ],

}
export function AppSidebar({
  ...props
}) {

  const user = useUserInfo();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/" />}>
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">HealthGate</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name,
          number: user?.number,
        }} />
      </SidebarFooter>
    </Sidebar>
  );
}
