import PFIDetails from "@/app/components/atoms/OfferPFI";
import MakeTransfer from "@/app/components/molecules/forms//MakeTransfer";
import RequestForQuote from "@/app/components/molecules/forms/RequestForQuote";
import { arraysEqual, getEstimatedSettlementTime } from "@/app/lib/utils";
import { ClockCircleFilled } from "@ant-design/icons";
import { Card, Flex, Steps, Tag, Typography } from "antd";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { DestinationCurrency, SourceCurrency } from "../../atoms/MarketRate";

const MakePayment = (props: any) => {
    const {
        pfiDid,
        pfiName,
        offering,
        isLoading,
        userBearerDid,
        createExchange,
        relevantExchange,
        campaignAmount,
        isRequestQuote,
        offeringCreatedAt,
        setPaymentDetails,
        setActivateButton,
        requiredPaymentDetails: stateDetails,
        offeringToCurrencyMethods
    } = props

    const [quoteExpired, setQuoteExpired] = useState(false)
    const [requiredPaymentDetails, setRequiredPaymentDetails] = useState<any>({
        payin: {},
        payout: {}
    })

    console.log("🚀 <MakeTransfer /> 🚀", {
        requiredPaymentDetails,
        stateDetails
    })


    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const exchangeRate = offeringData?.payoutUnitsPerPayinUnit

    const quoteExpiration = relevantExchange?.quote?.expiresAt



    const deadline = new Date(relevantExchange?.quote?.expiresAt).valueOf()

    console.log('quoteExpiration!', {
        relevantExchange,
        quoteExpiration,
        quoteExpirationMs: deadline
    });

    // const deadline = Date.now() + 1000 * 60
    // 60 * 60 * 24 * 2 + 1000 * 30;

    const onQuoteExpired = () => {
        setQuoteExpired(true)
        // To Do: Add notification
        console.log('finished!');
    };

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

    return (
        <Flex className={`gap-2 flex-col ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
            {isRequestQuote ? (
                <Flex className="w-full items-center flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>Exchange Rate in Offering</Typography.Text>
                    {/* <Typography.Text style={{ fontSize: 12 }}>%05 Market Rate</Typography.Text> */}
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
                <Flex className="w-full justify-between mb-4 gap-4 mt-4">
                    <Flex className="w-full">
                        <Card className="w-full">
                            <PFIDetails
                                pfiDid={pfiDid}
                                pfiName={pfiName}
                                createdAt={offeringCreatedAt}
                                estimatedSettlementTime={getEstimatedSettlementTime(offeringToCurrencyMethods, true)}
                            />
                        </Card>
                    </Flex>
                    <Flex className="w-1/2 justify-end items-start">
                        <Tag color={quoteExpired ? 'red' : 'default'}>
                            <Flex className="gap-3">
                                <ClockCircleFilled />
                                <Flex className="flex-col">
                                    <Typography.Text style={{ fontSize: 11 }}>
                                        {quoteExpired ? 'Quote Expired:' : "Quote Expires:"}
                                    </Typography.Text>
                                    <Typography.Text style={{ fontSize: 11 }}>
                                        {formatDistanceToNow(new Date(relevantExchange?.quote?.expiresAt), { addSuffix: true })}
                                    </Typography.Text>
                                </Flex>
                                {/* <Countdown
                                    valueStyle={{
                                        fontSize: 11,
                                        marginTop: -6
                                    }}
                                    title={
                                        <Typography.Text style={{ fontSize: 11 }}>
                                            {quoteExpired ? 'Quote Expired' : "Quote Expires In"}
                                            {formatDistanceToNow(new Date(relevantExchange?.quote?.expiresAt), { addSuffix: true })}
                                        </Typography.Text>
                                    }
                                    value={deadline}
                                    format="YY:MM:DD"
                                    onFinish={onQuoteExpired}
                                /> */}
                            </Flex>
                        </Tag>
                    </Flex>
                </Flex>
            )}
            {
                isRequestQuote
                    ? <RequestForQuote
                        offering={offering}
                        campaignAmount={campaignAmount}
                        setRequiredPaymentDetails={setRequiredPaymentDetails}
                    />
                    : <MakeTransfer
                        offering={offering}
                        stateDetails={stateDetails}
                        campaignAmount={campaignAmount}
                        relevantExchange={relevantExchange}
                        requiredPaymentDetails={requiredPaymentDetails}
                    />}
        </Flex>
    )
}

export default MakePayment
