import { SPECIAL_PFI } from "@/app/lib/constants";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Avatar, Flex, Rate, Tag, Typography } from "antd";
import { formatDistanceToNow } from "date-fns";

export interface PFIDetailsProps {
    pfiDid: string;
    pfiName: string;
    createdAt: string;
    estimatedSettlementTime: number | string;
}

const PFIDetails = (props: PFIDetailsProps) => {
    const {
        pfiName,
        pfiDid,
        createdAt,
        estimatedSettlementTime
    } = props

    const pfi = pfiName
        ? pfiName?.charAt(0)?.toUpperCase()
        : SPECIAL_PFI.name?.charAt(0)?.toUpperCase()

    const pfiDidUri = pfiDid
        ? `${pfiDid?.slice(0, 14)}...${pfiDid?.slice(-8)}`
        : SPECIAL_PFI.did

    return (
        <Flex className="items-center justify-between w-full">
            <Flex className="gap-3">
                <Avatar shape="square" style={{ backgroundColor: pfiName ? '#f56a00' : '#87d068', width: 60, height: 60 }}>{pfi}</Avatar>
                <Flex className="flex-col">
                    <Typography.Title level={5} style={{ marginTop: -4 }}>
                        {pfiName ? pfiName : SPECIAL_PFI.name}
                    </Typography.Title>
                    <Typography.Text style={{ fontSize: 12, marginTop: -4 }} copyable>
                        {pfiDidUri}
                    </Typography.Text>
                    <Flex className="gap-1">
                        <Typography.Text className="font-bold text-xs">
                            Offered:
                        </Typography.Text>
                        <Typography.Text className="text-xs">
                            {formatDistanceToNow(createdAt, { addSuffix: true })}
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex className="flex-col gap-2">
                <Tag className="items-center">
                    <Rate style={{ fontSize: 11, color: '#CC9933' }} disabled allowHalf defaultValue={2.5} />
                </Tag>
                <Flex className="justify-end">
                    <Tag className="items-center" color="gold">
                        <Typography.Text>
                            <ClockCircleOutlined className="mr-1" />
                            {`${estimatedSettlementTime}`}
                        </Typography.Text>
                    </Tag>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default PFIDetails
