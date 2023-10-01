// "use client";
import { parseCookies } from 'nookies';
// import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
const fetcher = async (url:string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data');
    }
  };
  
const WalletComponent = () => {
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

    // Use SWR for data fetching with automatic revalidation
    const { data, error } = useSWR(uri, fetcher, {
        refreshInterval: 1000*60*60, // Set a refresh interval of 10 seconds (adjust as needed)
        // revalidateOnFocus: true, // Revalidate when the window gets focus
        ssr:true,
    });

    const walletBalance = data ? (Number(data) / 10 ** 18).toFixed(3) : '0.000';

  
    return (
      <div className="flex-center text-gradient_blue-purple heading3">
        Wallet balance: {walletBalance}
      </div>
    );
};

export default WalletComponent;