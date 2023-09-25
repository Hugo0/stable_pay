// "use client";
import DropDownButton from '@/components/DropDownButton';

type Props = {}

const page = (props: Props) => {
  return (
    <div className='flex flex-col h-screen w-screen justify-center bg-gradient-to-r from-purple-500 to-pink-500'>
        <DropDownButton />
    </div>
  )
}

export default page