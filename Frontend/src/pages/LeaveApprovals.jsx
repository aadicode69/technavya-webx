import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Check, X, Calendar, FileText, User } from "lucide-react"

export default function LeaveApprovals() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState({})

  useEffect(() => {
    API.get("/leaves")
      .then(res => setLeaves(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id, status, defaultComment) {
    try {
      const comment = comments[id] || defaultComment
      await API.put(`/leaves/${id}`, { 
        status: status,
        adminComment: comment 
      })
      setLeaves(leaves.map(l =>
        l._id === id ? { ...l, status, adminComment: comment } : l
      ))
      // Clear the comment after submitting
      setComments(prev => {
        const newComments = { ...prev }
        delete newComments[id]
        return newComments
      })
    } catch (err) {
      console.error("Failed to update leave status:", err)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900"></div>
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const pendingLeaves = leaves.filter(l => l.status === "Pending" || l.status === "PENDING")

  return (
    <DashboardLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Lexend', sans-serif;
        }
        
        .action-button {
          transition: all 0.2s ease;
        }
        
        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .action-button:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="min-h-screen bg-zinc-50 p-6 lg:p-8 font-comfortaa">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Leave Approvals
            </h1>
            <p className="text-sm text-zinc-500">
              {pendingLeaves.length} pending request{pendingLeaves.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Leave Requests */}
          <div className="grid gap-4">
            {leaves.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center">
                <FileText className="mx-auto mb-3 h-12 w-12 text-zinc-300" />
                <p className="text-sm text-zinc-500">No leave requests found</p>
              </div>
            ) : (
              leaves.map(l => (
                <div
                  key={l._id}
                  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Header */}
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 text-white">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">
                          {l.employee?.name || l.user?.name || 'Unknown Employee'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {l.employee?.employeeId || l.user?.employeeId || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={l.status} />
                  </div>

                  {/* Details */}
                  <div className="mb-4 space-y-3">
                    {/* Leave Type */}
                    {l.leaveType && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-zinc-400" />
                        <span className="font-medium text-zinc-700">{l.leaveType}</span>
                      </div>
                    )}

                    {/* Dates */}
                    {(l.startDate || l.endDate) && (
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span>
                          {l.startDate && new Date(l.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          {l.endDate && ` - ${new Date(l.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}`}
                        </span>
                      </div>
                    )}

                    {/* Reason */}
                    {l.reason && (
                      <div className="rounded-lg bg-zinc-50 p-3">
                        <p className="text-sm text-zinc-600">{l.reason}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {(l.status === "Pending" || l.status === "PENDING") && (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                          Admin Comment (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={comments[l._id] || ''}
                          onChange={(e) => setComments(prev => ({ ...prev, [l._id]: e.target.value }))}
                          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition focus:border-zinc-900 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateStatus(l._id, "APPROVED", "Approved")}
                          className="action-button flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(l._id, "REJECTED", "Rejected")}
                          className="action-button flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Show admin comment if already processed */}
                  {(l.status !== "Pending" && l.status !== "PENDING" && l.adminComment) && (
                    <div className="rounded-lg bg-zinc-100 p-3">
                      <p className="text-xs font-medium text-zinc-500">Admin Comment</p>
                      <p className="mt-1 text-sm text-zinc-700">{l.adminComment}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ---------- COMPONENTS ---------- */

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-100 text-rose-700 border-rose-200",
    REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[status] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
      {status || 'Unknown'}
    </span>
  )
}