"use client";

import { User } from '@privy-io/react-auth';
import React, { useState } from 'react'

// interface CustomUser extends User{
//     id?:string|undefined,
// }

type Props = {
    user: any 
    signMessage: any
}

const SignMessage = ({signMessage,user}: Props) => {

    const [hasSigned,setHasSigned]=useState(false);
    const [signature,setSignature]=useState("");

    const message="This is a Signing Message!";
    const uiConfig={
        title:"Testing Signing feature",
        description:"This is a demo to test the signing feature",
        buttonText:"Sign the message",
    }

    const handleSubmit= async () => {
        const signature=await signMessage(message,uiConfig);
        setSignature(signature);
        setHasSigned(true);
    }

  return (
    <div>
        <button
            className='mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 rounded text-white'
            disabled={!user.wallet}
            onClick={handleSubmit}
        >Sign Message</button>
        {hasSigned && <p className='mt-2'>Signed message with signature: {signature}</p>}
    </div>
  )
}

export default SignMessage