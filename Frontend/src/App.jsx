import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./components/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import HrDashboard from "./components/dashboard/HrDashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import LeaveApprovals from "./pages/LeaveApprovals"
import Payroll from "./pages/Payroll"
import EmployeeDashboard from "./pages/EmployeeDashboard"
import EmployeeAttendance from "./pages/employee/Attendance"
import ApplyLeave from "./pages/employee/ApplyLeave"
import Profile from "./pages/Profile"


function RequireAuth({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

function RoleRoute({ allowed, children }) {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user) return <Navigate to="/login" replace />
  return allowed.includes(user.role) ? children : <Navigate to="/" replace />
}

/* ---------------- APP ---------------- */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/hr/dashboard"
        element={
          <RequireAuth>
            <RoleRoute allowed={["ADMIN"]}>
              <HrDashboard />
            </RoleRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/employees"
        element={
          <RequireAuth>
            <RoleRoute allowed={["ADMIN"]}>
              <Employees />
            </RoleRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/attendance"
        element={
          <RequireAuth>
            <RoleRoute allowed={["ADMIN"]}>
              <Attendance />
            </RoleRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/leaves"
        element={
          <RequireAuth>
            <RoleRoute allowed={["ADMIN"]}>
              <LeaveApprovals />
            </RoleRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/payroll"
        element={
          <RequireAuth>
            <RoleRoute allowed={["ADMIN"]}>
              <Payroll />
            </RoleRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/employee/dashboard"
        element={
          <RequireAuth>
            <RoleRoute allowed={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </RoleRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/employee/attendance"
        element={
          <RequireAuth>
            <RoleRoute allowed={["EMPLOYEE"]}>
              <EmployeeAttendance />
            </RoleRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/employee/leave"
        element={
          <RequireAuth>
            <RoleRoute allowed={["EMPLOYEE"]}>
              <ApplyLeave />
            </RoleRoute>
          </RequireAuth>
        }
      />

      {/* SHARED */}
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
