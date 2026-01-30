import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { User, Mail, Briefcase, MapPin, Pencil, Save, Calendar, Palmtree, DollarSign } from "lucide-react"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [leaves, setLeaves] = useState(null)
  const [payroll, setPayroll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({
    name: ""
  })

  useEffect(() => {
    async function load() {
      const res = await API.get("/users/me")
      console.log("Full API Response:", res.data) // Debug log
      
      // Extract all sections from the response
      const profileData = res.data.profile || res.data
      setUser(profileData)
      setAttendance(res.data.attendance || null)
      setLeaves(res.data.leaves || null)
      setPayroll(res.data.payroll || null)
      
      setForm({
        name: profileData.name || ""
      })
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    try {
      await API.put("/users/me", {
        name: form.name
      })
      
      const updated = await API.get("/users/me")
      const profileData = updated.data.profile || updated.data
      setUser(profileData)
      setAttendance(updated.data.attendance || null)
      setLeaves(updated.data.leaves || null)
      setPayroll(updated.data.payroll || null)
      setEdit(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  if (loading) {
    return <div className="p-6 text-slate-500">Loading profile...</div>
  }

  return (
    <DashboardLayout user={user} role={user.role}>
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-indigo-600">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{user?.name || "User"}</h1>
              <p className="text-indigo-100">{user?.role || "EMPLOYEE"}</p>
            </div>
          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm hover:bg-white/30"
          >
            <Pencil size={16} />
            {edit ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-6 text-lg font-semibold text-slate-800">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Employee ID */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                <Briefcase size={16} /> Employee ID
              </label>
              <input
                disabled
                value={user?.employeeId || ""}
                className="w-full rounded-lg border bg-slate-100 p-3"
              />
            </div>

            {/* Name */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                <User size={16} /> Full Name
              </label>
              <input
                disabled={!edit}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border p-3 disabled:bg-slate-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                <Mail size={16} /> Email
              </label>
              <input
                disabled
                value={user?.email || ""}
                className="w-full rounded-lg border bg-slate-100 p-3"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                <Briefcase size={16} /> Role
              </label>
              <input
                disabled
                value={user?.role || ""}
                className="w-full rounded-lg border bg-slate-100 p-3"
              />
            </div>
          </div>

          {edit && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveProfile}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm text-white hover:bg-green-700"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Attendance Summary */}
        {attendance && (
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Calendar size={20} />
              Attendance Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{attendance.present || 0}</p>
                <p className="text-sm text-slate-600">Present</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{attendance.halfDay || 0}</p>
                <p className="text-sm text-slate-600">Half Day</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{attendance.absent || 0}</p>
                <p className="text-sm text-slate-600">Absent</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{attendance.leave || 0}</p>
                <p className="text-sm text-slate-600">Leave</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaves Summary */}
        {leaves && (
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Palmtree size={20} />
              Leave Summary
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-2xl font-bold text-purple-600">{leaves.paidUsed || 0}</p>
                <p className="text-sm text-slate-600">Paid Leave Used</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <p className="text-2xl font-bold text-orange-600">{leaves.unpaidUsed || 0}</p>
                <p className="text-sm text-slate-600">Unpaid Leave Used</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-2xl font-bold text-amber-600">{leaves.pending || 0}</p>
                <p className="text-sm text-slate-600">Pending Requests</p>
              </div>
            </div>
          </div>
        )}

        {/* Payroll Information */}
        {payroll && (
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <DollarSign size={20} />
              Payroll Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm text-slate-600">Monthly Wage</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ₹{payroll.monthlyWage?.toLocaleString() || 0}
                </p>
              </div>
              <div className="rounded-lg bg-teal-50 p-4">
                <p className="text-sm text-slate-600">Net Salary</p>
                <p className="text-3xl font-bold text-teal-600">
                  ₹{payroll.netSalary?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}