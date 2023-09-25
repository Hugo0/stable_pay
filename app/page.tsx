
import LoadingComponent from '@/components/LoadingComponent';
import { connectToDatabase } from '@/database';
// import Login from '@/components/Login'
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Login =dynamic(() => 
  import ('@/components/Login')
,{
  loading: () => <LoadingComponent />
})

const Home = async ({searchParams}:{searchParams: {[key:string]:string | string[] | undefined}}) => {
  console.log('searchParams:',searchParams);
  const feature=searchParams.feature || "";
  connectToDatabase().then(() => console.log('Success!!!'));
  return (
    <main className="flex-center paddings mx-auto w-full max-w-screen-2xl flex-col">
        <section className="nav-padding w-full">
            <div className="flex-center relative min-h-[274px] w-full flex-col rounded-xl bg-banner bg-cover bg-center text-center">
            <h1 className="sm:heading1 heading2 mb-6 text-center text-white">KeyChain Global Payments</h1>
            </div>
        </section>
        <Login feature={feature} />
    </main>
  )
}

export default Home