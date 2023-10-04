import peanut from '@squirrel-labs/peanut-sdk'
import { ethers, providers } from 'ethers';
import { parseCookies } from 'nookies';
import React from 'react'

type Props = {}

const fetcher=async () => {
    const smartContractAddress=parseCookies().smartContractAddress?.replace(/"/g,'')
    
      const linkDetails = {
        chainId: Number(80001),
        tokenAmount: Number(0.01),
        tokenType: 0,
        tokenAddress: smartContractAddress,
    };

    //   const prepareTxsResponse = await peanut.prepareTxs({
    //     address: smartContractAddress || "",
    //     linkDetails,
    //     });

    //     const provider = await embeddedWallet.getEthereumProvider();
    //                     await provider.request({method: "wallet_switchEthereumChain",
    //                     params:[{chainId: `0x${Number(80001).toString(16)}`}]
    //                 })
    //                 // await provider.request({})
    //                 const ethProvider=new ethers.providers.Web3Provider(provider);
    //                 const signer=await ethProvider.getSigner(user.wallet?.address);
    //     const signedTxs = await Promise.all(
    //         prepareTxsResponse.unsignedTxs.map((unsignedTx: any) =>
    //           peanut.signAndSubmitTx({
    //             structSigner: {
    //               signer: signer,
    //             },
    //             unsignedTx,
    //           })
    //         )
    //       );


}

const PeanutProtocol = (props: Props) => {
    
    
  return (
    <div>
        <button className='graadient_blue-purple'>Create link</button>
    </div>
  )
}

export default PeanutProtocol