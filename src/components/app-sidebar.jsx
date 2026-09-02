
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
import { Settings2Icon, CommandIcon, Building2Icon, MegaphoneIcon, UsersIcon, LayoutDashboardIcon, ChartAreaIcon, MessageCircle, Stethoscope, BriefcaseIcon, ShieldAlertIcon } from "lucide-react"


const data = {
  navMain: [
    {
      title: "대시보드",
      icon: (
        <LayoutDashboardIcon />
      ),
      url: "/dashboard",
    },
    {
      title: "출근자 건강 정보",
      url: "/attendance",
      icon: (
        <BriefcaseIcon/>
      )
    },
    {
      title: "오늘의 안전 브리핑",
      url: "/safety-briefings/today",
      icon: (
        <ShieldAlertIcon/>
      )
    },
    {
      title: "보건 상담",
      isActive: true,
      icon: (
        <MessageCircle/>
      ),
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
          title: "상담 목록 조회",
          url: "/consultation/list",
        },
      ],
    },
    {
      title: "건강검진",
      isActive: true,
      icon: (
        <Stethoscope/>
      ),
      items: [
        {
          title: "검진 대상자 목록 조회",
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
    {
      title: "제휴 병원",
      icon: (
        <Building2Icon/>
      ),
      url: "/hospitals/list",
    },
    {
      title: "공지사항",
      icon: (
        <MegaphoneIcon/>
      ),
      url: "/notices/list",
    },
    {
      title: "직원",
      icon: (
        <UsersIcon/>
      ),
      url: "/employees",
    },
  ],
  navSecondary: [
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
              render={<a href="/bioinput" />}>
              <img
                src="/healthgate_logo.png"
                alt="logo"
                className="size-10! object-contain"
              />
              <span className="text-base font-semibold">
                <span className="text-primary">Health</span>Gate
              </span>
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
