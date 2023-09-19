import Scan from "./Scan";

type Props = {
    feature:string | string[] | undefined;
}

const Body = (props:Props) => {
    const {feature}=props;
    if(feature==='scan'){
        return <Scan />
    }
  return (
    <div>
        <div className="text-white-400 w-full flex-center font-bold mt-10 heading2">
            <p><b className="text-gradient_pink-orange">Add to Home Screen</b> the app to delve into the world of future <b className="text-gradient_blue-purple">{feature || "payments"}</b></p>
        </div>
    </div>
  )
}

export default Body