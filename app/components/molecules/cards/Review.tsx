import { MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { displayTimeWithLabel, getEstimatedSettlementTime } from "@/app/lib/utils";
import { Card, Flex, Input, Rate, Tag, Typography } from "antd";
import { differenceInSeconds } from 'date-fns';
import { useEffect, useState } from "react";

const ReviewOffering = (props: any) => {
    const { offering, setOfferingReview } = props

    const { 1: toMethods } = offering.pair

    console.log("Offering ", offering)

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
            offeringId: offering?.id,
            estimatedSettlement: timeInSeconds,
            actualSettlement: txnTime,
            marketRate,
            offeringRate: toMethods.unit,
            stars: value,
            comment
        };
        console.log("Review Subnission", reviewSubmission)
        setOfferingReview(reviewSubmission)

    }, [value, comment])

    return (
        <Flex gap="middle" vertical>
            <Flex className="gap-4">
                <Card>
                    <Flex className="flex-col gap-1 flex">
                        <Typography.Text className="font-extrabold">Settlement Time</Typography.Text>
                        <Flex className="gap-1">
                            <Typography.Text>Estimated:</Typography.Text>
                            <Tag>{estimatedTime}</Tag>
                        </Flex>
                        <Flex className="gap-1">
                            <Typography.Text>Actual:</Typography.Text>
                            <Tag>{txnTimeWithLabel}</Tag>
                        </Flex>
                    </Flex>
                </Card>
                <Card>
                    <Flex className="flex-col gap-1 flex">
                        <Typography.Text className="font-extrabold">Exchange Rate</Typography.Text>
                        <Flex className="gap-1">
                            <Typography.Text>Market Rate:</Typography.Text>
                            <Tag>{parseFloat(marketRate as string).toFixed(2)}</Tag>
                        </Flex>
                        <Flex className="gap-1">
                            <Typography.Text>Offering Rate:</Typography.Text>
                            <Tag>{parseFloat(toMethods.unit).toFixed(2)}</Tag>
                        </Flex>
                    </Flex>
                </Card>
            </Flex>
            <Typography.Text>How would you rate the experience with the transfer?</Typography.Text>
            <Flex>
                <Tag className="items-center p-2">
                    <Rate tooltips={desc} onChange={setValue} value={value} style={{ color: '#CC9933' }} />
                </Tag>
            </Flex>
            {
                value
                    ? (
                        <Input.TextArea
                            value={comment}
                            onChange={(e) => setComment(e?.target?.value)}
                            placeholder="Comment on the experience with the transfer."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    )
                    : null
            }

        </Flex>
    )
}

export default ReviewOffering
