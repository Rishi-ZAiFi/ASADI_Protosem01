import React, { useState, useEffect } from 'react'
import { ALL_TOOLS } from './constants/tools'
import { SystemStatus, HistoryItem } from './types'
import { getSystemStatus, getHistory } from './services/api'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { SettingsPage } from './pages/SettingsPage'
import { SavedContentPage } from './pages/SavedContentPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ToolPage } from './components/tools/ToolPage'

export function App() {
  // Sync route with URL hash if present
  const getInitialRoute = () => {
    const hash = window.location.hash.replace(/^#\/?/, '').trim()
    if (hash && (ALL_TOOLS.some((t) => t.id === hash) || ['settings', 'saved-content', 'projects', 'dashboard'].includes(hash))) {
      return hash
    }
    return 'dashboard'
  }

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const fetchStatusAndHistory = async (retries = 3) => {
    try {
      const [status, hist] = await Promise.all([
        getSystemStatus(),
        getHistory(),
      ])
      setSystemStatus(status)
      setHistory(hist)
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchStatusAndHistory(retries - 1), 1200)
      } else {
        console.warn('Backend server status unavailable:', err)
      }
    }
  }

  useEffect(() => {
    fetchStatusAndHistory()
  }, [])

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim()
      if (hash) {
        setCurrentRoute(hash)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleNavigate = (route: string) => {
    setCurrentRoute(route)
    window.location.hash = `#${route}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Find active tool if navigating to one of 22 tools
  const activeTool = ALL_TOOLS.find((t) => t.id === currentRoute)

  return (
    <AppLayout
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
      systemStatus={systemStatus}
    >
      {currentRoute === 'dashboard' && (
        <DashboardPage
          onNavigate={handleNavigate}
          systemStatus={systemStatus}
          history={history}
        />
      )}

      {currentRoute === 'settings' && (
        <SettingsPage
          systemStatus={systemStatus}
          onRefreshStatus={fetchStatusAndHistory}
        />
      )}

      {currentRoute === 'saved-content' && (
        <SavedContentPage
          onNavigate={handleNavigate}
          onRefreshStats={fetchStatusAndHistory}
        />
      )}

      {currentRoute === 'projects' && (
        <ProjectsPage
          onNavigate={handleNavigate}
          onRefreshStats={fetchStatusAndHistory}
        />
      )}

      {activeTool && (
        <ToolPage
          key={activeTool.id}
          tool={activeTool}
          onOpenSettings={() => handleNavigate('settings')}
          onRefreshStats={fetchStatusAndHistory}
        />
      )}
    </AppLayout>
  )
}

export default App
