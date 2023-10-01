import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parseCookies } from 'nookies'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const userData= parseCookies().smartContractAddress;
  console.log('headers:',request.headers);
  if(userData){
    return NextResponse.redirect('/account');
  }
  return NextResponse.next();
}
