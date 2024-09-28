import { DEFAULT_BASE_CURRENCY, MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY, OFFERINGS_LAST_UPDATED } from "@/app/lib/constants"
import { getCurrencyFlag } from "@/app/lib/utils"
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider"
import { useTbdexContext } from "@/app/providers/TbdexProvider"
import { RedoOutlined, RightCircleFilled } from "@ant-design/icons"
import { Button, Flex, InputNumber, Select, Space, Spin, theme, Typography } from "antd"
import { formatDistanceToNow } from "date-fns"
import debounce from 'lodash/debounce'
import { useEffect, useState } from "react"

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

    useEffect(() => {
        let result = 0

        const localStorageRate = localStorage.getItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY)

        if (localStorageRate) {
            result = (campaignAmount as number) / parseFloat(localStorageRate)

        } else {
            result = (campaignAmount as number) / (currentMarketRate as number)
        }

        setConvertedCampaignAmount(result)

        setIsLoadingConvertedValue(false)
    }, [currentMarketRate])

    const convertedAmount = Math.floor(convertedCampaignAmount)
    return (
        <Space.Compact block >
            <Select style={{ width: 130 }} defaultValue={selectedCurrency || DEFAULT_BASE_CURRENCY} onChange={(value) => {
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
                            setCampaignAmount?.(Math.floor(newAmount?.conversion_result))
                        }, 1000)()
                        setLocalCampaignAmount(value as number)
                    }} />
            </Spin>
            <Flex className="px-4 border-[0.2px] border-gray-700">
                <RightCircleFilled style={{ color: colorPrimary }} />
            </Flex>
            <Select style={{ width: 130 }} defaultValue={selectedDestinationCurrency} onChange={async (value) => {
                try {
                    const response = await fetch(`/api/rates?source=${selectedDestinationCurrency}&destination=${value}`)
                    const data = await response.json()

                    if (!data.rate) {
                        const responsePaid = await fetch(`/api/conversions`, {
                            method: 'POST',
                            body: JSON.stringify({ source: selectedDestinationCurrency, destination: value })
                        })

                        const dataPaid = await responsePaid.json()
                        const rate = dataPaid?.conversion_rate

                        setCampaignAmount?.(Math.floor(rate * Number(campaignAmount)))
                    } else {
                        const rate = data?.rate
                        setCampaignAmount?.(Math.floor(rate * Number(campaignAmount)))
                    }

                } catch (error: any) {
                    console.error("Conversion failed", error)
                }
                setSelectedDestinationCurrency?.(value)
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