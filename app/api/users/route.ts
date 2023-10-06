import { NextRequest, NextResponse } from "next/server";
import { parseCookies } from "nookies";

export async function POST(req:NextRequest,res:NextResponse){
    try{


        const body=await req.json();

        return NextResponse.json({message:"Successfully executed!!"},{status:200});
    }catch(err){
        return NextResponse.json({message:"Server error"},{status:500})
    }
}

export async function GET(req:NextRequest,res:NextResponse){
    try{
        const smartContractAddress=parseCookies().smartContractAddress;
        const response= await fetch(`https://api.polygonscan.com/api?module=account&action=balance&address=${smartContractAddress}&apikey=YourApiKeyToken`);
        const data=await response.json();
        return NextResponse.json({data:data},{status:200});
    }catch(err){
        return NextResponse.json({message:"Server Error"},{status:500});
    }
}