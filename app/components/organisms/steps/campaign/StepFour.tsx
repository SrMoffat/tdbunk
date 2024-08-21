import { getCurrencyFlag, SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import DebunkingCampaign from "@/app/components/molecules/description/DebunkCampaign";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import DebunkSubject from "@/app/components/molecules/description/DebunkSubject";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import { Credentials } from "@/app/components/organisms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { OFFERINGS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY, PFIs } from "@/app/lib/constants";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
import { RightCircleFilled, ClockCircleOutlined, CheckCircleFilled, InfoCircleFilled } from "@ant-design/icons";
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import { Avatar, Card, Flex, Layout, List, Segmented, StepProps, Steps, theme, Typography, Space, Button, Tag, Rate } from "antd";
import MarketRate from "@/app/components/atoms/MarketRate";

const toCapitalizedWords = (str: string) => {
    // Replace any camelCase with space-separated words and snake_case with space-separated words
    const spacedString = str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');

    // Capitalize the first letter of each word
    const capitalizedWords = spacedString.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });

    return capitalizedWords;
}

const getFormattedOfferings = (offerings: any[], source: string, destination: string) => {
    let direct = []
    let hops = []

    for (const offer of offerings) {
        const offering = Object.values(offer!)[0] as any

        const [sourceCurrency, destinationCurrency] = offering?.pair
        const sourceCurrencyCode = sourceCurrency?.currencyCode
        const destinationCurrencyCode = destinationCurrency?.currencyCode
        const sourceMatches = source === sourceCurrencyCode
        const destinationMatches = destination === destinationCurrencyCode
        const isHit = sourceMatches && destinationMatches

        if (isHit) {
            console.log("HIT ===>")
            direct.push(offer)
        } else {
            console.log("NOT-HIT ===>")
            hops.push(offering)
        }
    }

    return {
        direct,
        hops
    }
}

const renderPaymentMethods = (methods: any[]) => {
    const renderPropertyNames = (names: any[]) => {
        return (
            <Flex>
                {names.map(name => <Tag>{toCapitalizedWords(name)}</Tag>)}
            </Flex>
        )
    }

    return (
        <Flex>
            {methods.map(entry => {
                const kind = entry.kind
                const paymentProperties = entry.paymentProperties

                const paymentPropertyNames = paymentProperties ? Object.keys(paymentProperties) : []
                return (
                    <Flex className="gap-2 w-full flex-col">
                        <Flex>
                            <Tag>{toCapitalizedWords(kind)}</Tag>
                        </Flex>
                        {renderPropertyNames(paymentPropertyNames)}
                    </Flex>
                )
            })}
        </Flex>
    )
}

const getEstimatedSettlementTime = (methods: any[], fastest: boolean) => {
    // Assumes time is in ms

    const estimates = new Set<number>()

    for (const method of methods) {
        const estimatedSettlementTime = method?.estimatedSettlementTime
        estimates.add(estimatedSettlementTime)
    }

    const slow = Math.max(...estimates)
    const fast = Math.min(...estimates)

    return fastest
        ? fast / 1000
        : Math.round((slow + fast) / 2) / 1000
}

const Offering = (props: any) => {
    const {
        token: { colorPrimary },
    } = theme.useToken()

    const { offering: values } = props

    const offering = Object.values(values ? values : {})[0] as any
    const pfiDid = Object.keys(values ? values : {})[0] as any

    const offeringId = offering?.id
    const offeringCreatedAt = offering?.createdAt
    const offeringRequiredClaims = offering?.requiredClaims
    const offeringFromCurrency = offering?.pair[0]
    const offeringToCurrency = offering?.pair[1]
    const offeringFromCurrencyMethods = offeringFromCurrency?.methods
    const offeringToCurrencyMethods = offeringToCurrency?.methods
    const offeringCreatedTime = formatDistanceToNow(new Date(offeringCreatedAt), { addSuffix: true });

    const pfiName = PFIs.filter(pfi => pfi?.did === pfiDid)[0]?.name

    const hasRequiredCredentials = true

    console.log("Offering", values)


    return (
        <List.Item className="flex flex-row gap-2">
            <Card className="w-full min-h-[200px]">
                <Flex className="items-center justify-between">
                    <Flex className="gap-3">
                        <Avatar shape="square" style={{ backgroundColor: '#f56a00', width: 60, height: 60 }}>{pfiName.charAt(0).toUpperCase()}</Avatar>
                        <Flex className="flex-col">
                            <Typography.Title level={5} style={{ marginTop: -4 }}>
                                {pfiName}
                            </Typography.Title>
                            <Typography.Text style={{ fontSize: 12, marginTop: -4 }} copyable>
                                {`${pfiDid.slice(0, 14)}...${pfiDid.slice(-8)}`}
                            </Typography.Text>
                            <Flex className="gap-1">
                                <Typography.Text className="font-bold text-xs">
                                    Offered:
                                </Typography.Text>
                                <Typography.Text className="text-xs">
                                    {offeringCreatedTime}
                                </Typography.Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex className="flex-col gap-2">
                        <Tag className="items-center">
                            <Rate style={{ fontSize: 11 }} disabled allowHalf defaultValue={2.5} />
                        </Tag>
                        <Flex className="justify-end">
                            <Tag className="items-center" color="gold">
                                <Typography.Text>
                                    <ClockCircleOutlined className="mr-1" />
                                    {`${getEstimatedSettlementTime(offeringToCurrencyMethods, true)}s`}
                                </Typography.Text>
                            </Tag>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex className="mt-3 justify-between">
                    <Flex className="flex-col w-full items-start justify-end">
                        <Flex>
                            <Button type="primary">Start Payment</Button>
                        </Flex>
                    </Flex>
                    <Flex className="w-full justify-end items-end">
                        <Space.Compact>
                            <Button className="h-[70px] w-[80px]" disabled>
                                <Flex className="flex flex-col justify-center items-center">
                                    <Flex className="text-white" >
                                        {offeringFromCurrency?.currencyCode}
                                        {' '}
                                        {getCurrencyFlag(offeringFromCurrency?.currencyCode)}
                                    </Flex>
                                    < Flex className="-mt-1 text-xs text-white" > {`${offeringFromCurrency?.unit}.0`}</Flex>
                                </Flex>
                            </Button>
                            <Button className="h-[70px] w-[50px]">
                                <RightCircleFilled style={{ color: colorPrimary }} />
                            </Button>
                            <Button className="h-[70px] w-[80px]" disabled >
                                <Flex className="flex flex-col justify-center items-center">
                                    <Flex className="text-white" >
                                        {offeringToCurrency?.currencyCode}
                                        {' '}
                                        {getCurrencyFlag(offeringToCurrency?.currencyCode)}
                                    </Flex>
                                    <Flex className="-mt-1 text-xs text-white" > {offeringToCurrency?.unit} </Flex>
                                </Flex>
                            </Button>
                        </Space.Compact>
                    </Flex>
                </Flex>
            </Card>
            <Card className="w-full min-h-[200px]">
                <Flex className="w-full gap-2">
                    <Typography.Text className="font-bold">
                        Offer ID:
                    </Typography.Text>
                    <Tag className="items-center" >
                        {offeringId}
                    </Tag>
                </Flex>

                <Flex className="gap-1">
                    <Flex className="mt-4 border-[0.3px] border-gray-800 rounded-md p-3 w-[250px] justify-between items-center">
                        <Flex className="flex-col gap-2">
                            <Typography.Text className="text-xs" style={{ fontSize: 11 }}>
                                Required Credential and Issuer:
                            </Typography.Text>
                            <Flex>
                                <Tag className="items-center text-xs" color={hasRequiredCredentials ? 'green' : 'default'}>
                                    {offeringRequiredClaims?.["type[*]"]}
                                </Tag>
                            </Flex>
                            <Flex>
                                <Tag>
                                    <Typography.Text copyable>
                                        {`${offeringRequiredClaims?.issuer.slice(0, 14)}...${offeringRequiredClaims?.issuer.slice(-6)}`}
                                    </Typography.Text>
                                </Tag>
                            </Flex>
                        </Flex>
                        <Flex className="items-center">
                            {
                                hasRequiredCredentials
                                    ? <CheckCircleFilled style={{ color: "#6abe39" }} />
                                    : <InfoCircleFilled color="gray" />
                            }
                        </Flex>
                    </Flex>
                    <Flex className="mt-4 border-[0.3px] border-gray-800 rounded-md p-3 w-[250px] justify-between flex-col">
                        <Typography.Text className="text-xs" style={{ fontSize: 11 }}>
                            Required Recipient Payment Details:
                        </Typography.Text>
                        {/* <Flex className="flex-col w-full">
                            {renderPaymentMethods(offeringFromCurrencyMethods)}
                        </Flex> */}
                        <Flex className="flex-col w-full">
                            {renderPaymentMethods(offeringToCurrencyMethods)}
                        </Flex>
                    </Flex>
                </Flex>
            </Card>
        </List.Item>

    )
}

const StepFour = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const [isLoading, setIsLoading] = useState(false)
    const [offerings, setOfferings] = useState<any[]>([])

    const { selectedCurrency, selectedDestinationCurrency, monopolyMoney } = useTbdexContext()


    const [localStorageData] = useBrowserStorage<CredentialStorage>(
        OFFERINGS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    useEffect(() => {
        setIsLoading(true)

        const storedOfferings = localStorageData
            ? Object.values(localStorageData!)
            : []

        const { direct } = getFormattedOfferings(
            storedOfferings,
            selectedCurrency as string,
            selectedDestinationCurrency as string
        )

        console.log("Final Step", {
            // selectedDestinationCurrency,
            // selectedCurrency,
            // storedOfferings,
            direct
        })

        setOfferings(direct)
        setIsLoading(false)
    }, [selectedCurrency, selectedDestinationCurrency, localStorageData])

    console.log("offerings ==>", offerings)

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
                    <List
                        pagination={{ position: "bottom", align: "start", pageSize: 4 }}
                        loading={isLoading}
                        dataSource={offerings}
                        className="mt-4"
                        renderItem={(item, index) => <Offering key={index} offering={item} />}
                    />
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
