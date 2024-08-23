import { useTbdexContext } from '@/app/providers/TbdexProvider';
import { Flex, Typography, Steps, StepProps } from 'antd';
import React, { useEffect, useState } from "react";

const SourceCurrency = (props: any) => {
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

const DestinationCurrency = (props: any) => {
    const {
        currency,
        isLoading,
        convertedAmount
    } = props
    return (
        <Typography.Text
            className="text-green-600"
            style={{ fontSize: 11 }}
        >
            {`${currency} ${isLoading ? '..' : `${parseFloat(convertedAmount)}`}`}
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
                    // const responsePaid = await fetch(`/api/conversions`, {
                    //     method: 'POST',
                    //     body: JSON.stringify({ source, destination })
                    // })
                    // const dataPaid = await responsePaid.json()
                    // console.log("Use PAID API", dataPaid?.conversion_rate)
                    // setConvertedAmount(dataPaid?.conversion_rate)
                } else {
                    // console.log("Use Free API", data)
                    setConvertedAmount(data?.rate)
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


