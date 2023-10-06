import TransactionDetailsComponent from "@/components/TransactionDetailsComponent";

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <TransactionDetailsComponent id={params.id} /> 
  )
}