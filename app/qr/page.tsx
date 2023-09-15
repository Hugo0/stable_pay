"use client";

import Hamburger from "@/components/utils/Hamburger";
import { userStore } from "@/store/UserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import QRCode from "react-qr-code";

type Props = {}

const QrCode = (props: Props) => {
    const [smartContractAddress]=userStore(state => [state.smartContractAddress]);
    const router=useRouter();
    useEffect(() => {
        if(smartContractAddress===""){
            router.back();
        }
    },[]);
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500">
        <Hamburger />
        <div className="flex h-5/6 w-full flex-col justify-center items-center self-center md:w-1/2 border rounded-md shadow-lg bg-white py-4 overflow-auto">
            <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "50%" }}
                value={smartContractAddress}
                viewBox={`0 0 256 256`}
            />
        </div>
    </div>
  )
}

export default QrCode