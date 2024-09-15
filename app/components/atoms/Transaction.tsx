
import { TDBUNK_CANCEL_REASON, TDBUNK_SUCCESS_TEXT } from "@/app/lib/constants";
import { extractMessageDetailsFromExchange, getCurrencyFlag } from "@/app/lib/utils";
import { PRIMARY_GOLD_HEX } from "@/app/providers/ThemeProvider";
import { RightCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Rate, Space, Tag, Typography } from "antd";
import { format, formatDistanceToNow } from "date-fns";

const TransactionSummary = (props: any) => {
    const {
        tag,
        payin,
        payout,
        isCancel,
        finalTag,
        createdAt,
    } = props

    const exchangeTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true })

    return (
        <Flex className="justify-between flex-col items-center gap-2">
            <Flex className="justify-between w-full">
                <Flex className="">
                    <Tag color={isCancel ? 'red' : 'green'}>
                        {tag ? tag : finalTag}
                    </Tag>
                </Flex>
                <Tag color="default">
                    {exchangeTime}
                </Tag>
            </Flex>
            <Space.Compact className="w-full">
                <Button className="h-[50px] w-full" disabled>
                    <Flex className="flex flex-col justify-center items-center">
                        <Flex className="text-white" >
                            {payin?.currency}
                            {' '}
                            {getCurrencyFlag(payin?.currency)}
                        </Flex>
                        <Flex className="-mt-1 text-xs text-white" > {`${parseFloat(payin?.amount).toFixed(2)}`}</Flex>
                    </Flex>
                </Button>
                <Button className="w-[80px] h-[49px] opacity-100">
                    <RightCircleFilled style={{ color: PRIMARY_GOLD_HEX }} />
                </Button>
                <Button className="h-[50px] w-full" disabled >
                    <Flex className="flex flex-col justify-center items-center">
                        <Flex className="text-white" >
                            {payout?.currency}
                            {' '}
                            {getCurrencyFlag(payout?.currency)}
                        </Flex>
                        <Flex className="-mt-1 text-xs text-white" > {`${parseFloat(payout?.amount).toFixed(2)}`}</Flex>
                    </Flex>
                </Button>
            </Space.Compact>
        </Flex>
    )
}

const TranscationDetails = (props: any) => {
    const {
        payin,
        payout,
        protocol,
        isCancel,
        isSuccess,
        exchangeTime,
        exchangeId,
        pfiDetails,
    } = props
    return (
        <Card className="flex-col gap-2 w-full" >
            <Flex className="justify-between mb-3" >
                <Typography.Text style={{ fontSize: 10 }} className="opacity-40" >
                    {
                        isCancel
                            ? TDBUNK_CANCEL_REASON
                            : TDBUNK_SUCCESS_TEXT
                    }
                </Typography.Text>
                <Typography.Text style={{ fontSize: 10 }} className="opacity-40" >
                    {format(new Date(exchangeTime), "dd MMMM yyyy 'at' hh:mm a")}
                </Typography.Text>
            </Flex>
            <Space.Compact className="w-full" >
                <Button className="h-[70px] w-full" disabled>
                    <Flex className="flex flex-col justify-center items-center">
                        <Flex className="text-white" >
                            {payin?.currency}
                            {' '}
                            {getCurrencyFlag(payin?.currency)}
                        </Flex>
                        <Flex className="-mt-1 text-xs text-white" > {`${parseFloat(payin?.amount).toFixed(2)}`}</Flex>
                    </Flex>
                </Button>
                <Button className="h-[70px] w-[80px]" >
                    <RightCircleFilled style={{ color: PRIMARY_GOLD_HEX }} />
                </Button>
                <Button className="h-[70px] w-full" disabled >
                    <Flex className="flex flex-col justify-center items-center">
                        <Flex className="text-white" >
                            {payout?.currency}
                            {' '}
                            {getCurrencyFlag(payout?.currency)}
                        </Flex>
                        <Flex className="-mt-1 text-xs text-white" > {`${parseFloat(payout?.amount).toFixed(2)}`} </Flex>
                    </Flex>
                </Button>
            </Space.Compact>
            {isSuccess && (
                <Flex className="justify-between mt-3">
                    <Tag className="w-full p-4 mr-0">
                        <Flex className="items-center justify-between w-full">
                            <Flex className="gap-3">
                                <Avatar shape="square" style={{ backgroundColor: '#f56a00', width: 40, height: 40 }}>{pfiDetails?.name?.charAt(0)?.toUpperCase()}</Avatar>
                                <Flex className="flex-col">
                                    <Typography.Text style={{ marginTop: -4 }}>
                                        {pfiDetails?.name}
                                    </Typography.Text>
                                    <Typography.Text style={{ fontSize: 12 }} copyable>
                                        {`${pfiDetails?.did?.slice(0, 14)}...${pfiDetails?.did?.slice(-8)}`}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                            <Flex className="flex-col gap-2">
                                <Tag className="items-center mr-0">
                                    <Rate style={{ fontSize: 11, color: '#CC9933' }} disabled allowHalf defaultValue={5} />
                                </Tag>
                                <Flex className="justify-end -mt-1">
                                    <Typography.Text style={{ fontSize: 12 }}>
                                        Your Rating
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Tag>
                </Flex>
            )}
            <Flex className="justify-between mt-3">
                <Typography.Text style={{ fontSize: 10 }} className="opacity-20">
                    {`${exchangeId}`}
                </Typography.Text>
                <Typography.Text style={{ fontSize: 10 }} className="opacity-20">
                    {`tbDEX v${protocol}`}
                </Typography.Text>
            </Flex>
        </Card>
    )
}

export const generateExchangesComponents = (exchanges: any[]) => {
    const txns = []

    for (let item of exchanges) {
        const {
            tag,
            payin,
            payout,
            protocol,
            finalTag,
            isCancel,
            isSuccess,
            createdAt,
            pfiDetails,
            exchangeId,
            exchangeTime,
        } = item

        txns.push({
            key: Math.random(),
            label: <TransactionSummary
                tag={tag}
                payin={payin}
                payout={payout}
                finalTag={finalTag}
                isCancel={isCancel}
                createdAt={createdAt}
                isSuccess={isSuccess}
                exchangeTime={exchangeTime}
            />,
            children: <TranscationDetails
                payin={payin}
                payout={payout}
                protocol={protocol}
                isCancel={isCancel}
                isSuccess={isSuccess}
                pfiDetails={pfiDetails}
                exchangeId={exchangeId}
                exchangeTime={createdAt}
            />
        })
    }

    return txns
}

