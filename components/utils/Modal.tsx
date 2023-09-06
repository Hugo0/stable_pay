type Props={
    title?:String,
    content?:String,
}

function Modal({title,content}:Props) {
    return (
      <div className='flex h-screen w-screen items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500'>
          <div className="h-screen w-screen max-w-2xl max-h-full px-4 flex items-center justify-center">
              <div className="bg-white rounded-lg relative md:w-full">
                  <div className="flex items-center justify-center p-4 border-b rounded-t">
                      <h3 className="text-xl font-semibold text-gray-900">
                          {title}
                      </h3>
                  </div>
                  <div className="p-6 space-y-6">
                      <p className="text-base leading-relaxed text-gray-500">
                        {content}
                      </p>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5">
                      <span className="relative flex h-6 w-6">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
                      </span>
                  </div>
              </div>
          </div>
      </div>
    )
  }
  
  export default Modal