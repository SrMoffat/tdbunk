import { useTbdexContext } from '@/app/providers/TbdexProvider';
import { Flex, Typography, Steps, StepProps } from 'antd';
import React, { useEffect, useState } from "react";


// const getConversionRate = async (source: string, destination: string) => {
//     setIsLoading(true)
//     const isSame = source === destination

//     // const response = await 

//     const conversion = '2.00'

//     console.log("Conversion", {
//         source,
//         destination
//     })

//     return isSame ? '1.00' : conversion
// }

// const data = storedOfferings

// const convertedAmount = await getConversionRate(selectedCurrency as string, selectedDestinationCurrency as string)

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
    // const { selectedCurrency, selectedDestinationCurrency } = useTbdexContext()

    useEffect(() => {
        setIsLoading(true)

        const fetchRates = async () => {
            const response = await fetch(`/api/rates?source=${source}&destination=${destination}`)
            const data = await response.json()

            if (!data.rate) {
                console.log("Use Paid API", data)
            } else {
                console.log("Use Free API", data)
                setConvertedAmount(data?.rate)
            }
            setIsLoading(false)
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



