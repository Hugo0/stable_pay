import Image from 'next/image'
import React from 'react'

type Props = {}

const LoadingComponent = (props: Props) => {
  return (
    <div className='h-full w-full flex-1'>
        <Image src="/dropping-money.png" width={100} height={100} alt="Dropping money" />
    </div>
  )
}

export default LoadingComponent