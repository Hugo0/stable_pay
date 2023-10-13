"use client";

import { ArrowDownIcon, ArrowLeftCircleIcon, ArrowsUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useState } from "react";
import {fiatCurrencies} from "@/lib/fiatCurrencies"
import toast from "react-hot-toast";
import { usePrivySmartAccount } from "@zerodev/privy";
import { ethers } from "ethers";
import {ValidChecker} from "@/components/utils/ethereum_validator";

import dynamic from "next/dynamic";
import LoadingComponent from "./LoadingComponent";
import getConversionAmount, { offRampFunction } from "./utils/getConversion";
import { parseCookies } from "nookies";
import { useWallets } from "@privy-io/react-auth";
import peanut from "@squirrel-labs/peanut-sdk";
import { useGeneralStore } from "@/store/GeneralStore";
import { useRouter } from "next/navigation";
import SendlinkModal from "./SendlinkModal";


const WalletComponent=dynamic(() => 
    import("./WalletComponent")
,{
    loading: () => <LoadingComponent />
} )


type Props={
    receiverAdress?:string,
}

const SendTransactionComponent = (props:Props) => {
    const [value, setValue] = useState<string>('');
    const [receiverAmount,setReceiverAmount]=useState("0.00");
    const [receiverAddress,setReceiverAddress]=useState<string>(props.receiverAdress || "");
    const [receiverCurrency,setReceiverCurrency]=useState<string>("INR");
    const [baseCurrency,setBaseCurrency]=useState<string>("USD");
    const [dropDownOpen,setDropDownOpen]=useState<boolean>(false);
    const [currecySelected,setCase]=useState<string>("");
    const [loading,setLoading]=useState(false);
    const {sendTransaction,user,getEthereumProvider,zeroDevReady}=usePrivySmartAccount();
    const [exRate,setExRate]=useState(0.0);
    const [validatorOpen,setValidatorOpen]=useState(false);
    const [noteAdded,setNoteAdded]=useState("");
    const [link,setLink]=useState('');
    const [loadingState,setLoadingState]=useGeneralStore(state => [state.loadingState,state.setLoadingState]);
    const router=useRouter();
    const [walletBalance,setWalletBalance]=useState("0.00");
    const [invalidInput,setInvalidInput]=useState(0.00);

    useEffect(() => {
        const getTestbalance=async () => {
            if(!user.wallet)return ;
        
            const smartContractAddress = parseCookies().smartContractAddress?.replace(/"/g, '');
            if(!smartContractAddress)return ;
            const uri = `https://api-testnet.polygonscan.com/api?module=account&action=balance&address=${smartContractAddress}&apikey=${process.env.NEXT_PUBLIC_POLYGON_API}`;
            
            let walletBalance:number=await fetch(uri).then(response => response.json()).then(data => data.result); //matic balance
            walletBalance=Number(walletBalance)/10**18;
            setWalletBalance(walletBalance.toFixed(2));
        }
        getTestbalance();
    },[]);

    useEffect(() => {
        const fetcher= async () => {
            setLoading(true);
            const rate=await getConversionAmount(baseCurrency,receiverCurrency,1);
            setExRate(Number(rate.toFixed(2)));
            setLoading(false);
        }
        fetcher();
        // setDropDownOpen(!dropDownOpen);
    },[baseCurrency,receiverCurrency]);

    const SetCurrency= () => {
        const [currencies,setCurrencies]=useState(fiatCurrencies);
        const [searchQuery,setSearchQuery]=useState("");
    
        const handleChange=(e:React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            const value=e.target.value;
            const tempCurrencies=fiatCurrencies;
            setSearchQuery(value);
            setCurrencies(tempCurrencies.filter(country => country.currency_code.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || country.currency_name.toLocaleLowerCase().includes(value.toLocaleLowerCase())));
        };
    
        const handleCurrencySelection=async (currency_code:string) => {
            setReceiverCurrency(currency_code);
            setDropDownOpen(false);
        }   
    
        return (
            <div className="h-5/6 w-full md:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around">

                <div className={`h-50 overflow-auto w-120 bg-white divide-y divide-gray-100 rounded-lg shadow `}>
                        <div className='p-3 overflow-auto flex items-center '>
                            <MagnifyingGlassIcon className='h-6 text-gray-500' />
                            <input className='outline-none' type="text" onChange={handleChange} placeholder="Search your country" value={searchQuery} />
                        </div>
                        <ul className="p-3 space-y-1 text-sm text-gray-700" aria-labelledby="dropdownRadioBgHoverButton">
                            {currencies.map(({currency_name,currency_code}:{currency_name:string,currency_code:string},index) => (
                                <li key={index} className='hover:cursor-pointer'>
                                    <div className={`flex items-center p-2 rounded hover:cursor-pointer `} onClick={() => handleCurrencySelection(currency_code)}>
                                        <input id="default-radio-4" type="radio" value="" name="default-radio" className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 `} />
                                        <label className="w-full ml-2 text-sm font-medium text-gray-900 rounded">{currency_name} - {currency_code}</label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
            </div>
        )
    
    }

    useEffect(() => {
        const maxAllowedInput=async () => {
            const rate:any=await offRampFunction(baseCurrency); //1 usdc in baseCurrency
            setInvalidInput(Number(walletBalance)*rate?.amount);
        }
        maxAllowedInput();
    },[baseCurrency,walletBalance]);

    const handleReceiverAdress=async (e:ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setReceiverAddress(inputValue);
        // console.log(`receiver Address: ${receiverAddress}`);
        // console.log(`Valid Address: ${ValidChecker.isValidAddress(receiverAddress)}`);
      };

    // This function ensures that the input only contains numbers
    const handleInputChange =async  (e:ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if(Number(inputValue)<0)return ;
        // Use a regular expression to allow only numbers (0-9)
        // const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
        setValue(inputValue);
        // const recevingAmount=exRate*Number(inputValue);
        // const amount_without_commas=Number(recevingAmount.toFixed(2));
        // const formattedAmount=amount_without_commas.toLocaleString();
        // console.log(`receevingamount: ${recevingAmount} without commas ${amount_without_commas} formatted: ${formattedAmount}`)
        // setReceiverAmount(formattedAmount);
    };

    const handleValidator=() => {
        // if(receiverAddress==="")return ;
        if(!user?.wallet)return ;
        if(Number(receiverAmount)>0)
            setValidatorOpen(true);
    }

    useEffect(() => {
        const recevingAmount=exRate*Number(value);
        const amount_without_commas=Number(recevingAmount.toFixed(2));
        const formattedAmount=amount_without_commas.toLocaleString();
        // console.log(`receevingamount: ${recevingAmount} without commas ${amount_without_commas} formatted: ${formattedAmount}`)
        setReceiverAmount(formattedAmount);
    },[exRate,value]);

    const handleDropDown=() => {
        // setCase(input);
        setDropDownOpen(true);
    }
    
    const handleSubmit=async () => {
        // e.preventDefault();

        if(receiverAddress==="")return ;
        if(!user.wallet)return ;
        
        const smartContractAddress = parseCookies().smartContractAddress?.replace(/"/g, '');
        const uri = `https://api-testnet.polygonscan.com/api?module=account&action=balance&address=${smartContractAddress}&apikey=${process.env.NEXT_PUBLIC_POLYGON_API}`;
        
        
        
        const sendingFundsId=toast.loading("Sending Funds...");
        let walletBalance:number=await fetch(uri).then(response => response.json()).then(data => data.result); //matic balance
        walletBalance=Number(walletBalance)/10**18;
        const rate:any=await offRampFunction(baseCurrency); //1 usdc in baseCurrency
        const amount=Number(value)/rate?.amount;
        
        if(amount > walletBalance){
            toast.error("Insufficient funds...",{
                id:sendingFundsId,
            })    
            return ;
        }

        try{
            setLoading(true);
            setLoadingState(true);

            const ethAmount=amount.toString();
            const weiValue =ethers.utils.parseEther(ethAmount);
            const hexValue= ethers.utils.hexlify(weiValue);
            const unsignedTx={
                to: receiverAddress,
                chainId:80001,
                value:hexValue,
            }
            const hashId=await sendTransaction(unsignedTx); //user.wallet.address

            const bodyObj={
                senderAddress:user.wallet?.address,
                receiverAddress:receiverAddress,
                category:"Send",
                status:"Completed",
                hashId:hashId,
                sender_currency:baseCurrency,
                receiver_currency:receiverCurrency,
                sentAmount:Number(value),
                exchangeRate:Number(exRate),
                note:noteAdded,
                usdc_transferred:amount,
            }
            setLoading(false);
            toast.success("Successfully Sent!!",{
                id:sendingFundsId,
            })

            const response=await fetch('/api/transactions',{
                method:"POST",
                body:JSON.stringify(bodyObj),
            })
            const data=await response.json();
            console.log("data added to db:",data);

            router.push(`/payments/${hashId}`);

        }catch(err){
            toast.error("Transaction Failed",{
                id:sendingFundsId,
            })
            console.log(err);
        }

        // setLoadingState(false);

        // revalidateTag('transactionHistory');

    }   

    const handleInvalidInput= async () => {
        const rate:any=await offRampFunction(baseCurrency); //1 usdc in baseCurrency
        const amount=Number(value)/rate?.amount;
        
        if(amount > Number(walletBalance)){  
            return true;
        }
        return false;
    }

    const handleLinkTransfer = async () => {
        if(zeroDevReady){


            const smartContractAddress = parseCookies().smartContractAddress?.replace(/"/g, '');
            if(!smartContractAddress)return ;
            const uri = `https://api-testnet.polygonscan.com/api?module=account&action=balance&address=${smartContractAddress}&apikey=${process.env.NEXT_PUBLIC_POLYGON_API}`;
            
            const loadingLink=toast.loading("Creating Link...");
            try{
                let testWalletBalance:number=await fetch(uri).then(response => response.json()).then(data => data.result); //matic balance
                testWalletBalance=Number(testWalletBalance)/10**18;
                const rate=await offRampFunction(baseCurrency); //1 usdc in baseCurrency
                const amount=Number(value)/rate?.amount;
                
                if(amount > testWalletBalance){
                    toast.error("Insufficient funds...");    
                    return ;
                }

                const scwProvider=await getEthereumProvider();
                // await scwProvider.request({method:""})
                const scwEthProvider=new ethers.providers.Web3Provider(scwProvider);
                // const scwSigner=await scwEthProvider.getSigner(user?.wallet?.address);
                const scwSigner=await scwEthProvider.getSigner(user?.wallet?.address);

                const chainId=user?.wallet?.chainId;

                console.log(`chainId: ${chainId} signer ${scwSigner}`);
                console.log(scwSigner);
                
                const createLinkResponse = await peanut.createLink({
                    structSigner: {
                        signer: scwSigner,
                    },
                    linkDetails: {
                        chainId: 80001,
                        tokenAmount: amount,
                        tokenType: 0,
                        // tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    },
                });

                console.log("response:", createLinkResponse);
                console.log("link:", createLinkResponse.createdLink.link[0]);
                // setLink(createLinkResponse.createdLink.link[0]);
                let hashId=createLinkResponse.createdLink.txHash;

                if(!hashId) return;

                    const bodyObj={
                        senderAddress:user.wallet?.address,
                        receiverAddress:"",
                        category:"SendviaLink",
                        status:"Completed",
                        hashId:hashId,
                        sender_currency:baseCurrency,
                        receiver_currency:receiverCurrency,
                        sentAmount:Number(value),
                        exchangeRate:Number(exRate),
                        note:noteAdded,
                        usdc_transferred:amount,
                        link:createLinkResponse.createdLink.link[0],
                    }
                    
                    const response=await fetch('/api/transactions',{
                        method:"POST",
                        body:JSON.stringify(bodyObj),
                    })
                    const data=await response.json();
                    console.log("data added to db:",data);

                    if (data.error) {
                        // Handle the case where there is an error in the response, e.g., validation error
                        toast.error(data.error, {
                            id: loadingLink,
                        });
                    } else {
                        // Handle success
                        toast.success("Link Created", {
                            id: loadingLink,
                        });
                    }

                    const uriLink=`http://stable-pay-mukul202.vercel.app/payments/${hashId}`;

                    setLink(uriLink);
                    setLoading(false);
                    

                    // router.push(`/payments/${hashId}`);
                    

            }catch(err){
                console.log(err);
                toast.error("Link Creation Unsuccessful", {
                    id: loadingLink,
                });
            }

        }
    }

  return (
    <div className="h-screen w-screen relative flex-center backdrop-blur-lg">
        {dropDownOpen? (<SetCurrency />):(
            <div className={`${validatorOpen?'hidden':''} h-5/6 w-full md:w-3/4 lg:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around gap-y-2`}>
                <WalletComponent baseCurrency={baseCurrency} />
                {/* <div className="flex-center gap-x-3 gap-y-3 flex-col md:flex-row">
                    <p className=" text-gradient_blue-purple text-3xl font-bold">Send to:</p>
                    <input required={true} onChange={handleReceiverAdress} type="text" value={receiverAddress} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Enter the receiver's contract address" />
                </div> */}
                <div className="flex-center gap-x-4 w-full">
                    <div className="flex flex-col justify-center gap-y-1 w-1/2 pl-12">
                        <p className="text-white-400 heading4">You Send:</p>
                        <p className="text-gradient_blue-purple heading2">{baseCurrency}</p>
                    </div>
                    <input onChange={handleInputChange} type="number" step="0.01" value={value} className={`outline-none ${Number(value)>invalidInput?'border-[#DC143C]':'border-[#2ecc71]'} border-[6px] no-scrollar w-1/2 flex-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl max-w-full`} placeholder="Enter Amount" />
                </div>
                <div className="flex flex-col justify-center gap-y-1 w-1/2 pl-[72px]">
                    <ArrowsUpDownIcon className="h-7 w-7 text-white-500 hover:cursor-pointer" />
                    <div className="w-1/2"></div>
                </div>
                {/* <div className="flex heading4 w-full">
                    <p className="text-white-400 w-1/2 pl-12">Receiver Gets:</p>
                    {loading ? <LoadingComponent />:<p className="text-white-500 text-center">1 {baseCurrency} = {exRate} {receiverCurrency}</p>}
                </div> */}
                <div className="flex-center w-full">
                    <div className="w-1/2 flex flex-col gap-y-1">
                        <p className=" text-white-400 heading4 pl-12">Receiver Gets:</p>
                        <div className="flex w-full items-center">
                            <p className=" text-gradient_blue-purple heading2 pl-12">{receiverCurrency}</p>
                            <ArrowDownIcon className="h-7 w-7 text-white pl-2 hover:cursor-pointer" onClick={handleDropDown} />
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col gap-y-1">
                        {loading ? <LoadingComponent />:<p className="text-white-500 heading4">1 {baseCurrency} = {exRate} {receiverCurrency}</p>}
                        <p className=" text-gradient_purple-blue heading2 flex items-center w-full overflow-auto">{receiverAmount}</p>
                    </div>
                </div>
                <div className="text-3xl flex-center flex-col md:flex-row hover:cursor-pointer">
                    <button className='gradient_purple-blue text-white rounded-2xl p-4 px-6 hover:cursor-pointer' disabled={loading} onClick={handleValidator}>{loading?'Please Wait...':'Send Funds'}</button>
                </div>
            </div>
        )}
        {validatorOpen && (
            <div className="h-5/6 w-full relative py-12 md:w-3/4 lg:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around my-12">
            <div className="top-0 left-0 h-10 w-10 absolute m-3">
                <ArrowLeftCircleIcon className=" hover:cursor-pointer rounded-full text-white-800" onClick={() => setValidatorOpen(false)} />
            </div>
            <p className="flex-center text-white-500 heading3">Send To:</p>
            <p className="flex-center text-white-400 heading4">You are sending USDC worth {value} {baseCurrency}</p>
            <div className="flex-center gap-x-3 gap-y-3 flex-col md:flex-row">
                <p className=" text-gradient_blue-purple text-3xl font-bold">Send to:</p>
                <input onChange={handleReceiverAdress} type="text" value={receiverAddress} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Enter the receiver's contract address" />
            </div>
            <div className="flex-center gap-x-3 gap-y-3 flex-col md:flex-row">
                <p className=" text-gradient_blue-purple text-3xl font-bold">Add Note:</p>
                <input onChange={(e) => setNoteAdded(e.target.value)} type="text" value={noteAdded} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Add a note" />
            </div>

            {(receiverAddress!=="" && !ValidChecker.isValidAddress(receiverAddress)) ? (<div className="flex-center p-4 gap-x-3 gap-y-3 flex-col md:flex-row">
                <p className="text-gradient_pink-orange text-3xl font-bold">Please Enter Valid Address</p>
            </div>):
            (
                <div className={`${receiverAddress==""?'hidden':''} text-3xl flex-center flex-col md:flex-row hover:cursor-pointer my-5`}>
                    <button className='gradient_purple-blue text-white rounded-2xl p-4 px-6 hover:cursor-pointer' disabled={loading} onClick={handleSubmit}>Send to User</button>
                </div>
            )
            }
            
            <div className="text-3xl flex-center flex-col md:flex-row hover:cursor-pointer">
                <button className='gradient_pink-orange text-white rounded-2xl p-4 px-6 hover:cursor-pointer' disabled={loading} onClick={handleLinkTransfer}>Send via Link</button>
            </div>

            {(link!=="" && !loading) && (
                <SendlinkModal link={link} amount={value+''+baseCurrency} />
            )}
        </div>
        )}
    </div>
  )
}

export default SendTransactionComponent