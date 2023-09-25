"use client";

import { userStore } from '@/store/UserStore';
import { ethers } from 'ethers';
import { useState } from 'react';
import toast from "react-hot-toast";

type Props = {
    user:any,
    sendTransaction:any
}

const SendTransaction = ({user,sendTransaction}: Props) => {
    const [txHash,setTxHash]=useState("");
    const [popupOpen,setPopupOpen]=useState<boolean>(false);
    const [smartContractAddress]=userStore(state => [state.smartContractAddress]);
    const handleSubmit = async () => {
        // setPopupOpen(true);
        const ethAmount="0.001";
        const weiValue =ethers.utils.parseEther(ethAmount);
        const hexValue= ethers.utils.hexlify(weiValue);
        const unsignedTx={
            to: smartContractAddress,
            chainId:80001,
            value:hexValue,
        }
        // const txUiConfig={
        //     header:"Send Transaction",
        //     description:"Send 0.001 eth to yourself",
        //     buttonText:"Send",
        // }

        if (user.wallet) {

            try {
                const tempHash = await sendTransaction(unsignedTx);
                setTxHash(tempHash);
                // Dismiss the loading toast when the transaction is successful
                // toast.dismiss(loadingToastId);

                // Show the success toast
                // toast.success('Transaction Successful✅', {
                // // toastId: 'sendTransaction',
                // });
            } catch (error) {
                // Handle errors if the transaction fails
                console.error(error);
                // You may want to show an error toast here as well
            }
        }

    }

  return (
    <div>
        <button
            disabled={!user?.wallet}
            className='mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 rounded text-white'
            onClick={handleSubmit}
        >
            Send 0.001 eth to yourself!!!
        </button>
        {txHash && <p>{txHash}</p>}
    </div>  
  )
}

export default SendTransaction