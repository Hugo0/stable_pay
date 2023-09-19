"use client";

import Hamburger from "@/components/utils/Hamburger";
import { userStore } from "@/store/UserStore";
import { usePrivySmartAccount } from "@zerodev/privy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

type Props = {}

const QrCode = (props: Props) => {
    const {authenticated,zeroDevReady,user,ready,login} =usePrivySmartAccount();
    const [smartContractAddress,setSmartContractAddress]=useState('');
    const router=useRouter();
    useEffect(() => {
        if(!authenticated || !zeroDevReady){
            login();
        }else if(zeroDevReady){
            setSmartContractAddress(user?.wallet?.address || "");
        }
    },[zeroDevReady,authenticated,ready]);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
        <div className="flex h-1/2 w-5/6 flex-col justify-center items-center self-center rounded-md shadow-lg bg-white py-4 overflow-auto">
            <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={smartContractAddress}
                viewBox={`0 0 256 256`}
                className="h-full w-full"
            />
        </div>
    </div>
  )
}

export default QrCode