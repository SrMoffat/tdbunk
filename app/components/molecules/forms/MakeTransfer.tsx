import { getCurrencyFlag, toCapitalizedWords } from "@/app/lib/utils";
import { RightCircleFilled } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, InputNumber, Space, theme, Typography } from "antd";
import { useState } from "react";

const MakeTransfer = (props: any) => {
    const { offering, campaignAmount, requiredPaymentDetails, feeDetails } = props

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
        feeDetails
    })

    return (
        <Flex className="w-full gap-4 flex-col">
            <Button style={{ width: 140 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
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
                                    style={{ width: '100%', color: 'white' }}
                                    value={campaignAmount}
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
                                    style={{ width: '100%', color: 'white' }}
                                    value={exchangeRate * campaignAmount}
                                    defaultValue={exchangeRate * campaignAmount}
                                />
                            </Flex>
                        </Space.Compact>
                    </Flex>
                    <Flex className="w-full mt-2">
                        {renderPaymentMethods(requiredPaymentDetails?.payout)}
                    </Flex>
                </Card>
            </Flex>
            <Card>
                <Flex className="w-full items-end flex-col">
                    <Flex className=" gap-3">
                        <Typography.Text className="text-bold">Transaction Fee:</Typography.Text>
                        <Typography.Text>{`${feeDetails?.transactionFee}`}</Typography.Text>
                    </Flex>
                    <Flex className="gap-3">
                        <Typography.Text className="text-bold">Platform Fee:</Typography.Text>
                        <Typography.Text>{`${feeDetails?.platformFee}`}</Typography.Text>
                    </Flex>
                    <Flex className="gap-3">
                        <Typography.Text className="text-bold">Total Fee:</Typography.Text>
                        <Typography.Text>{`${feeDetails?.total}`}</Typography.Text>
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    )
}

export default MakeTransfer
