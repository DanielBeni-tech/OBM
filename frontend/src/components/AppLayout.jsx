import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto pb-20 min-h-screen">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
