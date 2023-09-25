"use client";

import { ArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useState } from "react";
import {fiatCurrencies} from "@/lib/fiatCurrencies"
import toast from "react-hot-toast";
import { usePrivySmartAccount } from "@zerodev/privy";
import { ethers } from "ethers";


type Props={
    receiverAdress?:string,
}

type CurrencyProps={
    callback: (input:string) => void;
    setDropDownOpen:any,
}

const SendTransactionComponent = (props:Props) => {
    const [value, setValue] = useState('');
    const [receiverAmount,setReceiverAmount]=useState(0.0);
    const [receiverAddress,setReceiverAddress]=useState<string>(props.receiverAdress || "");
    const [receiverCurrency,setReceiverCurrency]=useState<string>("INR");
    const [baseCurrency,setBaseCurrency]=useState<string>("USD");
    const [dropDownOpen,setDropDownOpen]=useState<boolean>(false);
    const [currecySelected,setCase]=useState<string>("");
    const [loading,setLoading]=useState(false);
    const {sendTransaction,user}=usePrivySmartAccount();
    
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
            if(currecySelected==="b"){
                setBaseCurrency(currency_code);
            }else{
                setReceiverCurrency(currency_code);
            }
            setDropDownOpen(false);
        }   
    
        return (
            <div className="h-5/6 w-full md:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around">

                <div className={`z-10 h-50 overflow-auto w-120 bg-white divide-y divide-gray-100 rounded-lg shadow `}>
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

    const handleReceiverAdress=(e:ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setReceiverAddress(inputValue);
      };

    // This function ensures that the input only contains numbers
    const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Use a regular expression to allow only numbers (0-9)
        const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
        setValue(sanitizedValue);
        setReceiverAmount(82.15*Number(sanitizedValue));
    };

    const handleDropDown=(input:string) => {
        setCase(input);
        setDropDownOpen(true);
    }
    
    const handleSubmit=async () => {
        // e.preventDefault();

        if(receiverAddress==="")return ;
        if(!user.wallet)return ;
        
        try{
            setLoading(true);
            const sendingFundsId=toast.loading("Sending Funds...");
            const ethAmount=value;
            const weiValue =ethers.utils.parseEther(ethAmount);
            const hexValue= ethers.utils.hexlify(weiValue);
            const unsignedTx={
                to: receiverAddress,
                chainId:80001,
                value:hexValue,
            }
            const hashId=await sendTransaction(unsignedTx);

            const bodyObj={
                senderAddress:user.wallet?.address,
                receiverAddress:receiverAddress,
                category:"Send",
                status:"Completed",
                hashId:hashId,
                sender_currency:baseCurrency,
                receiver_currency:receiverCurrency,
                sentAmount:value,
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
        }catch(err){
            console.log(err);
        }

    }   

  return (
    <div className="h-screen w-screen relative flex-center z-50 backdrop-blur-lg">
        {dropDownOpen? (<SetCurrency />):(
            <div className="h-5/6 w-full md:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around">
                <div className="flex-center gap-x-3 gap-y-3 flex-col md:flex-row">
                    <p className=" text-gradient_blue-purple text-3xl font-bold">Send to:</p>
                    <input onChange={handleReceiverAdress} type="text" value={receiverAddress} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Enter the receiver's contract address" />
                </div>
                <div className="flex-center flex-col md:flex-row gap-x-2 gap-y-3">
                    <p className="text-gradient_blue-purple text-3xl font-bold">You Send:</p>
                    <input onChange={handleInputChange} type="text" value={value} className="outline-none flex items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Enter Amount" />
                    <p className="text-gradient_blue-purple text-3xl font-bold flex-center gap-x-1">{baseCurrency}
                        <ArrowDownIcon className="h-7 w-7 text-white hover:cursor-pointer" onClick={() => handleDropDown("b")} />
                    </p>
                </div>
                <div className="flex-center flex-col md:flex-row gap-x-3 gap-y-3">
                    <p className=" text-gradient_blue-purple text-3xl font-bold">They receive:</p>
                    <p className=" text-gradient_purple-blue text-3xl font-bold flex-center">{receiverAmount} {receiverCurrency}
                    <ArrowDownIcon className="h-7 w-7 text-white pl-2 hover:cursor-pointer" onClick={() => handleDropDown("r")} />
                    </p>
                </div>
                <div className="text-3xl flex-center flex-col md:flex-row hover:cursor-pointer">
                    <button className='gradient_purple-blue text-white rounded-2xl p-4 px-6 hover:cursor-pointer' disabled={loading} onClick={handleSubmit}>{loading?'Sending...':'Send Funds'}</button>
                </div>
            </div>
        )}
    </div>
  )
}

export default SendTransactionComponent