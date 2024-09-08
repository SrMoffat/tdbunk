import { Cancelled } from "@/app/components/atoms/Icon";
import MarketRate from "@/app/components/atoms/MarketRate";
import { SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import OfferingDetails from "@/app/components/molecules/cards/Offering";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import { Credentials } from "@/app/components/organisms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY, OFFERINGS_LOCAL_STORAGE_KEY, SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY, SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { getAllPfiExchanges } from "@/app/lib/tbdex";
import { getFormattedOfferings } from "@/app/lib/utils";
import { checkIfUserHasRequiredClaims } from "@/app/lib/web5";
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider";
import { useNotificationContext } from "@/app/providers/NotificationProvider";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
import { useWeb5Context } from "@/app/providers/Web5Provider";
import { Avatar, Badge, Button, Card, Flex, Layout, List, Modal, theme, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

const CancelledTransactions = (props: any) => {
    const {
        userBearerDid
    } = props
    const {
        token: { colorPrimary }
    } = theme.useToken()
    const [showModal, setShowModal] = useState(false)

    const handleCancel = () => {
        setShowModal(false)
    }

    const handleViewCancelTransactions = () => {
        setShowModal(true)
    }

    return (
        <Flex className="w-full ml-4">
            <Modal
                width={800}
                open={showModal}
                title="Cancelled Transactions"
                footer={[
                    <Button danger key="back" onClick={handleCancel}>
                        Close
                    </Button>
                ]}
            >
                Cancelled Transactions Here
            </Modal>
            <Flex className="items-center gap-1">
                <Button className="pl-0" onClick={handleViewCancelTransactions}>
                    <Badge count={2} style={{ color: "white" }}>
                        <Avatar shape='square' style={{ backgroundColor: colorPrimary, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} icon={<Image src={Cancelled} alt="factChecker" width={50} height={50} />} />
                    </Badge>
                    <Typography.Text className="ml-1 text-xs">View Cancelled Transactions</Typography.Text>
                </Button>
            </Flex>
        </Flex>
    )
}


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

    const {
        credentials,
        monopolyMoney,
        createExchange,
        selectedCurrency,
        unformattedOfferings,
        selectedDestinationCurrency,
    } = useTbdexContext()
    const { web5, userBearerDid } = useWeb5Context()

    const { notify } = useNotificationContext()

    const { campaignAmount } = useCreateCampaignContext()

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

    // console.log("Bearere DID <StepFour />", {
    //     userBearerDid,
    //     isSelected,
    //     selectedCard,
    //     existingCredentials,
    //     credentials
    // })

    const hasCancelledTransactions = true


    useEffect(() => {
        const getCloseMessageExchanges = async () => {
            try {
                if (userBearerDid) {
                    const exchangesResults = await getAllPfiExchanges(userBearerDid)
                    console.log("Fetch Cancelled Transactions", exchangesResults)
                    return exchangesResults
                } else {
                    console.log("Fetch Cancelled No Bearer")

                }
            } catch (error: any) {
                console.error("Fetch Cancelled Transactions Error", error)
            }
        }
        if (isCancelled) {
            notify?.('error', {
                message: 'Transaction Cancelled!',
                description: 'Your transaction has been cancelled!'
            })
            // setIsCancelled(false)
            getCloseMessageExchanges()
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
                <Card className="w-full">
                    <Flex className="items-center w-full">
                        <SearchOffers
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                        {hasCancelledTransactions && (
                            <CancelledTransactions userBearerDid={userBearerDid} />
                        )}
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
                        renderItem={(item, index) => <OfferingDetails
                            key={index}
                            web5={web5}
                            offering={item}
                            money={monopolyMoney}
                            isSelected={isSelected}
                            isCompleted={isCompleted}
                            isCancelled={isCancelled}
                            selectedCard={selectedCard}
                            userBearerDid={userBearerDid}
                            stateCredentials={credentials}
                            campaignAmount={campaignAmount}
                            credentials={existingCredentials}
                            selectedOffering={selectedOffering}
                            unformattedOfferings={unformattedOfferings}

                            setIsSelected={setIsSelected}
                            setIsCompleted={setIsCompleted}
                            setIsCancelled={setIsCancelled}
                            createExchange={createExchange}
                            setSelectedCard={setSelectedCard}
                            setSelectedOffering={setSelectedOffering}
                        />}
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
