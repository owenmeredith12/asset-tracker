import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid asset ID" },
        { status: 400 }
      );
    }

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

    const result = await db.collection("assets").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          assetTag: assetTag.trim(),
          deviceType: deviceType.trim(),
          manufacturer: manufacturer.trim(),
          model: model.trim(),
          status,
          employeeId:
            employeeId && ObjectId.isValid(employeeId)
              ? new ObjectId(employeeId)
              : null,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Asset updated",
    });
  } catch (error) {
    console.error("Failed to update asset:", error);

    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid asset ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("assetTracker");

    const result = await db.collection("assets").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Asset deleted",
    });
  } catch (error) {
    console.error("Failed to delete asset:", error);

    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}