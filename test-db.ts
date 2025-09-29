import { connectToDatabase } from "./lib/mongodb.ts";

async function testConnection() {
  try {
    const db = await connectToDatabase();
    console.log("🟢 Connection test successful!");
    if (!db.connection.db) {
      throw new Error("MongoDB connection is not ready yet!");
    }
    const databases = await db.connection.db.admin().listDatabases();
    console.log(
      "Databases:",
      databases.databases.map((d) => d.name),
    );

    process.exit(0);
  } catch (error) {
    console.error("🔴 Connection test failed:", error);
    process.exit(1);
  }
}

testConnection();
