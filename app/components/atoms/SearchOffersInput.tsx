import { OFFERINGS_LAST_UPDATED } from "@/app/lib/constants"
import { getCurrencyFlag } from "@/app/lib/utils"
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider"
import { useTbdexContext } from "@/app/providers/TbdexProvider"
import { RedoOutlined, RightCircleFilled } from "@ant-design/icons"
import { Button, Flex, InputNumber, Select, Space, theme, Typography } from "antd"
import { formatDistanceToNow } from "date-fns"
formatDistanceToNow

const { Option } = Select

export const SearchOffers = (props: any) => {
    const {
        isLoading,
        setIsLoading
    } = props

    const {
        token: { colorPrimary },
    } = theme.useToken()

    const {
        sourceCurrencies,
        selectedCurrency,
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
    console.log("Convert then set result to campaignAmount", {
        campaignAmount,
        from: selectedDestinationCurrency,
        to: selectedCurrency

    })

    // const destinationCountry = countries.filter(entry => entry.currencyCode === selectedDestinationCurrency)[0]?.flag

    // campaignAmount is amount the campaign will receive in selectedCurrency
    // default: convert campaignAmount to USD and set as defaultValue
    // changed: convert campaignAmount to selectedCurrency and set as defaultValue
    return (
        <Space.Compact block >
            <Select style={{ width: 130 }} defaultValue={selectedCurrency || 'USD'} onChange={(value) => {
                setSelectedCurrency?.(value)
            }}>
                {mergedSourceCurrencies?.map(entry => <Option key={entry} value={entry}>{`${entry} ${getCurrencyFlag(entry)}`}</Option>)}
            </Select>
            <InputNumber defaultValue={campaignAmount} onChange={(value) => {
                setCampaignAmount?.(value as number)
            }} />
            <Flex className="px-4 border-[0.2px] border-gray-700">
                <RightCircleFilled style={{ color: colorPrimary }} />
            </Flex>
            <Select style={{ width: 130 }} defaultValue={selectedDestinationCurrency} onChange={(value) => {
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