import MarketRate from "@/app/components/atoms/MarketRate";
import { SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import OfferingDetails from "@/app/components/molecules/cards/Offering";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import { Credentials } from "@/app/components/organisms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY, OFFERINGS_LOCAL_STORAGE_KEY, SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { getFormattedOfferings } from "@/app/lib/utils";
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
import { useWeb5Context } from "@/app/providers/Web5Provider";
import { Card, Flex, Layout, List, theme } from "antd";
import { useEffect, useState } from "react";

const StepFour = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const [isLoading, setIsLoading] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedCard, setSelectedCard] = useState('')
    const [offerings, setOfferings] = useState<any[]>([])

    const {
        credentials,
        monopolyMoney,
        createExchange,
        selectedCurrency,
        unformattedOfferings,
        selectedDestinationCurrency,
    } = useTbdexContext()

    const { userBearerDid } = useWeb5Context()

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
        setOfferings(mergedResults) // Has v2.0 PFI offerings 
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

    console.log("Bearere DID <StepFour />", userBearerDid)

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
                            offering={item}
                            isSelected={isSelected}
                            stateCredentials={credentials}
                            userBearerDid={userBearerDid}
                            campaignAmount={campaignAmount}
                            credentials={existingCredentials}
                            unformattedOfferings={unformattedOfferings}

                            selectedCard={selectedCard}
                            setIsSelected={setIsSelected}
                            createExchange={createExchange}
                            setSelectedCard={setSelectedCard}
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
