"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const handleLogin=(user:any) => {
    console.log(`User created: ${user.id}`)
}

function PrivyProviderB({children}:{children: React.ReactNode}){
    return (
    <PrivyProvider
        appId={process.env.NEXT_PUBLIC_APP_ID || ""}
        onSuccess={handleLogin}
        config={{
            loginMethods:[
                "wallet",
                "sms",
                "google",
                "email"
            ],
            embeddedWallets:{
                createOnLogin:"users-without-wallets",
                // noPromptOnSignature:true,
            },
            appearance:{
                accentColor:"#676FFF",
                theme:"light",
                logo:"icon-192x192.png",
            },
        }}
    >
        {children}
    </PrivyProvider>
    );
}

export default PrivyProviderB;