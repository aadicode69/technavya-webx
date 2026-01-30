import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  User,
  LogOut,
} from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"

export default function EmployeeSidebar({ user }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.clear()
    navigate("/")
  }

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/employee/dashboard" },
    { label: "Attendance", icon: CalendarCheck, path: "/employee/attendance" },
    { label: "Apply Leave", icon: FileText, path: "/employee/leave" },
    { label: "My Profile", icon: User, path: "/profile" },
  ]

  return (
    <aside className="flex w-72 flex-col bg-gradient-to-b from-indigo-700 via-indigo-600 to-purple-600 text-white">
      {/* Logo */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold">HR Portal</h2>
        <p className="text-sm text-indigo-200">Employee Account</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4">
        {menu.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-indigo-700 shadow"
                  : "text-indigo-100 hover:bg-indigo-500"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-indigo-400 px-6 py-4">
        <p className="text-sm text-indigo-100 truncate">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 text-sm text-red-200 hover:text-red-100"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
