"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const links = ['Payments','Scan', 'History']

const Features = () => {
  const searchParams = useSearchParams();

  // console.log(eoaAddress);

  // const handleFilter = async (link: string) => {
  //   let newUrl = '';
    
  //   if(active === link) {
  //     setActive('');

  //   } else {
  //     setActive(link);
  //   }
    
  // }

  return (
    <ul className="text-white-800 flex-center body-text no-scrollbar w-full max-w-full gap-2 overflow-auto py-4 sm:max-w-2xl sm:px-3">
    {links.map((link) => (
        <Link
        key={link}
        href={`?feature=${link.toLocaleLowerCase()}`}
        // onClick={() => handleFilter(link)}
        className={`${
            (searchParams.get('feature')===link.toLocaleLowerCase() ) ?"gradient_blue-purple" : "bg-black-300"
            } ${(!searchParams.has('feature')) && link==='Payments'?'gradient_blue-purple':''} whitespace-nowrap rounded-lg px-8 py-2.5 capitalize`}
            scroll={false}
            >
        {link}
        </Link>
    ))}
    </ul>
  )
}

export default Features