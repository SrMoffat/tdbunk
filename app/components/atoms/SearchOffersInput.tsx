import { useTbdexContext } from "@/app/providers/TbdexProvider"
import { RightCircleFilled, SearchOutlined } from "@ant-design/icons"
import { Button, Flex, InputNumber, Select, Space, theme } from "antd"

const { Option } = Select

export const SearchOffers = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken()

    const { sourceCurrencies, destinationCurrencies, selectedCurrency } = useTbdexContext()

    return (
        <Space.Compact block >
            <Select defaultValue={selectedCurrency}>
                {sourceCurrencies?.map(entry => <Option key={entry} value={entry}>{entry}</Option>)}
            </Select>
            <InputNumber defaultValue={12} />
            <Flex className="px-4 border-[0.2px] border-gray-700">
                <RightCircleFilled style={{ color: colorPrimary }} />
            </Flex>
            <Select defaultValue={selectedCurrency}>
                {destinationCurrencies?.map(entry => <Option key={entry} value={entry}>{entry}</Option>)}
            </Select>
            <Button type="primary" icon={<SearchOutlined />} iconPosition='end'>
                Search Offers
            </Button>
        </Space.Compact>
    )
}