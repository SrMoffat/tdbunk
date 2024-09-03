import { getCurrencyFlag } from "@/app/components/atoms/SearchOffersInput";
import { getEstimatedSettlementTime, toCapitalizedWords } from "@/app/lib/utils";
import { RightCircleFilled, ClockCircleFilled } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, InputNumber, Space, Steps, Tag, theme, Typography, Statistic } from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LogoIcon2 } from "../../atoms/Icon";
import { DestinationCurrency, SourceCurrency } from "../../atoms/MarketRate";
import PFIDetails from "../../atoms/OfferPFI";

const { Countdown } = Statistic


const arraysEqual = (arr1: string | any[], arr2: string | any[]) => {
    // Check if lengths are the same
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Sort both arrays and compare each element
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }

    // If all elements match, the arrays are equal
    return true;
}

const RequestForQuote = (props: any) => {
    const [form] = Form.useForm();

    const { offering, campaignAmount, setRequiredPaymentDetails } = props

    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const payinMethods = payin?.methods
    const payoutMethods = payout?.methods

    const exchangeRate = offeringData?.payoutUnitsPerPayinUnit

    const fromCurrencyFlag = getCurrencyFlag(fromCurrency)
    const toCurrencyFlag = getCurrencyFlag(toCurrency)

    const [toValue, setToValue] = useState<number>(0)
    const [convertedToValue, setConvertedToValue] = useState<number>(campaignAmount * exchangeRate)


    const {
        token: { colorPrimary, colorBgContainer },
    } = theme.useToken()

    const renderRequiredDetails = (details: any[], type: string) => {
        return (
            <Flex className="flex-col w-full">
                {
                    details.map((entry: any) => {
                        const {
                            name,
                            label,
                            title,
                            description,
                        } = entry
                        return (
                            <Form.Item
                                key={name}
                                required
                                label={label}
                                className="w-full"
                                tooltip={description}
                                style={{ width: '100%' }}
                                extra={<Typography.Text style={{ fontSize: 11 }} className="mt-1 opacity-50">
                                    {description}
                                </Typography.Text>}
                            >
                                <Input.Password
                                    onChange={event => {
                                        const details = {
                                            [name]: event?.target?.value
                                        }
                                        console.log("Dynamic Value", details)
                                        setRequiredPaymentDetails((prev: any) => ({
                                            ...prev,
                                            ...{
                                                [type]: {
                                                    ...prev[type],
                                                    ...details
                                                }
                                            }
                                        }))
                                    }}
                                    style={{ width: '100%' }} name={name} placeholder={title} />
                            </Form.Item>
                        )
                    })
                }
            </Flex>
        )
    }

    const getRequiredDetails = (entry: any) => {
        const requiredPaymentDetails = entry.requiredPaymentDetails
        const requiredPaymentDetailsProperties = requiredPaymentDetails.properties
        const required = requiredPaymentDetails.required

        const results = []

        if (required?.length) {
            for (const require of required) {
                const details = requiredPaymentDetailsProperties[require]

                const combinedDetails = {
                    name: require,
                    label: toCapitalizedWords(require),
                    title: details?.title,
                    description: details?.description,
                }
                results.push(combinedDetails)
            }
        }

        return results
    }

    const renderPaymentMethods = (methods: any, type: string) => {
        return (
            <Flex className="w-full">
                {methods.map((entry: any) => {
                    const kind = entry.kind
                    const requiredPaymentDetails = entry.requiredPaymentDetails
                    const requiredPaymentDetailsTitle = requiredPaymentDetails.title

                    const results = getRequiredDetails(entry)

                    const isAssumedStoredBalance = !requiredPaymentDetailsTitle && !results.length
                    return (
                        <Flex key={entry?.kind} className="flex-col">
                            <Flex className="flex-col">
                                <Flex className="my-2">
                                    <Tag className="text-xs">
                                        {toCapitalizedWords(kind)}
                                    </Tag>
                                </Flex>
                                <Flex>
                                    <Typography.Text className="opacity-50 ml-2 -mt-1" style={{ fontSize: 11 }}>
                                        {requiredPaymentDetailsTitle}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                            <Flex className="mt-2 w-full">
                                {
                                    isAssumedStoredBalance
                                        ? <Card className="w-full">
                                            <Flex className="gap-5">
                                                <Image src={LogoIcon2} width={60} height={60} alt="TDBunk" />
                                                <Flex className="flex-col">
                                                    <Flex>TDBunk Wallet</Flex>
                                                    <Flex>Wallet Balance</Flex>
                                                    <Flex>Wallet Balance</Flex>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                        : <Form
                                            form={form}
                                            layout="vertical"
                                            style={{ width: '100%' }}
                                        >
                                            {renderRequiredDetails(results, type)}
                                        </Form>
                                }
                            </Flex>
                        </Flex>
                    )
                })}
            </Flex>
        )
    }

    useEffect(() => {
        console.log("Handle set converted to Value", {
            amount: campaignAmount,
            converted: campaignAmount * exchangeRate
        })

        setConvertedToValue(campaignAmount * exchangeRate)
    }, [])
    return (
        <Flex className="gap-3">
            <Card className="w-full">
                <Flex className="w-full">
                    <Space.Compact block>
                        <Flex className="flex-col">
                            <Typography.Text className="font-bold">
                                You Send
                            </Typography.Text>
                            <Button disabled>
                                <Flex className="text-white">
                                    {fromCurrency}
                                    {' '}
                                    {fromCurrencyFlag}
                                </Flex>
                            </Button>
                        </Flex>

                        <Flex className="flex-col">
                            <Typography.Text className="font-bold " style={{ color: colorBgContainer }}>.</Typography.Text>
                            <InputNumber
                                style={{ width: '100%' }}
                                defaultValue={campaignAmount}
                                onChange={(value) => {
                                    // @ts-ignore
                                    setToValue(value * exchangeRate)
                                    setConvertedToValue(value * exchangeRate)
                                }}
                            />
                        </Flex>
                    </Space.Compact>
                </Flex>
                <Flex className="w-full mt-2">
                    {renderPaymentMethods(payinMethods, 'payin')}
                </Flex>
            </Card>
            <Flex>
                <RightCircleFilled style={{ color: colorPrimary }} />
            </Flex>
            <Card className=" w-full">
                <Flex className="w-full">
                    <Space.Compact block>
                        <Flex className="flex-col">
                            <Typography.Text className="font-bold">
                                They Receive
                            </Typography.Text>
                            <Button disabled>
                                <Flex className="text-white">
                                    {toCurrency}
                                    {' '}
                                    {toCurrencyFlag}
                                </Flex>
                            </Button>
                        </Flex>

                        <Flex className="flex-col">
                            <Typography.Text className="font-bold " style={{ color: colorBgContainer }}>.</Typography.Text>
                            <InputNumber
                                disabled
                                style={{ width: '100%', color: '#ffffff' }}
                                defaultValue={convertedToValue}
                                value={convertedToValue ? convertedToValue : toValue}
                            />
                        </Flex>
                    </Space.Compact>
                </Flex>
                <Flex className="w-full mt-2">
                    {renderPaymentMethods(payoutMethods, 'payout')}
                </Flex>
            </Card>
        </Flex>
    )
}

const MakeTransfer = (props: any) => {
    const { offering, campaignAmount, requiredPaymentDetails, relevantExchange } = props

    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const payinMethods = payin?.methods
    const payoutMethods = payout?.methods

    const fromCurrencyFlag = getCurrencyFlag(fromCurrency)
    const toCurrencyFlag = getCurrencyFlag(toCurrency)

    const [passwordVisible, setPasswordVisible] = useState(false);

    const {
        token: { colorPrimary, colorBgContainer },
    } = theme.useToken()

    const renderFields = (details: any) => {
        const fields = Object.keys(details)
        return (
            <Flex className="flex-col">
                {fields.map((field: any) => {
                    return (
                        <Form.Item
                            key={field}
                            label={toCapitalizedWords(field)}
                            className="w-full"
                            style={{ width: "100%" }}
                        >
                            <Input.Password
                                style={{ width: "100%" }}
                                name={field}
                                disabled
                                defaultValue={details[field]}
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                            />
                        </Form.Item>
                    );
                })}
            </Flex>
        )
    }

    const renderPaymentMethods = (details: any) => {
        console.log("Details to render", details)
        return (
            <Form
                layout="vertical"
                style={{ width: '100%' }}
            >
                {renderFields(details)}
            </Form>
        )
    }

    console.log("received values ==>", requiredPaymentDetails)

    const { rfq, quote } = relevantExchange
    return (
        <Flex className="w-full gap-1 flex-col">
            <Button className="mb-3" style={{ width: 140 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
                {passwordVisible ? 'Hide Details' : 'Show Details'}
            </Button>

            <Flex className="w-full gap-3">
                <Card className="w-full">
                    <Flex className="w-full">
                        <Space.Compact block>
                            <Flex className="flex-col">
                                <Typography.Text className="font-bold">
                                    You Send
                                </Typography.Text>
                                <Button disabled>
                                    <Flex className="text-white">
                                        {fromCurrency}
                                        {' '}
                                        {fromCurrencyFlag}
                                    </Flex>
                                </Button>
                            </Flex>

                            <Flex className="flex-col">
                                <Typography.Text className="font-bold " style={{ color: colorBgContainer }}>.</Typography.Text>
                                <InputNumber
                                    disabled
                                    style={{ width: '100%' }}
                                    value={quote?.fromAmountWithFee}
                                    defaultValue={campaignAmount}
                                />
                            </Flex>
                        </Space.Compact>
                    </Flex>
                    <Flex className="w-full mt-2">
                        {renderPaymentMethods(requiredPaymentDetails?.payin)}
                    </Flex>
                </Card>
                <Flex>
                    <RightCircleFilled style={{ color: colorPrimary }} />
                </Flex>
                <Card className="w-full">
                    <Flex className="w-full">
                        <Space.Compact block>
                            <Flex className="flex-col">
                                <Typography.Text className="font-bold">
                                    They Receive
                                </Typography.Text>
                                <Button disabled>
                                    <Flex className="text-white">
                                        {toCurrency}
                                        {' '}
                                        {toCurrencyFlag}
                                    </Flex>
                                </Button>
                            </Flex>

                            <Flex className="flex-col">
                                <Typography.Text className="font-bold " style={{ color: colorBgContainer }}>.</Typography.Text>
                                <InputNumber
                                    disabled
                                    style={{ width: '100%', color: '#ffffff' }}
                                // value={toValue}
                                />
                            </Flex>
                        </Space.Compact>
                    </Flex>
                    <Flex className="w-full mt-2">
                        {renderPaymentMethods(requiredPaymentDetails?.payout)}
                    </Flex>
                </Card>
            </Flex>
        </Flex>
    )
}

const MakePayment = (props: any) => {
    const {
        pfiDid,
        pfiName,
        offering,
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


    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const exchangeRate = offeringData?.payoutUnitsPerPayinUnit

    const quoteExpiration = relevantExchange?.quote?.expiresAt

 

    const deadline = new Date(relevantExchange?.quote?.expiresAt).getMilliseconds()

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
        <Flex className="gap-2 flex-col">
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
                                <Countdown
                                    valueStyle={{
                                        fontSize: 11,
                                        marginTop: -6
                                    }}
                                    title={
                                        <Typography.Text style={{ fontSize: 11 }}>
                                            {quoteExpired ? 'Quote Expired' : "Quote Expires In"}
                                        </Typography.Text>
                                    }
                                    value={deadline}
                                    onFinish={onQuoteExpired}
                                />
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
                        campaignAmount={campaignAmount}
                        relevantExchange={relevantExchange}
                        requiredPaymentDetails={requiredPaymentDetails || stateDetails}
                    />}
        </Flex>
    )
}

export default MakePayment
