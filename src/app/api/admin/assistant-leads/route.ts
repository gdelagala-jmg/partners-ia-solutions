import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const leads = await prisma.assistantLead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Failed to fetch assistant leads:", error);
    return NextResponse.json(
      { error: "Error fetching assistant leads" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, sentiment, priority, insights } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (status) data.status = status;
    if (sentiment) data.sentiment = sentiment;
    if (priority) data.priority = priority;
    if (insights) data.insights = insights;

    const lead = await prisma.assistantLead.update({
      where: { id },
      data,
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead details:", error);
    return NextResponse.json(
      { error: "Error updating lead details" },
      { status: 500 }
    );
  }
}
