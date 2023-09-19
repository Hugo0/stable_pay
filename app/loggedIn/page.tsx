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
import { useCurrencyStore } from '@/store/CurrencyStore';
import { userStore } from '@/store/UserStore';
import SideBar from '@/components/SideBar';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { generalStore } from '@/store/GeneralStore';
import Hamburger from '@/components/utils/Hamburger';
import SendTransactionModal from '@/components/SendTransactionModal';
import { parseCookies } from 'nookies';

function LoggedIn() {
    const [transactionModalOpen,setTransactionOpen]=useState(false);
    const [selectedLink,setSelectedLink]=useState("");
    const [walletBalance,setWalletBalance]=useState("");
    const [embeddedWallet,setEmbeddedWallet]=useState<any>("");
    const [transactionHash,setTransactionHash]=useState("");
    const [baseCurrency,receiverCurrency,setBaseCurrency,setReceiverCurrency]=useCurrencyStore(state => [
        state.baseCurrency,
        state.receiverCurrency,
        state.setBaseCurrency,
        state.setReceiverCurrency
    ])
    const [eoaWalletAddress,setEoaWalletAddress,smartContractAddress,setSmartContractAddress]=userStore(state => [state.eoaWalletAddress,state.setEoaWalletAddress,state.smartContractAddress,state.setSmartContractAddress])
    const [loading,setLoading]=generalStore(state => [state.loading,state.setLoading]);
    const [amountSelected,setAmountSelected]=useState(0);
    const userData=parseCookies().contractAddress;

    const swap= async () => {
        const temp=baseCurrency;
        setBaseCurrency(receiverCurrency);
        setReceiverCurrency(temp);
    }

   const {user,
    ready,
    logout,
    authenticated,
    zeroDevReady,
    sendTransaction,
    signMessage,
    } =usePrivySmartAccount();

    const {wallets}=useWallets();
    const router=useRouter();

    useEffect(() => {
        if(!ready)return ;
        if(!window.matchMedia('(display-mode: standalone)').matches)router.push('/install');
        if(baseCurrency==="")router.push("/baseCurrency");
        setLoading(true);
        async function setUp() {
            const embeddedWallet=wallets.find((wallet) => wallet.walletClientType === "privy");
            if(embeddedWallet){
                console.log(embeddedWallet);
                const provider = await embeddedWallet.getEthereumProvider();
                    await provider.request({method: "wallet_switchEthereumChain",
                    params:[{chainId: `0x${Number(80001).toString(16)}`}]
                })
                const ethProvider=new ethers.providers.Web3Provider(provider);
                const walletBalance=await ethProvider.getBalance(
                    embeddedWallet.address
                )
                const ethStringAmount=ethers.utils.formatEther(walletBalance);
                setWalletBalance(ethStringAmount);
                setEmbeddedWallet(embeddedWallet);
                
                if(!userData){
                    setEoaWalletAddress(embeddedWallet?.address || "");
                    setSmartContractAddress(user?.wallet?.address || "");
                }else{
                    console.log('address:',userData);
                }
            }
            setLoading(false);
        }
        setUp();
    },[wallets,ready,zeroDevReady]);

    if(ready && !authenticated)router.push("/");

   if(!user)return <></>

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

   const handleSendTransactionOpen= async () => {
    // if(!user || !zeroDevReady || !ready || smartContractAddress==="") return;
    setTransactionOpen(true);
   }

  return (
    <div className='flex flex-col justify-center h-screen w-screen bg-black-100'>
        {transactionModalOpen && <SendTransactionModal modal={true} />}
    <div className='p-8 flex flex-col items-center bg-banner w-full md:w-1/2 self-center rounded-md shadow-lg'>
        <p className='text-xl font-semibold underline'>My Balance</p>
        {/* <p className='mb-4'>User {user?.id} has linked following accounts:</p> */}
        {<p className='font-extrabold mb-10'>{walletBalance || "0.0"} {baseCurrency}</p>}
        <p className='text-gray-500'>Exchange Estimate</p>
        <div className='flex m-2'>
            <div className='flex flex-col p-2'>
                <p className='font-normal m-2 '>You Send</p>
                <p className='font-bold pl-5 h-8 flex justify-center items-center'>{baseCurrency}</p>
            </div>
            <div className='flex flex-col p-2'>
                <p className='text-green-500 font-normal m-2'>Max 5,000 {baseCurrency}</p>
                <input 
                    onChange={(e) => setAmountSelected(Number(e.target.value)*82.15)}
                type="text" className='h-8 flex justify-center items-center border border-green-500 outline-none rounded-md text-green-500' />
            </div>
        </div>
        <button className='m-2' onClick={swap}> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
        </button>
        <div className='flex m-2'>
            <div className='flex flex-col p-2'>
                <p className='font-normal m-2 '>Receiver gets</p>
                <p className='font-bold pl-5 h-8 flex justify-center items-center'>{receiverCurrency}</p>
                <p className='font-normal m-2 '>Network Fee:</p>
            </div>
            <div className='flex flex-col p-2'>
                <p className='text-[#40BCCE] font-normal m-2'>1 {baseCurrency} = 82.15 {receiverCurrency}</p>
                <p className='font-bold flex justify-center items-center h-8 text-gray-500'>~{amountSelected}</p>
                <p className='font-normal m-2 flex justify-end'>0.06 {baseCurrency}</p>
            </div>
        </div>
        {/* <div className='mb-5'>
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
        </div> */}
        {/* <p>The Address of the Smart Wallet is {user?.wallet?.address}</p> */}
        {/* <p>The EOA Address : {embeddedWallet?.address}</p> */}
        {/* {zeroDevReady && <p>Smart Wallet Created!!!</p>} */}
        <div className='mt-2 flex'>
            <button className='bg-gradient-to-r bg-purple-500 to-bg-pink-500 hover:bg-green-600 m-4 py-2 px-4 rounded-lg text-white'>Add funds</button>
            <button className='bg-green-500 hover:bg-green-600 m-4 py-2 px-4 rounded-lg text-white' onClick={handleSendTransactionOpen}>Send</button>
        </div>
        {/* <button onClick={handleMint} className='bg-green-500 hover:bg-green-600 mt-4 py-2 px-4'>Mint</button>
        {transactionHash!=="" && <p>Transaction Hash: {transactionHash}</p>}
    <SignMessage user={user} signMessage={signMessage} /> */}
    <SendTransaction user={user} sendTransaction={sendTransaction} />
    <div>
        <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
            Log Out
        </button>
    </div>
    </div>
    </div>
  )
}
export default LoggedIn 
