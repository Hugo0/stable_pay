"use client";

import { User } from '@privy-io/react-auth'
import { ethers } from 'ethers';
import React from 'react'

type Props = {
    user:any,
    sendTransaction:any
}

const SendTransaction = ({user,sendTransaction}: Props) => {
    const handleSubmit = async () => {
        const ethAmount="0.00";
        const weiValue =ethers.utils.parseEther(ethAmount);
        const hexValue= ethers.utils.hexlify(weiValue);
        const unsignedTx={
            to: user?.wallet?.address,
            chainId:1,
            value:hexValue,
        }
        const txUiConfig={
            header:"Send Transaction",
            description:"Send 0.00 eth to yourself",
            buttonText:"Send",
        }
        if(user.wallet){
            await sendTransaction(unsignedTx,txUiConfig);
        }
    }

  return (
    <div>
        <button
            disabled={!user.wallet}
            className='mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 rounded text-white'
            onClick={handleSubmit}
        >
            Send 0.00 eth to yourself!!!
        </button>
    </div>
  )
}

export default SendTransaction