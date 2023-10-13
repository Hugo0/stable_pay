"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type Props = {
    modal:boolean
}

const SendTransactionModal = ({modal}: Props) => {
    const [modalOpen,setModalOpen]=useState(modal);
    useEffect(() => {
        setModalOpen(true);
    },[]);
  return (
    <div className={`h-screen w-screen flex justify-center items-center fixed top-0 left-0 backdrop-blur-lg bg-blue-400 ${modalOpen?'':'hidden'}`}>
        <div className='h-1/6 w-full flex md:w-1/2 relative bg-black/20 rounded-md shadow-lg self-center justify-center items-center'>
            <XMarkIcon className="absolute right-0 top-0 m-4 h-8 w-8 hover:cursor-pointer bg-gray-100 rounded-md" onClick={() => setModalOpen(false)} />
            <div>
                Send To...
            </div>
        </div>
    </div>
  )
}

export default SendTransactionModal