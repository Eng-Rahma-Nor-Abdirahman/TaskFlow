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
};

type Props = {
  userName: string;
  userEmail: string;
};

export default function TaskDashboard({
  userName,
  userEmail,
}: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("09:00");
  const [priority, setPriority] =
    useState<TaskPriority>("MEDIUM");

  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  // =========================
  // LOAD TASKS
  // =========================

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tasks", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load tasks.");
      }

      setTasks(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // =========================
  // CREATE TASK
  // =========================

  async function createTask(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create task.");
        return;
      }

      setTasks((current) => [data, ...current]);

      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while creating the task.");
    } finally {
      setCreating(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("09:00");
    setPriority("MEDIUM");
  }

  // =========================
  // TOGGLE COMPLETED
  // =========================

  async function toggleTask(task: Task) {
    try {
      setError("");

      const newCompleted = !task.completed;

      const response = await fetch(
        `/api/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: newCompleted,
            status: newCompleted
              ? "COMPLETED"
              : "TODO",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task."
        );
      }

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id ? data : item
        )
      );
    } catch (error) {
      console.error(error);
      setError("Failed to update task.");
    }
  }

  // =========================
  // CHANGE STATUS
  // =========================

  async function changeStatus(
    task: Task,
    status: TaskStatus
  ) {
    try {
      setError("");

      const response = await fetch(
        `/api/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            completed: status === "COMPLETED",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change status."
        );
      }

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id ? data : item
        )
      );
    } catch (error) {
      console.error(error);
      setError("Failed to change task status.");
    }
  }

  // =========================
  // DELETE TASK
  // =========================

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
          data.message || "Failed to delete task."
        );
      }

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error(error);
      setError("Failed to delete task.");
    }
  }

  // =========================
  // STATISTICS
  // =========================

  const statistics = useMemo(() => {
    return {
      total: tasks.length,

      pending: tasks.filter(
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

  // =========================
  // FILTER
  // =========================

  const filteredTasks = useMemo(() => {
    if (filter === "ALL") {
      return tasks;
    }

    return tasks.filter(
      (task) => task.status === filter
    );
  }, [tasks, filter]);

  const initial =
    userName?.charAt(0).toUpperCase() || "U";

  // =========================
  // DATE FORMAT
  // =========================

  function formatDate(date: string) {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // =========================
  // PRIORITY STYLE
  // =========================

  function priorityStyle(priority: TaskPriority) {
    if (priority === "HIGH") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    if (priority === "MEDIUM") {
      return "bg-amber-50 text-amber-600 border-amber-100";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  }

  // =========================
  // STATUS STYLE
  // =========================

  function statusStyle(status: TaskStatus) {
    if (status === "COMPLETED") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "IN_PROGRESS") {
      return "bg-indigo-50 text-indigo-600";
    }

    return "bg-amber-50 text-amber-600";
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-900">

      {/* NAVBAR */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <a
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
              T
            </div>

            <span className="text-xl font-bold tracking-tight">
              Task<span className="text-blue-600">
                Flow
              </span>
            </span>
          </a>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                {userName}
              </p>

              <p className="max-w-[180px] truncate text-xs text-slate-500">
                {userEmail}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-md">
              {initial}
            </div>

          </div>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* HERO */}

        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-7 text-white shadow-xl shadow-blue-600/10 sm:p-9">

          <div className="relative z-10 max-w-2xl">

            <p className="mb-2 text-sm font-medium text-blue-100">
              Welcome back 👋
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s get things done.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Organize your work, track your progress,
              and stay focused on what matters.
            </p>

            <button
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 shadow-lg transition hover:bg-blue-50"
            >
              + Create New Task
            </button>

          </div>

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

        </section>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* STATISTICS */}

        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            label="Total Tasks"
            value={statistics.total}
            icon="📋"
            iconClass="bg-blue-50"
          />

          <StatCard
            label="To Do"
            value={statistics.pending}
            icon="○"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="In Progress"
            value={statistics.progress}
            icon="◐"
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            label="Completed"
            value={statistics.completed}
            icon="✓"
            iconClass="bg-emerald-50 text-emerald-600"
          />

        </section>

        {/* TASK AREA */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="flex flex-col gap-5 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold">
                My Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep track of everything you need to accomplish.
              </p>
            </div>

            <button
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + Add Task
            </button>

          </div>

          {/* FILTERS */}

          <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-6 py-4">

            {[
              ["ALL", "All"],
              ["TODO", "To Do"],
              ["IN_PROGRESS", "In Progress"],
              ["COMPLETED", "Completed"],
            ].map(([value, label]) => (

              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>

            ))}

          </div>

          {/* TASK LIST */}

          {loading ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading your tasks...
              </p>

            </div>

          ) : filteredTasks.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📋
              </div>

              <h3 className="mt-5 text-lg font-bold">
                No tasks found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {filter === "ALL"
                  ? "Start by creating your first task and keep your work organized."
                  : "There are no tasks in this category."}
              </p>

              {filter === "ALL" && (
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  + Create your first task
                </button>
              )}

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {filteredTasks.map((task) => (

                <div
                  key={task.id}
                  className="px-6 py-5 transition hover:bg-slate-50"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    {/* LEFT */}

                    <div className="flex min-w-0 items-start gap-4">

                      <button
                        type="button"
                        onClick={() => toggleTask(task)}
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          task.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 hover:border-blue-500"
                        }`}
                        aria-label="Toggle task"
                      >
                        {task.completed && (
                          <span className="text-xs">
                            ✓
                          </span>
                        )}
                      </button>

                      <div className="min-w-0">

                        <h3
                          className={`font-semibold ${
                            task.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-900"
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

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                              task.status
                            )}`}
                          >
                            {task.status === "TODO"
                              ? "To Do"
                              : task.status === "IN_PROGRESS"
                              ? "In Progress"
                              : "Completed"}
                          </span>

                          <span className="text-xs text-slate-400">
                            Due {formatDate(task.dueDate)} ·{" "}
                            {task.dueTime}
                          </span>

                        </div>

                      </div>
                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-2 lg:ml-6">

                      <select
                        value={task.status}
                        onChange={(event) =>
                          changeStatus(
                            task,
                            event.target.value as TaskStatus
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                        onClick={() => deleteTask(task.id)}
                        className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
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

      {/* CREATE TASK MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

            <div className="mb-6 flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Create New Task
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a task and keep your work organized.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={createTask}
              className="space-y-5"
            >

              {/* TITLE */}

              <div>
                <label
                  htmlFor="task-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Task title
                </label>

                <input
                  id="task-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. Build dashboard"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="task-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="task-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Add some details..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* DATE + TIME */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="due-date"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Due date
                  </label>

                  <input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(event) =>
                      setDueDate(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="due-time"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Due time
                  </label>

                  <input
                    id="due-time"
                    type="time"
                    value={dueTime}
                    onChange={(event) =>
                      setDueTime(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* PRIORITY */}

              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Priority
                </label>

                <select
                  id="priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value as TaskPriority
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

              {/* MODAL ERROR */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

    </main>
  );
}

// =========================
// STAT CARD
// =========================

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

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

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}