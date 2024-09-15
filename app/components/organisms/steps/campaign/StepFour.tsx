import MarketRate from "@/app/components/atoms/MarketRate";
import { SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import OfferingDetails from "@/app/components/molecules/cards/Offering";
import Transactions from "@/app/components/molecules/cards/Transaction";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import { Credentials } from "@/app/components/organisms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY, OFFERINGS_LOCAL_STORAGE_KEY, SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY, SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { getFormattedOfferings } from "@/app/lib/utils";
import { checkIfUserHasRequiredClaims, getUserBearerDid } from "@/app/lib/web5";
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider";
import { useNotificationContext } from "@/app/providers/NotificationProvider";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
import { useWeb5Context } from "@/app/providers/Web5Provider";
import { Card, Flex, Layout, List, theme, Typography } from "antd";
import { useEffect, useState } from "react";

const StepFour = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const [isLoading, setIsLoading] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [selectedCard, setSelectedCard] = useState('')
    // const [notifiedCompletion, setNotifiedCompletion] = useState(false)
    const [selectedOffering, setSelectedOffering] = useState<any>()
    const [offerings, setOfferings] = useState<any[]>([])
    const [transactions, setTransactions] = useState<any[]>([])

    const {
        credentials,
        monopolyMoney,
        createExchange,
        currentMarketRate,
        selectedCurrency,
        setCurrentMarketRate,
        unformattedOfferings,
        selectedDestinationCurrency,
        marketConversionApiQuotaExceeded,
    } = useTbdexContext()
    const { web5, userBearerDid } = useWeb5Context()

    const { notify } = useNotificationContext()

    const { campaignAmount, setCampaignAmount } = useCreateCampaignContext()

    const [localStorageData] = useBrowserStorage<CredentialStorage>(
        OFFERINGS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const [localStorageSpecialData] = useBrowserStorage<CredentialStorage>(
        SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    useEffect(() => {
        setIsLoading(true)

        const storedOfferings = localStorageData
            ? Object.values(localStorageData!)
            : []

        const storedSpecialOfferings = localStorageSpecialData
            ? Object.values(localStorageSpecialData!)
            : []

        const { direct } = getFormattedOfferings(
            storedOfferings,
            selectedCurrency as string,
            selectedDestinationCurrency as string
        )

        const { direct: specialDirect } = getFormattedOfferings(
            storedSpecialOfferings,
            selectedCurrency as string,
            selectedDestinationCurrency as string
        )

        const mergedResults = [...new Set(direct.concat(specialDirect))]

        const offeringsWithCredentialChecks: any[] = [];

        for (const offer of mergedResults) {
            const pfiDid = Object.keys(offer)[0];
            const offeringData = offer[pfiDid];

            const requiredClaims = offeringData?.requiredClaims;
            const requiredClaimsExist = checkIfUserHasRequiredClaims(
                existingCredentials,
                requiredClaims
            );

            offeringsWithCredentialChecks.push({
                [pfiDid]: {
                    ...offeringData,
                    requiredClaimsExist,
                },
            });
        }


        setOfferings(offeringsWithCredentialChecks) // Has v2.0 PFI offerings 
        // setOfferings(direct)
        setIsLoading(false)
    }, [selectedCurrency, selectedDestinationCurrency, localStorageData])

    const [localStorageCredentials] = useBrowserStorage<CredentialStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    // @ts-ignore
    const existingCreds = localStorageCredentials?.credentials ?? {}
    const existingCredentials = Object.values(existingCreds).flat()
    const hasCancelledTransactions = true

    useEffect(() => {
        if (isCancelled) {
            notify?.('error', {
                message: 'Transaction Cancelled!',
                description: 'Your transaction has been cancelled!'
            })
            // setIsCancelled(false)
            // getCloseMessageExchanges()
        }
    }, [isCancelled])

    useEffect(() => {
        if (isCompleted) {
            // End timer for the transfer
            localStorage?.setItem(SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY, JSON.stringify(new Date()))

            // To Do: Reset form and all relevant state
            notify?.('success', {
                message: 'Transaction Complete!',
                description: 'Your transaction has been completed succesfully!'
            })
            // setNotifiedCompletion(true)
            // setIsCompleted(false)
        }
    }, [isCompleted])


    const theBearerDid = userBearerDid
        ? userBearerDid
        : getUserBearerDid()

    const hasMadePayment = false

    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col">
            <Flex className="justify-between">
                <Credentials
                    isSelected={isSelected}
                    selectedCard={selectedCard}
                    setIsSelected={setIsSelected}
                    setSelectedCard={setSelectedCard}
                    credentials={existingCredentials}
                    stateCredentials={credentials}
                />
                <WalletBalance money={monopolyMoney} />
            </Flex>
            <Flex className="flex-row mt-4 gap-3 justify-between">
                {
                    !hasMadePayment ? (
                        <Card className="w-full">
                            <Flex className="items-center w-full">
                                <Flex className="flex-col">
                                    <Typography.Text style={{ fontSize: 11 }} className="mb-1 opacity-50">
                                        The campaign amount converted at market rate
                                    </Typography.Text>
                                    <SearchOffers
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading}
                                    />
                                </Flex>
                                {hasCancelledTransactions && (
                                    <Transactions exchanges={transactions} />
                                )}
                                <MarketRate
                                    source={selectedCurrency}
                                    currentMarketRate={currentMarketRate}
                                    destination={selectedDestinationCurrency}
                                    setCurrentMarketRate={setCurrentMarketRate}
                                    marketConversionApiQuotaExceeded={marketConversionApiQuotaExceeded}
                                />
                            </Flex>
                            <List
                                pagination={{ position: "bottom", align: "start", pageSize: 4 }}
                                loading={isLoading}
                                dataSource={offerings}
                                className="mt-4"
                                renderItem={(item, index) => {
                                    const isOnlyResult = offerings?.length === 1
                                    return (
                                        <OfferingDetails
                                            key={index}
                                            web5={web5}
                                            offering={item}
                                            money={monopolyMoney}
                                            isSelected={isSelected}
                                            isCompleted={isCompleted}
                                            isCancelled={isCancelled}
                                            selectedCard={selectedCard}
                                            isOnlyResult={isOnlyResult}
                                            userBearerDid={theBearerDid}
                                            stateCredentials={credentials}
                                            campaignAmount={campaignAmount}
                                            credentials={existingCredentials}
                                            selectedOffering={selectedOffering}
                                            currentMarketRate={currentMarketRate}
                                            unformattedOfferings={unformattedOfferings}

                                            setIsSelected={setIsSelected}
                                            setIsCompleted={setIsCompleted}
                                            setIsCancelled={setIsCancelled}
                                            createExchange={createExchange}
                                            setTransactions={setTransactions}
                                            setSelectedCard={setSelectedCard}
                                            setCampaignAmount={setCampaignAmount}
                                            setSelectedOffering={setSelectedOffering}
                                        />
                                    )
                                }}
                            />
                        </Card>
                    ) : <Card className="w-full">
                        <Flex className="items-center w-full">
                            <Flex className="flex-col">
                                <Typography.Text style={{ fontSize: 11 }} className="mb-1 opacity-50">
                                    The campaign amount has been made
                                </Typography.Text>
                                <Flex>Something Here</Flex>
                            </Flex>
                            <Flex>Something Here</Flex>
                        </Flex>
                        <Flex>
                            Has Made Payment View Campaign Stuff and Start CTA with Confetting and 3D stuff
                        </Flex>
                    </Card>
                }
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
