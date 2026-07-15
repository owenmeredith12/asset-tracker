// script to seed the database with necessary data

import clientPromise from "../lib/mongodb";

async function seedDatabase() {
  const client = await clientPromise;
  const db = client.db("assetTracker");

  const employeesCollection = db.collection("employees");
  const assetsCollection = db.collection("assets");

  try {
    console.log("Clearing old seed data...");

    await assetsCollection.deleteMany({});
    await employeesCollection.deleteMany({});

    console.log("Adding employees...");

    const employeeResult = await employeesCollection.insertMany([
      {
        name: "John Smith",
        email: "john.smith@example.com",
        department: "Information Technology",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        department: "Accounting",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Michael Davis",
        email: "michael.davis@example.com",
        department: "Sales",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const johnId = employeeResult.insertedIds[0];
    const sarahId = employeeResult.insertedIds[1];

    console.log("Adding assets...");

    await assetsCollection.insertMany([
      {
        assetTag: "LT-1001",
        deviceType: "Laptop",
        manufacturer: "Dell",
        model: "Latitude 5540",
        status: "Assigned",
        employeeId: johnId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        assetTag: "DT-1002",
        deviceType: "Desktop",
        manufacturer: "HP",
        model: "EliteDesk 800",
        status: "Assigned",
        employeeId: sarahId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        assetTag: "MN-1003",
        deviceType: "Monitor",
        manufacturer: "Dell",
        model: "P2422H",
        status: "Available",
        employeeId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        assetTag: "LT-1004",
        deviceType: "Laptop",
        manufacturer: "Lenovo",
        model: "ThinkPad T14",
        status: "Repair",
        employeeId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seedDatabase();