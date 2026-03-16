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
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lead = await prisma.assistantLead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead status:", error);
    return NextResponse.json(
      { error: "Error updating lead status" },
      { status: 500 }
    );
  }
}
