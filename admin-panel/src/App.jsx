import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DashboardLayout from "./layout/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";
import Services from "./pages/Services";
import PrivateRoute from "./components/PrivateRoute";
import User from "./pages/User";
import Technicians from "./pages/Technicians";
import NotVerifiedUser from "./pages/NotVerifiedUser";
import Intro from "./pages/Intro";
import LoadingScreen from "./pages/LoadingScreen";
import ServiceRequest from "./pages/ServiceRequest";
import ServiceRequestList from "./pages/ServiceRequestList";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Services />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <User />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/technicians"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Technicians />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/not-verified"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <NotVerifiedUser />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/splash-screen"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Intro />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/about-screen"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <LoadingScreen />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/new-requests"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ServiceRequest />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/service-requests"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ServiceRequestList />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}