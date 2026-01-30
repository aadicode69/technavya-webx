import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900"></div>

      <div className="max-w-6xl w-full relative">
        <div className="backdrop-blur-xl bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-5 gap-0">
            {/* Left Side - Branding */}
            <div className="md:col-span-2 p-12 flex flex-col justify-between border-r border-white/10 relative overflow-hidden">
              {/* Subtle decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full -mr-48 -mt-48"></div>
              
              <div className="relative z-10">
                <div className="mb-16">
                  <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Dayflow</h1>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Enterprise HR management for modern teams
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent"></div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Streamlined Operations</h3>
                      <p className="text-zinc-500 text-sm">Manage your entire workforce from one platform</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-white/70 to-transparent"></div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Enterprise Security</h3>
                      <p className="text-zinc-500 text-sm">Bank-level encryption and data protection</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Real-time Analytics</h3>
                      <p className="text-zinc-500 text-sm">Actionable insights at your fingertips</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-zinc-600 text-xs">
                  Trusted by 10,000+ companies worldwide
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:col-span-3 p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-zinc-500 text-sm">Join thousands of teams already using Dayflow</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Employee ID</label>
                      <input
                        type="text"
                        name="employeeId"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all"
                        placeholder="EMP001"
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Role</label>
                      <select
                        name="role"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white transition-all appearance-none cursor-pointer"
                        onChange={handleChange}
                        defaultValue="EMPLOYEE"
                      >
                        <option value="EMPLOYEE" className="bg-zinc-900">Employee</option>
                        <option value="ADMIN" className="bg-zinc-900">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all"
                      placeholder="John Doe"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all"
                      placeholder="john@company.com"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all"
                      placeholder="••••••••"
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200"
                  >
                    Create Account
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-zinc-900/50 text-zinc-600">or</span>
                    </div>
                  </div>

                  <p className="text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-white hover:text-zinc-300 transition-colors">
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-zinc-700 text-xs mt-8">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Signup;