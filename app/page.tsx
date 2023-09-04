"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  const {login,ready,authenticated}=usePrivy();
  const router=useRouter();

  useEffect(() => {
    if(!window.matchMedia('(display-mode: standalone)').matches)router.push('/install');
  },[]);

  if(!ready)return <></>

  if(authenticated)router.push("loggedIn");

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-semibold">Privy wallet Demo</h1>
      <button
        className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
        onClick={login}
      >
        Log In
      </button>
    </div>
  )
}