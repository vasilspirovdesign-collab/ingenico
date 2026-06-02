import { useState } from 'react'
import Sidebar from './components/Sidebar'
import DevicesPage from './pages/DevicesPage'
import RegisterDevicePage from './pages/RegisterDevicePage'

export default function App() {
  const [page, setPage] = useState('devices')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {page === 'devices' && (
          <DevicesPage onRegister={() => setPage('register')} />
        )}
        {page === 'register' && (
          <RegisterDevicePage onCancel={() => setPage('devices')} />
        )}
      </main>
    </div>
  )
}
