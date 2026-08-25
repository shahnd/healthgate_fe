"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "HealthGate",
      logo: (
        <GalleryVerticalEndIcon />
      ),
      plan: "물류현장 보건 관리 시스템",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "대시보드",
      url: "/dashboard",
      icon: (
        <TerminalSquareIcon />
      ),
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
      title: "보건상담",
      url: "#",
      icon: (
        <BotIcon />
      ),
      items: [
        {
          title: "상담예약 조회",
          url: "/consultation/reservation/list",
        },
        {
          title: "상담예약 신청",
          url: "/consultation/reservation",
        },
        {
          title: "상담내역 조회",
          url: "/consultation/list",
        },
      ],
    },
    {
      title: "건강검진",
      url: "#",
      icon: (
        <BookOpenIcon />
      ),
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
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon />
      ),
      items: [
        {
          title: "병원 관리",
          url: "/hospitals/list",
        },
        {
          title: "공지사항 관리",
          url: "/notice/list",
        },
        {
          title: "직원 관리",
          url: "/employees",
        },
      ],
    },
  ],
  projects: [
    {
      name: "병원 관리",
      url: "/hospitals/list",
      icon: (
        <FrameIcon />
      ),
    },
    {
      name: "공지사항 관리",
      url: "/notice/list",
      icon: (
        <PieChartIcon />
      ),
    },
    {
      name: "직원 관리",
      url: "/employees",
      icon: (
        <MapIcon />
      ),
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
