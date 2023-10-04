"use client";

import { ArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useState } from "react";
import {fiatCurrencies} from "@/lib/fiatCurrencies"
import toast from "react-hot-toast";
import { usePrivySmartAccount } from "@zerodev/privy";
import { ethers } from "ethers";
import {ValidChecker} from "@/components/utils/ethereum_validator";

import dynamic from "next/dynamic";
import LoadingComponent from "./LoadingComponent";
import getConversionAmount from "./utils/getConversion";
import { parseCookies } from "nookies";
import { useWallets } from "@privy-io/react-auth";
import peanut from "@squirrel-labs/peanut-sdk";


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
    const [receiverAmount,setReceiverAmount]=useState(0.0);
    const [receiverAddress,setReceiverAddress]=useState<string>(props.receiverAdress || "");
    const [receiverCurrency,setReceiverCurrency]=useState<string>("INR");
    const [baseCurrency,setBaseCurrency]=useState<string>("USD");
    const [dropDownOpen,setDropDownOpen]=useState<boolean>(true);
    const [currecySelected,setCase]=useState<string>("");
    const [loading,setLoading]=useState(false);
    const {sendTransaction,user}=usePrivySmartAccount();
    const [exRate,setExRate]=useState(0.0);
    const [validatorOpen,setValidatorOpen]=useState(false);
    const [noteAdded,setNoteAdded]=useState("");
    const [link,setLink]=useState('');

    useEffect(() => {
        const fetcher= async () => {
            setLoading(true);
            const rate=await getConversionAmount(baseCurrency,receiverCurrency,1);
            setExRate(Number(rate.toFixed(3)));
            setLoading(false);
        }
        fetcher();
        setDropDownOpen(!dropDownOpen);
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
            if(currecySelected==="b"){
                setBaseCurrency(currency_code);
            }else{
                setReceiverCurrency(currency_code);
            }
            // setDropDownOpen(false);
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

    const handleReceiverAdress=async (e:ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setReceiverAddress(inputValue);
        // console.log(`receiver Address: ${receiverAddress}`);
        // console.log(`Valid Address: ${ValidChecker.isValidAddress(receiverAddress)}`);
      };

    // This function ensures that the input only contains numbers
    const handleInputChange =async  (e:ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Use a regular expression to allow only numbers (0-9)
        // const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
        setValue(inputValue);
        const recevingAmount=exRate*Number(inputValue);
        setReceiverAmount(Number(recevingAmount.toFixed(3)));
    };

    const handleValidator=() => {
        // if(receiverAddress==="")return ;
        if(!user?.wallet)return ;
        if(receiverAmount>0)
            setValidatorOpen(true);
    }

    useEffect(() => {
        setReceiverAmount(exRate*Number(value));
    },[exRate]);

    const handleDropDown=(input:string) => {
        setCase(input);
        setDropDownOpen(true);
    }
    
    const handleSubmit=async () => {
        // e.preventDefault();

        if(receiverAddress==="")return ;
        if(!user.wallet)return ;
        
        const smartContractAddress = parseCookies().smartContractAddress?.replace(/"/g, '');
        const uri = `https://api-testnet.polygonscan.com/api?module=account&action=balance&address=${smartContractAddress}&apikey=${process.env.NEXT_PUBLIC_POLYGON_API}`;
        
        const data=await fetch(uri).then(response => response.json());

        if(receiverAmount>data){
            return ;
        }

        const sendingFundsId=toast.loading("Sending Funds...");
        try{
            setLoading(true);
            const ethAmount=receiverAmount.toString();
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
            toast.error("Transaction Failed",{
                id:sendingFundsId,
            })
            console.log(err);
        }

    }   

    const embeddedWallet=useWallets().wallets.find((wallet) => wallet.walletClientType === "privy");
    const handleLinkTransfer = async () => {
        if(embeddedWallet){
            const provider = await embeddedWallet.getEthereumProvider();
                            await provider.request({method: "wallet_switchEthereumChain",
                            params:[{chainId: `0x${Number(80001).toString(16)}`}]
                        })
                        // await provider.request({})
                        const ethProvider=new ethers.providers.Web3Provider(provider);
                        const signer=await ethProvider.getSigner(embeddedWallet.address);
                        const walletBalance=await ethProvider.getBalance(
                            user.wallet?.address || ""
                        )
                        const ethStringAmount=ethers.utils.formatEther(walletBalance);
                        // setWalletBalance(ethStringAmount);

                        const loadingLink=toast.loading("Creating Link...");
                        await peanut.createLink({
                            structSigner: {
                              signer: signer,
                            },
                            linkDetails: {
                              chainId: 80001,
                              tokenAmount: 0.001,
                              tokenType: 0,
                            //   tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                            },
                          }).then(response => {
                              console.log("response:",response);
                              console.log("link:",response.createdLink.link[0]);
                              setLink(response.createdLink.link[0]);
                              const code=response.status.code;
                              if(code){
                                toast.error("Unsuccessfull",{
                                    id:loadingLink,
                                })
                              }else{
                                  toast.success("Link Created",{
                                    id:loadingLink,
                                  })
                              }
    
                          }).catch(error => {
                            toast.error("Link Creation Unsuccessfull",{
                                id:loadingLink,
                            })
                            console.log(error)});
        }
    }

  return (
    <div className="h-screen w-screen relative flex-center z-50 backdrop-blur-lg">
        {dropDownOpen? (<SetCurrency />):(
            <div className={`${validatorOpen?'hidden':''} h-5/6 w-full md:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around`}>
                <WalletComponent />
                {/* <div className="flex-center gap-x-3 gap-y-3 flex-col md:flex-row">
                    <p className=" text-gradient_blue-purple text-3xl font-bold">Send to:</p>
                    <input required={true} onChange={handleReceiverAdress} type="text" value={receiverAddress} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Enter the receiver's contract address" />
                </div> */}
                <div className="flex-center flex-col md:flex-row gap-x-2 gap-y-3">
                    <p className="text-gradient_blue-purple text-3xl font-bold">You Send:</p>
                    <input onChange={handleInputChange} type="number" step="0.01" value={value} className="outline-none flex items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Enter Amount" />
                    <p className="text-gradient_purple-blue text-3xl font-bold flex-center gap-x-1">{baseCurrency}
                        <ArrowDownIcon className="h-7 w-7 text-white hover:cursor-pointer" onClick={() => handleDropDown("b")} />
                    </p>
                </div>
                <div className="flex-center flex-col md:flex-row gap-x-2 gap-y-3">
                    <p className="text-gradient_blue-purple text-xl font-bold">Exchange Rate:</p>
                    {loading ? <LoadingComponent />:<p className="text-gradient_purple-blue text-xl font-bold">{exRate}</p>}
                </div>
                <div className="flex-center flex-col md:flex-row gap-x-3 gap-y-3">
                    <p className=" text-gradient_blue-purple text-3xl font-bold">They receive:</p>
                    <p className=" text-gradient_purple-blue text-3xl font-bold flex-center">{receiverAmount} {receiverCurrency}
                    <ArrowDownIcon className="h-7 w-7 text-white pl-2 hover:cursor-pointer" onClick={() => handleDropDown("r")} />
                    </p>
                </div>
                <div className="text-3xl flex-center flex-col md:flex-row hover:cursor-pointer">
                    <button className='gradient_purple-blue text-white rounded-2xl p-4 px-6 hover:cursor-pointer' disabled={loading} onClick={handleValidator}>{loading?'Please Wait...':'Send Funds'}</button>
                </div>
            </div>
        )}
        {validatorOpen && (
            <div className="h-5/6 w-full py-12 md:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around my-12">
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
                <button className='gradient_purple-blue text-white rounded-2xl p-4 px-6 hover:cursor-pointer' disabled={loading} onClick={handleLinkTransfer}>Send via Link</button>
            </div>

            {link!=="" && (
                <div className="flex-center p-4 gap-x-3 gap-y-3 flex-col md:flex-row">
                <p className="text-gradient_pink-orange text-3xl font-bold">{link}</p>
            </div>
            )}
        </div>
        )}
    </div>
  )
}

export default SendTransactionComponent