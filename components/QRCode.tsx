"use client";

import { usePrivySmartAccount } from "@zerodev/privy";
import React,{ useEffect, useState } from "react";
import QRCode from "react-qr-code";
import clipboard from 'clipboard-copy';
import toast from "react-hot-toast";


const QrCode = () => {
    const {authenticated,zeroDevReady,user,login} =usePrivySmartAccount();
    const [smartContractAddress,setSmartContractAddress]=useState('');
    useEffect(() => {
        if(!authenticated || !zeroDevReady){
            login();
        }else if(zeroDevReady){
            setSmartContractAddress(user?.wallet?.address || "");
        }
    },[zeroDevReady,authenticated]);

    const handleCopy=async (e: React.MouseEvent<HTMLInputElement>) => {
        try {
            const copyingToast=toast.loading("Copying to clipboard...");
            await clipboard(smartContractAddress);
            toast.success("Successfully copied!",{
                id:copyingToast
            })
        } catch (err) {
            console.error('Failed to copy to clipboard: ', err);
        }
    }

  return (
    <div className="h-screen w-screen flex-center flex-col">
        <div className="flex h-1/2 w-5/6 md:w-1/2 flex-col justify-center items-center self-center rounded-md shadow-lg bg-white py-4 overflow-auto">
            <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "90%", width: "100%" }}
                value={smartContractAddress}
                viewBox={`0 0 256 256`}
                className="h-full w-full"
            />
        </div>
        <div onClick={handleCopy} className="hover:cursor-pointer text-gradient_blue-purple bg-black-400 mt-10 heading3 p-4 rounded">Copy to Clipboard</div>
    </div>
  )
}

export default React.memo(QrCode)