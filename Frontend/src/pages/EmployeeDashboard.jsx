import { useEffect, useState } from "react";
import API from "@/services/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

function formatTime(timeStr) {
  if (!timeStr) return "--";
  return new Date(timeStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
export default function EmployeeDashboard() {
  const [profile, setProfile] = useState(null);
  const [today, setToday] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, attRes] = await Promise.all([
          API.get("/users/me"),
          API.get("/attendance/me"),
        ]);

        setProfile(profileRes.data);
        setAttendance(attRes.data);

        const todayStr = new Date().toISOString().split("T")[0];
        setToday(attRes.data.find((r) => r.date === todayStr) || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleAction(type) {
    setActionLoading(true);
    try {
      await API.post(`/attendance/${type}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const checkedIn = !!today?.checkIn;
  const checkedOut = !!today?.checkOut;

  // Calculate stats
  const thisMonthAttendance = attendance.filter((r) => {
    const recordDate = new Date(r.date);
    const now = new Date();
    return (
      recordDate.getMonth() === now.getMonth() &&
      recordDate.getFullYear() === now.getFullYear()
    );
  });

  const presentDays = thisMonthAttendance.filter((r) => r.checkIn).length;
  const onTimeDays = thisMonthAttendance.filter((r) => {
    if (!r.checkIn) return false;
    const checkInTime = r.checkIn.split(":");
    const hour = parseInt(checkInTime[0]);
    return hour < 10; // Assuming 10 AM is the cutoff
  }).length;

  return (
    <DashboardLayout user={profile} role="EMPLOYEE">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 font-comfortaa">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile.name}
          </h1>
          <p className="text-slate-600 mt-1">
            Track your attendance and manage your work schedule
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {presentDays}
                </p>
                <p className="text-xs text-gray-500 mt-1">Days Present</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">On Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {onTimeDays}
                </p>
                <p className="text-xs text-gray-500 mt-1">Days This Month</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Status</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {checkedIn && !checkedOut
                    ? "Active"
                    : checkedOut
                    ? "Done"
                    : "Away"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Current Status</p>
              </div>
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  checkedIn && !checkedOut
                    ? "bg-green-100"
                    : checkedOut
                    ? "bg-gray-100"
                    : "bg-red-100"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    checkedIn && !checkedOut
                      ? "text-green-600"
                      : checkedOut
                      ? "text-gray-600"
                      : "text-red-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* TODAY CARD */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 font-medium">
                  Today's Attendance
                </p>
                <h2 className="text-2xl font-bold mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
              </div>
              <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 text-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                {checkedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-green-600">
                        Checked In
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(today.checkIn)}
                    </p>{" "}
                    {checkedOut && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Checked Out</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {formatTime(today.checkOut)}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span className="font-semibold text-red-600">
                        Not Checked In
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Start your workday by checking in
                    </p>
                  </div>
                )}
              </div>

              <div>
                {!checkedIn ? (
                  <button
                    onClick={() => handleAction("check-in")}
                    disabled={actionLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Processing..." : "Check In"}
                  </button>
                ) : !checkedOut ? (
                  <button
                    onClick={() => handleAction("check-out")}
                    disabled={actionLoading}
                    className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Processing..." : "Check Out"}
                  </button>
                ) : (
                  <div className="px-6 py-3 bg-green-50 text-green-700 rounded-xl font-semibold flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Day Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ATTENDANCE HISTORY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Attendance History
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your recent attendance records
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View All
              </button>
            </div>
          </div>

          <div className="p-6">
            {attendance.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-600 font-medium">
                  No attendance records found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Your attendance history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.slice(0, 10).map((r) => {
                  const isComplete = r.checkIn && r.checkOut;
                  return (
                    <div
                      key={r._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            isComplete ? "bg-green-100" : "bg-yellow-100"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 ${
                              isComplete ? "text-green-600" : "text-yellow-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {new Date(r.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(r.checkIn)} → {formatTime(r.checkOut)}
                          </p>
                        </div>
                      </div>
                      <div>
                        {isComplete ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Complete
                          </span>
                        ) : r.checkIn ? (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            In Progress
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            Absent
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
