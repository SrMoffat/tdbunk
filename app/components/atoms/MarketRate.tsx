import { MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import { Flex, Steps, Typography } from 'antd';
import { useEffect, useState } from "react";

export const SourceCurrency = (props: any) => {
    const { currency } = props
    return (
        <Typography.Text
            className="text-green-600"
            style={{ fontSize: 11 }}
        >
            {`${currency} 1`}
        </Typography.Text>
    )
}

export const DestinationCurrency = (props: any) => {
    const {
        currency,
        isLoading,
        convertedAmount
    } = props
    const converted = parseFloat(convertedAmount)
    const isNaN = Number.isNaN(converted)
    return (
        <Typography.Text
            className="text-green-600"
            style={{ fontSize: 11 }}
        >
            {`${currency} ${isLoading ? '..' : `${isNaN ? 'Unavailable' : converted}`}`}
        </Typography.Text>
    )
}


const MarketRate = (props: any) => {
    const { source, destination } = props

    const [isLoading, setIsLoading] = useState(false)
    const [convertedAmount, setConvertedAmount] = useState(1)

    useEffect(() => {
        setIsLoading(true)

        const fetchRates = async () => {
            try {
                const response = await fetch(`/api/rates?source=${source}&destination=${destination}`)
                const data = await response.json()

                if (!data.rate) {
                    const responsePaid = await fetch(`/api/conversions`, {
                        method: 'POST',
                        body: JSON.stringify({ source, destination })
                    })
                    const dataPaid = await responsePaid.json()
                    console.log("Use PAID API", dataPaid)
                    setConvertedAmount(dataPaid?.conversion_rate)
                    localStorage.setItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY, dataPaid?.conversion_rate)
                } else {
                    console.log("Use Free API", data)
                    setConvertedAmount(data?.rate)
                    localStorage.setItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY, data?.rate)
                }
                setIsLoading(false)
            } catch (error: any) {
                console.log("Fetching rates errored", error)
            }
        }

        fetchRates()
    }, [source, destination])

    return (
        <Flex className="flex-col items-center w-1/3">
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



