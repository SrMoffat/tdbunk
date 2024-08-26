import MarketRate from "@/app/components/atoms/MarketRate";
import { SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import OfferingDetails from "@/app/components/molecules/cards/Offering";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import { Credentials } from "@/app/components/organisms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY, OFFERINGS_LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { getFormattedOfferings } from "@/app/lib/utils";
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
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

    // const {getBearerDid} = useWeb5Context()

    const {
        monopolyMoney,
        createExchange,
        selectedCurrency,
        unformattedOfferings,
        selectedDestinationCurrency,
    } = useTbdexContext()

    const {campaignAmount} = useCreateCampaignContext()

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

    const [localStorageCredentials] = useBrowserStorage<CredentialStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    // @ts-ignore
    const existingCreds = localStorageCredentials?.credentials ?? {}
    const existingCredentials = Object.values(existingCreds).flat()

    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col">
            <Flex className="justify-between">
                <Credentials
                    isSelected={isSelected}
                    selectedCard={selectedCard}
                    setIsSelected={setIsSelected}
                    setSelectedCard={setSelectedCard}
                    credentials={existingCredentials}
                />
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
                        renderItem={(item, index) => <OfferingDetails
                            key={index}
                            offering={item}
                            isSelected={isSelected}
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
