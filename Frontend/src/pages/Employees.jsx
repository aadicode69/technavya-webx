import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Search, Users } from "lucide-react"

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    API.get("/users").then(res => setEmployees(res.data))
  }, [])

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-slate-500">Manage and view all employees</p>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            placeholder="Search employees..."
            className="w-full rounded-lg border py-2 pl-10 pr-3"
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map(emp => (
          <div key={emp._id} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
              {emp.name[0]}
            </div>

            <div className="flex-1">
              <p className="font-medium">{emp.name}</p>
              <p className="text-sm text-slate-500">{emp.email}</p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              {emp.role}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
