"use client";
import { usePrivySmartAccount } from '@zerodev/privy';
import { useEffect, useState } from 'react'
import Features from './Features';
import toast from "react-hot-toast";
import Install from './Install';
import Body from './Body';
import { getUserData } from '@/getUserData';
import { connectToDatabase } from '@/database';
import { useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import peanut from '@squirrel-labs/peanut-sdk';

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
    useEffect(() => {
        const userData=setTimeout(async () => {

            if(!window.matchMedia('(display-mode: standalone)').matches){
                setConditionalRender(true);
                return ;
            }

            const refreshToast=toast.loading('Setting Up, please wait...');
            if(!authenticated){
                await login();
            }
            if(zeroDevReady){
                const embeddedWallet=wallets.find((wallet) => wallet.walletClientType === "privy");
                if(embeddedWallet){
                    console.log("Eoa:",embeddedWallet.address);
                    const provider = await embeddedWallet.getEthereumProvider();
                        await provider.request({method: "wallet_switchEthereumChain",
                        params:[{chainId: `0x${Number(80001).toString(16)}`}]
                    })
                    // await provider.request({})
                    const ethProvider=new ethers.providers.Web3Provider(provider);
                    const signer=await ethProvider.getSigner(user.wallet?.address);
                    const walletBalance=await ethProvider.getBalance(
                        user.wallet?.address || ""
                    )
                    const ethStringAmount=ethers.utils.formatEther(walletBalance);
                    // setWalletBalance(ethStringAmount);
                    await peanut.createLink({
                        structSigner: {
                          signer: signer,
                        },
                        linkDetails: {
                          chainId: Number(80001),
                          tokenAmount: Number(0.01),
                          tokenType: 1,
                          tokenAddress: user?.wallet?.address,
                        },
                      }).then(response => {
                          console.log("response:",response);
                          console.log("link:",response.createdLink.link[0]);

                      }).catch(error => console.log(error));

                      const linkDetails = {
                        chainId: Number(80001),
                        tokenAmount: Number(0.01),
                        tokenType: user.wallet?.chainId,
                        tokenAddress: user.wallet?.address,
                      };

                      const prepareTxsResponse = await peanut.prepareTxs({
                        address: user.wallet?.address || "",
                        linkDetails,
                      });

                      const signedTxs = await Promise.all(
                        prepareTxsResponse.unsignedTxs.map((unsignedTx: any) =>
                          peanut.signAndSubmitTx({
                            structSigner: {
                              signer: signer,
                            },
                            unsignedTx,
                          })
                        )
                      );

                      const links = await peanut.getLinksFromTx({
                        linkDetails,
                        txHash: signedTxs[signedTxs.length - 1]?.txHash,
                      });
                  
                      console.log("links:",links);
                  

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
        {authenticated && <Features />}
        <section className=''>
            <Body feature={feature} />
            <div>
                {/* {signer} */}
            </div>
        </section>
    </div>) : <Install />}
    </>

  )
}

export default Login