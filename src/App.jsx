import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import DevicesPage from './pages/DevicesPage'
import RegisterDevicePage from './pages/RegisterDevicePage'
import ConfigurationsPage from './pages/ConfigurationsPage'
import NewConfigurationPage from './pages/NewConfigurationPage'
import FleetsPage from './pages/FleetsPage'
import DeploymentsPage from './pages/DeploymentsPage'

export default function App() {
  const [page, setPage] = useState('devices')
  const [newConfigSource, setNewConfigSource] = useState(null)
  const [appliedConfig, setAppliedConfig] = useState(null)
  const [editingDevice, setEditingDevice] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [newDeviceId, setNewDeviceId] = useState(null)
  const [showToast, setShowToast] = useState(false)

  const handleConfirm = () => {
    setPage('devices')
    setRegistering(true)
  }

  useEffect(() => {
    if (!registering) return
    const id = setTimeout(() => {
      setRegistering(false)
      setNewDeviceId(1)
      setShowToast(true)
    }, 2500)
    return () => clearTimeout(id)
  }, [registering])

  useEffect(() => {
    if (!showToast) return
    const id = setTimeout(() => setShowToast(false), 4000)
    return () => clearTimeout(id)
  }, [showToast])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage={page} onNavigate={setPage} />
      <main className="relative flex-1 overflow-hidden">
        {page === 'devices' && (
          <DevicesPage
            onRegister={() => { setEditingDevice(null); setPage('register') }}
            onEditDevice={(device) => { setEditingDevice(device); setPage('register') }}
            newDeviceId={newDeviceId}
          />
        )}
        {page === 'fleets' && <FleetsPage />}
        {page === 'deployments' && <DeploymentsPage />}
        {page === 'configurations' && (
          <ConfigurationsPage onNewConfig={() => { setNewConfigSource(null); setPage('new-configuration') }} />
        )}
        {page === 'new-configuration' && (
          <NewConfigurationPage
            ctaLabel={newConfigSource === 'register' ? 'Review & Apply' : 'Review & Create'}
            onCancel={() => setPage(newConfigSource === 'register' ? 'register' : 'configurations')}
            onSave={(configName) => {
              if (newConfigSource === 'register') {
                setAppliedConfig(configName)
                setPage('register')
              } else {
                setPage('configurations')
              }
            }}
          />
        )}
        {page === 'register' && (
          <RegisterDevicePage
            onCancel={() => setPage('devices')}
            onConfirm={handleConfirm}
            onNewConfig={() => { setNewConfigSource('register'); setPage('new-configuration') }}
            initialConfig={appliedConfig}
            onConfigApplied={() => setAppliedConfig(null)}
            editingDevice={editingDevice}
          />
        )}

        {/* Registering overlay */}
        {registering && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-40 pointer-events-none">
            <div className="flex items-center gap-2.5 bg-background border border-border rounded-full px-4 py-2.5 shadow-md">
              <svg className="w-4 h-4 text-muted-foreground animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-[14px] font-medium text-foreground">Registering...</span>
            </div>
          </div>
        )}

        {/* Success toast */}
        {showToast && (
          <div className="absolute bottom-5 right-5 z-50 flex items-start gap-3 bg-foreground text-background rounded-xl px-4 py-3.5 shadow-lg w-[340px] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-semibold">Success! Your device have been registered</span>
              <span className="text-[13px] opacity-70">Manage its status from the Devices page</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
