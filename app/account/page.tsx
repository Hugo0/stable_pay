"use client";
import { ArrowUpOnSquareIcon, CreditCardIcon, PlusCircleIcon, UserCircleIcon, WalletIcon } from '@heroicons/react/24/outline';
import { useWallets } from '@privy-io/react-auth';
import { usePrivySmartAccount } from '@zerodev/privy';
import { useEffect, useMemo, useState } from 'react';
import clipboard from 'clipboard-copy';
import toast from "react-hot-toast";

type Props = {}
// export const revalidate=300;

const Page = (props: Props) => {
    const {linkEmail,linkDiscord,linkGoogle,linkTwitter,linkPhone,exportWallet,user,zeroDevReady,login}=usePrivySmartAccount();
    const [smartContractAddress,setSmartContractAddress]=useState("");
    const [eoaAddress,setEoaWalletAddress]=useState("");

    const linkOptions=[
        {label:"Email",action:linkEmail,code:"email"},
        {label:"Phone",action:linkPhone,code:"phone"},
        {label:"Google",action:linkGoogle,code:"google_oauth"},
        {label:"Discord",action:linkDiscord,code:"discord"},
        {label:"Twitter",action:linkTwitter,code:"twitter"},
       ]

    const {wallets}=useWallets();

    const linkedOrNot= (code:string) => {
        const index=user.linkedAccounts?.findIndex(element => element.type===code);
        return index!=-1;
    }
       
    useEffect(() => {
           if(!zeroDevReady){
               login();
            }else{
            const response=user.linkedAccounts;
            console.log('response:',response);
            setSmartContractAddress(user?.wallet?.address || "");
            const EmbeddedWallet=wallets.find((wallet) => wallet.walletClientType === "privy");
            setEoaWalletAddress(EmbeddedWallet?.address || "");
        }
    },[zeroDevReady]);

    const handleCopy=async (e: React.MouseEvent<HTMLInputElement>) => {
        if(smartContractAddress==="")return ;
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
    <div className='h-screen w-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500'>
        <div className='flex h-2/3 w-full flex-col items-center self-center md:w-1/2 rounded-md shadow-lg bg-black-300 py-4 overflow-auto no-scrollbar'>
            <p className='font-bold text-2xl text-gradient_pink-orange'>Account</p>
            <div className='flex mt-4 justify-center items-center text-gray-500'>
                <WalletIcon className='h-12 w-12' />
                <p>Wallets</p>
            </div>
            <p className='text-gray-400'>Connect and link Wallets to your account</p>
            <div className='border border-blue-400 rounded-md flex justify-between p-2 items-center w-4/5 m-4'>
                <p className='text-gray-400'>{`${smartContractAddress.substring(0,7)}...${smartContractAddress.substring(smartContractAddress.length-3)}`}</p>
                <span onClick={handleCopy} className='text-gray-400 p-2 rounded-md hover:cursor-pointer'>Copy</span>
            </div>
            <div className='w-full flex flex-col my-2'>
                <div className='text-gray-600 flex justify-center items-center'>
                    <UserCircleIcon className='h-8 w-8' />
                    <p className='text-gray-400'>Linked Socials</p>
                </div>
                {linkOptions.map((element,index) =>  {
                    return (
                    <div key={index} className='border flex justify-between items-center w-full md:w-3/4 self-center rounded-md p-2 my-1 mx-2'>
                        <p className='text-gray-300'>{element.label}</p>
                        <PlusCircleIcon 
                        className={`${linkedOrNot(element.code)?'hidden':''} h-8 w-8 gradient_pink-orange rounded-full text-white hover:cursor-pointer`} 
                        onClick={element.action} />
                        <p className={`${linkedOrNot(element.code)?'':'hidden'} text-gray-400`}>Already Linked</p>
                    </div>
                )})}
            </div>
            <div className='w-full flex flex-col mt-2'>
                <div className='w-full md:w-3/4 self-center border rounded-md p-2 text-gray-500'>
                    <div className='flex items-center '>
                        <CreditCardIcon className='h-8 w-8' />
                        <div className='flex flex-1 justify-between items-center px-2'>
                            <p>Embedded Wallet</p>
                            <p className='text-gray-400'>{`${eoaAddress.substring(0,5)}...${eoaAddress.substring(eoaAddress.length-3)}`}</p>
                        </div>
                    </div>
                    <div>
                        <p className='text-sm text-gray-400'>A user&apos;s embedded wallet is theirs to keep, and even take with them.</p>
                        <div className='text-blue-500 my-2 flex items-center hover:cursor-pointer justify-center' onClick={exportWallet}>
                            <ArrowUpOnSquareIcon className='h-8 w-8' />
                            <p>Export your Wallet</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-5/6 flex items-center justify-around mt-4'>
                {/* <button className='bg-green-500 text-white rounded-3xl p-4'>Add funds</button> */}
                <button className='gradient_pink-orange text-white rounded-3xl p-4'>Withdraw Funds</button>
            </div>
        </div>
    </div>
  )
}

export default Page