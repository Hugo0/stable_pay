"use client";

import peanut from "@squirrel-labs/peanut-sdk";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";

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

    const handleClaim=async () => {
        const smartContractAddress=parseCookies().smartContractAddress?.replace(/"/g, '');
        if((transactionDetail?.link==="") || !smartContractAddress)return ;
        const link=transactionDetail?.link?.replace(/peanut/g,'staging.peanut');
        console.log('linkclaim' + link);
        const response = await peanut.claimLinkGasless({
            link: link,
            recipientAddress: smartContractAddress,
            APIKey: process.env.NEXT_PUBLIC_PEANUT_KEY || "",
      })
      
      console.log('result: ' + response)
    }

    useEffect(() => {
        const getData = async () => {
            const transaction: TransactionProps = await fetcher(props.id);
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
        <div className="h-screen w-screen flex-center">
            {transactionDetail? (
                <div className="bg-black-400 gap-y-3 h-3/4 w-full md:w-1/2 text-white-800 flex flex-col justify-around items-center overflow-auto no-scrollbar rounded">
                    <p className="heading1 flex-center w-full md:px-4">Transaction Details</p>
                    <div className="text-gradient_blue-purple heading3 flex-center w-full">
                        From : {`${transactionDetail.senderAddress.substring(0,3)}...${transactionDetail.senderAddress.substring(transactionDetail.senderAddress.length-3)}`}
                    </div>
                    <div className="text-gradient_blue-purple heading3 flex-center w-full">
                        To : {`${transactionDetail.receiverAddress.substring(0,3)}...${transactionDetail.receiverAddress.substring(transactionDetail.senderAddress.length-3)}`}
                    </div>
                    <div className="text-gradient_blue-purple heading3 flex-center w-full">
                        Amount : {(transactionDetail.sentAmount).toString()} {transactionDetail.sender_currency}
                    </div>
                    <div className="text-gradient_blue-purple heading3 flex-center w-full md:px-4">
                        Note : {transactionDetail?.note}
                    </div>
                    {linkExist && (
                        <div className="flex flex-col justify-center items-center gap-y-4">
                            <div className="text-gradient_blue-purple heading3 py-2">
                                Category : Outgoing via Link
                            </div>
                            <div onClick={handleClaim} className="mb-4 gradient_blue-purple text-white-800 rounded whitespace-nowrap p-6 heading3">
                                Claim Link
                            </div>
                        </div>

                    )}
                </div>
            ):(
                <LoadingComponent />
            )
        }
        </div>
    );
}

export default TransactionDetailsComponent;
