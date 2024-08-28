import { getCurrencyFlag } from "@/app/components/atoms/SearchOffersInput";
import { toCapitalizedWords } from "@/app/lib/utils";
import { RightCircleFilled } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, InputNumber, Space, Steps, Tag, theme, Typography, Statistic } from "antd";
import Image from "next/image";
import { useState } from "react";
import { LogoIcon2 } from "../../atoms/Icon";
import { DestinationCurrency, SourceCurrency } from "../../atoms/MarketRate";

const { Countdown } = Statistic


const RequestForQuote = (props: any) => {
    const [form] = Form.useForm();

    const { offering, campaignAmount } = props

    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const payinMethods = payin?.methods
    const payoutMethods = payout?.methods

    const fromCurrencyFlag = getCurrencyFlag(fromCurrency)
    const toCurrencyFlag = getCurrencyFlag(toCurrency)

    const [toValue, setToValue] = useState<number>(0)
    const [requiredPaymentDetails, setRequiredPaymentDetails] = useState<any>({
        payin: {},
        payout: {}
    })

    console.log("requiredPaymentDetails", requiredPaymentDetails)

    const {
        token: { colorPrimary, colorBgContainer },
    } = theme.useToken()

    const renderRequiredDetails = (details: any[], type: string) => {
        const isPayin = type === 'payin'
        const isPayout = type === 'payout'

        return (
            <Flex className="flex-col">
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
                                        // const prev = { payin: {}, payout: {} }
                                        // const prev = 
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
                                            // ...details
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


                    // console.log("Results", results)
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
    return (
        <Flex className="gap-1">
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
                                value={toValue}
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
    const { offering, campaignAmount } = props

    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const payinMethods = payin?.methods
    const payoutMethods = payout?.methods

    const fromCurrencyFlag = getCurrencyFlag(fromCurrency)
    const toCurrencyFlag = getCurrencyFlag(toCurrency)

    const {
        token: { colorPrimary, colorBgContainer },
    } = theme.useToken()
    return (
        <Flex className="border w-full gap-1">
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
                                defaultValue={campaignAmount}
                                onChange={(value) => {
                                    // @ts-ignore
                                    setToValue(value * exchangeRate)
                                }}
                            />
                        </Flex>
                    </Space.Compact>
                </Flex>
                <Flex className="w-full mt-2">
                    Payin Details
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
                    Payout Details
                </Flex>
            </Card>
        </Flex>
    )
}

const MakePayment = (props: any) => {
    const { offering, campaignAmount, isRequestQuote } = props

    const [quoteExpired, setQuoteExpired] = useState(false)


    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const exchangeRate = offeringData?.payoutUnitsPerPayinUnit

    const deadline = Date.now() + 1000 * 30
    // 60 * 60 * 24 * 2 + 1000 * 30;

    const onFinish = () => {
        setQuoteExpired(true)
        console.log('finished!');
    };

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
                <Flex className="w-full items-center flex-col mb-4">
                    <Tag color={quoteExpired ? 'red' : 'default'}>
                        <Countdown title={quoteExpired ? 'Quote Expired' : "Quote Expires In"} value={deadline} onFinish={onFinish} />
                    </Tag>
                </Flex>
            )}
            {
                isRequestQuote
                    ? <RequestForQuote
                        offering={offering}
                        campaignAmount={campaignAmount}
                    />
                    : <MakeTransfer
                        offering={offering}
                        campaignAmount={campaignAmount}
                    />}
        </Flex>
    )
}

export default MakePayment
