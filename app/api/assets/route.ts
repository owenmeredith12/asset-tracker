import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

//get route for assets
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assetTracker");

    const assets = await db
      .collection("assets")
      .aggregate([
        {
          $lookup: {
            from: "employees",
            localField: "employeeId",
            foreignField: "_id",
            as: "employee",
          },
        },
        {
          $unwind: {
            path: "$employee",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            assetTag: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Failed to get assets:", error);

    return NextResponse.json(
      { error: "Failed to get assets" },
      { status: 500 }
    );
  }
}

//post route for assets
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      assetTag,
      deviceType,
      manufacturer,
      model,
      status,
      employeeId,
    } = body;

    if (!assetTag || !deviceType || !manufacturer || !model || !status) {
      return NextResponse.json(
        { error: "All required asset fields must be completed" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("assetTracker");

    const result = await db.collection("assets").insertOne({
      assetTag: assetTag.trim(),
      deviceType: deviceType.trim(),
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      status,
      employeeId:
        employeeId && ObjectId.isValid(employeeId)
          ? new ObjectId(employeeId)
          : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Asset created",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create asset:", error);

    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}