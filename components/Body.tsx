import React from "react";
import Scan from "./Scan";
import SendTransactionComponent from "./SendTransactionComponent";

type Props = {
    feature:string | string[] | undefined;
}

const Body = (props:Props) => {
    const {feature}=props;
    if(feature==='scan'){
        return <Scan />
    }else if(feature==="payments" || feature===""){
        return <SendTransactionComponent />
    }
  return (
    <div>
        <div className="text-white-400 w-full flex-center font-bold mt-10 heading2">
            <p><b className="text-gradient_pink-orange">Add to Home Screen</b> the app to delve into the world of future <b className="text-gradient_blue-purple">{feature || "payments"}</b></p>
        </div>
    </div>
  )
}
 
export default React.memo(Body)