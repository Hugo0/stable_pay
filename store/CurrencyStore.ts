import { create } from "zustand";


interface CurrencyState{
    baseCurrency:string,
    receiverCurrency:string,
    setBaseCurrency:(baseCurrency:string) => void,
    setReceiverCurrency: (receiverCurrency:string) => void,
}

export const useCurrencyStore=create<CurrencyState>((set,get) => ({
    baseCurrency:"",
    receiverCurrency:"INR",
    setBaseCurrency:async (baseCurrency:string) => set({baseCurrency}),
    setReceiverCurrency:async (receiverCurrency:string) => set({receiverCurrency}),
}))