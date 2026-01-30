import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Search, X, Mail, Briefcase, Calendar, Clock, FileText } from "lucide-react"

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [query, setQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [employeeDetails, setEmployeeDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    API.get("/users").then(res => setEmployees(res.data))
  }, [])

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase())
  )

  async function handleEmployeeClick(employee) {
    setSelectedEmployee(employee)
    setLoading(true)
    setEmployeeDetails(null)

    try {
      const response = await API.get(`/admin/employees/by-employee-id/${employee.employeeId}`)
      setEmployeeDetails(response.data)
    } catch (err) {
      console.error("Failed to fetch employee details:", err)
    } finally {
      setLoading(false)
    }
  }

  function closePanel() {
    setSelectedEmployee(null)
    setEmployeeDetails(null)
  }

  return (
    <DashboardLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Lexend:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Lexend', sans-serif;
        }
        
        .mono {
          font-family: 'IBM Plex Mono', monospace;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .slide-in {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .employee-card {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .employee-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        
        .status-badge {
          position: relative;
          overflow: hidden;
        }
        
        .status-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .status-badge:hover::before {
          left: 100%;
        }
      `}</style>

      <div className="min-h-screen bg-zinc-50 p-6 lg:p-8 font-comfortaa">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-900">
                Employees
              </h1>
              <p className="text-sm text-zinc-500">
                {employees.length} total • {filtered.length} shown
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                placeholder="Search by name..."
                className="w-full rounded-xl border-2 border-zinc-200 bg-white py-2.5 pl-11 pr-4 text-sm transition focus:border-zinc-900 focus:outline-none"
                onChange={e => setQuery(e.target.value)}
                value={query}
              />
            </div>
          </div>

          {/* Employee List */}
          <div className="grid gap-3">
            {filtered.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center">
                <p className="text-sm text-zinc-500">No employees found</p>
              </div>
            ) : (
              filtered.map(emp => (
                <div
                  key={emp._id}
                  className="employee-card flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 lg:p-5"
                  onClick={() => handleEmployeeClick(emp)}
                >
                  {/* Avatar */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 text-lg font-semibold text-white">
                    {emp.name[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-900 truncate">{emp.name}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                      <span className="mono truncate">{emp.email}</span>
                      {emp.employeeId && (
                        <>
                          <span>•</span>
                          <span className="mono">{emp.employeeId}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span className="status-badge shrink-0 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white">
                    {emp.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel Overlay */}
      {selectedEmployee && (
        <>
          {/* Backdrop */}
          <div
            className="fade-in fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={closePanel}
          />

          {/* Side Panel */}
          <div className="slide-in fixed right-0 top-0 z-50 h-full w-full overflow-y-auto bg-white shadow-2xl sm:w-[480px]">
            {/* Panel Header */}
            <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
              <div className="flex items-start justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 text-xl font-semibold text-white">
                    {selectedEmployee.name[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900">
                      {selectedEmployee.name}
                    </h2>
                    <p className="mono mt-0.5 text-sm text-zinc-500">
                      {selectedEmployee.employeeId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closePanel}
                  className="rounded-lg p-2 transition hover:bg-zinc-100"
                >
                  <X className="h-5 w-5 text-zinc-600" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900"></div>
                  <p className="mt-4 text-sm text-zinc-500">Loading details...</p>
                </div>
              ) : employeeDetails ? (
                <div className="space-y-6">
                  {/* Profile Section */}
                  <section>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Profile
                    </h3>
                    <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                      <InfoRow icon={<Mail />} label="Email" value={employeeDetails.profile?.email} />
                      <InfoRow icon={<Briefcase />} label="Role" value={employeeDetails.profile?.role} />
                    </div>
                  </section>

                  {/* Attendance Section */}
                  {employeeDetails.attendance && employeeDetails.attendance.length > 0 && (
                    <section>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Attendance Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <StatCard
                          label="Present"
                          value={employeeDetails.attendance.filter(a => a.status === "PRESENT").length}
                          color="bg-emerald-50 text-emerald-700"
                        />
                        <StatCard
                          label="Half Day"
                          value={employeeDetails.attendance.filter(a => a.status === "HALF_DAY").length}
                          color="bg-amber-50 text-amber-700"
                        />
                        <StatCard
                          label="Absent"
                          value={employeeDetails.attendance.filter(a => a.status === "ABSENT").length}
                          color="bg-rose-50 text-rose-700"
                        />
                        <StatCard
                          label="Leave"
                          value={employeeDetails.attendance.filter(a => a.status === "LEAVE").length}
                          color="bg-blue-50 text-blue-700"
                        />
                      </div>
                    </section>
                  )}

                  {/* Recent Attendance */}
                  {employeeDetails.attendance && employeeDetails.attendance.length > 0 && (
                    <section>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Recent Attendance
                      </h3>
                      <div className="space-y-2">
                        {employeeDetails.attendance.slice(-5).reverse().map((record, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-zinc-400" />
                              <div>
                                <p className="mono text-xs text-zinc-900">
                                  {new Date(record.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                {record.checkIn && (
                                  <p className="mono mt-0.5 text-xs text-zinc-500">
                                    {new Date(record.checkIn).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                            <StatusBadge status={record.status} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Leaves Section */}
                  {employeeDetails.leaves && employeeDetails.leaves.length > 0 && (
                    <section>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Leave Requests
                      </h3>
                      <div className="space-y-3">
                        {employeeDetails.leaves.slice(-5).reverse().map((leave, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-zinc-200 bg-white p-4"
                          >
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-zinc-400" />
                                <span className="text-sm font-medium text-zinc-900">
                                  {leave.leaveType || 'Leave'}
                                </span>
                              </div>
                              <StatusBadge status={leave.status} />
                            </div>
                            <div className="space-y-1.5 text-xs text-zinc-600">
                              {leave.startDate && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  <span className="mono">
                                    {new Date(leave.startDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                    {leave.endDate && ` - ${new Date(leave.endDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}`}
                                  </span>
                                </div>
                              )}
                              {leave.reason && (
                                <p className="mt-2 text-zinc-500">{leave.reason}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-zinc-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

/* ---------- COMPONENTS ---------- */

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-zinc-400">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="mono mt-0.5 text-sm font-medium text-zinc-900">{value || "N/A"}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <p className="mono text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide">{label}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    PRESENT: "bg-emerald-100 text-emerald-700",
    HALF_DAY: "bg-amber-100 text-amber-700",
    ABSENT: "bg-rose-100 text-rose-700",
    LEAVE: "bg-blue-100 text-blue-700",
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-orange-100 text-orange-700",
    REJECTED: "bg-red-100 text-red-700",
  }

  return (
    <span className={`mono rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-zinc-100 text-zinc-700"}`}>
      {status}
    </span>
  )
}