
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
import { Settings2Icon, CommandIcon, Building2Icon, MegaphoneIcon, UsersIcon, LayoutDashboardIcon, ChartAreaIcon, MessageCircle, Stethoscope } from "lucide-react"


const data = {
  navMain: [
    {
      title: "메인",
      isActive: true,
      icon: (
        <LayoutDashboardIcon />
      ),
      items: [
        {
          title: "대시보드",
          url: "/dashboard",
        },
        {
          title: "출근자 건강 정보",
          url: "/attendance",
        },
        {
          title: "오늘의 안전 브리핑",
          url: "/safety-briefings/today",
        },
      ],
    },
    {
      title: "보건 상담 관리",
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
          title: "상담 내역 조회",
          url: "/consultation/list",
        },
      ],
    },
    {
      title: "건강검진 관리",
      isActive: true,
      icon: (
        <Stethoscope/>
      ),
      items: [
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
    {
      title: "제휴 병원",
      icon: (
        <Building2Icon/>
      ),
      items: [
        {
          title: "병원 관리",
          url: "/hospitals/list",
        },
      ],
    },
    {
      title: "공지사항",
      icon: (
        <MegaphoneIcon/>
      ),
      items: [
        {
          title: "공지사항 관리",
          url: "/notices/list",
        },
      ],
    },
    {
      title: "직원",
      icon: (
        <UsersIcon/>
      ),
      items: [
        {
          title: "직원 관리",
          url: "/employees",
        },
      ],
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
              render={<a href="/dashboard" />}>
              <img 
                src="/public/healthgate_logo.png" 
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
