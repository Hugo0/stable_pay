"use client";
import { userStore } from '@/store/UserStore'
import { ArrowLeftCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

type Props = {
    setSideBarOpen: (value: React.SetStateAction<boolean>) => void,
    sideBarOpen: boolean
}

const SideBar = ({setSideBarOpen,sideBarOpen}: Props) => {
    const [smartContractAddress]=userStore(state => [state.smartContractAddress]);
    const router=useRouter();
    const handleClick=async () => {
        setSideBarOpen(false);
        router.push("/account");
    }
  return (
    <div className={`h-screen w-screen fixed top-0 left-0 backdrop-blur-sm ${!sideBarOpen?'hidden':''}`}>
        <div className=' bg-white h-screen w-full md:1/2 lg:w-1/4 border border-r-2 flex flex-col justify-around'>
            <ArrowLeftCircleIcon className='fixed top-0 left-0 h-12 w-12 m-4 border rounded-full hover:bg-purple-300 hover:cursor-pointer' 
                onClick={() => setSideBarOpen(false)}
            />
            <div className='flex mx-5 justify-center text-gray-700'>
                <UserCircleIcon className='h-full w-1/4' />
                <div className='flex flex-col'>
                    <p className='text-gray-500'>{`${smartContractAddress.substring(0,7)}...${smartContractAddress.substring(smartContractAddress.length-3)}`}</p>
                    <p className='border rounded-md border-black border-[3px] flex-1 h-full mb-2 flex items-center justify-center hover:cursor-pointer p-1' onClick={handleClick}>Account</p>
                </div>
                
            </div>
            <div className='flex flex-col items-center'>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/loggedIn");
                }}>Home</button>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/baseCurrency");
                }}>Select base Currency</button>
            </div>
            <div className='flex flex-col items-center'>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/loggedIn");
                }}>Terms of Service</button>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/loggedIn");
                }}>Privacy Policy</button>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/loggedIn");
                }}>Cookie Policy</button>
            </div>
        </div>
    </div>
  )
}

export default SideBar