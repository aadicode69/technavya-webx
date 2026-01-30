import Sidebar from "./Sidebar"
import EmployeeSidebar from "./EmployeeSidebar"
import Topbar from "./Topbar"

export default function DashboardLayout({ user, role, children }) {
  const isEmployee = role === "EMPLOYEE"

  return (
    <div className="flex min-h-screen bg-slate-100">
      {isEmployee ? (
        <EmployeeSidebar user={user} />
      ) : (
        <Sidebar user={user} />
      )}

      <div className="flex-1 p-6">{children}</div>
    </div>
  )
}

