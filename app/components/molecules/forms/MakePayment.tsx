import { DestinationCurrency, SourceCurrency } from "@/app/components/atoms/MarketRate";
import PFIDetails from "@/app/components/atoms/OfferPFI";
import MakeTransfer from "@/app/components/molecules/forms//MakeTransfer";
import RequestForQuote from "@/app/components/molecules/forms/RequestForQuote";
import { TBDEX_MESSAGE_TYPES_TO_STATUS } from "@/app/lib/constants";
import { arraysEqual, getEstimatedSettlementTime, getPlatformFees, msToDays, percentageDifference } from "@/app/lib/utils";
import { PRIMARY_GOLD_HEX } from "@/app/providers/ThemeProvider";
import { ClockCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Card, Flex, Progress, Statistic, Steps, Tag, Typography } from "antd";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState, } from "react";

const { Countdown } = Statistic

const MakePayment = (props: any) => {
    const {
        money,
        pfiDid,
        pfiName,
        offering,
        isLoading,
        feeDetails,
        monopolyMoney,
        campaignAmount,
        isRequestQuote,
        relevantExchange,
        currentMarketRate,
        offeringCreatedAt,
        setPaymentDetails,
        setActivateButton,
        setCampaignAmount,
        requiredPaymentDetails: stateDetails,
        offeringToCurrencyMethods
    } = props

    const [quoteExpired, setQuoteExpired] = useState(false)
    const [requiredPaymentDetails, setRequiredPaymentDetails] = useState<any>({
        payin: {},
        payout: {}
    })

    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const exchangeRate = offeringData?.payoutUnitsPerPayinUnit

    const isQuote = relevantExchange?.status === TBDEX_MESSAGE_TYPES_TO_STATUS.QUOTE
    const isClose = relevantExchange?.status === TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE

    const quoteExpiration = relevantExchange?.mostRecentMessage?.data?.expiresAt;
    const transferCancellation = relevantExchange?.mostRecentMessage?.metadata?.createdAt;

    const deadline = new Date(quoteExpiration).valueOf()

    const numberOfDays = msToDays(deadline)

    const isLessThanOrADay = numberOfDays <= 1

    const onQuoteExpired = () => {
        setQuoteExpired(true)
        // To Do: Add notification
        console.log('finished!');
    };

    const { timeWithLabel } = getEstimatedSettlementTime(offeringToCurrencyMethods, true)

    useEffect(() => {
        const requiredPayin = payin?.methods[0]?.requiredPaymentDetails?.required
        const requiredPayout = payout?.methods[0]?.requiredPaymentDetails?.required


        const providedPayinDetails = requiredPaymentDetails?.payin
        const providedPayoutDetails = requiredPaymentDetails?.payout

        const providedPayinFields = Object.keys(providedPayinDetails)
        const providedPayoutFields = Object.keys(providedPayoutDetails)


        let activateBtn = false

        const allPaymentDetailsRequired = requiredPayin && requiredPayout
        const allPaymentDetailsNotRequired = !requiredPayin && !requiredPayout
        const payinRequiredButNotPayout = requiredPayin && !requiredPayout
        const payoutRequiredButNotPayin = !requiredPayin && requiredPayout

        if (allPaymentDetailsRequired) {
            const hasAllPayinDetails = arraysEqual(providedPayinFields, requiredPayin)
            const hasAllPayoutDetails = arraysEqual(providedPayoutFields, requiredPayout)

            activateBtn = hasAllPayinDetails && hasAllPayoutDetails
            console.log('allPaymentDetailsRequired!', {
                activateBtn,
                requiredPayin,
                requiredPayout,
                hasAllPayinDetails,
                hasAllPayoutDetails
            });

        } else if (allPaymentDetailsNotRequired) {
            activateBtn = true
            console.log('allPaymentDetailsNotRequired!', {
                activateBtn,
                allPaymentDetailsNotRequired,
                requiredPayin,
                requiredPayout,
            });

        } else if (payinRequiredButNotPayout) {
            activateBtn = arraysEqual(providedPayinFields, requiredPayin)
            console.log('payinRequiredButNotPayout!', {
                activateBtn,
                payinRequiredButNotPayout,
                requiredPayin,
                requiredPayout,
            });

        } else if (payoutRequiredButNotPayin) {
            activateBtn = arraysEqual(providedPayoutFields, requiredPayout)
            console.log('payoutRequiredButNotPayin!', {
                activateBtn,
                payoutRequiredButNotPayin,
                requiredPayin,
                requiredPayout,
            });
        }

        setActivateButton(activateBtn)
        setPaymentDetails(requiredPaymentDetails)

    }, [requiredPaymentDetails])

    const { diff } = percentageDifference(currentMarketRate, parseFloat(exchangeRate));

    const comparison = currentMarketRate > parseFloat(exchangeRate)
        ? 'higher than'
        : 'lower than';

    return (
        <Flex className="gap-2 flex-col">
            {isRequestQuote ? (
                <Flex className="w-full items-center flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>Exchange Rate in Offering</Typography.Text>
                    {
                        Boolean(currentMarketRate) && (
                            <Typography.Text style={{ fontSize: 12 }}>
                                <Typography.Text style={{
                                    fontSize: 12,
                                    color: currentMarketRate > parseFloat(exchangeRate)
                                        ? 'red'
                                        : 'green'
                                }}
                                >
                                    {`${diff}%`}
                                </Typography.Text >
                                <Typography.Text style={{ fontSize: 12 }}> {comparison} Market Rate</Typography.Text>
                            </Typography.Text>
                        )
                    }
                    <Steps
                        type="inline"
                        items={[
                            {
                                title: <SourceCurrency currency={fromCurrency} />,
                                status: 'process'
                            },
                            {
                                title: '',
                                status: 'wait'
                            },
                            {
                                title: <DestinationCurrency
                                    isLoading={false}
                                    convertedAmount={exchangeRate}
                                    currency={toCurrency}
                                />,
                                status: 'process'
                            },
                        ]}
                    />
                </Flex>
            ) : (
                <Flex className={isLoading ? 'flex-col opacity-100' : ''}>
                    <Flex className="w-full justify-between mb-4 gap-4 mt-4">
                        <Flex className="w-full">
                            <Card className="w-full">
                                <PFIDetails
                                    pfiDid={pfiDid}
                                    pfiName={pfiName}
                                    createdAt={offeringCreatedAt}
                                    estimatedSettlementTime={timeWithLabel}
                                />
                            </Card>
                        </Flex>

                        {isClose && (
                            <Flex className="w-1/2 justify-end items-start">
                                <Tag color="red">
                                    <Flex className="gap-3">
                                        <CloseCircleFilled />
                                        <Flex className="flex-col">
                                            <Typography.Text style={{ fontSize: 11 }}>
                                                Transfer Cancelled
                                            </Typography.Text>
                                            <Typography.Text style={{ fontSize: 11 }}>
                                                {formatDistanceToNow(new Date(transferCancellation), { addSuffix: true })}
                                            </Typography.Text>
                                        </Flex>
                                    </Flex>
                                </Tag>
                            </Flex>
                        )}

                        {isQuote && (
                            <Flex className="w-1/2 justify-end items-start">
                                <Tag color={quoteExpired ? 'red' : 'default'}>
                                    <Flex className="gap-3">
                                        <ClockCircleFilled />
                                        {
                                            isLessThanOrADay
                                                ? (
                                                    <Countdown
                                                        valueStyle={{
                                                            fontSize: 11,
                                                            marginTop: -6
                                                        }}
                                                        title={
                                                            <Typography.Text style={{ fontSize: 11 }}>
                                                                {quoteExpired ? 'Quote Expired:' : "Quote Expires:"}
                                                                {formatDistanceToNow(new Date(quoteExpiration), { addSuffix: true })}
                                                            </Typography.Text>
                                                        }
                                                        value={deadline}
                                                        onFinish={onQuoteExpired}
                                                    />
                                                )
                                                : (
                                                    <Flex className="flex-col">
                                                        <Typography.Text style={{ fontSize: 11 }}>
                                                            {quoteExpired ? 'Quote Expired:' : "Quote Expires:"}
                                                        </Typography.Text>
                                                        <Typography.Text style={{ fontSize: 11 }}>
                                                            {formatDistanceToNow(new Date(quoteExpiration), { addSuffix: true })}
                                                        </Typography.Text>
                                                    </Flex>
                                                )
                                        }
                                    </Flex>
                                </Tag>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            )}
            {
                isRequestQuote
                    ? <RequestForQuote
                        money={money}
                        offering={offering}
                        isLoading={isLoading}
                        monopolyMoney={monopolyMoney}
                        campaignAmount={campaignAmount}
                        setCampaignAmount={setCampaignAmount}
                        currentMarketRate={currentMarketRate}
                        setRequiredPaymentDetails={setRequiredPaymentDetails}
                    />
                    : <MakeTransfer
                        offering={offering}
                        isLoading={isLoading}
                        feeDetails={feeDetails}
                        stateDetails={stateDetails}
                        monopolyMoney={monopolyMoney}
                        campaignAmount={campaignAmount}
                        relevantExchange={relevantExchange}
                        currentMarketRate={currentMarketRate}
                        requiredPaymentDetails={requiredPaymentDetails}
                    />}
        </Flex>
    )
}

export default MakePayment
