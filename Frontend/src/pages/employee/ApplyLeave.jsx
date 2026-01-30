import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium tracking-wide ${
        styles[status] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  )
}

function LeaveTypeBadge({ type }) {
  const styles = {
    PAID: "bg-blue-50 text-blue-700",
    SICK: "bg-purple-50 text-purple-700",
    UNPAID: "bg-gray-50 text-gray-700",
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
        styles[type] || "bg-slate-50 text-slate-600"
      }`}
    >
      {type}
    </span>
  )
}

export default function ApplyLeave() {
  const [user, setUser] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [reason, setReason] = useState("")
  const [leaveType, setLeaveType] = useState("PAID")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const profile = await API.get("/users/me")
      const myLeaves = await API.get("/leaves/me")
      setUser(profile.data)
      setLeaves(myLeaves.data)
    }
    load()
  }, [])

  async function submitLeave(e) {
  e.preventDefault()
  setLoading(true)
  await API.post("/leaves/apply", {
    reason,
    type: leaveType,
    fromDate,
    toDate
  })
  const res = await API.get("/leaves/me")
  setLeaves(res.data)
  setReason("")
  setLeaveType("PAID")
  setFromDate("")
  setToDate("")
  setLoading(false)
}

  if (!user) return null

  return (
    <DashboardLayout user={user} role="EMPLOYEE">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 font-comfortaa">
        
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-slate-900">
            Leave Request
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Submit your time-off request and monitor approval status
          </p>
        </div>

        {/* APPLY FORM */}
        <div className="mb-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <form onSubmit={submitLeave} className="p-8 space-y-8">
            
            {/* Leave Type Selection */}
            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Leave Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["PAID", "SICK", "UNPAID"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLeaveType(type)}
                    className={`relative overflow-hidden rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
                      leaveType === type
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="relative z-10">
                      {type === "PAID" ? "Paid Leave" : type === "SICK" ? "Sick Leave" : "Unpaid Leave"}
                    </span>
                    {leaveType === type && (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-500">
                  From Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-500">
                  To Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Reason for Leave
              </label>
              <textarea
                required
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100"
                placeholder="Please provide details about your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                disabled={loading}
                className="group relative overflow-hidden rounded-xl bg-slate-900 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {loading ? "Submitting Request..." : "Submit Request"}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </div>
          </form>
        </div>

        {/* LEAVE HISTORY */}
        <div>
          <h2 className="mb-6 text-2xl font-light tracking-tight text-slate-900">
            Request History
          </h2>

          {leaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600">No leave requests yet</p>
              <p className="mt-1 text-xs text-slate-400">Your submitted requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaves.map((l) => (
                <div
                  key={l._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-2">
                          <LeaveTypeBadge type={l.leaveType} />
                          <StatusBadge status={l.status} />
                        </div>
                        
                        <p className="mb-2 text-base font-medium text-slate-900">
                          {l.reason}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {formatDate(l.fromDate)} — {formatDate(l.toDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status indicator bar */}
                  <div
                    className={`h-1 ${
                      l.status === "APPROVED"
                        ? "bg-emerald-500"
                        : l.status === "REJECTED"
                        ? "bg-rose-500"
                        : "bg-amber-500"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}