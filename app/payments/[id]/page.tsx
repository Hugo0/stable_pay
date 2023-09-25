import React from 'react'

export default function Page({ params }: { params: { id: string } }) {

  // const 

  return <div className='text-white h-screen w-screen  flex-center heading1'>My Post: {params.id}</div>
}