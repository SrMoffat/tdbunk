import { fetchMarketExchangeRates } from '@/app/lib/api';
import { MARKET_CONVERSION_API_EXCEEDED_QOUTA_LOCAL_STORAGE_KEY, MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import { Flex, Steps, Typography, Alert } from 'antd';
import { useEffect, useState, useMemo } from "react";

export const SourceCurrency = (props: any) => {
    const { currency } = props
    return (
        <Typography.Text
            style={{ fontSize: 11 }}
        >
            {`${currency} ${parseFloat('1').toFixed(2)}`}
        </Typography.Text>
    )
}

export const DestinationCurrency = (props: any) => {
    const {
        currency,
        isLoading,
        convertedAmount
    } = props
    const converted = parseFloat(convertedAmount) //.toFixed(2)
    const isNaN = Number.isNaN(converted)
    return (
        <Typography.Text
            style={{ fontSize: 11 }}
        >
            {`${currency} ${isLoading ? '..' : `${isNaN ? 'Unavailable' : converted}`}`}
        </Typography.Text>
    )
}


const MarketRate = (props: any) => {
    const { source, destination, setCurrentMarketRate, marketConversionApiQuotaExceeded } = props

    const [isLoading, setIsLoading] = useState(false)
    const [showBanner, setShowBanner] = useState(true)
    const [convertedAmount, setConvertedAmount] = useState(1)

    useMemo(() => {
        setIsLoading(true)

        const fetchRates = async () => {
            try {
                // const response = await fetch(`/api/rates?source=${source}&destination=${destination}`)
                // const data = await response.json()

                // @ts-ignore
                const { success, rate: marketRate, amount: convertedAmount } = await fetchMarketExchangeRates({
                    source,
                    amount: 1,
                    destination
                })

                if (success) {
                    console.log("Fetch Rates Market Rate Succeded", {
                        marketRate,
                        convertedAmount,
                    })
                } else {
                    console.log("Fetch Rates Market Rate Failed", {
                        marketRate,
                        convertedAmount,
                    })
                }


                // if (!data.rate) {
                // const responsePaid = await fetch(`/api/conversions`, {
                //     method: 'POST',
                //     body: JSON.stringify({ source, destination })
                // })
                // const dataPaid = await responsePaid.json()

                //     const rate = dataPaid?.conversion_rate

                //     setConvertedAmount(rate)
                //     setCurrentMarketRate(rate)
                //     localStorage.setItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY, rate)
                // } else {
                //     const rate = data?.rate

                //     setConvertedAmount(rate)
                //     setCurrentMarketRate(rate)
                //     localStorage.setItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY, rate)
                // }
                // setIsLoading(false)
            } catch (error: any) {
                console.log("Fetching rates errored", error)
            }
        }

        fetchRates()
    }, [source, destination])

    const exhuasted = localStorage?.getItem(MARKET_CONVERSION_API_EXCEEDED_QOUTA_LOCAL_STORAGE_KEY)

    console.log("Local Exchuated", exhuasted)


    useEffect(() => {
        const showBanner = marketConversionApiQuotaExceeded || exhuasted
        setShowBanner(showBanner)
    }, [exhuasted, marketConversionApiQuotaExceeded])


    return (
        <Flex className="flex-col items-center w-full">
            {showBanner && (
                <Flex className="w-full bordder">
                    <Alert
                        showIcon
                        message="Exhausted Paid Conversion Service."
                        type="warning"
                        className="mb-6 text-xs w-full"
                    />
                </Flex>
            )}
            <Typography.Text style={{ fontSize: 12 }}>Market Rate</Typography.Text>
            <Steps
                type="inline"
                items={[
                    {
                        title: <SourceCurrency currency={source} />,
                        status: 'process'
                    },
                    {
                        title: '',
                        status: 'wait'
                    },
                    {
                        title: <DestinationCurrency
                            isLoading={isLoading}
                            convertedAmount={convertedAmount}
                            currency={destination}
                        />,
                        status: 'process'
                    },
                ]}
            />
        </Flex>
    )
}

export default MarketRate;



