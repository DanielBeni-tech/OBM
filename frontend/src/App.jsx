import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import AppLayout from './components/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CashIn from './pages/CashIn.jsx'
import Clients from './pages/Clients.jsx'
import Sales from './pages/Sales.jsx'
import Assistant from './pages/Assistant.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="encaisser" element={<CashIn />} />
        <Route path="clients" element={<Clients />} />
        <Route path="ventes" element={<Sales />} />
        <Route path="profil" element={<Profile />} />
      </Route>
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <Assistant />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
