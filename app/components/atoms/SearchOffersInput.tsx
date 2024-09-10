import { MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY, OFFERINGS_LAST_UPDATED } from "@/app/lib/constants"
import { getCurrencyFlag } from "@/app/lib/utils"
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider"
import { useTbdexContext } from "@/app/providers/TbdexProvider"
import { RedoOutlined, RightCircleFilled } from "@ant-design/icons"
import { Button, Flex, InputNumber, Select, Space, Spin, theme, Typography } from "antd"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import debounce from 'lodash/debounce';

const { Option } = Select

export const SearchOffers = (props: any) => {
    const {
        isLoading,
        setIsLoading
    } = props

    const [isLoadingConvertedValue, setIsLoadingConvertedValue] = useState(true)
    const [convertedCampaignAmount, setConvertedCampaignAmount] = useState(0)
    const [localCampaignAmount, setLocalCampaignAmount] = useState(0)

    const {
        token: { colorPrimary },
    } = theme.useToken()

    const {
        sourceCurrencies,
        selectedCurrency,
        currentMarketRate,
        destinationCurrencies,
        selectedDestinationCurrency,

        specialSourceCurrencies,
        specialDestinationCurrencies,

        setSelectedCurrency,
        setSelectedDestinationCurrency
    } = useTbdexContext()

    const { campaignAmount, setCampaignAmount } = useCreateCampaignContext()

    const handleRefreshOfferings = () => {
        setIsLoading(true)

        const timer = setTimeout(() => {
            setIsLoading(false)
            localStorage.setItem(OFFERINGS_LAST_UPDATED, new Date().toISOString())

        }, 3000)
    }

    const mergedSourceCurrencies = [...new Set(sourceCurrencies?.concat(specialSourceCurrencies))]
    const mergedDestinationCurrencies = [...new Set(destinationCurrencies?.concat(specialDestinationCurrencies))]

    const lastUpdate = localStorage.getItem(OFFERINGS_LAST_UPDATED)

    console.log("Last Updated", lastUpdate)
    // const destinationCountry = countries.filter(entry => entry.currencyCode === selectedDestinationCurrency)[0]?.flag

    // campaignAmount is amount the campaign will receive in selectedCurrency
    // default: convert campaignAmount to USD and set as defaultValue
    // changed: convert campaignAmount to selectedCurrency and set as defaultValue

    // const outsideLocalStorageRate = localStorage.getItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY)

    // useEffect(() => {
    //     console.log("[DEBUG]: outsideLocalStorageRate", {
    //         outsideLocalStorageRate,
    //         from: selectedDestinationCurrency,
    //         to: selectedCurrency,
    //         currentMarketRate
    //     })

    // }, [outsideLocalStorageRate])


    useEffect(() => {
        let result = 0

        const localStorageRate = localStorage.getItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY)

        if (localStorageRate) {
            result = (campaignAmount as number) / parseFloat(localStorageRate)
            console.log("[DEBUG]: Using local storage", result)

        } else {
            result = (campaignAmount as number) / (currentMarketRate as number)
            console.log("[DEBUG]: Using state storage", result)
        }

        setConvertedCampaignAmount(result)

        setIsLoadingConvertedValue(false)
        console.log("[DEBUG]: Market Rate Changed Values", {
            result,
            localStorageRate,
            campaignAmount,
            from: selectedDestinationCurrency,
            to: selectedCurrency,
            currentMarketRate
        })

    }, [currentMarketRate])


    console.log("convertedCampaignAmount", convertedCampaignAmount)

    const convertedAmount = Math.floor(convertedCampaignAmount)

    return (
        <Space.Compact block >
            <Select style={{ width: 130 }} defaultValue={selectedCurrency || 'USD'} onChange={(value) => {
                setSelectedCurrency?.(value)
            }}>
                {mergedSourceCurrencies?.map(entry => <Option key={entry} value={entry}>{`${entry} ${getCurrencyFlag(entry)}`}</Option>)}
            </Select>
            <Spin size="small" spinning={isLoadingConvertedValue} tip={
                <Typography.Text className="-mt-4" style={{ fontSize: 10, color: colorPrimary }}>
                    Converting ...
                </Typography.Text>}
            >
                <InputNumber
                    defaultValue={convertedAmount}
                    value={
                        isLoadingConvertedValue
                            ? undefined
                            : localCampaignAmount
                                ? localCampaignAmount
                                : convertedAmount
                                    ? convertedAmount
                                    : campaignAmount
                    }
                    onChange={async (value) => {
                        debounce(async () => {
                            const response = await fetch('/api/conversions', {
                                method: 'POST',
                                body: JSON.stringify({
                                    source: selectedCurrency,
                                    destination: selectedDestinationCurrency,
                                    amount: value
                                })
                            })

                            const newAmount = await response.json()
                            console.log("Amount Here Debounced ==>", {
                                value,
                                newAmount,
                                source: selectedCurrency,
                                destination: selectedDestinationCurrency,
                            })

                            setCampaignAmount?.(Math.floor(newAmount?.conversion_result))
                        }, 1000)()
                        setLocalCampaignAmount(value as number)
                    }} />
            </Spin>
            <Flex className="px-4 border-[0.2px] border-gray-700">
                <RightCircleFilled style={{ color: colorPrimary }} />
            </Flex>
            <Select style={{ width: 130 }} defaultValue={selectedDestinationCurrency} onChange={(value) => {
                setSelectedDestinationCurrency?.(value)
                // Convert campaignAmount and set it

                
            }}>
                {mergedDestinationCurrencies?.map(entry => <Option key={entry} value={entry}>{`${entry} ${getCurrencyFlag(entry)}`}</Option>)}
            </Select>
            <Button loading={isLoading} onClick={handleRefreshOfferings} type="primary" icon={<RedoOutlined />} iconPosition='end'>
                <Flex className="flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>Refresh Offerings</Typography.Text>
                    <Typography.Text className="-mt-1" style={{ fontSize: 8 }}>
                        Updated {formatDistanceToNow(new Date(lastUpdate as string), { addSuffix: true })}
                    </Typography.Text>
                </Flex>
            </Button>
        </Space.Compact>
    )
}