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
import { Avatar, Card, Flex, Layout, List, Segmented, StepProps, Steps, theme, Typography, Space, Button, Tag } from "antd";
import MarketRate from "@/app/components/atoms/MarketRate";

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
                        <Avatar shape="square" style={{ backgroundColor: '#f56a00', width: 50, height: 50 }}>{pfiName.charAt(0).toUpperCase()}</Avatar>
                        <Flex className="flex-col">
                            <Typography.Title level={5}>
                                {pfiName}
                            </Typography.Title>
                            <Typography.Text style={{ fontSize: 12, marginTop: -2 }} copyable>
                                {`${pfiDid.slice(0, 14)}...${pfiDid.slice(-8)}`}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                    <Flex>

                        <Tag className="items-center" color="gold">
                            <Typography.Text>
                                <ClockCircleOutlined className="mr-1" />
                                {`${getEstimatedSettlementTime(offeringToCurrencyMethods, true)}s`}
                            </Typography.Text>
                        </Tag>
                    </Flex>
                </Flex>
                <Flex className="mt-3 flex-col">
                    <Flex className="gap-1">
                        <Typography.Text className="font-bold">
                            Offered:
                        </Typography.Text>
                        <Typography.Text>
                            {offeringCreatedTime}
                        </Typography.Text>
                    </Flex>
                    <Flex>
                        {renderPaymentMethods(offeringFromCurrencyMethods)}
                        {renderPaymentMethods(offeringToCurrencyMethods)}
                    </Flex>

                    <Flex className="border-[0.2px] rounded-md p-3 w-[250px] justify-between items-center">
                        <Flex className="flex-col gap-2">
                            <Typography.Text className="text-xs" style={{ fontSize: 11 }}>
                                Required Credentials:
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
                        {/* <Typography.Text className="font-bold">
                            Requires:
                        </Typography.Text>
                        <Flex>
                            
                            <Typography.Text className="mr-2">
                                from
                            </Typography.Text>
                            
                        </Flex> */}
                    </Flex>
                    {/* <Flex className="gap-1">
                        <Typography.Text className="font-bold">
                            Offer ID:
                        </Typography.Text>
                        <Tag className="items-center" >
                            {offeringId}
                        </Tag>
                    </Flex> */}
                </Flex>
                {/* 
                <Flex>
                    <Tag className="items-center" >
                        {offeringRequiredClaims?.["type[*]"]}
                    </Tag>
                    <Typography.Text copyable >
                        {offeringRequiredClaims?.issuer}
                    </Typography.Text>
                </Flex>
                <Flex>
                    {offeringToCurrencyMethods?.length} payment methods
                    {offeringFromCurrencyMethods?.length} payment methods
                </Flex>
               */}
            </Card>
            <Card className="w-1/2 justify-center flex min-h-[200px]">
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
                        // dataSource={offerings}
                        dataSource={[
                            {
                                "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y": {
                                    "id": "offering_01j5ntkh70egbb43nzbs4be2wq",
                                    "createdAt": "2024-08-19T17:22:53.793Z",
                                    "requiredClaims": {
                                        "type[*]": "KnownCustomerCredential",
                                        "issuer": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                                    },
                                    "pair": [
                                        {
                                            "currencyCode": "GHS",
                                            "unit": 1,
                                            "methods": [
                                                {
                                                    "kind": "GHS_BANK_TRANSFER"
                                                }
                                            ]
                                        },
                                        {
                                            "currencyCode": "USDC",
                                            "unit": 0.1,
                                            "methods": [
                                                {
                                                    "kind": "USDC_WALLET_ADDRESS",
                                                    "title": "USDC Required Payment Details",
                                                    "estimatedSettlementTime": 43200,
                                                    "paymentProperties": {
                                                        "address": {
                                                            "title": "USDC Wallet Address",
                                                            "description": "Wallet address to pay out USDC to",
                                                            "type": "string"
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]}

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
