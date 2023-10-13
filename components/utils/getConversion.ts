const { default: axios } = require("axios");

const offRampFunction = async (currency:string) => {
    try {

        let currencyRateArray = []

        // TRANSFI API CALL
        const transfiData = await axios.get(
            `https://sandbox-api.transfi.com/sell/quotes?cryptoTicker=USDC&fiatTicker=${currency}&baseTicker=crypto&amount=1`,
            {
                auth: {
                    username: "stablelabscorp",
                    password: "0eFrdrdeP0bcsyql",
                },
            }
        );

        // We will store the values if we get the successful output
        if (transfiData.data.message.success) {
            currencyRateArray.push({ provider: "transfi", amount: transfiData.data.message.data.cryptoPrice })
        }


        // ONMETA API CALL
        const onmetaData = await axios.post('https://stg.api.onmeta.in/v1/quote/sell', {
            sellTokenSymbol: "USDC",
            sellTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            sellTokenAmount: 100,
            chainId: 80001,
            fiatCurrency: currency,
            senderAddress: ""
        }, { headers: { 'x-api-key': 'ab97bdc0-c7a5-4013-ab40-02375f686e49' } })

        // We will store the values if we get the successful output
        if (onmetaData?.data?.success) {
            currencyRateArray.push({ provider: "onmeta", amount: parseFloat(onmetaData?.data?.data?.conversionRate) })
        }


        console.log(currencyRateArray, "all rate for currency " + currency);
        currencyRateArray.sort((a, b) => b.amount - a.amount)

        return currencyRateArray[0]

    } catch (error) {
        console.log(error, "offRampFunction error");
    }
}


const getConversionAmount = async (
    fromCountry: string,
    toCountry: string,
    amount: number
  ) => {
    try {
      const fromCountryRate = await offRampFunction(fromCountry);
      const toCountryRate = await offRampFunction(toCountry);
      console.log(
        `rate: ${
          toCountryRate?.amount / fromCountryRate?.amount
        }, amount: ${amount * (toCountryRate?.amount / fromCountryRate?.amount)}, fromCountryRate: ${
          fromCountryRate?.amount
        }, toCountryRate: ${toCountryRate?.amount}`
      );
  
      return toCountryRate?.amount / fromCountryRate?.amount;
    } catch (error) {
      console.log(error, "getConversionAmount Function Error");
      throw new Error('Unable to fetch data');
    }
  };

export default getConversionAmount;

export {offRampFunction};