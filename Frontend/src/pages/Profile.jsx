import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { User, Mail, Briefcase, MapPin, Pencil, Save } from "lucide-react"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({
    name: "",
    address: ""
  })

  useEffect(() => {
    async function load() {
      const res = await API.get("/users/me")
      setUser(res.data)
      setForm({
        name: res.data.name || "",
        address: res.data.address || ""
      })
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    await API.put("/users/me", form)
    const updated = await API.get("/users/me")
    setUser(updated.data)
    setEdit(false)
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
              {user.name?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-indigo-100">{user.role}</p>
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
                value={user.email}
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
                value={user.role}
                className="w-full rounded-lg border bg-slate-100 p-3"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                <MapPin size={16} /> Address
              </label>
              <textarea
                disabled={!edit}
                rows={3}
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border p-3 disabled:bg-slate-100"
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
      </div>
    </DashboardLayout>
  )
}
