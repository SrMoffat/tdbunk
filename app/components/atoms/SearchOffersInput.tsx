import { useTbdexContext } from "@/app/providers/TbdexProvider"
import { RedoOutlined, RightCircleFilled, SearchOutlined } from "@ant-design/icons"
import { Button, Flex, InputNumber, Select, Space, theme, Typography } from "antd"
import countries from "@/public/countries.json"

const { Option } = Select

export const getCurrencyFlag = (currency: string) => {
    let flag = ''

    switch (currency) {
        case 'USD':
            flag = '🇺🇸'
            break
        case 'EUR':
            flag = '🇪🇺'
            break
        case 'GBP':
            flag = '🇬🇧'
            break
        default:
            flag = countries.filter(entry => entry.currencyCode === currency)[0]?.flag
            break
    }

    return flag ?? '🏳️'
}

export const SearchOffers = () => {
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

    // const destinationCountry = countries.filter(entry => entry.currencyCode === selectedDestinationCurrency)[0]?.flag



    return (
        <Space.Compact block >
            <Select defaultValue={selectedCurrency} onChange={(value) => {
                setSelectedCurrency?.(value)
            }}>
                {sourceCurrencies?.map(entry => <Option key={entry} value={entry}>{`${entry} ${getCurrencyFlag(entry)}`}</Option>)}
            </Select>
            <InputNumber defaultValue={12} />
            <Flex className="px-4 border-[0.2px] border-gray-700">
                <RightCircleFilled style={{ color: colorPrimary }} />
            </Flex>
            <Select defaultValue={selectedDestinationCurrency} onChange={(value) => {
                setSelectedDestinationCurrency?.(value)
            }}>
                {destinationCurrencies?.map(entry => <Option key={entry} value={entry}>{`${entry} ${getCurrencyFlag(entry)}`}</Option>)}
            </Select>
            <Button type="primary" icon={<RedoOutlined />} iconPosition='end'>
                <Flex className="flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>Refresh Offerings</Typography.Text>
                    <Typography.Text className="-mt-1" style={{ fontSize: 8 }}>Updated 4 minutes ago</Typography.Text>
                </Flex>
            </Button>
        </Space.Compact>
    )
}