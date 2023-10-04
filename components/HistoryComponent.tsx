"use client";

import useSWR from "swr";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";
import Link from "next/link";

type TransactionProps = {
    senderAddress:string,
    receiverAddress:string,
    exchangeRate:Number,
    hashId:string,
    sender_currency:string,
    receiver_currency:string,
    sentAmount:Number,
}

const fetcher = async () => {
    const smartContractAddress=parseCookies().smartContractAddress?.replace(/"/g, '');
    const response=await fetch(`/api/transactions/${smartContractAddress}`,{
        next:{
            tags:['transactionHistory'],
            
        },
        // method:"GET",
        // cache:"no-cache",
    });
    const data=await response.json();
    console.log(`data: ${data}`);
    return data;
}

const HistoryComponent = () => {

    const [transactions,setTransactions]=useState<TransactionProps[] | null>(null);
    const smartContractAddress=parseCookies().smartContractAddress?.replace(/"/g, '');

    useEffect(() => {
        const getData=async () => {
            const data=await fetcher();
            console.log(`data: ${data}`);
            setTransactions(data);
        }
        getData();
    },[]);

    if(!transactions){
        return <LoadingComponent />
    }
    
  return (
    <div className="h-screen w-screen flex-center">
        <div className="h-5/6 w-full md:w-1/2 bg-black-400 py-3 flex-center flex-col overflow-auto shadow shadow-white-400 rounded no-scrollbar">
            {transactions.map((transaction:TransactionProps) => {
                const amount=Number(transaction.sentAmount)/Number(transaction.exchangeRate);
                const showAmount=Number(amount.toFixed(3));
                return (
                    <div key={transaction.hashId} className="h-8 w-full bg-black-300 text-white-400 m-1 py-10 flex items-center justify-around rounded">
                        {transaction.receiverAddress==smartContractAddress?
                            <p className="heading4 text-gradient_blue-purple">Received {showAmount} {transaction.sender_currency}</p>
                            : 
                            <p className="heading4 text-gradient_pink-orange">Sent {showAmount} {transaction.sender_currency}</p>
                        }
                        {/* <Link href={`/transactions/${transaction.hashId}`}>View More</Link> */}
                        <Link href={`https://app.jiffyscan.xyz/bundle/${transaction.hashId}?network=mumbai`} target="_blank" className="text-gradient_purple-blue text-xl">View on Chain</Link>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default HistoryComponent