import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../../../auth";
import { prisma } from "../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH - Update task
export async function PATCH(
  request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    const taskId = Number(id);

    if (Number.isNaN(taskId)) {
      return NextResponse.json(
        { message: "Invalid task ID" },
        { status: 400 }
      );
    }

    // Make sure task belongs to logged-in user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const data: {
      title?: string;
      description?: string | null;
      dueDate?: string;
      dueTime?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      status?: "TODO" | "IN_PROGRESS" | "COMPLETED";
      completed?: boolean;
    } = {};

    if (body.title !== undefined) {
      const title = body.title.trim();

      if (!title) {
        return NextResponse.json(
          { message: "Task title cannot be empty" },
          { status: 400 }
        );
      }

      data.title = title;
    }

    if (body.description !== undefined) {
      data.description =
        body.description?.trim() || null;
    }

    if (body.dueDate !== undefined) {
      data.dueDate = body.dueDate;
    }

    if (body.dueTime !== undefined) {
      data.dueTime = body.dueTime;
    }

    if (body.priority !== undefined) {
      if (
        !["LOW", "MEDIUM", "HIGH"].includes(
          body.priority
        )
      ) {
        return NextResponse.json(
          { message: "Invalid priority" },
          { status: 400 }
        );
      }

      data.priority = body.priority;
    }

    if (body.status !== undefined) {
      if (
        !["TODO", "IN_PROGRESS", "COMPLETED"].includes(
          body.status
        )
      ) {
        return NextResponse.json(
          { message: "Invalid status" },
          { status: 400 }
        );
      }

      data.status = body.status;

      // Keep completed and status synchronized
      data.completed =
        body.status === "COMPLETED";
    }

    if (body.completed !== undefined) {
      data.completed = Boolean(body.completed);

      // Keep status and completed synchronized
      data.status = body.completed
        ? "COMPLETED"
        : "TODO";
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE - Delete task
export async function DELETE(
  request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    const taskId = Number(id);

    if (Number.isNaN(taskId)) {
      return NextResponse.json(
        { message: "Invalid task ID" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}