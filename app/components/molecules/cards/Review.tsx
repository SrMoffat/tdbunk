import { MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY, PFIs } from "@/app/lib/constants";
import { displayTimeWithLabel, getCurrencyFlag, getEstimatedSettlementTime, percentageDifference } from "@/app/lib/utils";
import { PRIMARY_GOLD_HEX } from "@/app/providers/ThemeProvider";
import { RightCircleFilled, ClockCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Input, Rate, Space, Tag, Typography, theme } from "antd";
import { differenceInSeconds } from 'date-fns';
import { useEffect, useState } from "react";

const ReviewOffering = (props: any) => {
    const { offering, setOfferingReview, campaignAmount } = props

    const [fromMethods, toMethods] = offering.pair

    const fromCurrency = fromMethods?.currencyCode
    const fromAmount = Math.floor(campaignAmount / toMethods.unit)



    const toCurrency = toMethods?.currencyCode

    console.log("Offering ", offering)
    const { token: { colorError, colorSuccess } } = theme.useToken()


    const { timeWithLabel: estimatedTime, timeInSeconds } = getEstimatedSettlementTime(toMethods.methods, true);

    const [value, setValue] = useState(0);
    const [comment, setComment] = useState('');
    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    const startTime = new Date() // localStorage?.getItem(STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY)
    const end = new Date()
    const endTime = end.setHours(end.getHours() + 1) // localStorage?.getItem(SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY)

    const txnTime = differenceInSeconds(endTime, startTime)
    const txnTimeWithLabel = displayTimeWithLabel(txnTime)

    const marketRate = localStorage.getItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY)

    useEffect(() => {
        const reviewSubmission = {
            comment,
            marketRate,
            stars: value,
            offeringId: offering?.id,
            actualSettlement: txnTime,
            offeringRate: toMethods.unit,
            estimatedSettlement: timeInSeconds,
        };
        console.log("Review Subnission", reviewSubmission)
        setOfferingReview(reviewSubmission)
    }, [value, comment])

    const pfiDetails = PFIs.find(
        (entry) => entry.did === offering?.offeringFrom
    );

    const { diff } = percentageDifference(parseFloat(`${marketRate}`), parseFloat(toMethods.unit));

    const comparison = parseFloat(marketRate as string) > parseFloat(toMethods.unit)
        ? '-' // 'higher than'
        : '+'  // 'lower than'

    return (
        <Card className="flex items-center justify-center">
            <Flex className="flex-col text-center">
                <Typography.Title level={5}>
                    Please review your experience with the funds transfer.
                </Typography.Title>
                <Typography.Text className="opacity-40 text-xs -mt-1">
                    Provide some feedback on your experience with the offering, the transaction and overall funds transfer.
                </Typography.Text>
            </Flex>
            <Flex className="justify-between mt-3 gap-3">
                <Flex className="w-full">
                    <Space.Compact className="w-full" >
                        <Button className="h-[70px] w-full" disabled>
                            <Flex className="flex flex-col justify-center items-center">
                                <Flex className="text-white" >
                                    {fromCurrency}
                                    {' '}
                                    {getCurrencyFlag(fromCurrency)}
                                </Flex>
                                <Flex className="-mt-1 text-xs text-white" > {`${parseFloat(`${fromAmount}`).toFixed(2)}`}</Flex>
                            </Flex>
                        </Button>
                        <Button className="h-[70px] w-[80px]" >
                            <RightCircleFilled style={{ color: PRIMARY_GOLD_HEX }} />
                        </Button>
                        <Button className="h-[70px] w-full" disabled >
                            <Flex className="flex flex-col justify-center items-center">
                                <Flex className="text-white" >
                                    {toCurrency}
                                    {' '}
                                    {getCurrencyFlag(toCurrency)}
                                </Flex>
                                <Flex className="-mt-1 text-xs text-white" > {`${parseFloat(campaignAmount).toFixed(2)}`} </Flex>
                            </Flex>
                        </Button>
                    </Space.Compact>
                </Flex>
                <Flex className="w-full">
                    <Space.Compact className="w-full" >
                        <Button className="h-[70px] w-full" disabled>
                            <Flex className="flex flex-col justify-center items-center">
                                <Flex className="text-white flex-col">
                                    <Typography.Text style={{ fontSize: 11 }} className="opacity-40">Market Rate</Typography.Text>
                                    <Typography.Text className="text-white text-xs">{`${toCurrency} ${getCurrencyFlag(toCurrency)}`}</Typography.Text>
                                    <Typography.Text className="text-white text-xs">{`${parseFloat(marketRate as string).toFixed(2) }`}</Typography.Text>
                                </Flex>
                            </Flex>
                        </Button>
                        <Button className="h-[70px] w-[80px]" >
                            <Typography.Text style={{ fontSize: 12 }}>
                                <Typography.Text style={{
                                    fontSize: 12,
                                    color: parseFloat(marketRate as string) > parseFloat(toMethods.unit)
                                        ? colorError
                                        : colorSuccess
                                }}
                                >
                                    {`${comparison}${diff}%`}
                                </Typography.Text >
                            </Typography.Text>
                        </Button>
                        <Button className="h-[70px] w-full" disabled >
                            <Flex className="flex flex-col justify-center items-center">
                                <Flex className="text-white flex-col">
                                    <Typography.Text style={{ fontSize: 11 }} className="opacity-40">Offering Rate</Typography.Text>
                                    <Typography.Text className="text-white text-xs">{`${toCurrency} ${getCurrencyFlag(toCurrency)}`}</Typography.Text>
                                    <Typography.Text className="text-white text-xs">{`${parseFloat(toMethods.unit).toFixed(2) }`}</Typography.Text>
                                </Flex>
                            </Flex>
                        </Button>
                    </Space.Compact>
                </Flex>
            </Flex>
            <Flex className="justify-between mt-3 gap-3">
                <Flex className="w-full">
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
                        </Flex>
                    </Tag>
                </Flex>
                <Flex className="w-full">
                    <Space.Compact className="w-full" >
                        <Button className="h-[70px] w-full" disabled>
                            <Flex className="flex flex-col justify-center items-center">
                                <Flex className="text-white flex-col">
                                    <Typography.Text style={{ fontSize: 11 }} className="opacity-40">Estimated Time</Typography.Text>
                                    <Tag className="items-center" color="gold">
                                        <Typography.Text>
                                            <ClockCircleOutlined className="mr-1" />
                                            {`${estimatedTime}`}
                                        </Typography.Text>
                                    </Tag>
                                </Flex>
                            </Flex>
                        </Button>
                        <Button className="h-[70px] w-full" disabled >
                            <Flex className="flex flex-col justify-center items-center">
                                <Flex className="text-white flex-col">
                                    <Typography.Text style={{ fontSize: 11 }} className="opacity-40">Actual Time</Typography.Text>
                                    <Tag className="items-center" color="gold">
                                        <Typography.Text>
                                            <ClockCircleOutlined className="mr-1" />
                                            {`${txnTimeWithLabel}`}
                                        </Typography.Text>
                                    </Tag>
                                </Flex>
                            </Flex>
                        </Button>
                    </Space.Compact>
                </Flex>
            </Flex>
            <Flex className="mt-3 w-full justify-center">
                <Tag className="items-center p-2">
                    <Rate allowHalf allowClear tooltips={desc} onChange={setValue} value={value} style={{ color: '#CC9933', fontSize: 24 }} />
                </Tag>
            </Flex>
            {
                value
                    ? (
                        <Input.TextArea
                            className="mt-3"
                            value={comment}
                            onChange={(e) => setComment(e?.target?.value)}
                            placeholder="Comment on the experience with the transfer."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    )
                    : null
            }
        </Card>
    )
}

export default ReviewOffering
