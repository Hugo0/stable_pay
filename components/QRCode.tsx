"use client";

import { usePrivySmartAccount } from "@zerodev/privy";
import React,{ useEffect, useState } from "react";
import QRCode from "react-qr-code";
import clipboard from 'clipboard-copy';
import toast from "react-hot-toast";
import { parseCookies } from "nookies";
import LoadingComponent from "./LoadingComponent";


const QrCode = () => {
    const {authenticated,zeroDevReady,user,login} =usePrivySmartAccount();
    const [smartContractAddress,setSmartContractAddress]=useState(parseCookies().smartContractAddress);
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
    <>
      {zeroDevReady? (
            <div className="h-[60vh] md:h-[40vh] w-screen flex-center flex-col">
                <div className="flex h-full w-5/6 md:w-1/2 flex-col justify-center items-center self-center rounded-md shadow-lg bg-white py-4 overflow-auto">
                    <QRCode
                        size={256}
                        style={{ width: "100%" }}
                        value={smartContractAddress}
                        viewBox={`0 0 256 256`}
                        className="h-full w-full"
                    />
                </div>
                <div onClick={handleCopy} className="hover:cursor-pointer text-gradient_blue-purple bg-black-400 mt-2 heading4 md:heading4 p-4 rounded">Copy to Clipboard</div>
            </div>
            ):
        <LoadingComponent />}
    </>
  )
}

export default QrCode