"use client";
import { usePrivySmartAccount } from '@zerodev/privy';
import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import peanut from '@squirrel-labs/peanut-sdk';
import SendTransactionComponent from './SendTransactionComponent';

type Wallet = {
    address : string | undefined,
}

type LinkWallet = {
    wallet?: Wallet,
    getAddress?: () => string | undefined,
}

const Scan = () => {
    const [receiverAddress,setReceiverAddress]=useState("");
    const {user}=usePrivySmartAccount();
    const [linkCreated,setLinkCreated]=useState("");

    useEffect(() => {
        // const createLink=async () => {
        //     try{
        //         const testWallet:LinkWallet={
        //             wallet:user?.wallet,
        //             getAddress: () => {
        //                 return user?.wallet?.address
        //             }
        //         }
        //         const createLinkResponse = await peanut.createLink({
        //             structSigner:{
        //               signer: testWallet
        //             },
        //             linkDetails:{
        //               chainId: 80001, // eth-goerli 
        //               tokenAmount: 0.01,
        //               tokenType: 1,  // 0 for ether, 1 for erc20, 2 for erc721, 3 for erc1155
        //             }
        //         });
        //         setLinkCreated(createLinkResponse.createdLink.link[0]);
        //     }catch(err){
        //         console.log(err);
        //     }
        // }
        // createLink();
    },[receiverAddress]);

  return (
    <div>
        {receiverAddress===""? (
        <div className='h-[400px] md:h-[40vh] w-full md:w-1/2 bg-black-300'>
            <QrReader 
                onResult={(result, error) => {
                    if (!!result) {
                    setReceiverAddress(result?.getText());
                    }
        
                    if (!!error) {
                    console.info(error);
                    }
                }}
                constraints={
                    {
                        // width:'100px',

                        facingMode:'environment'
                    }
                }
                className="h-full w-full"
            />
        </div>
        ):(
            <SendTransactionComponent receiverAdress={receiverAddress} />
        )}
    </div>
  )
}

export default Scan