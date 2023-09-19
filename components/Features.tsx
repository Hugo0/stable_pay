"use client"

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'

const links = ['Payments','Scan', 'History']

const Features = () => {
  const [active, setActive] = useState('');
  const searchParms = useSearchParams();
    const eoaAddress=parseCookies().eoaAddress;
  const router = useRouter();

  console.log(eoaAddress);

  const handleFilter = (link: string) => {
    let newUrl = '';
    
    if(active === link) {
      setActive('');

    } else {
      setActive(link);
    }
    
    router.push(newUrl, { scroll: false });
  }

  return (
    <ul className="text-white-800 md:flex-center body-text no-scrollbar flex w-full max-w-full gap-2 overflow-auto py-8 sm:max-w-2xl">
    {links.map((link) => (
        <button
        key={link}
        onClick={() => handleFilter(link)}
        className={`${
            active === link ?"gradient_blue-purple" : "bg-black-300"
            } whitespace-nowrap rounded-lg px-8 py-2.5 capitalize`}
            >
        {link}
        </button>
    ))}
    </ul>
  )
}

export default Features