import { getCurrencyFlag } from "@/app/lib/utils"
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider"
import { useTbdexContext } from "@/app/providers/TbdexProvider"
import { RedoOutlined, RightCircleFilled } from "@ant-design/icons"
import { Button, Flex, InputNumber, Select, Space, theme, Typography } from "antd"

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

        setSelectedCurrency,
        setSelectedDestinationCurrency
    } = useTbdexContext()

    const { campaignAmount } = useCreateCampaignContext()

    const handleRefreshOfferings = () => {
        setIsLoading(true)

        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

    // const destinationCountry = countries.filter(entry => entry.currencyCode === selectedDestinationCurrency)[0]?.flag
    return (
        <Space.Compact block >
            <Select style={{ width: 130 }} defaultValue={selectedCurrency || 'USD'} onChange={(value) => {
                setSelectedCurrency?.(value)
            }}>
                {sourceCurrencies?.map(entry => <Option key={entry} value={entry}>{`${entry} ${getCurrencyFlag(entry)}`}</Option>)}
            </Select>
            <InputNumber defaultValue={campaignAmount} />
            <Flex className="px-4 border-[0.2px] border-gray-700">
                <RightCircleFilled style={{ color: colorPrimary }} />
            </Flex>
            <Select style={{ width: 130 }} defaultValue={selectedDestinationCurrency} onChange={(value) => {
                setSelectedDestinationCurrency?.(value)
            }}>
                {destinationCurrencies?.map(entry => <Option key={entry} value={entry}>{`${entry} ${getCurrencyFlag(entry)}`}</Option>)}
            </Select>
            <Button loading={isLoading} onClick={handleRefreshOfferings} type="primary" icon={<RedoOutlined />} iconPosition='end'>
                <Flex className="flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>Refresh Offerings</Typography.Text>
                    <Typography.Text className="-mt-1" style={{ fontSize: 8 }}>Updated 4 minutes ago</Typography.Text>
                </Flex>
            </Button>
        </Space.Compact>
    )
}