import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { SystemStatus } from '../../types'

interface AppLayoutProps {
  currentRoute: string
  onNavigate: (route: string) => void
  systemStatus: SystemStatus | null
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentRoute,
  onNavigate,
  systemStatus,
  children,
}) => {
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false)

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Sidebar for Desktop & Mobile */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isOpen={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
      />

      {/* Main Content Pane */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        <Navbar
          currentRoute={currentRoute}
          onNavigate={onNavigate}
          onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
          systemStatus={systemStatus}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  )
}
