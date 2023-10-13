"use client";
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
// import { useEffect, useMemo, useState } from 'react';
// import useSWR from 'swr';
import { offRampFunction } from './utils/getConversion';
const fetcher = async (url:string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
    //   let walletBalance:string;

    //     if(data){
    //         const rate=await getConversionAmount("usd",baseCurrency,1);
    //         walletBalance = (rate*Number(data.result) / 10 ** 18).toFixed(3);
    //     }else{
    //         walletBalance='0.000';
    //     }

      return data.result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data');
    }
  };

type Props={
    baseCurrency:string,
}
  
const WalletComponent = (props:Props) => {
    // const smartContractAddress = parseCookies().smartContractAddress;
    // const [walletBalance, setWalletBalance] = useState('0.0');
  
    // useEffect(() => {
    //   const fetchWalletBalance = async () => {
    //     const uri = `https://api.polygonscan.com/api?module=account&action=balance&address=${smartContractAddress}&apikey=YourApiKeyToken`;
    //     const response = await fetch(uri);
    //     const data = await response.json();
    //     const resultString = data.result;
  
    //     // Divide the BigInt value by 10^18 to get the result as a JavaScript number
    //     const resultInEth = Number(resultString) / 10 ** 18;
    //     setWalletBalance(resultInEth.toFixed(3));
    //   };
  
    //   fetchWalletBalance();
    // }, [smartContractAddress]);
  
    // const formattedWalletBalance = useMemo(() => {
    //     // Convert the wallet balance string to a JavaScript number.
    //     const walletBalanceNumber = Number(walletBalance);
      
    //     // Format the wallet balance number as a string with a fixed number of decimal places.
    //     const formattedWalletBalance = walletBalanceNumber.toFixed(3);
      
    //     return formattedWalletBalance;
    //   }, [walletBalance]);

    const smartContractAddress = parseCookies().smartContractAddress?.replace(/"/g, '');
    const uri = `https://api-testnet.polygonscan.com/api?module=account&action=balance&address=${smartContractAddress}&apikey=${process.env.NEXT_PUBLIC_POLYGON_API}`;
    const [walletBalance,setWalletBalance]=useState('0.000');

    // Use SWR for data fetching with automatic revalidation
    // const { data, error } = useSWR(uri, fetcher, {
    //     refreshInterval: 1000*60*60, // Set a refresh interval of 10 seconds (adjust as needed)
    //     // revalidateOnFocus: true, // Revalidate when the window gets focus
    //     ssr:true,
    // });

    useEffect(() => {
        const getWallet=async () => {
            const data=await fetcher(uri); // wallet balance in matic/usdc
            if(data){
                const rate=await offRampFunction(props.baseCurrency);// 1usdc in baseCurrency
                const NumberRate=Number(rate?.amount);
                const conversionFromGeitoNormalCurrency=Number(data)/10**18;
                let value=(NumberRate*conversionFromGeitoNormalCurrency).toFixed(2);
                if(isNaN(Number(value)))value="0.00";
                setWalletBalance(value);
            }
        }
        getWallet();
    },[props.baseCurrency]);
  
    return (
        <div className="flex-center flex-col md:flex-row gap-x-2 gap-y-3">
            <p className="text-gradient_blue-purple text-xl font-bold heading3">Total balance:</p>
            <p className="text-gradient_purple-blue text-xl font-bold heading3">{walletBalance} {props.baseCurrency}</p>
        </div>
    );
};

export default WalletComponent;