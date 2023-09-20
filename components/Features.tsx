"use client"

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { parseCookies } from 'nookies'
import Link from 'next/link'

const links = ['Payments','Scan', 'History']

const Features = () => {
  const [active, setActive] = useState('');
  const searchParams = useSearchParams();
    const eoaAddress=parseCookies().eoaAddress;
  const router = useRouter();

  console.log(eoaAddress);

  const handleFilter = async (link: string) => {
    let newUrl = '';
    
    if(active === link) {
      setActive('');

    } else {
      setActive(link);
    }
    
    // await router.push(`?feature=${active}`, { scroll: false });
  }

  return (
    <ul className="text-white-800 md:flex-center body-text no-scrollbar flex w-full max-w-full gap-2 overflow-auto py-8 sm:max-w-2xl">
    {links.map((link) => (
        <Link
        key={link}
        href={`?feature=${link.toLocaleLowerCase()}`}
        onClick={() => handleFilter(link)}
        className={`${
            (active === link || searchParams.get('feature')===link.toLocaleLowerCase() ) ?"gradient_blue-purple" : "bg-black-300"
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