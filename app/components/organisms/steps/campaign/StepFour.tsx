import MarketRate from "@/app/components/atoms/MarketRate";
import { SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import OfferingDetails from "@/app/components/molecules/cards/Offering";
import Transactions from "@/app/components/molecules/cards/Transaction";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import { Credentials } from "@/app/components/organisms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY, OFFERINGS_LOCAL_STORAGE_KEY, SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY, SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY, TBDEX_MESSAGE_TYPES } from "@/app/lib/constants";
import { getAllPfiExchanges } from "@/app/lib/tbdex";
import { getFormattedOfferings } from "@/app/lib/utils";
import { checkIfUserHasRequiredClaims, getUserBearerDid } from "@/app/lib/web5";
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider";
import { useNotificationContext } from "@/app/providers/NotificationProvider";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
import { useWeb5Context } from "@/app/providers/Web5Provider";
import { Card, Flex, Layout, List, theme, Typography } from "antd";
import { useEffect, useState } from "react";


const dummyExchanges = [
    {
        "metadata": {
            "from": "did:dht:e14pwefryxct64gzqj4hsydbrfi89yyb7zmfyjgrgfzutxrix6py",
            "to": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
            "protocol": "1.0",
            "kind": "rfq",
            "id": "rfq_01j719jpg6e6psqs0eje018xg7",
            "exchangeId": "rfq_01j719jpg6e6psqs0eje018xg7",
            "createdAt": "2024-09-05T14:31:55.655Z"
        },
        "data": {
            "offeringId": "offering_01j609945yeat8m92mzgc12nk0",
            "payin": {
                "amount": "18998",
                "kind": "USD_BANK_TRANSFER",
                "paymentDetailsHash": "VdRF-EVAMcapoai8HcjcApho8u8th7uVKVP4m97XZUY"
            },
            "payout": {
                "kind": "KES_BANK_TRANSFER",
                "paymentDetailsHash": "wBmJoEZXDUbE3cBpOxIgYAcq8WGSuQcG1lcxmD9ep7c"
            },
            "claimsHash": "iJwb-ID1TYCnakXIiRR7n-ga_l0ZUsjmaL4-KPR3x5E"
        },
        "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6ZTE0cHdlZnJ5eGN0NjRnenFqNGhzeWRicmZpODl5eWI3em1meWpncmdmenV0eHJpeDZweSMwIn0..LthGOobAX9GZoHSntzqevZUMHGczCFGGhd6hxWFUCH5jc7DKhi2FokTUxEL8upTF1tbIB14st9xspSrSAXZ8DQ",
        "privateData": {
            "salt": "42wLRFw2ccqpRZzL8FTmIQ",
            "payin": {
                "paymentDetails": {
                    "accountNumber": "767677677767676",
                    "routingNumber": "545545544545454554"
                }
            },
            "payout": {
                "paymentDetails": {
                    "accountNumber": "43443443434344433"
                }
            },
            "claims": [
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6Ymg4bWU2OGZzZGI2eHV5eTNkc2g0YWFuY3pleGdhM2szbTdmazRpZTZoajVqeTZpbnE1eSMwIn0.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vdzNpZC5vcmcvdmMvc3RhdHVzLWxpc3QvMjAyMS92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiS25vd25DdXN0b21lckNyZWRlbnRpYWwiXSwiaWQiOiJ1cm46dXVpZDo1MGQyN2UwNi03NGI4LTQ4ZmMtOWU3NC1jZTRjYjVkNWUzYzEiLCJpc3N1ZXIiOiJkaWQ6ZGh0OmJoOG1lNjhmc2RiNnh1eXkzZHNoNGFhbmN6ZXhnYTNrM203Zms0aWU2aGo1ank2aW5xNXkiLCJpc3N1YW5jZURhdGUiOiIyMDI0LTA5LTA1VDE0OjMwOjQxWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmRodDplMTRwd2Vmcnl4Y3Q2NGd6cWo0aHN5ZGJyZmk4OXl5Yjd6bWZ5amdyZ2Z6dXR4cml4NnB5IiwibmFtZSI6ImphamlAbWFpbGluYXRvci5jb20iLCJjb3VudHJ5T2ZSZXNpZGVuY2UiOiJETyJ9LCJleHBpcmF0aW9uRGF0ZSI6IjIwMjYtMDUtMTlUMDg6MDI6MDRaIiwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vdmMuc2NoZW1hcy5ob3N0L2tjYy5zY2hlbWEuanNvbiIsInR5cGUiOiJKc29uU2NoZW1hIn19LCJuYmYiOjE3MjU1NDY2NDEsImp0aSI6InVybjp1dWlkOjUwZDI3ZTA2LTc0YjgtNDhmYy05ZTc0LWNlNGNiNWQ1ZTNjMSIsImlzcyI6ImRpZDpkaHQ6Ymg4bWU2OGZzZGI2eHV5eTNkc2g0YWFuY3pleGdhM2szbTdmazRpZTZoajVqeTZpbnE1eSIsInN1YiI6ImRpZDpkaHQ6ZTE0cHdlZnJ5eGN0NjRnenFqNGhzeWRicmZpODl5eWI3em1meWpncmdmenV0eHJpeDZweSIsImlhdCI6MTcyNTU0NjY0MSwiZXhwIjoxNzc5MTc3NzI0fQ.XvV1oNW64huLIAkqLJbcYNRtIJJt7reffCxBmxr1Txaud1QlC5eHKkRdFdZ4tnCwQVCGES3AjX8fVtjhJFLdDg"
            ]
        }
    },
    {
        "metadata": {
            "from": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
            "to": "did:dht:e14pwefryxct64gzqj4hsydbrfi89yyb7zmfyjgrgfzutxrix6py",
            "exchangeId": "rfq_01j719jpg6e6psqs0eje018xg7",
            "protocol": "1.0",
            "kind": "quote",
            "id": "quote_01j719jggheedvrc3yc97cpam3",
            "createdAt": "2024-09-05T14:31:49.521Z"
        },
        "data": {
            "expiresAt": "2028-05-01T00:00:00.000Z",
            "payin": {
                "currencyCode": "USD",
                "amount": "18998"
            },
            "payout": {
                "currencyCode": "KES",
                "amount": "2659720"
            }
        },
        "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6M2ZrejVzc2Z4YnJpd2tzM2l5NW53eXMzcTVreXg2NGV0dHA5d2ZuMXlmZWtma2lndWoxeSMwIn0..k2tGxhiVfKovdkX6btS4EFZLxcuJ8dOKdcz_rdxk4esMFCquVMuJN2K94oo0Zq2EFcHKYDZnxhYsVrVX9DkBCQ"
    },
    {
        "metadata": {
            "from": "did:dht:e14pwefryxct64gzqj4hsydbrfi89yyb7zmfyjgrgfzutxrix6py",
            "to": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
            "exchangeId": "rfq_01j719jpg6e6psqs0eje018xg7",
            "kind": "close",
            "id": "close_01j719m71hfjj8brjm7e328pje",
            "createdAt": "2024-09-05T14:32:45.361Z",
            "protocol": "1.0"
        },
        "data": {
            "reason": "User cancelled transaction."
        },
        "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6ZTE0cHdlZnJ5eGN0NjRnenFqNGhzeWRicmZpODl5eWI3em1meWpncmdmenV0eHJpeDZweSMwIn0..RBkz1-iUHgCdkYHrZSZcDJK-XD6WZKPp3fudCAUFkFRmomPjL6ClDRAiaD5D4jGX_ViwjDdgMqnIqSZTUMAVBg"
    },
    {
        "metadata": {
            "from": "did:dht:e14pwefryxct64gzqj4hsydbrfi89yyb7zmfyjgrgfzutxrix6py",
            "to": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
            "exchangeId": "rfq_01j719jpg6e6psqs0eje018xg7",
            "kind": "close",
            "id": "close_01j719m71hfjj8brjm7e328pje",
            "createdAt": "2024-09-05T14:32:45.361Z",
            "protocol": "1.0"
        },
        "data": {
            "reason": "SUCCESS",
            "success": "true",
        },
        "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6ZTE0cHdlZnJ5eGN0NjRnenFqNGhzeWRicmZpODl5eWI3em1meWpncmdmenV0eHJpeDZweSMwIn0..RBkz1-iUHgCdkYHrZSZcDJK-XD6WZKPp3fudCAUFkFRmomPjL6ClDRAiaD5D4jGX_ViwjDdgMqnIqSZTUMAVBg"
    }
].filter(({ metadata: { kind } }: any) => kind === TBDEX_MESSAGE_TYPES.CLOSE)

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
