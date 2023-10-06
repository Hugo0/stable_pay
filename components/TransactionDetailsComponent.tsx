"use client";

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

    useEffect(() => {
        const getData = async () => {
            const transaction: TransactionProps = await fetcher(props.id);
            setTransactionDetail(transaction);
        }
        getData();

        // Set up an interval to call getData every 5 seconds
        const intervalId = setInterval(getData, 1000);

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
                <div className="bg-black-400 h-3/4 w-full md:w-1/2 text-white-800 flex flex-col justify-around items-center overflow-auto no-scrollbar rounded">
                    <p className="heading1 flex-center w-full">Transaction Details</p>
                    <div className="text-gradient_blue-purple heading3">
                        From : {`${transactionDetail.senderAddress.substring(0,3)}...${transactionDetail.senderAddress.substring(transactionDetail.senderAddress.length-3)}`}
                    </div>
                    <div className="text-gradient_blue-purple heading3">
                        To : {`${transactionDetail.receiverAddress.substring(0,3)}...${transactionDetail.receiverAddress.substring(transactionDetail.senderAddress.length-3)}`}
                    </div>
                    <div className="text-gradient_blue-purple heading3">
                        Amount : {(transactionDetail.sentAmount).toString()} {transactionDetail.sender_currency}
                    </div>
                    <div className="text-gradient_blue-purple heading3">
                        Note : {transactionDetail?.note}
                    </div>
                    {linkExist && (
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-gradient_blue-purple heading3">
                                Category : Outgoing via Link
                            </div>
                            <div className="gradient_blue-purple text-white-800 rounded whitespace-nowrap p-6 heading2">
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
