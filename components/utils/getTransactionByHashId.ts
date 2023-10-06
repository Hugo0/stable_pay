// Import your Transaction model

import { connectToDatabase } from "@/database";
import Transaction from "@/models/transactions";

export async function getTransactionIdByHashId(hashId:string) {
  try {
    await connectToDatabase();
    // Find the document with the matching hashId and select only the _id field
    const transaction = await Transaction.findOne({ hashId }).select('_id');

    if (transaction) {
      // If a matching document is found, return its _id
      return transaction._id;
    } else {
      // If no matching document is found, return null or an appropriate value
      return null;
    }
  } catch (error) {
    // Handle any errors that may occur during the database query
    console.error('Error fetching transaction by hashId:', error);
    throw error; // You can choose to handle the error as needed
  }
}