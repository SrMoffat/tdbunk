import { getCurrencyFlag, toCapitalizedWords } from "@/app/lib/utils";
import { RightCircleFilled } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, InputNumber, Space, theme, Typography } from "antd";
import { useState } from "react";

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

export default MakeTransfer
