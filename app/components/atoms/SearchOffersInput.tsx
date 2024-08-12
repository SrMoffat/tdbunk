import { RightCircleFilled, SearchOutlined } from "@ant-design/icons"
import { theme, Space, Select, InputNumber, Button } from "antd"

const { Option } = Select

export const SearchOffers = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken()
    return (
        <Space.Compact block >
            <Select defaultValue="USD">
                <Option value="USD">USD</Option>
                <Option value="KES">KES</Option>
            </Select>
            <InputNumber defaultValue={12} />
            <RightCircleFilled className="px-4" style={{ color: colorPrimary }} />
            <Select defaultValue="USD">
                <Option value="USD">USD</Option>
                <Option value="KES">KES</Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />} iconPosition='end'>
                Search Offers
            </Button>
        </Space.Compact>
    )
}