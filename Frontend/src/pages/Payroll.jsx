import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { DollarSign } from "lucide-react"

export default function Payroll() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    API.get("/payroll").then(res => setRecords(res.data))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-semibold">Payroll</h1>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-sm">
          <DollarSign className="mb-4 h-10 w-10 text-slate-300" />
          <p className="text-slate-500">No payroll records found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map(p => (
            <div key={p._id} className="rounded-xl bg-white p-5 shadow-sm">
              <p className="font-medium">{p.employee.name}</p>
              <p className="text-sm text-slate-500">₹ {p.amount}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
