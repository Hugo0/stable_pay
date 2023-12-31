"use client";
import { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import dynamic from "next/dynamic"
import LoadingComponent from "./LoadingComponent";

const SendTransactionComponent = dynamic(() => import("./SendTransactionComponent"),{
    loading: () => <LoadingComponent />
})

const QrCode = dynamic(() => import('./QRCode'),{
    loading: () => <LoadingComponent />
})

type Wallet = {
    address : string | undefined,
}

const Scan = () => {
    const [receiverAddress,setReceiverAddress]=useState("");
    const [qrActive,setQRActive]=useState("scan");

    const features=[
        {
            title:"Scan",
            option:"scan",
        },
        {
            title:"My QR Code",
            option:"qr",
        }
    ];
    
  return (
    <div className='mt-5 relative flex h-[70vh] md:h-[50vh]'>
        {qrActive=="scan"?(
            <div>
                {receiverAddress===""? (
        <div className='h-[60vh] md:h-[40vh] w-screen flex-center'>
            <div className='h-full w-full md:w-1/2 flex-center self-center'>
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
                className="h-full w-full flex-1"
            />
        </div>
        </div>
        ):(
            <SendTransactionComponent receiverAdress={receiverAddress} />
        )}
            </div>
        ):(
            <QrCode />
        )
    }
    <div className="flex-center w-full gap-x-4 absolute bottom-0 self-center justify-self-center">
        {features.map(feature => {
            return (
                <div key={feature.option} onClick={() => setQRActive(feature.option)} className={`${qrActive===feature.option?'gradient_blue-purple':''} hover:cursor-pointer text-white-800 whitespace-nowrap rounded-lg px-8 py-3 my-4 capitalize bg-black-300`}>
                    {feature.title}
                </div>
            )
        })}
    </div>
    </div>
  )
}

export default Scan