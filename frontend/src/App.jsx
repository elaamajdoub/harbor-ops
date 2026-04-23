import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ShipsPage from './pages/ShipsPage'
import ContainersPage from './pages/ContainersPage'
import EquipmentPage from './pages/EquipmentPage'
import CargoPage from './pages/CargoPage'
import CommunicationsPage from './pages/CommunicationsPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center text-harbor-accent">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="ships" element={<ShipsPage />} />
          <Route path="containers" element={<ContainersPage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="cargo" element={<CargoPage />} />
          <Route path="communications" element={<CommunicationsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
