import { LogoIcon2 } from "@/app/components/atoms/Icon";
import { getCurrencyFlag, toCapitalizedWords } from "@/app/lib/utils";
import { RightCircleFilled } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, InputNumber, Space, Statistic, StatisticProps, Tag, theme, Typography, } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const RequestForQuote = (props: any) => {
    const [form] = Form.useForm();

    const {
        money,
        offering,
        isLoading,
        campaignAmount,
        setCampaignAmount,
        setHasInsufficientBalance,
        setRequiredPaymentDetails,
    } = props

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
        token: { colorPrimary, colorBgContainer, colorError },
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

    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );

    const renderPaymentMethods = (methods: any, type: string, disabled: boolean, insufficientBalance: boolean) => {
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
                                        ? <Card className={`transition-all w-full ${insufficientBalance ? 'border border-red-400' : ''}`}>
                                            <Flex className="gap-5">
                                                <Image src={LogoIcon2} width={60} height={60} alt="TDBunk" />
                                                <Flex className="flex-col transition-all">
                                                    <Statistic
                                                        prefix={money?.currency}
                                                        title="Wallet Balance"
                                                        value={money?.amount}
                                                        precision={2}
                                                        formatter={formatter}
                                                        valueStyle={{ color: insufficientBalance ? colorError : colorPrimary, fontSize: 18, fontWeight: "bold" }}
                                                    />
                                                    {insufficientBalance && (
                                                        <Typography.Text style={{ fontSize: 10, color: colorError }}>Insufficient wallet balance.</Typography.Text>
                                                    )}
                                                </Flex>
                                            </Flex>
                                        </Card>
                                        : <Form
                                            form={form}
                                            disabled={disabled}
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
        setConvertedToValue(campaignAmount * exchangeRate)
    }, [])

    useEffect(() => {
        const rate = parseFloat(exchangeRate)
        const convertedResult = rate * toValue
        setConvertedToValue(convertedResult)
        // setCampaignAmount(convertedResult)
    }, [toValue])

    const insufficientBalance = Math.floor(campaignAmount / exchangeRate) > money?.amount

    useEffect(() => {
        payinMethods.forEach((entry: any) => {
            const requiredPaymentDetails = entry.requiredPaymentDetails
            const requiredPaymentDetailsTitle = requiredPaymentDetails.title

            const results = getRequiredDetails(entry)

            const isAssumedStoredBalance = !requiredPaymentDetailsTitle && !results.length

            if (isAssumedStoredBalance){
                setHasInsufficientBalance(insufficientBalance)
                return
            }
            return
        })
    }, [payinMethods, insufficientBalance])
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
                                defaultValue={Math.floor(campaignAmount / exchangeRate)}
                                onChange={(value) => {
                                    // @ts-ignore
                                    setToValue(value)
                                    setCampaignAmount(parseFloat(exchangeRate) * (value as number))
                                }}
                            />
                        </Flex>
                    </Space.Compact>
                </Flex>
                <Flex className="w-full mt-2">
                    {renderPaymentMethods(payinMethods, 'payin', isLoading, insufficientBalance)}
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
                                style={{ width: '100%', color: 'white' }}
                                defaultValue={Math.floor(campaignAmount / exchangeRate * exchangeRate)}
                                value={
                                    convertedToValue
                                        ? convertedToValue
                                        : Math.floor(campaignAmount / exchangeRate * exchangeRate)
                                }
                            />
                        </Flex>
                    </Space.Compact>
                </Flex>
                <Flex className="w-full mt-2">
                    {renderPaymentMethods(payoutMethods, 'payout', isLoading, false)}
                </Flex>
            </Card>
        </Flex>
    )
}

export default RequestForQuote
