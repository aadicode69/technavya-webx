import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"

export default function Attendance() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    API.get("/attendance").then(res => setRecords(res.data))
  }, [])

  return (
    <DashboardLayout role="ADMIN">
      <h1 className="mb-6 text-2xl font-semibold">Attendance</h1>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map(r => (
              <tr key={r._id} className="border-b last:border-0">
                <td className="p-4 font-medium">
                  {r.user?.name || "Unknown Employee"}
                </td>

                <td className="p-4">{r.date}</td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      r.status === "PRESENT"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
