"use client";
import { usePrivySmartAccount } from '@zerodev/privy';
import { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import peanut from '@squirrel-labs/peanut-sdk';
import { parseCookies, setCookie } from 'nookies';
import dynamic from "next/dynamic";
import LoadingComponent from './LoadingComponent';

const Body=dynamic(() => import("./Body"),{
    loading:() => <LoadingComponent />
})

const Install=dynamic(() => import("./Install"),{
    loading:() => <LoadingComponent />
})

const Features=dynamic(() => import("./Features"),{
    loading:() => <LoadingComponent />
})

type Props = {
    feature:string | string[] | undefined,
}

// let authenticated:boolean=false;
// let login:any={}

const Login = ({feature}: Props) => {
    const [conditionalRender,setConditionalRender]=useState(false);
    const {authenticated,login,user,zeroDevReady}=usePrivySmartAccount();
    const [link,setLink]=useState<string | null>(null);
    const {wallets}=useWallets();
    const smartContractAddress=parseCookies().smartContractAddress;
    useEffect(() => {
        const userData=setTimeout(async () => {

            if(!window.matchMedia('(display-mode: standalone)').matches){
                setConditionalRender(true);
                return ;
            }

            const refreshToast=toast.loading('Setting Up, please wait...');
            if(!smartContractAddress){
                await login();
            }
            if(zeroDevReady){
                const embeddedWallet=wallets.find((wallet) => wallet.walletClientType === "privy");
                if(embeddedWallet){
                    console.log("Eoa:",embeddedWallet.address);
                    const smartContractAddress=parseCookies().smartContractAddress;
                    if(!smartContractAddress && user?.wallet){
                        setCookie(null,'smartContractAddress',JSON.stringify(user?.wallet?.address),{
                            maxAge: 30 * 24 * 60 , // 1 day in seconds
                            path: '/', // Cookie available to all paths
                        })
                    }
                    // const provider = await embeddedWallet.getEthereumProvider();
                    //     await provider.request({method: "wallet_switchEthereumChain",
                    //     params:[{chainId: `0x${Number(80001).toString(16)}`}]
                    // })
                    // await provider.request({})
                    // const ethProvider=new ethers.providers.Web3Provider(provider);
                    // const signer=await ethProvider.getSigner(embeddedWallet.address);
                    // const walletBalance=await ethProvider.getBalance(
                    //     user.wallet?.address || ""
                    // )
                    // const ethStringAmount=ethers.utils.formatEther(walletBalance);
                    // // setWalletBalance(ethStringAmount);
                    // await peanut.createLink({
                    //     structSigner: {
                    //       signer: signer,
                    //     },
                    //     linkDetails: {
                    //       chainId: 80001,
                    //       tokenAmount: 0.00001,
                    //       tokenType: 0,
                    //     //   tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    //     },
                    //   }).then(response => {
                    //       console.log("response:",response);
                    //       console.log("link:",response.createdLink.link[0]);

                    //   }).catch(error => console.log(error));

                    //   const linkDetails = {
                    //     chainId: Number(80001),
                    //     tokenAmount: Number(0.00),
                    //     tokenType: 1,
                    //     tokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
                    //   };

                    //   const prepareTxsResponse = await peanut.prepareTxs({
                    //     address: user.wallet?.address || "",
                    //     linkDetails,
                    //   });

                    //   const signedTxs = await Promise.all(
                    //     prepareTxsResponse.unsignedTxs.map((unsignedTx: any) =>
                    //       peanut.signAndSubmitTx({
                    //         structSigner: {
                    //           signer: signer,
                    //         },
                    //         unsignedTx,
                    //       })
                    //     )
                    //   );

                    //   const links = await peanut.getLinksFromTx({
                    //     linkDetails,
                    //     txHash: signedTxs[signedTxs.length - 1]?.txHash,
                    //   });
                  
                    //   console.log("links:",links);
                  

                }
            }
            toast.success('You are ready to delve into global payments!!',{
                id:refreshToast
            });
        },100);
        return () => clearTimeout(userData);
    },[authenticated,zeroDevReady]);
  return (
    <>
        {!conditionalRender ? (<div className='flex-center paddings mx-auto w-full max-w-screen-2xl flex-col'>
        {/* {authenticated && <Features />} */}
        <section className=''>
            <Body feature={feature} />
        </section>
    </div>) : <Install />}
    </>

  )
}

export default Login