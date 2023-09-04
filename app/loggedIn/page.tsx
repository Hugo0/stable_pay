"use client";

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function LoggedIn() {
    const [selectedLink,setSelectedLink]=useState("");
    const [walletBalance,setWalletBalance]=useState("");
    const [embeddedWallet,setEmbeddedWallet]=useState<any>("");
   const {user,
    linkEmail,
    linkPhone,
    linkGoogle,
    linkWallet,
    ready,
    logout,
    authenticated
    } =usePrivy();

    const {wallets}=useWallets();
    const router=useRouter();


    useEffect(() => {
        if(!ready)return ;
        async function setUp() {
            const embeddedWallet=wallets.find((wallet) => wallet.walletClientType === "privy");
            if(embeddedWallet){
                const provider = await embeddedWallet.getEthereumProvider();
                    await provider.request({method: "wallet_switchEthereumChain",
                    params:[{chainId: `0x${Number(11155111).toString(16)}`}]
                })
                const ethProvider=new ethers.providers.Web3Provider(provider);
                const walletBalance=await ethProvider.getBalance(
                    embeddedWallet.address
                )
                const ethStringAmount=ethers.utils.formatEther(walletBalance);
                setWalletBalance(ethStringAmount);
                setEmbeddedWallet(embeddedWallet);
            }
        }
        setUp();
    },[wallets,ready]);

    if(ready && !authenticated)router.push("/");

   if(!user)return <></>

   const linkOptions=[
    {label:"Email",action:linkEmail},
    {label:"Phone",action:linkPhone},
    {label:"Google",action:linkGoogle},
    {label:"Wallet",action:linkWallet},
   ]

   const handleClick=async () => {
    const selected = linkOptions.find((option) => option.label===selectedLink)
    if(selected)selected.action();
   }

  return (
    <div className='p-8'>
        <p className='text-xl font-extrabold'>Logged In</p>
        <p className='mb-4'>User {user.id} has linked following accounts:</p>
        <div className='mb-5'>
            <select
                value={selectedLink}
                onChange={(e) => setSelectedLink(e.target.value)}
                className="border rounded mr-2 p-2"
            >
                <option>Select an option to Link</option>
                {linkOptions.map((option,index) => (
                    <option key={index} value={option.label}>{option.label}</option>
                ))}
            </select>
            <button onClick={handleClick}
                className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600 mr-2"
            >
                Link Selected Account
            </button>
        </div>
        <p>The Address of the embedded Wallet is {embeddedWallet?.address}</p>
        {walletBalance && <p>With a balance of {walletBalance}ETH</p>}
        <div>
            <button
                onClick={logout}
                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
                Log Out
            </button>
        </div>
    </div>
  )
}

export default LoggedIn