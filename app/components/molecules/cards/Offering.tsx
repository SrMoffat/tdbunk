import { getCurrencyFlag } from "@/app/components/atoms/SearchOffersInput";
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import { Credentials } from "@/app/components/organisms/Credentials";
import { PFIs } from "@/app/lib/constants";
import { getEstimatedSettlementTime } from "@/app/lib/utils";
import { Offering, Quote, Rfq } from "@tbdex/http-client";
import { Button, Card, Flex, List, Modal, Spin } from "antd";
import { formatDistanceToNow } from 'date-fns';
import { SetStateAction, useEffect, useState } from "react";
import AssetExachangeAction from "../../atoms/OfferAction";
import AssetExchangeOffer from "../../atoms/OfferDetails";
import AssetExchangeRates from "../../atoms/OfferExchangeRates";
import PFIDetails from "../../atoms/OfferPFI";
import MakePayment from "../forms/MakePayment";
import { TbdexHttpClient, Close } from '@tbdex/http-client';

const generateExchangeStatusValues = (exchangeMessage: any) => {
    if (exchangeMessage instanceof Close) {
        if (exchangeMessage.data.reason!.toLowerCase().includes('complete') || exchangeMessage.data.reason!.toLowerCase().includes('success')) {
            return 'completed'
        } else if (exchangeMessage.data.reason!.toLowerCase().includes('expired')) {
            return exchangeMessage.data.reason!.toLowerCase()
        } else if (exchangeMessage.data.reason!.toLowerCase().includes('cancelled')) {
            return 'cancelled'
        } else {
            return 'failed'
        }
    }
    return exchangeMessage.kind
}

const getRfqAndQuoteRenderDetails = (rfq: Rfq, quote: Quote) => {
    const rfqData = rfq.data
    const rfqPayin = rfqData.payin
    const rfqPayout = rfqData.payout
    const rfqMetadata = rfq.metadata
    const rfqPrivateData = rfq.privateData
    const rfqPrivateDataPayin = rfqPrivateData!.payin!.paymentDetails
    const rfqPrivateDataPayout = rfqPrivateData!.payout!.paymentDetails

    const rfqDetails = {
        from: rfqMetadata.from,
        to: rfqMetadata.to,
        offeringId: rfqData.offeringId,
        rfqId: rfqMetadata.exchangeId,
        requestedAt: rfqMetadata.createdAt,

        payinKind: rfqPayin.kind,
        payinAmount: rfqPayin.amount,
        payinData: rfqPrivateDataPayin,

        payoutKind: rfqPayout.kind,
        payoutData: rfqPrivateDataPayout,
    }

    const getQuoteRenderDetails = (quoteArg: any) => {
        const quote = quoteArg

        const quoteData = quote.data
        const quotePayin = quoteData.payin
        const quotePayout = quoteData.payout
        const quoteMetadata = quote.metadata

        const quotePayinFee = quotePayin.fee
        const quotePayinAmount = quotePayin.amount
        const amountWithFee = quotePayinFee
            ? Number(quotePayinAmount) + Number(quotePayinFee)
            : Number(quotePayinAmount)

        const fromAmountWithFee = amountWithFee.toString() //|| rfqData!.payinAmount

        return {
            expiresAt: quoteData.expiresAt,

            from: quoteMetadata.from,
            to: quoteMetadata.to,
            rfqId: quoteMetadata.exchangeId,
            quotedAt: quoteMetadata.createdAt,

            fromCurrency: quotePayin.currencyCode,
            fromAmount: quotePayin.amount,
            fromAmountWithFee,
            fromFee: quotePayinFee,

            toCurrency: quotePayout.currencyCode,
            toAmount: quotePayout.amount,
        }
    }

    const quoteDetails = getQuoteRenderDetails(quote)

    return {
        rfq: rfqDetails,
        quote: quoteDetails
    }
}


// Poll every 3 seconds
const EXCHANGES_POLLING_INTERVAL_MS = 3000;

const pollExchanges = (bearer: any, callback: any) => {
    const fetchAllExchanges = async () => {
        try {
            // const exchanges = await fetchExchanges({
            //     userBearerDid: contextUserBearerDid
            // });
            const exchangesResults = []

            for (const pfi of PFIs) {
                const exchanges = await TbdexHttpClient.getExchanges({
                    pfiDid: pfi.did,
                    did: bearer.did
                });

                exchangesResults.push(...exchanges)
            }

            for (const exchange of exchangesResults) {
                const latestMessage = exchange[exchange.length - 1]

                const rfq = exchange.find(entry => entry.metadata.kind === 'rfq')
                const quote = exchange.find(entry => entry.metadata.kind === 'quote')

                const status = generateExchangeStatusValues(exchange)

                const { rfq: rfqRenderDetails, quote: quoteRenderDetails } = getRfqAndQuoteRenderDetails(rfq as Rfq, quote as Quote)

                callback({
                    rfq: rfqRenderDetails,
                    quote: quoteRenderDetails
                })


                console.log('👽👽👽👽👽👽👽👽👽', {
                    status,
                    latestMessage,
                    quoteRenderDetails,
                    rfqRenderDetails,
                })

            }
        } catch (error) {
            console.error("Failed to fetch exchanges:", error);
        }
        // if (!userBearerDid) return;
        // const allExchanges: any[] = [];
    };

    // Set up the interval to run the function periodically
    setInterval(fetchAllExchanges, EXCHANGES_POLLING_INTERVAL_MS);
};

export interface AssetExchangePFIDetailsProps {
    cta: string;
    toUnit: string;
    pfiDid: string;
    pfiName: string;
    fromUnit: string;
    toCurrencyCode: string;
    toCurrencyFlag: string;
    fromCurrencyFlag: string;
    fromCurrencyCode: string;
    offeringCreatedAt: string;
    showPaymentModal: () => void;
    offeringToCurrencyMethods: any[];
}

export enum PaymentStage {
    REQUEST_QUOTE = 'REQUEST_QUOTE',
    MAKE_TRANSFER = 'MAKE_TRANSFER',
}

const AssetExchangePFIDetails = ({
    cta,
    toUnit,
    pfiDid,
    pfiName,
    fromUnit,
    toCurrencyFlag,
    toCurrencyCode,
    showPaymentModal,
    fromCurrencyCode,
    fromCurrencyFlag,
    offeringCreatedAt,
    offeringToCurrencyMethods,
}: AssetExchangePFIDetailsProps) => {
    return (
        <Card className="w-full min-h-[200px]">
            <PFIDetails
                pfiDid={pfiDid}
                pfiName={pfiName}
                createdAt={offeringCreatedAt}
                estimatedSettlementTime={getEstimatedSettlementTime(offeringToCurrencyMethods, true)}
            />
            <Flex className="mt-3 justify-between">
                <AssetExachangeAction
                    cta={cta}
                    showModal={showPaymentModal}
                />
                <AssetExchangeRates
                    toUnit={toUnit}
                    fromUnit={fromUnit}
                    toCurrencyCode={toCurrencyCode}
                    toCurrencyFlag={toCurrencyFlag}
                    fromCurrencyFlag={fromCurrencyFlag}
                    fromCurrencyCode={fromCurrencyCode}
                />
            </Flex>
        </Card>
    )
}

const OfferingDetails = (props: any) => {
    const {
        isSelected,
        credentials,
        stateCredentials,
        selectedCard,
        setIsSelected,
        userBearerDid,
        createExchange,
        campaignAmount,
        setSelectedCard,
        offering: values,
        unformattedOfferings,
    } = props

    // console.log("Bearere DID <OfferingDetails />", userBearerDid)


    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [activateButton, setActivateButton] = useState(false)
    const [relevantExchange, setRelevantExchanges] = useState<{ rfq: any; quote: any }>({
        rfq: {},
        quote: {}
    })
    const [requiredPaymentDetails, setRequiredPaymentDetails] = useState<any>({
        payin: {},
        payout: {}
    })
    const [paymentStage, setPaymentState] = useState<PaymentStage>(PaymentStage.REQUEST_QUOTE)

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

    const hasRequiredCredentials = Boolean(credentials?.length)

    const rawOfferins = unformattedOfferings?.flat() as Offering[]
    const rawOfferingDetails = rawOfferins.filter(({ metadata: { id } }) => id === offeringId)
    const rawOffering = rawOfferingDetails[0]

    const offerRequiredClaims = rawOffering?.data?.requiredClaims

    const isRequestQuote = paymentStage === PaymentStage.REQUEST_QUOTE

    const showPaymentModal = () => {
        const isReadyForQuote = hasRequiredCredentials && isSelected

        if (isReadyForQuote) {
            setShowModal(true)
        }

        setShowModal(true)
    }

    const handleOk = () => {
        setIsLoading(true)
        if (isRequestQuote) {
            // Here ==>
            console.log("requiredPaymentDetails Make Transfer", {
                requiredPaymentDetails,
                credentials,
                userBearerDid,
                stateCredentials
            })

            createExchange({
                requiredPaymentDetails,
                credentials,
                userBearerDid,
                amount: campaignAmount,
                offering: rawOffering,
                stateCredentials
            })
        } else {
            console.log("requiredPaymentDetails Make Transfer", {
                requiredPaymentDetails
            })
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        if (isRequestQuote) {
            setShowModal(false);
        } else {
            setPaymentState(PaymentStage.REQUEST_QUOTE)
        }
    };

    const cta = isSelected
        ? 'Start Transfer'
        : 'Request Credentials'

    const modalTitle = hasRequiredCredentials
        ? isSelected
            ? isRequestQuote
                ? 'Request for Quote'
                : 'Make Transfer'
            : 'Select Credential'
        : 'Request Credentials'

    const flow = hasRequiredCredentials
        ? isSelected
            ? <MakePayment
                pfiDid={pfiDid}
                pfiName={pfiName}
                offering={rawOffering}
                userBearerDid={userBearerDid}
                isRequestQuote={isRequestQuote}
                campaignAmount={campaignAmount}
                createExchange={createExchange}
                relevantExchange={relevantExchange}
                setActivateButton={setActivateButton}
                offeringCreatedAt={offeringCreatedAt}
                requiredPaymentDetails={requiredPaymentDetails}
                setPaymentDetails={setRequiredPaymentDetails}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
            : <Credentials
                credentials={credentials}
                isSelected={isSelected}
                selectedCard={selectedCard}
                setIsSelected={setIsSelected}
                setSelectedCard={setSelectedCard}
            />
        : <CredentialsForm
            nextButtonDisabled={false}
            noCredentialsFound={false}
            localStorageCredentials={[]}
            stateCredentials={undefined}
            setNextButtonDisabled={function (value: SetStateAction<boolean>): void {
                throw new Error("Function not implemented.");
            }}
            setUserDid={undefined}
            setWeb5Instance={undefined}
            setCredentials={undefined}
            setRecoveryPhrase={undefined}
            setUserBearerDid={undefined}
        />

    const issuerDid = offeringRequiredClaims?.['vc.issuer']
    const issuerVcSchema = offeringRequiredClaims?.['vc.credentialSchema.id']

    const isPaymentStep = hasRequiredCredentials && isSelected

    const destinationCurrencyCode = rawOffering?.data?.payout?.currencyCode


    const cancelText = isRequestQuote
        ? 'Cancel'
        : 'Cancel Transfer'

    const submitText = isRequestQuote
        ? 'Request for Quote'
        : `Transfer ${destinationCurrencyCode} ${campaignAmount}`

    useEffect(() => {
        pollExchanges(userBearerDid, setRelevantExchanges)
    }, [])
    useEffect(() => {

        const exchangeOfferingId = relevantExchange?.rfq?.offeringId
        const isRelevant = exchangeOfferingId === offeringId

        if (isRelevant) {
            setIsLoading(false)
            setPaymentState(PaymentStage.MAKE_TRANSFER)
        }

        console.log("relevantExchange:iiisndie", { relevantExchange, isRelevant })
    }, [relevantExchange])

    return (
        <List.Item className="flex flex-row gap-2">
            <Modal
                width={800}
                open={showModal}
                title={modalTitle}
                footer={isPaymentStep ? [
                    <Button danger key="back" onClick={handleCancel}>
                        {cancelText}
                    </Button>,
                    <Button loading={isLoading} key="submit" type="primary" onClick={handleOk} disabled={!activateButton}>
                        {submitText}
                    </Button>
                ] : []}
            >
                {
                    isLoading
                        ? <Spin>
                            {flow}
                        </Spin>
                        : flow
                }
            </Modal>
            <AssetExchangePFIDetails
                cta={cta}
                fromUnit="1.0"
                pfiDid={pfiDid}
                pfiName={pfiName}
                toUnit={offeringToCurrency?.unit}
                showPaymentModal={showPaymentModal}
                offeringCreatedAt={offeringCreatedAt}
                toCurrencyCode={offeringToCurrency?.currencyCode}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
                fromCurrencyCode={offeringFromCurrency?.currencyCode}
                fromCurrencyFlag={getCurrencyFlag(offeringFromCurrency?.currencyCode)}
                toCurrencyFlag={getCurrencyFlag(offeringToCurrency?.currencyCode)}
            />
            <AssetExchangeOffer
                isRecommended
                issuerDid={issuerDid}
                isSelected={isSelected}
                offeringId={offeringId}
                issuerVcSchema={issuerVcSchema}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </List.Item>

    )
}


export default OfferingDetails
