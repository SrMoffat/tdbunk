import { CopyOutlined } from "@ant-design/icons"
import { Space, Tooltip, Button, Input } from "antd"

export const DidUrlWithCopy = () => {
    return (
        <Space.Compact block>
            <Input
                style={{ width: 'calc(100% - 200px)' }}
                defaultValue="git@github.com:ant-design/ant-design.git"
            />
            <Tooltip title="copy did url">
                <Button icon={<CopyOutlined />} />
            </Tooltip>
        </Space.Compact>
    )
}