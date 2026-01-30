import { Navigate } from "react-router-dom"
import HrDashboard from "@/components/dashboard/hrDash"
import EmployeeDashboard from "@/pages/EmployeeDashboard"

export default function RoleRoute() {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === "EMPLOYEE") {
    return <EmployeeDashboard />
  }

  // ADMIN / HR
  return <HrDashboard />
}
