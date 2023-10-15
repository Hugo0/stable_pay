"use client";
import { ClockIcon, HomeIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const Footer = () => {
  const searchParams=useSearchParams();
  return (
    <footer className="text-white-800 fixed bottom-0 -z-100 left-0 flex justify-evenly w-full mb-2">
      <div className='rounded-full -z-100 p-4 hover:cursor-pointer gradient_blue-purple hover:animate-bounce shadow-md shadow-white-400'>
        <Link href="/?feature=payments" scroll={false}>
        <HomeIcon className='h-12 w-12' />
        </Link>
      </div>
      <div className='rounded-full p-4 hover:cursor-pointer gradient_blue-purple hover:animate-bounce shadow-md shadow-white-400'>
        <Link href="/?feature=history" scroll={false}>
          <ClockIcon className='h-12 w-12' />
        </Link>
      </div>
      <div className='rounded-full p-4 hover:cursor-pointer gradient_blue-purple hover:animate-bounce shadow-md shadow-white-400'>
        <Link href="/?feature=scan" scroll={false}>
          <QrCodeIcon className='h-12 w-12' />
        </Link>
      </div>
    </footer>
  )
}

export default Footer