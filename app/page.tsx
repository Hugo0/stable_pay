"use client";

import Modal from "@/components/utils/Modal";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  const {login,ready,authenticated}=usePrivy();
  const router=useRouter();

  useEffect(() => {
    // if(!window.matchMedia('(display-mode: standalone)').matches)router.push('/install');
    // else login();
    login();
  },[]);

  if(!ready)return <></>

  if(authenticated)router.push("loggedIn");

  return (
    <div className="text-center h-screen w-screen flex items-center justify-center flex-col">
      <Modal title="Please Login" content="You need to login to access the app" />
      <button
        className="fixed bottom-12 px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
        onClick={login}
      >
        Log In
      </button>
    </div>
  )
}
