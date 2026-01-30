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
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    APPROVED: "bg-green-100 text-green-700 border-green-300",
    REJECTED: "bg-red-100 text-red-700 border-red-300",
  }

  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  )
}

export default function ApplyLeave() {
  const [user, setUser] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [reason, setReason] = useState("")
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

    await API.post("/leaves/apply", { reason, fromDate, toDate })
    const res = await API.get("/leaves/me")
    setLeaves(res.data)

    setReason("")
    setFromDate("")
    setToDate("")
    setLoading(false)
  }

  if (!user) return null

  return (
    <DashboardLayout user={user} role="EMPLOYEE">
      {/* PAGE WRAPPER */}
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Apply Leave</h1>
          <p className="mt-1 text-slate-500">
            Request time off and track approval status
          </p>
        </div>

        {/* APPLY FORM */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* Gradient Strip */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <form
            onSubmit={submitLeave}
            className="space-y-6 p-6 sm:p-8"
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Reason for Leave
              </label>
              <textarea
                required
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:border-indigo-500 focus:bg-white focus:outline-none"
                placeholder="Explain the reason for your leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  From Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  To Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-2.5 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Apply Leave"}
            </button>
          </form>
        </div>

        {/* LEAVE HISTORY */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            My Leave Requests
          </h2>

          {leaves.length === 0 ? (
            <p className="text-slate-500">No leave requests yet</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leaves.map((l) => (
                <div
                  key={l._id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Accent bar */}
                  <div
                    className={`mb-3 h-1 w-full rounded-full ${
                      l.status === "APPROVED"
                        ? "bg-green-400"
                        : l.status === "REJECTED"
                        ? "bg-red-400"
                        : "bg-yellow-400"
                    }`}
                  />

                  <p className="mb-2 font-semibold text-slate-900">
                    {l.reason}
                  </p>

                  <p className="mb-4 text-sm text-slate-500">
                    {formatDate(l.fromDate)} → {formatDate(l.toDate)}
                  </p>

                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
