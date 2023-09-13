"use client";

import { userStore } from "@/store/UserStore";
import { PrivyProvider } from "@privy-io/react-auth";
import { usePrivySmartAccount } from "@zerodev/privy";

const handleLogin=() => {
    // router.push('/baseCurrency');
    // console.log(`User created: ${user.id}`)
    const [setSmartContractAddress]=userStore(state => [state.setSmartContractAddress]);
    const {user}=usePrivySmartAccount();
    setSmartContractAddress(user?.wallet?.address || "");
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
                "email",
                "discord",
                "twitter",
            ],
            embeddedWallets:{
                createOnLogin:"users-without-wallets",
                noPromptOnSignature:true,
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