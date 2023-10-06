import { create } from "zustand";


interface generalState{
    loadingState:boolean,
    setLoadingState:(loading:boolean) => void,
}

export const useGeneralStore=create<generalState>((set,get) => ({
    loadingState:false,
    setLoadingState: async (loadingState:boolean) => set({loadingState}),
}))