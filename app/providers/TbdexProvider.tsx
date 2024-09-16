"use client"
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { DEFAULT_BASE_CURRENCY, DEFAULT_BASE_CURRENCY_STABLE_COIN, LOCAL_STORAGE_KEY, MARKET_CONVERSION_API_EXCEEDED_QOUTA_LOCAL_STORAGE_KEY, OFFERINGS_LAST_UPDATED, OFFERINGS_LOCAL_STORAGE_KEY, PFIs, SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY, SPECIAL_PFI, TDBUNK_WALLET_BALANCE_LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { createRfQ } from '@/app/lib/tbdex';
import { getOfferingPairs } from '@/app/lib/utils';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import { Offering, Rfq, TbdexHttpClient } from '@tbdex/http-client';
import { PresentationDefinitionV2, PresentationExchange } from '@web5/credentials';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { fetchMarketExchangeRates } from '../lib/api';

export interface CredentialProp {
    [key: string]: string[]
}

export interface CreateExchangeArgs {
    offering: any;
    vcJwts: string[];
    rawOffering: Offering;
    campaignAmount: string | number;
    presentationDefinition: PresentationDefinitionV2
}

export interface MonopolyMoney { currency: string, amount: number }

export interface TbdexContextProps {
    offerings: any[];
    specialOfferings: any[];
    sourceCurrencies: any[];
    selectedCurrency: string;
    currentMarketRate: number;
    unformattedOfferings: any[];
    credentials: CredentialProp;
    destinationCurrencies: any[];
    monopolyMoney: MonopolyMoney;
    specialSourceCurrencies: any[];
    unformattedSpecialOfferings: any[];
    specialDestinationCurrencies: any[];
    selectedDestinationCurrency: string;
    marketConversionApiQuotaExceeded: boolean;
    setOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    createExchange: (args: CreateExchangeArgs) => Promise<void>;
    setSourceCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    setSpecialOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
    setCurrentMarketRate: React.Dispatch<React.SetStateAction<number>>;
    setUnformattedOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    setDestinationCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    setMonopolyMoney: React.Dispatch<React.SetStateAction<MonopolyMoney>>;
    setSpecialSourceCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    setUnformattedSpecialOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    setSpecialDestinationCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedDestinationCurrency: React.Dispatch<React.SetStateAction<string>>;
    setCredentials: React.Dispatch<React.SetStateAction<CredentialProp | undefined>>;
    setMarketConversionApiQuotaExceeded: React.Dispatch<React.SetStateAction<boolean>>;
};

export type OfferingStorage = {} | null


const TbdexContext = createContext<Partial<TbdexContextProps>>({});

const useTbdexContext = (): Partial<TbdexContextProps> => {
    const context = useContext(TbdexContext);
    if (!context) {
        throw new Error('useTbdexContext must be used within a TbdexContextProvider');
    }
    return context;
};

const TbdexContextProvider = ({ children }: PropsWithChildren) => {
    const { userBearerDid: contextUserBearerDid } = useWeb5Context()
    const [offerings, setOfferings] = useState<any[]>([])
    const [currentMarketRate, setCurrentMarketRate] = useState<number>(1)
    const [specialOfferings, setSpecialOfferings] = useState<any[]>([])
    const [unformattedOfferings, setUnformattedOfferings] = useState<any[]>([])
    const [unformattedSpecialOfferings, setUnformattedSpecialOfferings] = useState<any[]>([])
    const [selectedCurrency, setSelectedCurrency] = useState<string>(DEFAULT_BASE_CURRENCY)
    const [monopolyMoney, setMonopolyMoney] = useState<MonopolyMoney>({
        currency: DEFAULT_BASE_CURRENCY,
        amount: 1000
    })
    const [credentials, setCredentials] = useState<CredentialProp>()
    const [sourceCurrencies, setSourceCurrencies] = useState<any[]>([])
    const [specialSourceCurrencies, setSpecialSourceCurrencies] = useState<any[]>([])
    const [destinationCurrencies, setDestinationCurrencies] = useState<any[]>([])
    const [specialDestinationCurrencies, setSpecialDestinationCurrencies] = useState<any[]>([])
    const [marketConversionApiQuotaExceeded, setMarketConversionApiQuotaExceeded] = useState<boolean>(false)
    const [selectedDestinationCurrency, setSelectedDestinationCurrency] = useState<string>(DEFAULT_BASE_CURRENCY)

    const [_, setLocalOfferings] = useBrowserStorage<OfferingStorage>(
        OFFERINGS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )
    const [__, setLocalSpecialOfferings] = useBrowserStorage<OfferingStorage>(
        SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const createExchange = async (details: any) => {
        try {
            const userWeb5BearerDid = contextUserBearerDid
                ? contextUserBearerDid
                : details.userBearerDid

            const selectedCredentials = PresentationExchange.selectCredentials({
                vcJwts: details.credentials,
                presentationDefinition: details.offering.data.requiredClaims
            })
            const rfq = await createRfQ({
                userBearerDid: userWeb5BearerDid,
                amount: details.amount,
                offering: details.offering,
                credentials: selectedCredentials,
                requiredPaymentDetails: details.requiredPaymentDetails
            })

            TbdexHttpClient.createExchange(rfq as Rfq, {
                replyTo: 'http://localhost:3000/api/exchanges'
            })
        } catch (error: any) {
            console.log("Something went wrong createExchange", error)
        }
    }


    useEffect(() => {
        (async () => {
            try {
                // Convert wallet balance when source currency is changed
                // Hence wallet retains equivalent value in balance for each currency
                const amount = monopolyMoney?.amount
                const source = monopolyMoney?.currency
                const destination = selectedCurrency as string

                // const isUSDC = selectedCurrency === DEFAULT_BASE_CURRENCY_STABLE_COIN
                // const destination = isUSDC
                //     ? DEFAULT_BASE_CURRENCY
                //     : selectedCurrency as string

                // @ts-ignore
                const response = await fetchMarketExchangeRates({
                    source,
                    amount,
                    destination
                })

                if (response?.success) {
                    const moneyDetails = {
                        amount: response?.amount as number,
                        currency: destination
                    }

                    setMonopolyMoney(moneyDetails)
                    localStorage.setItem(TDBUNK_WALLET_BALANCE_LOCAL_STORAGE_KEY, JSON.stringify(moneyDetails))
                    return
                } else {
                    const isBrokeMessage = response?.message?.includes('Exceeded Quota')
                    setMarketConversionApiQuotaExceeded(isBrokeMessage)
                    localStorage?.setItem(MARKET_CONVERSION_API_EXCEEDED_QOUTA_LOCAL_STORAGE_KEY, JSON.stringify({
                        time: new Date(),
                        message: response?.message
                    }))
                }
            } catch (error: any) {
                console.log("Error in wallet conversion", error)
            }
        })()
    }, [selectedCurrency])

    useEffect(() => {
        (async () => {
            try {
                const offeringsData: { [x: string]: Offering[]; }[] = []
                const unformattedOfferings = []
                for (const PFI of PFIs) {
                    const pfiDidUri = PFI.did
                    const offers = await TbdexHttpClient.getOfferings({
                        pfiDid: pfiDidUri
                    })
                    const result = {
                        [pfiDidUri]: offers
                    }
                    offeringsData.push(result)
                    unformattedOfferings.push(offers)
                }

                const specialOfferings = await TbdexHttpClient.getOfferings({
                    pfiDid: SPECIAL_PFI.did
                })

                const specialResult = {
                    [SPECIAL_PFI.did]: specialOfferings
                }

                const {
                    offerings: specialOffers,
                    sourceCurrencies: specialOffersSourceCurrencies,
                    destinationCurrencies: specialOffersDestinationCurrencies
                } = getOfferingPairs([specialResult])

                const {
                    offerings,
                    sourceCurrencies,
                    destinationCurrencies
                } = getOfferingPairs(offeringsData)

                setOfferings(offerings)
                setSpecialOfferings(specialOffers)

                setLocalOfferings(offerings)
                setLocalSpecialOfferings(specialOffers)

                setSourceCurrencies(sourceCurrencies)
                setSpecialSourceCurrencies(specialOffersSourceCurrencies)

                setUnformattedOfferings(unformattedOfferings)
                setUnformattedSpecialOfferings(specialOfferings)

                setDestinationCurrencies(destinationCurrencies)
                setSpecialDestinationCurrencies(specialOffersDestinationCurrencies)

                localStorage.setItem(OFFERINGS_LAST_UPDATED, new Date().toISOString())
            } catch (error: any) {
                console.log("Error heere", error)
            }
        })()
    }, [])



    return <TbdexContext.Provider value={{
        offerings,
        credentials,
        monopolyMoney,
        specialOfferings,
        sourceCurrencies,
        selectedCurrency,
        currentMarketRate,
        unformattedOfferings,
        destinationCurrencies,
        specialSourceCurrencies,
        unformattedSpecialOfferings,
        selectedDestinationCurrency,
        specialDestinationCurrencies,
        marketConversionApiQuotaExceeded,

        setOfferings,
        setCredentials,
        createExchange,
        setMonopolyMoney,
        setSelectedCurrency,
        setSpecialOfferings,
        setSourceCurrencies,
        setCurrentMarketRate,
        setUnformattedOfferings,
        setDestinationCurrencies,
        setSpecialSourceCurrencies,
        setSelectedDestinationCurrency,
        setUnformattedSpecialOfferings,
        setSpecialDestinationCurrencies,
        setMarketConversionApiQuotaExceeded
    }}>
        {children}
    </TbdexContext.Provider>
}

export { TbdexContext, TbdexContextProvider, useTbdexContext };

