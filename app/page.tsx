"use client";

import Modal from "@/components/utils/Modal";
import { useCurrencyStore } from "@/store/CurrencyStore";
import { usePrivySmartAccount } from "@zerodev/privy";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Add your relevant code here for the issue to reproduce */
const content=["You need to login to access the app"]

export default function Home() {
  const {login,ready,authenticated}=usePrivySmartAccount();
  const [baseCurrency]=useCurrencyStore(state => [state.baseCurrency]);
  const router=useRouter();

  useEffect(() => {
    if(!window.matchMedia('(display-mode: standalone)').matches)router.push('/install');
    else login();
  },[]);

  if(!ready)return <></>

  if(authenticated && baseCurrency!=="")router.push("/loggedIn")
  else if(authenticated)router.push("/baseCurrency");

  return (
    <div className="text-center h-screen w-screen flex items-center justify-center flex-col">
      <Modal title="Please Login" content={content} />
      <button
        className="fixed bottom-12 px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
        onClick={login}
      >
        Log In
      </button>
    </div>
  )
}