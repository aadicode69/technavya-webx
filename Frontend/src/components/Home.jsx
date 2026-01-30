import { Button } from '@/components/ui/button'
import { Users, Shield, Calendar, DollarSign, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Shield,
      title: 'Role-Based Access',
      description:
        'Secure employee and HR dashboards with different permissions',
    },
    {
      icon: Calendar,
      title: 'Attendance Tracking',
      description:
        'Easy check-in/out with comprehensive attendance history',
    },
    {
      icon: DollarSign,
      title: 'Payroll Management',
      description:
        'View salary details, deductions, and download payslips',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-sky-50 to-cyan-100" />
        <div className="relative mx-auto max-w-6xl px-6 py-28 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
            <Users className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            HR Management{' '}
            <span className="block bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Streamline your workforce management with our comprehensive HR
            portal. Track attendance, manage leaves, and handle payroll — all in
            one place.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 px-8 text-white shadow-lg hover:opacity-90"
              onClick={() => navigate('/signup')}
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button 
              size="lg" 
              variant="outline" 
              className="px-8"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-slate-600">
            Powerful features to manage your workforce efficiently
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>

              <h3 className="mb-2 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 px-10 py-16 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Transform Your HR?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Join thousands of companies already using our platform to manage
            their workforce.
          </p>

          <Button 
            size="lg" 
            variant="outline" 
            className="mt-8 gap-2"
            onClick={() => navigate('/signup')}
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">
        © 2024 HR Portal. All rights reserved.
      </footer>
    </div>
  )
}