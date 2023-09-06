"use client";

import { useWallets } from '@privy-io/react-auth';
import { usePrivySmartAccount } from '@zerodev/privy';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { encodeFunctionData } from 'viem';
import abi from "@/lib/nft.json";
import SignMessage from '@/components/SignMessage';
import SendTransaction from '@/components/SendTransaction';
import DropDownButton from '@/components/utils/DropDownButton';

function LoggedIn() {
    const [selectedLink,setSelectedLink]=useState("");
    const [walletBalance,setWalletBalance]=useState("");
    const [embeddedWallet,setEmbeddedWallet]=useState<any>("");
    const [transactionHash,setTransactionHash]=useState("");

   const {user,
    linkEmail,
    linkPhone,
    linkGoogle,
    linkWallet,
    ready,
    logout,
    authenticated,
    zeroDevReady,
    sendTransaction,
    signMessage
    } =usePrivySmartAccount();

    const {wallets}=useWallets();
    const router=useRouter();


    useEffect(() => {
        if(!ready)return ;
        if(!window.matchMedia('(display-mode: standalone)').matches)router.push('/install');
        async function setUp() {
            const embeddedWallet=wallets.find((wallet) => wallet.walletClientType === "privy");
            if(embeddedWallet){
                console.log(embeddedWallet);
                const provider = await embeddedWallet.getEthereumProvider();
                    await provider.request({method: "wallet_switchEthereumChain",
                    params:[{chainId: `0x${Number(1).toString(16)}`}]
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
    },[wallets,ready,zeroDevReady]);

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

   const handleMint=async () => {
    if (zeroDevReady) {
        const transactionHash = await sendTransaction({
            to: '0xd6bab17e1c076A3b2153C86433e4090ece77741c',
            // value: 1,
            data:encodeFunctionData({
                abi,
                functionName:"mint",
                args:[user?.wallet?.address]
            })
        });
        setTransactionHash(transactionHash);
    } else {
        throw new Error('Smart wallet has not yet initialized. Try again once zeroDevReady is true.');
    }
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
        <p>The Address of the Smart Wallet is {user?.wallet?.address}</p>
        <p>The EOA Address : {embeddedWallet?.address}</p>
        {walletBalance && <p>With a balance of {walletBalance}ETH</p>}
        {zeroDevReady && <p>Smart Wallet Created!!!</p>}
        <div>
            <button
                onClick={logout}
                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
                Log Out
            </button>
        </div>
        <button onClick={handleMint} className='bg-green-500 hover:bg-green-600 mt-4 py-2 px-4'>Mint</button>
        {transactionHash!=="" && <p>Transaction Hash: {transactionHash}</p>}
        <SignMessage user={user} signMessage={signMessage} />
        <SendTransaction user={user} sendTransaction={sendTransaction} />
        <DropDownButton />
    </div>
  )
}
export default LoggedIn 