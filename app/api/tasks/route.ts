import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../../auth";
import { prisma } from "../../lib/prisma";

const validStatuses = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

const validPriorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
] as const;

// ================================
// GET /api/tasks
// Get all tasks for logged-in user
// ================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        {
          completed: "asc",
        },
        {
          dueDate: "asc",
        },
        {
          dueTime: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// ================================
// POST /api/tasks
// Create a new task
// ================================

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim() || null
        : null;

    const dueDate =
      typeof body.dueDate === "string"
        ? body.dueDate
        : "";

    const dueTime =
      typeof body.dueTime === "string" && body.dueTime
        ? body.dueTime
        : "09:00";

    const priority =
      typeof body.priority === "string"
        ? body.priority
        : "MEDIUM";

    const status =
      typeof body.status === "string"
        ? body.status
        : "TODO";

    // ================================
    // Validation
    // ================================

    if (!title) {
      return NextResponse.json(
        { message: "Task title is required" },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        {
          message:
            "Task title must be less than 200 characters",
        },
        { status: 400 }
      );
    }

    if (!dueDate) {
      return NextResponse.json(
        { message: "Due date is required" },
        { status: 400 }
      );
    }

    if (
      !validPriorities.includes(
        priority as (typeof validPriorities)[number]
      )
    ) {
      return NextResponse.json(
        { message: "Invalid priority" },
        { status: 400 }
      );
    }

    if (
      !validStatuses.includes(
        status as (typeof validStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    // ================================
    // Create task
    // ================================

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        dueTime,

        priority:
          priority as (typeof validPriorities)[number],

        status:
          status as (typeof validStatuses)[number],

        completed: status === "COMPLETED",

        userId: user.id,

        // Prisma schema-gaaga wuxuu leeyahay
        // updatedAt DateTime oo aan default lahayn
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(task, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    return NextResponse.json(
      { message: "Failed to create task" },
      { status: 500 }
    );
  }
}