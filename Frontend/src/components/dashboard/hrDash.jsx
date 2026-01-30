import { useEffect, useState } from "react"
import {
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  CalendarDays,
  UserX,
} from "lucide-react"
import API from "@/services/api"
import DashboardLayout from "./DashboardLayout"

export default function HrDashboard() {
  const [profile, setProfile] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const profileRes = await API.get("/users/me")
        const usersRes = await API.get("/users")

        setProfile(profileRes.data)
        setEmployees(Array.isArray(usersRes.data) ? usersRes.data : [])
      } catch (err) {
        console.error(err)
        setEmployees([])
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>
  }

  const totalEmployees = employees.length
  const presentToday = employees.filter((e) => e.status === "PRESENT").length
  const onLeave = employees.filter((e) => e.status === "ON_LEAVE").length
  const absent = employees.filter((e) => e.status === "ABSENT").length

  return (
    <DashboardLayout user={profile}>
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="text-gray-500">
            Overview of your organization&apos;s workforce
          </p>
        </div>
        <button className="rounded-lg border px-4 py-2 text-sm font-medium">
          View Employees
        </button>
      </div>

      {/* STATS */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users />}
          label="Total Employees"
          value={totalEmployees}
          color="bg-indigo-100 text-indigo-600"
          sub="+ this month"
        />
        <StatCard
          icon={<CheckCircle />}
          label="Present Today"
          value={presentToday}
          color="bg-green-100 text-green-600"
          sub={`${totalEmployees ? Math.round((presentToday / totalEmployees) * 100) : 0}% attendance`}
        />
        <StatCard
          icon={<Clock />}
          label="Pending Leaves"
          value={onLeave}
          color="bg-orange-100 text-orange-600"
          sub="Needs attention"
        />
        <StatCard
          icon={<DollarSign />}
          label="Payroll Due"
          value="5"
          color="bg-emerald-100 text-emerald-600"
          sub="In 5 days"
        />
      </div>

      {/* MIDDLE SECTION */}
      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending Leave */}
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Pending Leave Requests</h2>
              <p className="text-sm text-gray-500">
                Requests awaiting your approval
              </p>
            </div>
            <button className="rounded-md border px-3 py-1 text-sm">
              View All
            </button>
          </div>
          <p className="text-sm text-gray-500">No pending requests</p>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold">Quick Actions</h2>
          <p className="mb-4 text-sm text-gray-500">
            Frequently used HR functions
          </p>

          <div className="grid grid-cols-2 gap-4">
            <QuickAction icon={<Users />} label="Manage Employees" />
            <QuickAction icon={<CalendarDays />} label="View Attendance" />
            <QuickAction icon={<UserCheck />} label="Leave Approvals" />
            <QuickAction icon={<DollarSign />} label="Payroll Management" />
          </div>
        </div>
      </div>

      {/* TODAY OVERVIEW */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Today&apos;s Overview</h2>
        <p className="mb-6 text-sm text-gray-500">
          {new Date().toDateString()}
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <OverviewCard
            value={presentToday}
            label="Employees Present"
            color="bg-green-50 text-green-600"
          />
          <OverviewCard
            value={onLeave}
            label="On Leave Today"
            color="bg-orange-50 text-orange-600"
          />
          <OverviewCard
            value={absent}
            label="Absent"
            color="bg-red-50 text-red-600"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ---------- COMPONENTS ---------- */

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="rounded-2xl bg-white/70 p-6 shadow-md backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl">

      <div className={`mb-4 inline-flex rounded-lg p-3 ${color}`}>
        {icon}
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  )
}

function QuickAction({ icon, label }) {
  return (
    <button className="flex items-center gap-3 rounded-lg border p-4 text-sm hover:bg-gray-50">
      {icon}
      {label}
    </button>
  )
}

function OverviewCard({ value, label, color }) {
  return (
    <div className={`rounded-xl p-6 text-center ${color}`}>
      <p className="text-4xl font-bold">{value}</p>
      <p className="mt-2 text-sm">{label}</p>
    </div>
  )
}
