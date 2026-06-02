import Sidebar from './components/Sidebar'
import DevicesPage from './pages/DevicesPage'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <DevicesPage />
      </main>
    </div>
  )
}
