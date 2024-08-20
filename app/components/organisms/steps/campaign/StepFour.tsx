import { getCurrencyFlag, SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import DebunkingCampaign from "@/app/components/molecules/description/DebunkCampaign";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import DebunkSubject from "@/app/components/molecules/description/DebunkSubject";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import { Credentials } from "@/app/components/organisms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { OFFERINGS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
import { RightCircleFilled, UserOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import { Avatar, Card, Flex, Layout, List, Segmented, StepProps, Steps, theme, Typography, Space, Button, Tag } from "antd";
import MarketRate from "@/app/components/atoms/MarketRate";

const StepFour = () => {
    const {
        token: { colorBgContainer, colorPrimary },
    } = theme.useToken()

    const { selectedCurrency, selectedDestinationCurrency, monopolyMoney } = useTbdexContext()


    const [localStorageData] = useBrowserStorage<CredentialStorage>(
        OFFERINGS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const getFormattedOfferings = (offerings: any) => {
        for (const offer of offerings) {
            const offering = Object.values(offer!)[0] as any
            const [sourceCurrency, destinationCurrency] = offering?.pair
            const sourceCurrencyCode = sourceCurrency?.currencyCode
            const destinationCurrencyCode = destinationCurrency?.currencyCode

            const sourceMatches = selectedCurrency === sourceCurrencyCode
            const destinationMatches = selectedDestinationCurrency === destinationCurrencyCode
            const isHit = sourceMatches && destinationMatches

            if (isHit) {
                console.log("isHit ===>", offering?.pair)
            } else {
                // console.log("isMiss", [sourceCurrencyCode, destinationCurrencyCode])
                // console.log("isMiss", offering?.pair)
            }
        }
    }

    const storedOfferings = localStorageData
        ? Object.values(localStorageData!)
        : []

    getFormattedOfferings(storedOfferings)


    const renderPaymentMethods = (methods: any[]) => {
        const renderPropertyNames = (names: any[]) => {
            return (
                <Flex>
                    {names.map(name => <Tag>{name}</Tag>)}
                </Flex>
            )
        }

        return (
            <Flex>
                {methods.map(entry => {
                    const kind = entry.kind
                    const title = entry.title
                    const estimatedSettlementTime = entry.estimatedSettlementTime
                    const paymentProperties = entry.paymentProperties

                    const paymentPropertyNames = paymentProperties ? Object.keys(paymentProperties) : []
                    return (
                        <Flex>
                            {kind}
                            {title}
                            {estimatedSettlementTime}
                            {renderPropertyNames(paymentPropertyNames)}
                        </Flex>
                    )
                })}
            </Flex>
        )
    }

    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col">
            <Flex className="justify-between">
                <Credentials />
                <WalletBalance money={monopolyMoney} />
            </Flex>
            <Flex className="flex-row mt-4 gap-3 justify-between">
                <Card className="w-full">
                    <Flex className="items-center w-full">
                        <SearchOffers />
                        <MarketRate
                            source={selectedCurrency}
                            destination={selectedDestinationCurrency}
                        />
                    </Flex>
                    {/* <List
                        pagination={{ position: "bottom", align: "start", pageSize: 4 }}
                        loading={!data?.length}
                        dataSource={data}
                        className="mt-4"
                        renderItem={(item, index) => {
                            const values = Object.values(item ? item : {})[0] as any
                            const offeringId = values?.id
                            const offeringCreatedAt = values?.createdAt
                            const offeringRequiredClaims = values?.requiredClaims
                            const offeringFromCurrency = values?.pair[0]
                            const offeringToCurrency = values?.pair[1]

                            const offeringFromCurrencyMethods = offeringFromCurrency?.methods
                            const offeringToCurrencyMethods = offeringToCurrency?.methods

                            const formattedDistance = formatDistanceToNow(new Date(offeringCreatedAt), { addSuffix: true });
                            return (
                                <List.Item className="flex flex-row gap-2">
                                    <Card className="w-full">
                                        <Tag className="items-center">
                                            <Typography.Text copyable>
                                                {offeringId}
                                            </Typography.Text>
                                        </Tag>
                                        <Tag className="items-center">
                                            <Typography.Text>
                                                {formattedDistance}
                                            </Typography.Text>
                                        </Tag>
                                        <Flex>
                                            <Tag className="items-center">
                                                {offeringRequiredClaims?.["type[*]"]}
                                            </Tag>
                                            <Typography.Text copyable>
                                                {offeringRequiredClaims?.issuer}
                                            </Typography.Text>
                                        </Flex>
                                        <Flex>
                                            {offeringToCurrencyMethods?.length} payment methods
                                            {offeringFromCurrencyMethods?.length} payment methods
                                        </Flex>
                                        <Flex>
                                            {renderPaymentMethods(offeringFromCurrencyMethods)}
                                            {renderPaymentMethods(offeringToCurrencyMethods)}
                                        </Flex>
                                    </Card>
                                    <Card className="w-1/2 justify-center flex">
                                        <Space.Compact>
                                            <Button className="h-[70px] w-[80px]" disabled>
                                                <Flex className="flex flex-col justify-center items-center">
                                                    <Flex className="text-white">
                                                        {offeringFromCurrency?.currencyCode}
                                                        {' '}
                                                        {getCurrencyFlag(offeringFromCurrency?.currencyCode)}
                                                    </Flex>
                                                    <Flex className="-mt-1 text-xs text-white">{`${offeringFromCurrency?.unit}.0`}</Flex>
                                                </Flex>
                                            </Button>
                                            <Button className="h-[70px] w-[50px]">
                                                <RightCircleFilled style={{ color: colorPrimary }} />
                                            </Button>
                                            <Button className="h-[70px] w-[80px]" disabled>
                                                <Flex className="flex flex-col justify-center items-center">
                                                    <Flex className="text-white">
                                                        {offeringToCurrency?.currencyCode}
                                                        {' '}
                                                        {getCurrencyFlag(offeringToCurrency?.currencyCode)}
                                                    </Flex>
                                                    <Flex className="-mt-1 text-xs text-white">{offeringToCurrency?.unit}</Flex>
                                                </Flex>
                                            </Button>
                                        </Space.Compact>
                                    </Card>
                                </List.Item>
                            )
                        }}
                    /> */}
                </Card>
                <Flex className="w-1/4 flex flex-row">
                    <Flex className="w-full">
                        <DebunkCampaignStats isFull />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    </Layout>
}

export default StepFour;
