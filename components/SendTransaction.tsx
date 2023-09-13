"use client";

import { userStore } from '@/store/UserStore';
import { User } from '@privy-io/react-auth'
import { ethers } from 'ethers';
import React, { useState } from 'react'

type Props = {
    user:any,
    sendTransaction:any
}

const Popup=() => {
    return (
        <div>
            
        </div>

    )
}

const SendTransaction = ({user,sendTransaction}: Props) => {
    const [txHash,setTxHash]=useState("");
    const [smartContractAddress]=userStore(state => [state.smartContractAddress]);
    const handleSubmit = async () => {
        const ethAmount="0.000";
        const weiValue =ethers.utils.parseEther(ethAmount);
        const hexValue= ethers.utils.hexlify(weiValue);
        const unsignedTx={
            to: smartContractAddress,
            chainId:80001,
            value:hexValue,
        }
        const txUiConfig={
            header:"Send Transaction",
            description:"Send 0.001 eth to yourself",
            buttonText:"Send",
        }
        if(user.wallet){
            const tempHash=await sendTransaction(unsignedTx);
            setTxHash(tempHash);
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