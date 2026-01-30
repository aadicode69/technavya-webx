import { Bell } from "lucide-react"

export default function Topbar({ user }) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-lg font-semibold">HR Dashboard</h2>

      <div className="flex items-center gap-5">
        {/* Notification */}
        <div className="relative">
          <Bell className="text-gray-500" size={20} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>
        </div>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  )
}
