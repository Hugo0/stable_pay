import { connectToDatabase } from "@/database";
import Transaction from "@/models/transactions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,res:NextResponse){
    try{

        const body=await req.json();
        await connectToDatabase();

        await Transaction.create(body);

        return NextResponse.json({message:"Successfully executed!!"},{status:200});
    }catch(err){
        return NextResponse.json({message:"Server error"},{status:500})
    }
}