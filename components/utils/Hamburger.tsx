"use client";
import { generalStore } from '@/store/GeneralStore';
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import SideBar from '../SideBar';

type Props = {}

const Hamburger = (props: Props) => {
    const [sideBarOpen,setSideBarOpen]=useState(false);
    const [loading]=generalStore(state => [state.loading]);
    const router=useRouter();
    const handleSideBarOpen=async () => {
        // router.push("/");
        if(loading)return ;
        setSideBarOpen(true);
    }
  return (
    <div>
        <Bars3Icon 
        className='h-12 w-12 fixed top-0 left-0 m-4 border rounded-md shadow-md hover:cursor-pointer hover:bg-purple-300 bg-white'
        // className='h-12 w-12 fixed top-0 left-0 p-6 m-2 z-10 text-black border shadow-md' 
        onClick={handleSideBarOpen} 
        />
        {sideBarOpen && <SideBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />}
    </div>
  )
}

export default Hamburger