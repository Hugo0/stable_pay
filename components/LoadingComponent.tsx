import Image from 'next/image'
import React from 'react'

type Props = {}

const LoadingComponent = (props: Props) => {
  return (
    <div className='animate-pulse h-full w-full flex-center'>
        {/* <Image src="/dropping-money.png" width={100} height={100} alt="Dropping money" /> */}
        <span className="relative h-12 w-12 flex-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
    </div>
  )
}

export default LoadingComponent