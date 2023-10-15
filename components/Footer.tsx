import { ClockIcon, HomeIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="text-white-800 fixed bottom-0 left-0 flex justify-evenly w-full mb-2 z-auto">
      <div className='rounded-full p-4 hover:cursor-pointer gradient_blue-purple shadow-md shadow-white-400'>
        <Link href="/?feature=payments">
        <HomeIcon className='h-6 w-6 md:h-8 md:w-8' />
        </Link>
      </div>
      <div className='rounded-full p-4 hover:cursor-pointer gradient_blue-purple shadow-md shadow-white-400'>
        <Link href="/?feature=history">
          <ClockIcon className='h-6 w-6 md:h-8 md:w-8' />
        </Link>
      </div>
      <div className='rounded-full p-4 flex-center hover:cursor-pointer gradient_blue-purple shadow-md shadow-white-400'>
        <Link href="/?feature=scan">
          <QrCodeIcon className='h-6 w-6 md:h-8 md:w-8' />
        </Link>
      </div>
    </footer>
  )
}

export default Footer