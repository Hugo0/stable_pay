"use client";
import { usePrivySmartAccount } from '@zerodev/privy';
import { useEffect, useState } from 'react'
import Features from './Features';
import toast from "react-hot-toast";
import Install from './Install';

type Props = {}

const Login = (props: Props) => {
    const {authenticated,login} = usePrivySmartAccount();
    useEffect(() => {
        const userData=setTimeout(async () => {
            if(!window.matchMedia('(display-mode: standalone)').matches){
                return <Install />
            }
            const refreshToast=toast.loading('Setting Up, please wait...');
            if(!authenticated){
                await login();
            }
            toast.success('You are ready to delve into global payments!!',{
                id:refreshToast
            });
        },200);
        return () => clearTimeout(userData);
    },[authenticated]);
  return (
    <div className='flex-center paddings mx-auto w-full max-w-screen-2xl flex-col'>
        {authenticated && <Features />}
        <section className=''>

        </section>
    </div>
  )
}

export default Login