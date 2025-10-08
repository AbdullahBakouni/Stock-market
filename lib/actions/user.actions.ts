"use server";

import { ObjectId } from "mongodb";
import { connectToDatabase } from "../mongodb.ts";

export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongose connectiion Field");
    const users = await db
      .collection("user")
      .find(
        {
          email: { $exists: true, $ne: null },
        },
        { projection: { _id: 1, id: 1, name: 1, email: 1, country: 1 } },
      )
      .toArray();
    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id?.toString() || "",
        email: user.email,
        name: user.name,
      }));
  } catch (e) {
    console.error("Error Fetching users for new emails", e);
    return [];
  }
};

export const fetchUserById = async (userId: string) => {
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Mongose connectiion Field");
  const user = await db
    .collection("user")
    .findOne<{ _id: ObjectId; name: string; email: string }>({
      _id: new ObjectId(userId),
    });
  if (!user) return { success: false, message: "User not found" };
  else {
    return { success: true, user: user };
  }
};
