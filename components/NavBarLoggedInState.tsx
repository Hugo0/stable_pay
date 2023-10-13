"use client";
import { usePrivySmartAccount } from '@zerodev/privy';
import Link from 'next/link'
import { useEffect, useState } from 'react'


const NavBarLoggedInState = () => {
    const {authenticated}=usePrivySmartAccount();
    const [conditionalRender,setConditionalRender]=useState(false);
    useEffect(() => {
        const userData=setTimeout(async () => {
            if(window.matchMedia('(display-mode: standalone)').matches){
                setConditionalRender(true);
                return ;
            }
        },100);
        return () => clearTimeout(userData);
    },[authenticated]);
  return (
    <div>
        {conditionalRender ? (<ul className="flex-center gap-x-3  md:gap-x-10">
        <li className="body-text text-gradient_blue-purple !font-bold">
          <Link
            href="/qr"
          >
            Add Funds
          </Link>
        </li>
        {/* <li className="body-text !font-bold text-gradient_pink-orange">
          <Link
            href="/account"
          >
            Account
          </Link>
        </li> */}
      </ul>):<></>}
    </div>
  )
}

export default NavBarLoggedInState