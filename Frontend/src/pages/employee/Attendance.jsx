import { useEffect, useState } from "react";
import API from "@/services/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function EmployeeAttendance() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, present, incomplete

  // Format time to 12-hour format
  const formatTime = (time) => {
    if (!time) return "--";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    async function load() {
      try {
        const profile = await API.get("/users/me");
        const attendance = await API.get("/attendance/me");
        setUser(profile.data);
        setRecords(attendance.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Filter records
  const filteredRecords = records.filter((r) => {
    if (filter === "all") return true;
    if (filter === "present") return r.checkIn && r.checkOut;
    if (filter === "incomplete") return r.checkIn && !r.checkOut;
    return true;
  });

  // Calculate stats
  const totalDays = records.length;
  const completeDays = records.filter((r) => r.checkIn && r.checkOut).length;
  const incompleteDays = records.filter((r) => r.checkIn && !r.checkOut).length;
  const attendanceRate =
    totalDays > 0 ? Math.round((completeDays / totalDays) * 100) : 0;

  return (
    <DashboardLayout user={user} role="EMPLOYEE">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 font-comfortaa">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Attendance Records
          </h1>
          <p className="text-slate-600 mt-1">
            View and track your complete attendance history
          </p>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Days</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalDays}
                </p>
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
                <p className="text-sm text-gray-600 font-medium">Complete</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {completeDays}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Incomplete</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {incompleteDays}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 font-medium">
                  Attendance Rate
                </p>
                <p className="text-3xl font-bold mt-2">{attendanceRate}%</p>
              </div>
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Attendance History
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Filter and view your records
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filter === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({totalDays})
              </button>
              <button
                onClick={() => setFilter("present")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filter === "present"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Complete ({completeDays})
              </button>
              <button
                onClick={() => setFilter("incomplete")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filter === "incomplete"
                    ? "bg-yellow-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Incomplete ({incompleteDays})
              </button>
            </div>
          </div>
        </div>

        {/* ATTENDANCE RECORDS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {records.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Attendance Records
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't marked any attendance yet. Start by checking in from
                your dashboard.
              </p>
              <button
                onClick={() => (window.location.href = "/employee/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </button>
            </div>
          ) : filteredRecords.length === 0 ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-600 font-medium">No records found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try changing the filter
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((r) => {
                const isComplete = r.checkIn && r.checkOut;
                const isIncomplete = r.checkIn && !r.checkOut;

                return (
                  <div
                    key={r._id}
                    className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          isComplete
                            ? "bg-green-100"
                            : isIncomplete
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {isComplete ? (
                          <svg
                            className="w-6 h-6 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : isIncomplete ? (
                          <svg
                            className="w-6 h-6 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {new Date(r.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                              />
                            </svg>
                            <span className="font-medium">In:</span> {formatTime(r.checkIn)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span className="font-medium">Out:</span> {r.checkOut ? formatTime(r.checkOut) : "Ongoing"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isComplete ? (
                        <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                          Complete
                        </span>
                      ) : isIncomplete ? (
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
                          In Progress
                        </span>
                      ) : (
                        <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                          Not Marked
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
    </DashboardLayout>
  );
}
