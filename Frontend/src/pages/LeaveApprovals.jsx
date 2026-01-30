import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"

export default function LeaveApprovals() {
  const [leaves, setLeaves] = useState([])

  useEffect(() => {
    API.get("/leaves").then(res => setLeaves(res.data))
  }, [])

  async function updateStatus(id, status) {
    await API.put(`/leaves/${id}`, { status })
    setLeaves(leaves.map(l =>
      l._id === id ? { ...l, status } : l
    ))
  }

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-semibold">Leave Approvals</h1>

      <div className="grid gap-4">
        {leaves.map(l => (
          <div key={l._id} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="font-medium">{l.employee.name}</p>
            <p className="text-sm text-slate-500">{l.reason}</p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => updateStatus(l._id, "Approved")}
                className="rounded bg-green-500 px-4 py-2 text-sm text-white"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(l._id, "Rejected")}
                className="rounded bg-red-500 px-4 py-2 text-sm text-white"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
