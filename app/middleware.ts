import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parseCookies } from 'nookies'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const userData=parseCookies().eoaAddress;
  if(request.headers.get('display-mode') !== 'standalone'){
    return NextResponse.redirect('/install');
  }
  return NextResponse.next();
}
