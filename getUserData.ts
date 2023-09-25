import { usePrivySmartAccount } from "@zerodev/privy";

let cachedData:any=null;

async function getUserData(){

    if(cachedData && cachedData.authenticated){
        return cachedData;
    }

    const {authenticated,zeroDevReady,user,login}=usePrivySmartAccount();

    cachedData={authenticated,zeroDevReady,user,login};

    return {authenticated,zeroDevReady,user,login};
}

export {getUserData};