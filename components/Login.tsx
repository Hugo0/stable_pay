"use client";
import { usePrivySmartAccount } from '@zerodev/privy';
import { useEffect, useState } from 'react'
import Features from './Features';
import toast from "react-hot-toast";
import Install from './Install';
import Body from './Body';

type Props = {
    feature:string | string[] | undefined,
}

const Login = ({feature}: Props) => {
    const {authenticated,login} = usePrivySmartAccount();
    const [conditionalRender,setConditionalRender]=useState(true);
    useEffect(() => {
        const userData=setTimeout(async () => {
            if(!window.matchMedia('(display-mode: standalone)').matches){
                setConditionalRender(false);
                return ;
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
    <>
        {conditionalRender ? (<div className='flex-center paddings mx-auto w-full max-w-screen-2xl flex-col'>
        {authenticated && <Features />}
        <section className=''>
            <Body feature={feature} />
        </section>
    </div>) : <Install />}
    </>

  )
}

export default Login