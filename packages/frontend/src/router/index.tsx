import { Routes, Route, Navigate } from 'react-router-dom';
import { App } from '../App';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthGuard } from '../components/guards/AuthGuard';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AppointmentsPage } from '../pages/appointments/AppointmentsPage';
import { ClientsPage } from '../pages/clients/ClientsPage';
import { ServicesPage } from '../pages/services/ServicesPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
