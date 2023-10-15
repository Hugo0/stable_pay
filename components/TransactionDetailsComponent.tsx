"use client";

import peanut from "@squirrel-labs/peanut-sdk";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";
import clipboard from 'clipboard-copy';
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {
    id: string,
}

const fetcher = async (id: string) => {
    const data = await fetch(`/api/transactions/${id}`).then(response => response.json());
    return data;
}

const TransactionDetailsComponent = (props: Props) => {

    const [transactionDetail, setTransactionDetail] = useState<TransactionProps | null>(null);
    const [linkExist, setLinkExist] = useState(false);
    const smartContractAddress=parseCookies().smartContractAddress?.replace(/"/g, '');

    const handleClaim=async () => {
        if((transactionDetail?.link==="") || !smartContractAddress)return ;
        // const link=transactionDetail?.link?.replace(/peanut/g,'staging.peanut');
        const link=transactionDetail?.link;
        console.log('linkclaim' + link);
        const response = await peanut.claimLinkGasless({
            link: link || "",
            recipientAddress: smartContractAddress,
            APIKey: process.env.NEXT_PUBLIC_PEANUT_KEY || "",
      })
      
      console.log('result: ' + response)
    }

    const handleCopy=async (address:string) => {
        try {
            const copyingToast=toast.loading("Copying to clipboard...");
            await clipboard(address);
            toast.success("Successfully copied!",{
                id:copyingToast
            })
        } catch (err) {
            console.error('Failed to copy to clipboard: ', err);
        }
    }

    const formattedDate= (date:string) => {
        const utcDateString = date;
        const utcDate = new Date(utcDateString || "");

        // Convert UTC date to local date
        const localDate = new Date(utcDate);

        // To get the local date and time as a string
        const localDateString = localDate.toLocaleString();
        return localDateString;
    }

    useEffect(() => {
        const getData = async () => {
            const transaction: TransactionProps = await fetcher(props.id);
            if(transaction.senderAddress!==smartContractAddress && transaction.receiverAddress!==smartContractAddress)return ;
            setTransactionDetail(transaction);
        }
        getData();

        // Set up an interval to call getData every 5 seconds
        const intervalId = setInterval(getData, 1000*60);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (transactionDetail)
            setLinkExist(transactionDetail?.link !== "");
    }, [transactionDetail]);

    return (
    <div className="flex-center h-screen w-screen">
            {transactionDetail? (
                <div className="bg-black-400 h-[80vh] self-center w-full md:w-3/4 text-white py-6 flex flex-col justify-around items-center overflow-auto no-scrollbar rounded">
                    <p className="heading2 max-w-full flex text-center">Transaction Details</p>
                    <div className="heading4 flex w-full justify-around md:flex-row ">
                        <p className="flex-center text-white-800 w-1/2">Status:</p>
                        <p className="flex-center text-gradient_pink-orange w-1/2 text-ellipsis">Confirmed</p>
                    </div>
                    <div className="flex-center flex-col">
                        <p className="heading4 text-white-400">{transactionDetail.senderAddress===smartContractAddress?'You sent':'You received'} {transactionDetail.usdc_transferred?.toFixed(3)} USDC</p>
                        <p className="body-text text-white-500">on {formattedDate(transactionDetail.createdAt || "")}</p>
                    </div>
                    <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">From {transactionDetail.senderAddress===smartContractAddress?'(You)':''}:</p> 
                        <div className="flex flex-col hover:cursor-pointer w-1/2" onClick={() => handleCopy(transactionDetail.senderAddress)}>
                            <p className="flex-center text-gradient_purple-blue">{transactionDetail.senderAddress.substring(0,3)}...{transactionDetail.senderAddress.substring(transactionDetail.senderAddress.length-3)}</p>
                            {/* <p className="flex-center text-white-400 heading4" onClick={() => handleCopy(transactionDetail.senderAddress)}>Click to Copy</p> */}
                        </div>
                    </div>
                    <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">To {transactionDetail.receiverAddress===smartContractAddress?'(You)':''}:</p> 
                        <div className="flex flex-col hover:cursor-pointer w-1/2" onClick={() => handleCopy(transactionDetail.receiverAddress)}>
                            <p className="flex-center text-gradient_purple-blue">{transactionDetail.receiverAddress.substring(0,3)}...{transactionDetail.receiverAddress.substring(transactionDetail.receiverAddress.length-3)}</p>
                            {/* <p className="flex-center text-white-400 heading4" onClick={() => handleCopy(transactionDetail.receiverAddress)}>Click to Copy</p> */}
                        </div>
                    </div>
                    <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">Amount:</p>
                        <div className="flex-center flex-col w-1/2">
                            <p className="flex-center text-gradient_purple-blue">{(transactionDetail.sentAmount).toString()} {transactionDetail.sender_currency}</p>
                            <p className="flex-center text-white-400 body-text ">{transactionDetail.senderAddress===smartContractAddress?'-':'+'}{transactionDetail.usdc_transferred?.toFixed(3)} USDC</p>
                        </div>
                    </div>
                    <div className="heading4 flex w-full justify-around lex-row">
                        <p className="text-gradient_blue-purple flex  w-1/2 pl-8">Note:</p> 
                        <p className="flex-center text-gradient_purple-blue  w-1/2 text-center text-ellipsis">{transactionDetail?.note}</p>
                    </div>
                    
                    {linkExist && (
                        <div className="flex flex-col justify-center w-full items-center gap-y-10">
                            <div className="text-gradient_blue-purple heading4 py-2 w-full flex justify-around">
                                <p className="text-gradient_blue-purple flex  w-1/2 pl-8">Category:</p> 
                                <p className="flex-center text-gradient_purple-blue  w-1/2">{transactionDetail.senderAddress===smartContractAddress?'Outgoing':'Incoming'} via link</p>
                            </div>
                        </div>

                    )}
                    <div className="flex items-center justify-around gap-x-2">
                        <div onClick={handleClaim} className="gradient_pink-orange cursor-pointer text-white-800 rounded-lg whitespace-nowrap p-4 sm:heading4 xs:body-text">
                            Claim Link
                        </div>
                        <div className="gradient_pink-orange cursor-pointer text-white-800 rounded-lg whitespace-nowrap p-4 sm:heading4 xs:body-text">
                            <Link href={`https://mumbai.polygonscan.com/tx/${transactionDetail.hashId}`} target="_blank">View on PolygonScan</Link>
                        </div>
                    </div>
                </div>
            ):(
                <LoadingComponent />
            )
        }
        </div>
    );
}

export default TransactionDetailsComponent;
