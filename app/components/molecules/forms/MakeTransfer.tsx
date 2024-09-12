import { LogoIcon2 } from "@/app/components/atoms/Icon";
import { TDBUNK_PLATFORM_FEE_STRATEGY } from "@/app/lib/constants";
import { getCurrencyFlag, toCapitalizedWords } from "@/app/lib/utils";
import { RightCircleFilled } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, InputNumber, Space, Statistic, StatisticProps, Tag, theme, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";
import CountUp from "react-countup";

const MakeTransfer = (props: any) => {
    const { offering, campaignAmount, requiredPaymentDetails, feeDetails, monopolyMoney } = props

    const offeringData = offering?.data

    const payin = offeringData?.payin
    const payout = offeringData?.payout

    const fromCurrency = payin?.currencyCode
    const toCurrency = payout?.currencyCode

    const exchangeRate = offeringData?.payoutUnitsPerPayinUnit

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
                                style={{ width: "100%", color: "white" }}
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

    console.log("received values ==>", {
        feeDetails,
        requiredPaymentDetails
    })

    const payinFee = payin?.fee
    const payoutFee = payout?.fee

    const payinCode = payin?.currencyCode

    const currencyCode = feeDetails?.currencyCode
    const totalFee = Number(feeDetails?.totalFee)?.toFixed(2)
    const overallFee = payinFee
        ? Number(payinFee + totalFee).toFixed(2)
        : Number(totalFee).toFixed(2)

    const transactionFee = `${payinCode} ${payinFee}`
    const platformFee = `${currencyCode} ${totalFee}`
    const allFee = `${currencyCode} ${overallFee}`

    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );

    return (
        <Flex className="w-full gap-4 flex-col">
            <Button style={{ width: 140 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
                {passwordVisible ? 'Hide Details' : 'Show Details'}
            </Button>
            <Flex className="w-full gap-3">
                <Card className="w-full">
                    {
                        payinFee && (
                            <Flex className="w-full mb-3 justify-end">
                                <Tag>
                                    {`${requiredPaymentDetails?.payin?.currencyCode} ${payinFee}`}
                                </Tag>
                            </Flex>
                        )
                    }
                    <Flex className="w-full">
                        <Space.Compact block className="w-full">
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
                                    style={{ width: '100%', color: 'white' }}
                                    defaultValue={Math.floor(campaignAmount / exchangeRate)}
                                    value={Math.floor(campaignAmount / exchangeRate)}
                                />
                            </Flex>
                        </Space.Compact>
                    </Flex>
                    <Flex className="w-full mt-2">
                        {
                            Object.keys(requiredPaymentDetails?.payin).length
                                ? renderPaymentMethods(requiredPaymentDetails?.payin)
                                : <Card className="mt-3">
                                    <Flex className="gap-5">
                                        <Image src={LogoIcon2} width={60} height={60} alt="TDBunk" />
                                        <Flex className="flex-col">
                                            <Statistic
                                                prefix={monopolyMoney?.currency}
                                                title="Wallet Balance"
                                                value={monopolyMoney?.amount}
                                                precision={2}
                                                formatter={formatter}
                                                valueStyle={{ color: colorPrimary, fontSize: 18, fontWeight: "bold" }}
                                            />
                                            {/**
                                             * To Do: Since we are assuming the user of wallet balance here
                                             *         we should also check for insufficient balance and send
                                             *         Close message
                                             */}
                                        </Flex>
                                    </Flex>
                                </Card>
                        }
                    </Flex>
                </Card>
                <Flex>
                    <RightCircleFilled style={{ color: colorPrimary }} />
                </Flex>
                <Card className="w-full">
                    {
                        payoutFee && (
                            <Flex className="w-full mb-3 justify-end">
                                <Tag>
                                    {`${requiredPaymentDetails?.payout?.currencyCode} ${payoutFee}`}
                                </Tag>
                            </Flex>
                        )
                    }
                    <Flex className="w-full">
                        <Space.Compact block className="w-full">
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
                                    value={campaignAmount}
                                    defaultValue={campaignAmount}
                                />
                            </Flex>
                        </Space.Compact>
                    </Flex>
                    <Flex className="w-full mt-2">
                        {renderPaymentMethods(requiredPaymentDetails?.payout)}
                    </Flex>
                </Card>
            </Flex>
            <Card className="mb-2">
                <Flex className="w-full items-end flex-col">
                    {payinFee && (
                        <Flex className=" gap-3">
                            <Typography.Text className="text-bold">Transaction Fee:</Typography.Text>
                            <Typography.Text>{transactionFee}</Typography.Text>
                        </Flex>
                    )}
                    {totalFee && (
                        <Flex className="gap-3">
                            <Flex className="flex-col">
                                <Typography.Text className="text-bold text-xs">Platform Fee:</Typography.Text>
                                <Typography.Text style={{ fontSize: 10 }} className="opacity-40">{TDBUNK_PLATFORM_FEE_STRATEGY.displayText}</Typography.Text>
                            </Flex>
                            <Typography.Text className="text-xs">{platformFee}</Typography.Text>
                        </Flex>
                    )}
                    {overallFee && (
                        <Flex className="gap-3 mt-2">
                            <Typography.Text className="text-bold">Total Fee:</Typography.Text>
                            <Typography.Text>{allFee}</Typography.Text>
                        </Flex>
                    )}
                </Flex>
            </Card>
        </Flex>
    )
}

export default MakeTransfer
