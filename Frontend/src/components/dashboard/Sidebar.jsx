import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  DollarSign,
  User,
  LogOut,
} from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"

export default function Sidebar({ user }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.clear()
    navigate("/", { replace: true })
  }

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/hr/dashboard", end: true },
    { label: "Employees", icon: Users, path: "/employees" },
    { label: "Attendance", icon: CalendarCheck, path: "/attendance" },
    { label: "Leave Approvals", icon: ClipboardList, path: "/leaves" },
    { label: "Payroll", icon: DollarSign, path: "/payroll" },
  ]

  return (
    <aside className=" font-comfortaa flex w-72 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-6">
        <div className="rounded-xl bg-indigo-600 p-3 text-white shadow-lg">
          <Users size={22} />
        </div>
        <div>
          <p className="text-lg font-semibold">HR Portal</p>
          <p className="text-xs text-slate-400">HR Account</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Main Menu
        </p>

        {menu.map(({ label, icon: Icon, path, end }) => (
          <NavLink
            key={label}
            to={path}
            end={end}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

        <p className="mt-8 mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Personal
        </p>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`
          }
        >
          <User size={20} />
          My Profile
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 px-6 py-5">
        <p className="truncate text-sm text-slate-400">{user?.email}</p>

        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 text-sm text-red-400 transition hover:text-red-500"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
