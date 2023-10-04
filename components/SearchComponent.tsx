"use client";

import { useEffect, useState } from "react";
import { ValidChecker } from "./utils/ethereum_validator";
import dynamic from "next/dynamic";
import LoadingComponent from "./LoadingComponent";

const SendTransactionComponent = dynamic(() => import("./SendTransactionComponent"),{
    loading:() => <LoadingComponent />
})

const SearchComponent = () => {
    const [searchValue,setSearchValue]=useState("");
    const [valid,setValid]=useState(false);
    useEffect(() => {
        setValid(ValidChecker.isValidAddress(searchValue));
    },[searchValue]);
  return (
    <>
      {!valid ?
        <div className="h-full w-screen relative flex-center z-50 backdrop-blur-lg">
            <div className="h-1/3 w-full p-6 md:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around">
                <div className="flex-center gap-x-3 gap-y-3 flex-col md:flex-row">
                    <p className=" text-gradient_blue-purple text-3xl font-bold">Send to:</p>
                    <input onChange={(e) => setSearchValue(e.target.value)} type="text" value={searchValue} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Enter the receiver's contract address" />
                </div>
                {searchValue!=="" && (<div className="flex-center p-4 gap-x-3 gap-y-3 flex-col md:flex-row">
                    <p className="text-gradient_pink-orange text-3xl font-bold">Not Valid Address</p>
                </div>)}
            </div>

        </div>
         : 
        <>
            <SendTransactionComponent receiverAdress={searchValue} />
        </>}
    </>
  )
}

export default SearchComponent