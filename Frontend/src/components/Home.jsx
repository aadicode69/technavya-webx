import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  Calendar,
  DollarSign,
  ArrowRight,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GridScan } from "../blocks/GridScan.jsx";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Role-Based Access",
      description:
        "Secure employee and HR dashboards with different permissions",
    },
    {
      icon: Calendar,
      title: "Attendance Tracking",
      description: "Easy check-in/out with comprehensive attendance history",
    },
    {
      icon: DollarSign,
      title: "Payroll Management",
      description: "View salary details, deductions, and download payslips",
    },
  ];

  const benefits = [
    "Enterprise-grade security",
    "Real-time analytics",
    "Automated workflows",
    "24/7 Support",
  ];

  return (
    <div className="min-h-screen text-slate-900 font-comfortaa">
      {/* Fixed GridScan Background */}
      <div className="fixed inset-0 z-0 bg-black">
        <GridScan
          sensitivity={0.6}
          lineThickness={1.5}
          linesColor="#392e4e"
          gridScale={0.12}
          scanColor="#FF9FFC"
          scanOpacity={0.3}
          enablePost
          bloomIntensity={0.8}
          chromaticAberration={0.001}
          noiseIntensity={0.008}
        />
      </div>

      <div className="fixed inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-20">
        <section className="relative overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-6 py-32 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Modern HR Management Platform
            </div>

            <h1 className="mb-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block bg-gradient-to-r from-[#FF9FFC] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Day Flow{" "}
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400">
              Transform your HR operations with intelligent automation,
              real-time insights, and seamless employee experiences.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group h-12 gap-2 rounded-full bg-white px-8 text-base font-medium text-slate-900 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
                onClick={() => navigate("/signup")}
              >
                SIGNUP
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/30"
                onClick={() => navigate("/login")}
              >
                LOGIN
              </Button>
            </div>

            {/* Benefits Pills */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm"
                >
                  <Check className="h-4 w-4 text-indigo-400" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-7xl px-6 py-32">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Everything You Need
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Powerful features designed for modern teams
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>

                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-7 w-7 text-pink-600" />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-12 backdrop-blur-sm md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-white">10K+</div>
              <div className="text-slate-400">Companies Trust Us</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-white">99.9%</div>
              <div className="text-slate-400">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-white">24/7</div>
              <div className="text-slate-400">Expert Support</div>
            </div>
          </div>
        </section>
        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-black/30 py-4 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">HR Portal</span>
              </div>

              <div className="text-sm text-slate-500">
                © 2024 HR Portal. All rights reserved.
              </div>

              <div className="flex gap-6 text-sm text-slate-400">
                <a href="#" className="transition-colors hover:text-white">
                  Privacy
                </a>
                <a href="#" className="transition-colors hover:text-white">
                  Terms
                </a>
                <a href="#" className="transition-colors hover:text-white">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
