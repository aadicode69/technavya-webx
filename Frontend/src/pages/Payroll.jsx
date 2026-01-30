import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { DollarSign, Edit2, Save, X, TrendingUp, Calculator, User, ChevronRight } from "lucide-react"

export default function Payroll() {
  const [currentUser, setCurrentUser] = useState(null)
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [payrollForm, setPayrollForm] = useState({
    employeeId: "",
    monthlyWage: "",
    basicPercent: "",
    hraPercent: "",
    performancePercent: "",
    ltaPercent: "",
    standardAllowance: "",
    pfRate: "",
    professionalTax: ""
  })
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [myPayroll, setMyPayroll] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Get current user
        const userRes = await API.get("/users/me")
        setCurrentUser(userRes.data.profile || userRes.data)

        // If admin, load all employees
        if (userRes.data.profile?.role === "ADMIN" || userRes.data.role === "ADMIN") {
          const empRes = await API.get("/users")
          setEmployees(empRes.data)
        } else {
          // If employee, load their payroll
          const payrollRes = await API.get("/payroll/me/view")
          setMyPayroll(payrollRes.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleEmployeeSelect(employee) {
    setSelectedEmployee(employee)
    setEditMode(false)
    
    try {
      // Try to fetch existing payroll
      const res = await API.get(`/payroll/employee/${employee.employeeId}`)
      setPayrollForm({
        employeeId: employee.employeeId,
        monthlyWage: res.data.monthlyWage || "",
        basicPercent: res.data.basicPercent || "",
        hraPercent: res.data.hraPercent || "",
        performancePercent: res.data.performancePercent || "",
        ltaPercent: res.data.ltaPercent || "",
        standardAllowance: res.data.standardAllowance || "",
        pfRate: res.data.pfRate || "",
        professionalTax: res.data.professionalTax || ""
      })
    } catch (err) {
      // No existing payroll, reset form with employee ID
      setPayrollForm({
        employeeId: employee.employeeId,
        monthlyWage: "",
        basicPercent: "",
        hraPercent: "",
        performancePercent: "",
        ltaPercent: "",
        standardAllowance: "",
        pfRate: "",
        professionalTax: ""
      })
      setEditMode(true)
    }
  }

  async function handleSubmitPayroll(e) {
    e.preventDefault()
    
    try {
      await API.post("/payroll", {
        employeeId: payrollForm.employeeId,
        monthlyWage: Number(payrollForm.monthlyWage),
        basicPercent: Number(payrollForm.basicPercent),
        hraPercent: Number(payrollForm.hraPercent),
        performancePercent: Number(payrollForm.performancePercent),
        ltaPercent: Number(payrollForm.ltaPercent),
        standardAllowance: Number(payrollForm.standardAllowance),
        pfRate: Number(payrollForm.pfRate),
        professionalTax: Number(payrollForm.professionalTax)
      })
      
      // Refresh the data
      const res = await API.get(`/payroll/employee/${payrollForm.employeeId}`)
      setPayrollForm({
        employeeId: payrollForm.employeeId,
        monthlyWage: res.data.monthlyWage,
        basicPercent: res.data.basicPercent,
        hraPercent: res.data.hraPercent,
        performancePercent: res.data.performancePercent,
        ltaPercent: res.data.ltaPercent,
        standardAllowance: res.data.standardAllowance,
        pfRate: res.data.pfRate,
        professionalTax: res.data.professionalTax
      })
      setEditMode(false)
    } catch (err) {
      console.error("Failed to set payroll:", err)
    }
  }

  function calculateNetSalary() {
    const monthly = Number(payrollForm.monthlyWage) || 0
    const pf = Number(payrollForm.pfRate) || 0
    const pt = Number(payrollForm.professionalTax) || 0
    return monthly - ((monthly * pf) / 100) - pt
  }

  if (loading) {
    return (
      <DashboardLayout user={currentUser}>
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900"></div>
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Employee View
  if (currentUser?.role !== "ADMIN") {
    return (
      <DashboardLayout user={currentUser}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
          }
          
          .serif {
            font-family: 'Libre Baskerville', serif;
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="serif mb-2 text-3xl font-bold text-slate-900">
                My Payroll
              </h1>
              <p className="text-sm text-slate-600">Your compensation details</p>
            </div>

            {myPayroll ? (
              <div className="space-y-6">
                {/* Main Salary Card */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white shadow-xl">
                  <div className="mb-6 flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-emerald-400" />
                    <div>
                      <p className="text-sm text-slate-400">Monthly Gross Salary</p>
                      <p className="serif text-4xl font-bold">
                        ₹{myPayroll.monthlyWage?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-700"></div>

                  <div className="mt-6">
                    <p className="mb-2 text-sm text-slate-400">Net Take Home</p>
                    <p className="serif text-3xl font-bold text-emerald-400">
                      ₹{myPayroll.netSalary?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="serif mb-4 text-xl font-semibold text-slate-900">
                    Salary Breakdown
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <BreakdownItem 
                      label="Basic" 
                      value={`${myPayroll.basicPercent}%`}
                      amount={Math.round((myPayroll.monthlyWage * myPayroll.basicPercent) / 100)}
                    />
                    <BreakdownItem 
                      label="HRA" 
                      value={`${myPayroll.hraPercent}%`}
                      amount={Math.round((myPayroll.monthlyWage * myPayroll.hraPercent) / 100)}
                    />
                    <BreakdownItem 
                      label="Performance" 
                      value={`${myPayroll.performancePercent}%`}
                      amount={Math.round((myPayroll.monthlyWage * myPayroll.performancePercent) / 100)}
                    />
                    <BreakdownItem 
                      label="LTA" 
                      value={`${myPayroll.ltaPercent}%`}
                      amount={Math.round((myPayroll.monthlyWage * myPayroll.ltaPercent) / 100)}
                    />
                    <BreakdownItem 
                      label="Standard Allowance" 
                      value=""
                      amount={myPayroll.standardAllowance}
                    />
                  </div>
                </div>

                {/* Deductions */}
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
                  <h2 className="serif mb-4 text-xl font-semibold text-rose-900">
                    Deductions
                  </h2>

                  <div className="space-y-3">
                    <DeductionItem 
                      label="Provident Fund (PF)" 
                      value={`${myPayroll.pfRate}%`}
                      amount={Math.round((myPayroll.monthlyWage * myPayroll.pfRate) / 100)}
                    />
                    <DeductionItem 
                      label="Professional Tax" 
                      value=""
                      amount={myPayroll.professionalTax}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12">
                <DollarSign className="mb-4 h-16 w-16 text-slate-300" />
                <p className="text-slate-600">No payroll information available</p>
                <p className="mt-1 text-sm text-slate-500">Please contact HR</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Admin View
  return (
    <DashboardLayout user={currentUser}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .serif {
          font-family: 'Libre Baskerville', serif;
        }

        .employee-item {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .employee-item:hover {
          transform: translateX(4px);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="serif mb-2 text-3xl font-bold text-slate-900">
              Payroll Management
            </h1>
            <p className="text-sm text-slate-600">Set and manage employee compensation</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Employee List */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="serif mb-4 text-lg font-semibold text-slate-900">
                  Employees
                </h2>

                <div className="space-y-2">
                  {employees.map(emp => (
                    <div
                      key={emp._id}
                      onClick={() => handleEmployeeSelect(emp)}
                      className={`employee-item flex items-center justify-between rounded-lg border p-3 ${
                        selectedEmployee?._id === emp._id
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                          {emp.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.employeeId}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payroll Form */}
            <div className="lg:col-span-8">
              {selectedEmployee ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6 text-slate-600" />
                      <div>
                        <h2 className="serif text-xl font-semibold text-slate-900">
                          {selectedEmployee.name}
                        </h2>
                        <p className="text-sm text-slate-500">{selectedEmployee.employeeId}</p>
                      </div>
                    </div>

                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditMode(false)}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitPayroll} className="space-y-6">
                    {/* Monthly Wage */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Monthly Wage (₹)
                      </label>
                      <input
                        type="number"
                        value={payrollForm.monthlyWage}
                        onChange={(e) => setPayrollForm({ ...payrollForm, monthlyWage: e.target.value })}
                        disabled={!editMode}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-lg font-semibold transition focus:border-slate-900 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                        placeholder="50000"
                      />
                    </div>

                    {/* Percentages Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="Basic %"
                        value={payrollForm.basicPercent}
                        onChange={(e) => setPayrollForm({ ...payrollForm, basicPercent: e.target.value })}
                        disabled={!editMode}
                        placeholder="50"
                      />
                      <FormField
                        label="HRA %"
                        value={payrollForm.hraPercent}
                        onChange={(e) => setPayrollForm({ ...payrollForm, hraPercent: e.target.value })}
                        disabled={!editMode}
                        placeholder="50"
                      />
                      <FormField
                        label="Performance %"
                        value={payrollForm.performancePercent}
                        onChange={(e) => setPayrollForm({ ...payrollForm, performancePercent: e.target.value })}
                        disabled={!editMode}
                        placeholder="8.33"
                      />
                      <FormField
                        label="LTA %"
                        value={payrollForm.ltaPercent}
                        onChange={(e) => setPayrollForm({ ...payrollForm, ltaPercent: e.target.value })}
                        disabled={!editMode}
                        placeholder="8.33"
                      />
                    </div>

                    {/* Allowances & Deductions */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        label="Standard Allowance (₹)"
                        value={payrollForm.standardAllowance}
                        onChange={(e) => setPayrollForm({ ...payrollForm, standardAllowance: e.target.value })}
                        disabled={!editMode}
                        placeholder="4167"
                      />
                      <FormField
                        label="PF Rate %"
                        value={payrollForm.pfRate}
                        onChange={(e) => setPayrollForm({ ...payrollForm, pfRate: e.target.value })}
                        disabled={!editMode}
                        placeholder="12"
                      />
                      <FormField
                        label="Professional Tax (₹)"
                        value={payrollForm.professionalTax}
                        onChange={(e) => setPayrollForm({ ...payrollForm, professionalTax: e.target.value })}
                        disabled={!editMode}
                        placeholder="200"
                      />
                    </div>

                    {/* Computed Net Salary */}
                    {payrollForm.monthlyWage && (
                      <div className="rounded-lg bg-emerald-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                            <Calculator className="h-4 w-4" />
                            Computed Net Salary
                          </div>
                          <p className="serif text-2xl font-bold text-emerald-900">
                            ₹{calculateNetSalary().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {editMode && (
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
                      >
                        <Save className="h-4 w-4" />
                        Save Payroll
                      </button>
                    )}
                  </form>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12">
                  <TrendingUp className="mb-4 h-16 w-16 text-slate-300" />
                  <p className="text-slate-600">Select an employee to manage payroll</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ---------- COMPONENTS ---------- */

function FormField({ label, value, onChange, disabled, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 transition focus:border-slate-900 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
        placeholder={placeholder}
      />
    </div>
  )
}

function BreakdownItem({ label, value, amount }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {value && <span className="text-xs text-slate-500">{value}</span>}
      </div>
      <p className="text-xl font-semibold text-slate-900">₹{amount.toLocaleString()}</p>
    </div>
  )
}

function DeductionItem({ label, value, amount }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-rose-900">{label}</p>
        {value && <p className="text-xs text-rose-700">{value}</p>}
      </div>
      <p className="text-lg font-semibold text-rose-900">-₹{amount.toLocaleString()}</p>
    </div>
  )
}