import { theme, Avatar, Tooltip } from "antd"
import { FactCheckers } from "@/app/components/atoms/Icon"
import Image from "next/image"

export const FactCheckersAvatars = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken()
    return (
        <Avatar.Group shape='square' size="large" max={{
            count: 4, style: {
                color: '#f56a00', backgroundColor: '#fde3cf',
                cursor: 'pointer'
            }, popover: { trigger: 'click' },
        }}>
            <Tooltip title="Fact Checker 1" placement="top">
                <Avatar style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
            </Tooltip>
            <Tooltip title="Fact Checker 2" placement="top">
                <Avatar style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
            </Tooltip>
            <Tooltip title="Fact Checker 3" placement="top">
                <Avatar style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
            </Tooltip>
            <Tooltip title="Fact Checker 4" placement="top">
                <Avatar style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
            </Tooltip>
        </Avatar.Group>
    )
}