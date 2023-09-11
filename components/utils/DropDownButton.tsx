"use client";

import { useCurrencyStore } from '@/store/CurrencyStore';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import {fiatCurrencies} from "@/lib/fiatCurrencies"
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";

type Props = {}

const DropDownButton = () => {

    const [dropDownOpen, setDropDownOpen]=useState(false);
    const [selectedCurrency,setSelectedCurrency]=useState("");
    const [searchQuery,setSearchQuery]=useState("");
    const router=useRouter();
    const [currencies,setCurrencies]=useState(fiatCurrencies);

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value=e.target.value;
        const tempCurrencies=fiatCurrencies;
        setSearchQuery(value);
        setCurrencies(tempCurrencies.filter(country => country.currency_code.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || country.currency_name.toLocaleLowerCase().includes(value.toLocaleLowerCase())));
    };

    const [baseCurrency,setBaseCurrency]=useCurrencyStore(state => [state.baseCurrency,state.setBaseCurrency]);
    const handleCurrencySelection=async (currency_code:string) => {
        setSelectedCurrency(currency_code);
        setBaseCurrency(currency_code);
    }   

    useEffect(() => {
        // if(baseCurrency!=="")router.push("/loggedIn");
    },[]);

  return (
    <div className='flex flex-col justify-around items-center h-5/6 border bg-white shadow-md w-full md:w-1/2 self-center rounded-md'>
        <div>
        <button 
            onClick={() => setDropDownOpen(!dropDownOpen)}
            data-dropdown-toggle="dropdownRadioBgHover" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">Select base Currency <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg></button>

            <div className={`z-10 h-40 overflow-auto w-120 bg-white divide-y divide-gray-100 rounded-lg shadow ${!dropDownOpen ? 'hidden' : ''}`}>
                <div className='p-3 overflow-auto flex items-center '>
                    <MagnifyingGlassIcon className='h-6 text-gray-500' />
                    <input className='outline-none' type="text" onChange={handleChange} placeholder="Search your country" value={searchQuery} />
                </div>
                <ul className="p-3 space-y-1 text-sm text-gray-700" aria-labelledby="dropdownRadioBgHoverButton">
                    {currencies.map(({currency_name,currency_code}) => (
                        <li className='hover:cursor-pointer'>
                            <div className={`flex items-center p-2 rounded hover:cursor-pointer ${selectedCurrency===currency_code?'bg-purple-400':'hover:bg-gray-100'}`} onClick={() => handleCurrencySelection(currency_code)}>
                                <input id="default-radio-4" type="radio" value="" name="default-radio" className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 ${selectedCurrency===currency_code?'ring-blue-500 ring-2':''}`} />
                                <label className="w-full ml-2 text-sm font-medium text-gray-900 rounded">{currency_name} - {currency_code}</label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        {/* button to move on */}
        <button 
            disabled={baseCurrency===""}
            className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600 mr-2"
            onClick={() => router.push("/loggedIn")}
        >
            Continue
        </button>
    </div>
  )
}

export default DropDownButton