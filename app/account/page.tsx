"use client";
import Hamburger from '@/components/utils/Hamburger';
import { userStore } from '@/store/UserStore';
import { ArrowUpOnSquareIcon, CreditCardIcon, PlusCircleIcon, UserCircleIcon, WalletIcon } from '@heroicons/react/24/outline';
import { usePrivySmartAccount } from '@zerodev/privy';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

type Props = {}

const Page = (props: Props) => {
    const router=useRouter();
    const [smartContractAddress,eoaWalletAddress]=userStore(state => [state.smartContractAddress,state.eoaWalletAddress]);
    const {linkEmail,linkDiscord,linkGoogle,linkTwitter,linkPhone,exportWallet,user}=usePrivySmartAccount();

    const linkOptions=[
        {label:"Email",action:linkEmail,code:"email"},
        {label:"Phone",action:linkPhone,code:"phone"},
        {label:"Google",action:linkGoogle,code:"gmail"},
        {label:"Discord",action:linkDiscord,code:"discord"},
        {label:"Twitter",action:linkTwitter,code:"twitter"},
       ]

       useEffect(() => {
        if(smartContractAddress==="")router.push("/");
       },[smartContractAddress,router]);

  return (
    <div className='h-screen w-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500'>
        <Hamburger />
        <div className='flex h-5/6 w-full flex-col items-center self-center md:w-1/2 border rounded-md shadow-lg bg-white py-4 overflow-auto'>
            <p className='font-bold text-2xl'>Account</p>
            <div className='flex mt-4 justify-center items-center text-gray-500'>
                <WalletIcon className='h-12 w-12' />
                <p>Wallets</p>
            </div>
            <p className='text-gray-400'>Connect and link Wallets to your account</p>
            <div className='border border-blue-400 rounded-md flex justify-between p-2 items-center w-4/5 m-4'>
                <p className='text-gray-600'>{`${smartContractAddress.substring(0,7)}...${smartContractAddress.substring(smartContractAddress.length-3)}`}</p>
                <span className='text-white bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-md'>Active</span>
            </div>
            <div className='w-full flex flex-col my-2'>
                <div className='text-gray-600 flex justify-center items-center'>
                    <UserCircleIcon className='h-8 w-8' />
                    <p className=''>Linked Socials</p>
                </div>
                {linkOptions.map((element,index) =>  {
                    return (
                    <div key={index} className='border flex justify-between items-center w-full md:w-1/2 self-center rounded-md p-2 m-1'>
                        <p className='text-gray-600'>{element.label}</p>
                        <PlusCircleIcon 
                        className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:cursor-pointer " 
                        onClick={element.action} />
                    </div>
                )})}
            </div>
            <div className='w-full flex flex-col mt-2'>
                <div className='w-full md:w-3/4 self-center border rounded-md p-2 text-gray-500'>
                    <div className='flex items-center '>
                        <CreditCardIcon className='h-8 w-8' />
                        <div className='flex flex-1 justify-between items-center px-2'>
                            <p>Embedded Wallet</p>
                            <p className='text-gray-400'>{`${eoaWalletAddress.substring(0,5)}...${eoaWalletAddress.substring(eoaWalletAddress.length-3)}`}</p>
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
                <button className='bg-green-500 text-white rounded-3xl p-4'>Add funds</button>
                <button className='bg-green-500 text-white rounded-3xl p-4'>Withdraw Funds</button>
            </div>
        </div>
    </div>
  )
}

export default Page