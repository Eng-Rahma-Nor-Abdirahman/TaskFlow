
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              ✓
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Task<span className="text-blue-500">Flow</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#about" className="hover:text-white transition">
              About
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Sign In
            </a>

            <a
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium shadow-lg shadow-blue-600/20"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Simple Task Management
          </div>

          <h2 className="max-w-4xl mx-auto text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Organize your work.
            <br />
            <span className="text-blue-500">Achieve your goals.</span>
          </h2>

          <p className="max-w-2xl mx-auto mt-7 text-lg md:text-xl text-slate-400 leading-relaxed">
            TaskFlow helps you organize tasks, track your progress,
            and stay focused on what matters most.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <a
              href="/register"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-xl shadow-blue-600/20"
            >
              Start for Free →
            </a>

            <a
              href="/login"
              className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-semibold"
            >
              Sign In
            </a>
          </div>

          <div className="mt-16 flex justify-center items-center gap-8 text-sm text-slate-500">
            <span>✓ Easy to use</span>
            <span>✓ Fast & simple</span>
            <span>✓ Stay organized</span>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl">
          <div className="rounded-xl border border-white/10 bg-slate-900 overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />

              <div className="ml-4 flex-1 max-w-md mx-auto h-7 rounded-lg bg-white/5" />
            </div>

            <div className="grid md:grid-cols-[220px_1fr] min-h-[350px]">
              {/* Sidebar */}
              <div className="hidden md:block border-r border-white/10 p-5">
                <div className="text-lg font-bold mb-8">
                  Task<span className="text-blue-500">Flow</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400">
                    Dashboard
                  </div>
                  <div className="px-3 py-2 text-slate-400">
                    My Tasks
                  </div>
                  <div className="px-3 py-2 text-slate-400">
                    Completed
                  </div>
                </div>
              </div>

              {/* Dashboard */}
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-7">
                  <div>
                    <p className="text-slate-400 text-sm">Welcome back</p>
                    <h3 className="text-2xl font-bold mt-1">
                      Your Tasks
                    </h3>
                  </div>

                  <div className="px-4 py-2 rounded-lg bg-blue-600 text-sm">
                    + New Task
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-7">
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                    <p className="text-slate-400 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold mt-2">24</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                    <p className="text-slate-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold mt-2 text-green-400">
                      18
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                    <p className="text-slate-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold mt-2 text-yellow-400">
                      6
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Complete project documentation",
                    "Review today's tasks",
                    "Prepare presentation",
                  ].map((task, index) => (
                    <div
                      key={task}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          index === 0
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-600"
                        }`}
                      />

                      <span
                        className={
                          index === 0
                            ? "text-slate-500 line-through"
                            : "text-slate-300"
                        }
                      >
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-900/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider">
              Everything you need
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Work smarter, not harder.
            </h2>

            <p className="text-slate-400 max-w-2xl mx-auto mt-5">
              Simple tools designed to help you manage your tasks
              without unnecessary complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.05] transition">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-6">
                📋
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Organize Tasks
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Keep all your tasks in one place and easily manage
                everything you need to accomplish.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.05] transition">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Track Progress
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Know exactly what is completed, what is pending,
                and how much progress you have made.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.05] transition">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl mb-6">
                🎯
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Reach Your Goals
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Stay focused, finish your tasks, and turn your plans
                into real results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-500">100%</p>
            <p className="text-slate-400 mt-2">Simple & focused</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-blue-500">24/7</p>
            <p className="text-slate-400 mt-2">Access your tasks</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-blue-500">∞</p>
            <p className="text-slate-400 mt-2">Possibilities</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-10 md:p-16 text-center shadow-2xl shadow-blue-900/30">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to get organized?
          </h2>

          <p className="max-w-xl mx-auto mt-5 text-blue-100 text-lg">
            Start managing your tasks today and take control of
            your productivity.
          </p>

          <a
            href="/register"
            className="inline-block mt-8 px-8 py-4 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition"
          >
            Create Your Account →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 TaskFlow. All rights reserved.
          </p>

          <p className="text-slate-600 text-sm">
            Simple. Focused. Productive.
          </p>
        </div>
      </footer>
    </main>
  );
}
