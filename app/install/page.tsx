"use client";

import Modal from "@/components/utils/Modal"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function install() {
  const router=useRouter();
  useEffect(() => {
    if(window.matchMedia('(display-mode: standalone)').matches)router.push('/');
  },[]);
    const title="Add To Home Screen";
    const content=["To install the app, you need to add this website to your home screen.","In your browser, tap the share icon and choose “Add to Home” Screen in the option.","Then open the app on your home screen."]
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500'>
          <div className="h-screen w-screen max-w-2xl max-h-full px-4 flex items-center justify-center">
              <div className="bg-white rounded-lg relative md:w-full">
                  <div className="flex items-center justify-center p-4 border-b rounded-t">
                      <h3 className="text-xl font-semibold text-gray-900">
                          {title}
                      </h3>
                  </div>
                  {/* {content?.map(text => ( */}
                    <div className="p-6 space-y-6 flex justify-center">
                        <div className="flex justify-center">
                            <div className=" text-gray-500 flex justify-center text-base leading-relaxed">
                              To install the app, you need to add this website to your home screen.
                            </div>
                        </div>
                    </div>
                  {/* ))} */}
                  <div className="p-6 space-y-6 flex justify-center">
                      <div className="flex">
                          <p className=" text-gray-500">
                            In your browser, tap the share icon <span className=""><svg className="h-4 w-4 -ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16" fill="none">
    <path d="M6.82091 2.9955H6.82098L6.82084 2.99022L6.81073 2.60779L6.98637 2.7973L6.98686 2.79782L8.01026 3.91001C8.11778 4.0312 8.27005 4.08939 8.41212 4.08939C8.70806 4.08939 8.94986 3.85653 8.94986 3.54946C8.94986 3.37717 8.87689 3.25654 8.79157 3.15939L8.7918 3.15919L8.78412 3.15136L6.66196 0.986662C6.60487 0.927233 6.54292 0.878519 6.47121 0.84569C6.3976 0.811994 6.32458 0.8 6.25302 0.8C6.18145 0.8 6.10843 0.811994 6.03482 0.84569C5.96311 0.878519 5.90116 0.927233 5.84407 0.986663L3.72192 3.15136L3.72191 3.15135L3.72032 3.15301C3.62449 3.25303 3.55014 3.37559 3.55014 3.54946C3.55014 3.85419 3.78356 4.08939 4.08788 4.08939C4.22623 4.08939 4.38597 4.03371 4.49576 3.91002L5.51917 2.79782L5.51966 2.7973L5.6953 2.60779L5.68519 2.99022L5.68512 2.99022V2.9955V9.77518C5.68512 10.0896 5.93976 10.3529 6.25302 10.3529C6.56627 10.3529 6.82091 10.0896 6.82091 9.77518V2.9955ZM8.00201 4.68399H7.80201V4.88399V5.66457V5.86457H8.00201H9.70276C10.0004 5.86457 10.2042 5.9478 10.3347 6.08288C10.4662 6.219 10.5522 6.43752 10.5522 6.76619V13.1178C10.5522 13.45 10.466 13.6681 10.335 13.8032C10.2048 13.9373 10.0013 14.0194 9.70276 14.0194H2.79121C2.48924 14.0194 2.28806 13.9371 2.16064 13.8041C2.03185 13.6697 1.94785 13.4517 1.94785 13.1178V6.76619C1.94785 6.43589 2.03164 6.21749 2.16094 6.08196C2.28875 5.94798 2.49014 5.86457 2.79121 5.86457H4.50402H4.70402V5.66457V4.88399V4.68399H4.50402H2.77915C2.15728 4.68399 1.65229 4.84925 1.30467 5.20934C0.958261 5.56816 0.8 6.08758 0.8 6.72842V13.1619C0.8 13.7998 0.95839 14.3177 1.30485 14.6756C1.65243 15.0347 2.15729 15.2 2.77915 15.2H9.72085C10.3432 15.2 10.848 15.0329 11.1953 14.6731C11.5415 14.3145 11.7 13.7969 11.7 13.1619V6.72842C11.7 6.09047 11.5416 5.57131 11.1955 5.21188C10.8481 4.85112 10.3432 4.68399 9.72085 4.68399H8.00201Z" fill="black" stroke="black" stroke-width="0.4"/>
  </svg> </span>and choose <span className="font-bold text-black">“Add to Home”</span> Screen in the option.
                          </p>
                      </div>
                  </div>
                  <div className="p-6 space-y-6 flex justify-center">
                      <div className="flex justify-center">
                          <div className=" text-gray-500 flex justify-center text-base leading-relaxed">
                            Then open the app on your home screen.
                          </div>
                      </div>
                  </div>
                  {/* <div className="absolute -top-0.5 -right-0.5">
                      <span className="relative flex h-6 w-6">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
                      </span>
                  </div> */}
              </div>
          </div>
      </div>
  )
}

export default install