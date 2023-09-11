import { create } from "zustand";


interface generalState{
    loading:boolean,
    setLoading:(loading:boolean) => void,
}

export const generalStore=create<generalState>((set,get) => ({
    loading:false,
    setLoading: async (loading:boolean) => set({loading}),
}))