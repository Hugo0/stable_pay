import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavBarLoggedInState from './NavBarLoggedInState'

type Props = {}

const NavBar = () => {
  return (
    <nav className="flex-center fixed top-0  w-full border-b-2 border-black-200 bg-black-100 py-7 text-white">
      <div className="flex justify-end mx-auto w-full max-w-screen-2xl px-6 xs:px-8 sm:px-16">
        {/* <Link href="/" className='z-0'>
          <Image src='/payments.png' width={55} height={40} alt='KeyChain logo' className='rounded' />
        </Link> */}
        <NavBarLoggedInState />
      </div>
    </nav>
  )
}

export default NavBar