import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

//get route for employees
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assetTracker");

    const employees = await db
      .collection("employees")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Failed to get employees:", error);

    return NextResponse.json(
      { error: "Failed to get employees" },
      { status: 500 }
    );
  }
}

//post route for employees
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, department } = body;

    if (!name || !email || !department) {
      return NextResponse.json(
        { error: "Name, email, and department are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("assetTracker");

    const result = await db.collection("employees").insertOne({
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Employee created",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create employee:", error);

    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}