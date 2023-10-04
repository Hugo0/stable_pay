"use client";
import { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import dynamic from "next/dynamic"
import LoadingComponent from "./LoadingComponent";

const SendTransactionComponent = dynamic(() => import("./SendTransactionComponent"),{
    loading: () => <LoadingComponent />
})

type Wallet = {
    address : string | undefined,
}

type LinkWallet = {
    wallet?: Wallet,
    getAddress?: () => string | undefined,
}

const Scan = () => {
    const [receiverAddress,setReceiverAddress]=useState("");
    
  return (
    <div className=''>
        {receiverAddress===""? (
        <div className='h-[60vh] md:h-[40vh] w-screen flex-center '>
            <div className='h-full w-full md:w-1/2 bg-white flex-center'>
            <QrReader 
                onResult={(result, error) => {
                    if (!!result) {
                    setReceiverAddress(result?.getText());
                    }
        
                    if (!!error) {
                    console.info(error);
                    }
                }}
                constraints={
                    {
                        // width:'100px',

                        facingMode:'environment'
                    }
                }
                className="h-full w-full"
            />
        </div>
        </div>
        ):(
            <SendTransactionComponent receiverAdress={receiverAddress} />
        )}
    </div>
  )
}

export default Scan