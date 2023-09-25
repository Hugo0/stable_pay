import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        senderAddress: {
            type: String,
            required: true,
        },
        receiverAddress: {
            type: String,
        },
        sentAmount:{
            type:Number,
            required:true,
        },
        exchangeRate: {
            type: Number,
        },
        fees: {
            type: Number,
        },
        category:{
            type:String,
            required:true,
        },
        status:{
            type:String,
            required:true,
        },
        hashId:{
            type:String,
        },
        sender_currency:{
            type:String, //baseCurrency 
            /*
                flow:
                1-> update baseCurrency  
                2-> peanut protocol -|
                3-> transaction is created in the database ->objectId -|
                4-> copy link & share link functionalities 
                5-> claim link 
                6-> transaction is updated with the receiver address 
            */
        },
        receiver_currency:{
            type:String, //quoteCurrency -> via link we're updating quote currency 
        },
        link:{
            type:String,
        }
    },
    {
        timestamps: true,
    })

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)

export default  Transaction;