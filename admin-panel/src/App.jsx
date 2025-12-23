import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import Points from "./pages/Points";
import NotFound from "./pages/NotFound";
import Logs from "./pages/Logs";
import Inventory from "./pages/Inventory";
import MaterialRequests from "./pages/MaterialRequests";
import SpareParts from "./pages/SpareParts";
import TechnicianSkills from "./pages/TechnicianSkillSet";
import TermsAndCondition from "./pages/TermsAndCondition";
import Issues from "./pages/Issues";
import AccountType from "./pages/AccountType";
import Road from "./pages/Road";
import Block from "./pages/Block";
import ServiceRequestDetails from "./pages/ServiceRequestDetails";
import AdminUser from "./pages/AdminUser";

export default function App() {
  return (
    <>
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
              path="/about-screen"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Intro />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/splash-screen"
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
            <Route
              path="/points"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Points />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/user-logs"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Logs />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Inventory />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/material-requests"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <MaterialRequests />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/spare-parts"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <SpareParts />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/technician-skill"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <TechnicianSkills />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/terms-condition"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <TermsAndCondition />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/issues"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Issues />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/account-type"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <AccountType />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/road"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Road />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/block"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Block />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/service-requests/:id"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ServiceRequestDetails />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-list"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <AdminUser />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
    </>
  );
}