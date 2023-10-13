"use client";

// import useSWR from "swr";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";
import Link from "next/link";

const fetcher = async () => {
    const smartContractAddress=parseCookies().smartContractAddress?.replace(/"/g, '');
    const response=await fetch(`/api/users/${smartContractAddress}`,{
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

type GroupedTransactions = Record<string, TransactionProps[]>;
type Props= [date:string,transactionDetail:TransactionProps[]];

const HistoryComponent = () => {

    const [transactions,setTransactions]=useState<TransactionProps[] | null>(null);
    const smartContractAddress=parseCookies().smartContractAddress?.replace(/"/g, '');

    function groupTransactionsByMonth(transactions: TransactionProps[]): GroupedTransactions {
        const grouped: GroupedTransactions = {};
      
        for (const transaction of transactions) {
          const date = new Date(transaction.createdAt || "");
          const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!grouped[month]) {
            grouped[month] = [];
          }
          grouped[month].push(transaction);
        }
      
        return grouped;
      }
     

    useEffect(() => {
        const getData = async () => {
            const data : TransactionProps[] = await fetcher();
            data.map((transaction: TransactionProps) => console.log(transaction));
            setTransactions(data);
            // const randomData:GroupedTransactions=groupTransactionsByMonth(data);
            // Object.entries(groupTransactionsByMonth(data)).map(([date,transactionsDetail]:Props) => {
            //     console.log(date);
            //     console.log(`date: ${transactionsDetail}`);
            // })
          };
        
          // Call getData initially when the component mounts
          getData();
        
          // Set up an interval to call getData every 5 seconds
          const intervalId = setInterval(getData, 1000*60);
        
          // Clear the interval when the component unmounts
          return () => clearInterval(intervalId);
    },[]);

    if(!transactions){
        return <LoadingComponent />
    }
    
  return (
    <div className="h-screen w-screen flex-center">
        <div className="h-5/6 w-full md:w-3/4 bg-black-400 py-3 flex flex-col overflow-auto shadow shadow-white-400 rounded no-scrollbar">
            {/* {transactions.map((transaction:TransactionProps) => {
                const amount=Number(transaction.sentAmount);
                const showAmount=Number(amount.toFixed(3));
                const utcDateString = transaction.createdAt;
                const utcDate = new Date(utcDateString || "");

                // Convert UTC date to local date
                const localDate = new Date(utcDate);

                // To get the local date and time as a string
                const localDateString = localDate.toLocaleString();
                return (
                    <div key={transaction.hashId} className=" py-7 w-full bg-black-300 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded flex-col lg:flex-row">
                        {transaction.senderAddress==smartContractAddress?
                            <p className="heading4 text-gradient_pink-orange">Sent {showAmount} {transaction.sender_currency} on {localDateString}</p>
                            : 
                            <p className="heading4 text-gradient_blue-purple">Received {showAmount} {transaction.sender_currency} on {localDateString}</p>
                        }
                        <div className="flex-center flex-col gap-y-6">
                            <Link href={`/payments/${transaction.hashId}`} className="text-gradient_purple-blue text-xl">View Transaction</Link>
                            <Link href={`https://mumbai.polygonscan.com/tx/${transaction.hashId}`} target="_blank" className="text-gradient_purple-blue text-xl">View on Chain</Link>
                        </div>
                    </div>
                )
            })} */}
            {Object.entries(groupTransactionsByMonth(transactions)).map(([month,transactions]:Props) => {
                return (
                    <div className="bg-black-300" key={month}>
                        <p className="heading1 text-white-800 flex-center w-full py-6 text-center">{month}</p>
                        {transactions.map((transaction:TransactionProps) => {
                            const amount=Number(transaction.sentAmount);
                            const showAmount=Number(amount.toFixed(3));
                            const utcDateString = transaction.createdAt;
                            const utcDate = new Date(utcDateString || "");

                            // Convert UTC date to local date
                            const localDate = new Date(utcDate);

                            // To get the local date and time as a string
                            const localDateString = localDate.toLocaleString('default', { month: 'long', day: 'numeric' });
                            return (
                                <div key={transaction.hashId} className=" py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded">
                                    <Link href={`/payments/${transaction.hashId}`} className="hover:cursor-pointer flex-center w-full">
                                        <p className={`heading4 w-3/4 text-center flex-center ${transaction.senderAddress==smartContractAddress?'text-gradient_pink-orange':'text-gradient_blue-purple'}`}>{transaction.senderAddress==smartContractAddress?'Sent on':'Received on'} {localDateString}</p>
                                        <p className="text-center w-1/4 heading4">{showAmount} {transaction.sender_currency}</p>
                                    </Link>
                                    {/* <div className="flex-center flex-col"> */}
                                        {/* <Link href={`https://mumbai.polygonscan.com/tx/${transaction.hashId}`} target="_blank" className="text-gradient_purple-blue text-xl">View on Chain</Link> */}
                                    {/* </div> */}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default HistoryComponent