import Transaction  from "@/models/transactions"
import { Document } from "mongoose";

export const revalidate=60;

// Define your transaction schema
interface ITransaction extends Document {
  _id:string,
  senderAddress: string;
  receiverAddress?: string;
  sentAmount: number;
  exchangeRate?: number;
  fees?: number;
  category: string;
  status: string;
  hashId?: string;
  sender_currency: string;
  receiver_currency?: string;
  link?: string;
}

export async function generateStaticParams() {
  try {
    const transactions: ITransaction[] = await Transaction.find({ category: 'SendviaLink' }).exec();
    // Note: 'Document<Transaction>[]' is used to specify the type of the returned documents

    return transactions.map((transaction) => ({
      params: { id: transaction._id?.toString() , link :transaction.link?.toString()},
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}
export default async function Page({ params }: { params: { id: string,link:string } }) {


  return <div className="h-screen w-screen flex-center">
    <h1 className="text-white-400">Transaction Details</h1>
    <pre className="text-white-400">{params.id} - {params.link}</pre>
  </div>
}