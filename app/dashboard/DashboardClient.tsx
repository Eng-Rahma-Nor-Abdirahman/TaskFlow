"use client";

import { useEffect, useMemo, useState } from "react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

type Task = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  dueTime: string;
  completed: boolean;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  userName: string;
  userEmail: string;
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function DashboardClient({
  userName,
  userEmail,
}: Props) {
  // ================================
  // TASK STATES
  // ================================

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // CREATE TASK STATES
  // ================================

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("09:00");
  const [priority, setPriority] =
    useState<TaskPriority>("MEDIUM");

  // ================================
  // PROFILE STATES
  // ================================

  const [showProfileModal, setShowProfileModal] =
    useState(false);

  const [profileName, setProfileName] =
    useState(userName);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  // ================================
  // OTHER STATES
  // ================================

  const [filter, setFilter] =
    useState<"ALL" | TaskStatus>("ALL");

  const [error, setError] = useState("");

  // ================================
  // LOAD TASKS
  // ================================

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tasks", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load tasks"
        );
      }

      setTasks(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load your tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // ================================
  // CREATE TASK
  // ================================

  async function createTask(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          dueDate,
          dueTime,
          priority,
          status: "TODO",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create task"
        );
      }

      setTasks((current) => [data, ...current]);

      resetForm();

      setShowModal(false);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setCreating(false);
    }
  }

  // ================================
  // RESET FORM
  // ================================

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("09:00");
    setPriority("MEDIUM");
  }

  // ================================
  // UPDATE TASK
  // ================================

  async function updateTask(
    id: number,
    updates: Partial<{
      completed: boolean;
      status: TaskStatus;
    }>
  ) {
    try {
      setError("");

      const response = await fetch(
        `/api/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task"
        );
      }

      setTasks((current) =>
        current.map((task) =>
          task.id === id ? data : task
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update task."
      );
    }
  }

  // ================================
  // TOGGLE COMPLETE
  // ================================

  async function toggleTask(task: Task) {
    await updateTask(task.id, {
      completed: !task.completed,
      status: task.completed
        ? "TODO"
        : "COMPLETED",
    });
  }

  // ================================
  // CHANGE STATUS
  // ================================

  async function changeStatus(
    task: Task,
    status: TaskStatus
  ) {
    await updateTask(task.id, {
      status,
      completed: status === "COMPLETED",
    });
  }

  // ================================
  // DELETE TASK
  // ================================

  async function deleteTask(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete task"
        );
      }

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete task."
      );
    }
  }

  // ================================
  // UPDATE PROFILE
  // ================================

  async function updateProfile(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const name = profileName.trim();

    if (!name) {
      setProfileError("Please enter your name.");
      return;
    }

    if (name.length < 2) {
      setProfileError(
        "Name must be at least 2 characters."
      );
      return;
    }

    if (name.length > 50) {
      setProfileError(
        "Name must be less than 50 characters."
      );
      return;
    }

    try {
      setSavingProfile(true);
      setProfileError("");

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      setProfileName(data.user.name);

      setShowProfileModal(false);
    } catch (error) {
      console.error(error);

      setProfileError(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  // ================================
  // STATISTICS
  // ================================

  const statistics = useMemo(() => {
    return {
      total: tasks.length,

      todo: tasks.filter(
        (task) => task.status === "TODO"
      ).length,

      progress: tasks.filter(
        (task) => task.status === "IN_PROGRESS"
      ).length,

      completed: tasks.filter(
        (task) => task.status === "COMPLETED"
      ).length,

      high: tasks.filter(
        (task) => task.priority === "HIGH"
      ).length,
    };
  }, [tasks]);

  // ================================
  // FILTER
  // ================================

  const filteredTasks = useMemo(() => {
    if (filter === "ALL") {
      return tasks;
    }

    return tasks.filter(
      (task) => task.status === filter
    );
  }, [tasks, filter]);

  // ================================
  // AVATAR INITIAL
  // ================================

  const initial =
    profileName?.charAt(0).toUpperCase() || "U";

  // ================================
  // UI
  // ================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =================================
          HEADER
      ================================= */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* LOGO */}

          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30">
              ✓
            </div>

            <div>
              <span className="text-xl font-bold tracking-tight">
                Task
                <span className="text-blue-500">
                  Flow
                </span>
              </span>

              <p className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:block">
                Task Management
              </p>
            </div>
          </a>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() => {
              setProfileName(profileName);
              setProfileError("");
              setShowProfileModal(true);
            }}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/5"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                {profileName}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/30 bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20">
              {initial}
            </div>
          </button>
        </div>
      </header>

      {/* =================================
          CONTENT
      ================================= */}

      <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        {/* =================================
            HERO
        ================================= */}

        <section className="relative z-10 mb-8 overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 shadow-2xl shadow-blue-900/20 sm:p-10">

          <div className="relative z-10 max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              Your productivity workspace
            </div>

            <p className="mb-2 text-sm font-medium text-blue-100">
              Welcome back 👋
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Let&apos;s get things done.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Organize your work, track your progress,
              and stay focused on what matters most.
            </p>

            <button
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
              className="mt-7 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-xl transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
            >
              + Create New Task
            </button>
          </div>

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-28 right-20 h-60 w-60 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="absolute bottom-5 right-8 hidden text-8xl font-black text-white/5 lg:block">
            ✓
          </div>
        </section>

        {/* =================================
            ERROR
        ================================= */}

        {error && (
          <div className="relative z-10 mb-6 flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300 backdrop-blur">

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 font-bold hover:bg-red-500/20"
            >
              ×
            </button>
          </div>
        )}

        {/* =================================
            STATISTICS
        ================================= */}

        <section className="relative z-10 mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            label="Total Tasks"
            value={statistics.total}
            icon="📋"
            iconClass="bg-blue-500/10 text-blue-400"
          />

          <StatCard
            label="To Do"
            value={statistics.todo}
            icon="○"
            iconClass="bg-amber-500/10 text-amber-400"
          />

          <StatCard
            label="In Progress"
            value={statistics.progress}
            icon="◐"
            iconClass="bg-indigo-500/10 text-indigo-400"
          />

          <StatCard
            label="Completed"
            value={statistics.completed}
            icon="✓"
            iconClass="bg-emerald-500/10 text-emerald-400"
          />

        </section>

        {/* =================================
            TASK AREA
        ================================= */}

        <section className="relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/20 backdrop-blur">

          {/* HEADER */}

          <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-3">

                <h2 className="text-xl font-bold text-white">
                  My Tasks
                </h2>

                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                  {tasks.length}
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Keep track of everything you need to accomplish.
              </p>
            </div>

            <button
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              + Add Task
            </button>

          </div>

          {/* FILTERS */}

          <div className="flex gap-2 overflow-x-auto border-b border-white/5 px-6 py-4">

            {[
              ["ALL", "All"],
              ["TODO", "To Do"],
              ["IN_PROGRESS", "In Progress"],
              ["COMPLETED", "Completed"],
            ].map(([value, label]) => (

              <button
                key={value}
                onClick={() =>
                  setFilter(
                    value as "ALL" | TaskStatus
                  )
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
                  filter === value
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </button>

            ))}

          </div>

          {/* TASK LIST */}

          {loading ? (

            <div className="px-6 py-20 text-center">

              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

              <p className="mt-4 text-sm text-slate-500">
                Loading your tasks...
              </p>

            </div>

          ) : filteredTasks.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/10 bg-blue-500/10 text-2xl">
                📋
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                No tasks found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Start by creating your first task and
                keep your work organized.
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                + Create your first task
              </button>

            </div>

          ) : (

            <div className="divide-y divide-white/5">

              {filteredTasks.map((task) => (

                <div
                  key={task.id}
                  className="group px-6 py-5 transition hover:bg-white/[0.025]"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    {/* LEFT */}

                    <div className="flex min-w-0 items-start gap-4">

                      <button
                        type="button"
                        onClick={() =>
                          toggleTask(task)
                        }
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                          task.completed
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : "border-slate-600 text-white hover:border-blue-500 hover:bg-blue-500/10"
                        }`}
                        aria-label="Toggle task completion"
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <div className="min-w-0">

                        <h3
                          className={`font-semibold transition ${
                            task.completed
                              ? "text-slate-600 line-through"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="mt-1 text-sm text-slate-500">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          <span className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
                            📅 {task.dueDate}
                          </span>

                          <span className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
                            🕐 {task.dueTime}
                          </span>

                          <PriorityBadge
                            priority={task.priority}
                          />

                          <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                            {statusLabels[task.status]}
                          </span>

                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2 lg:ml-4">

                      <select
                        value={task.status}
                        onChange={(event) =>
                          changeStatus(
                            task,
                            event.target.value as TaskStatus
                          )
                        }
                        className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 outline-none transition focus:border-blue-500"
                      >
                        <option value="TODO">
                          To Do
                        </option>

                        <option value="IN_PROGRESS">
                          In Progress
                        </option>

                        <option value="COMPLETED">
                          Completed
                        </option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                        className="rounded-xl px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* =================================
          CREATE TASK MODAL
      ================================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">

          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">

            {/* HEADER */}

            <div className="border-b border-white/10 px-6 py-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Create New Task
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a task to your workflow.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>

              </div>
            </div>

            {/* FORM */}

            <form
              onSubmit={createTask}
              className="space-y-5 p-6"
            >

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Task Title
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. Complete project report"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={3}
                  placeholder="Add some details..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

              </div>

              {/* DATE + TIME */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) =>
                      setDueDate(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Due Time
                  </label>

                  <input
                    type="time"
                    value={dueTime}
                    onChange={(event) =>
                      setDueTime(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              {/* PRIORITY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value as TaskPriority
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="LOW">
                    Low
                  </option>

                  <option value="MEDIUM">
                    Medium
                  </option>

                  <option value="HIGH">
                    High
                  </option>
                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 border-t border-white/5 pt-4">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? "Creating..."
                    : "Create Task"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================
          EDIT PROFILE MODAL
      ================================= */}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">

          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">

            {/* HEADER */}

            <div className="border-b border-white/10 px-6 py-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Edit Profile
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your display name.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    setProfileError("");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>

              </div>
            </div>

            {/* FORM */}

            <form
              onSubmit={updateProfile}
              className="space-y-5 p-6"
            >

              <div>

                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Your Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={profileName}
                  onChange={(event) =>
                    setProfileName(event.target.value)
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

              </div>

              {profileError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {profileError}
                </div>
              )}

              <div className="flex gap-3 border-t border-white/5 pt-4">

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    setProfileError("");
                  }}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  );
}

// ========================================
// STAT CARD
// ========================================

function StatCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: string;
  iconClass: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-white/15">

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-4 text-3xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}

// ========================================
// PRIORITY BADGE
// ========================================

function PriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
  const styles = {
    LOW: "bg-slate-500/10 text-slate-400 border border-slate-500/10",

    MEDIUM:
      "bg-amber-500/10 text-amber-400 border border-amber-500/10",

    HIGH:
      "bg-red-500/10 text-red-400 border border-red-500/10",
  };

  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}