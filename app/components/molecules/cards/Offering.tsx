import AssetExchangeOffer from "@/app/components/atoms/OfferDetails";
import AssetExchangePFIDetails from "@/app/components/molecules/cards/OfferingPFIDetails";
import PaymentFlowModal from "@/app/components/molecules/modals/PaymentFlow";
import { PFIs, TBDEX_MESSAGE_TYPES_TO_STATUS, TDBUNK_TRANSACTIONS_LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { createTransaction, getCurrencyFlag, getPlatformFees, getUniqueExchanges } from "@/app/lib/utils";
import { storeTbdexTransactionInDwn } from "@/app/lib/web5";
import { Offering } from "@tbdex/http-client";
import { List } from "antd";
import { useEffect, useState } from "react";

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

const OfferingDetails = (props: any) => {
    const {
        web5,
        money,
        isSelected,
        credentials,
        isCompleted,
        isCancelled,
        selectedCard,
        setIsSelected,
        userBearerDid,
        createExchange,
        setIsCompleted,
        setIsCancelled,
        campaignAmount,
        setSelectedCard,
        setTransactions,
        offering: values,
        stateCredentials,
        selectedOffering,
        currentMarketRate,
        setCampaignAmount,
        setSelectedOffering,
        unformattedOfferings,
        selectedPayinMethod,
        selectedPayoutMethod,
        setSelectedPayinMethod,
        setSelectedPayoutMethod,
    } = props

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [activateButton, setActivateButton] = useState(false)
    const [offeringReview, setOfferingReview] = useState({})
    const [feeDetails, setFeeDetails] = useState<any>({})
    const [relevantExchange, setRelevantExchange] = useState<any>()
    const [allExchanges, setAllExchanges] = useState<any>()
    const [requiredPaymentDetails, setRequiredPaymentDetails] = useState<any>({
        payin: {},
        payout: {}
    })
    const [paymentStage, setPaymentStage] = useState<PaymentStage>(PaymentStage.REQUEST_QUOTE)

    const offering = Object.values(values ? values : {})[0] as any
    const pfiDid = Object.keys(values ? values : {})[0] as any

    const offeringId = offering?.id
    const offeringCreatedAt = offering?.createdAt
    const offeringRequiredClaims = offering?.requiredClaims
    const offeringFromCurrency = offering?.pair[0]
    const offeringToCurrency = offering?.pair[1]
    const offeringToCurrencyMethods = offeringToCurrency?.methods
    const offeringFromCurrencyMethods = offeringFromCurrency?.methods

    const isCheaperThanMarketRate = offeringToCurrency?.unit > Number(currentMarketRate) // || isOnlyResult

    const pfiName = PFIs.filter(pfi => pfi?.did === pfiDid)[0]?.name

    const hasRequiredCredentials = Boolean(credentials?.length)

    const rawOfferins = unformattedOfferings?.flat() as Offering[]
    const rawOfferingDetails = rawOfferins.filter(({ metadata: { id } }) => id === offeringId)
    const rawOffering = rawOfferingDetails[0]

    const isRequestQuote = paymentStage === PaymentStage.REQUEST_QUOTE

    const payinData = rawOffering?.data?.payin
    const payinMethod = payinData?.methods?.[0]

    const payinFee = payinMethod?.fee

    const exchangeRate = rawOffering?.data?.payoutUnitsPerPayinUnit

    const totalFee = Number(feeDetails?.totalFee)?.toFixed(2)

    const overallFee = payinFee
        ? Number(payinFee + totalFee).toFixed(2)
        : Number(totalFee).toFixed(2)

    const offeringRequiredClaimsInputDescriptors = rawOffering?.data?.requiredClaims?.input_descriptors

    const offeringRequiredClaimsDetails = offeringRequiredClaimsInputDescriptors
        ?.map((entry: any) => entry?.constraints?.fields
            ?.map((entry: any) => entry?.filter?.const))

    const requiredClaimsArray = offeringRequiredClaimsDetails?.flat()

    const hasSelectedRequiredCredential = requiredClaimsArray?.includes(selectedCard?.issuer)

    const showPaymentModal = () => {
        const isReadyForQuote = hasRequiredCredentials && isSelected

        if (isReadyForQuote) {
            setShowModal(true)
        }

        setShowModal(true)
    }

    const cta = hasSelectedRequiredCredential
        ? 'Start Transfer'
        : 'Request Credentials'

    const issuerDid = offeringRequiredClaims?.['vc.issuer'] || offeringRequiredClaims?.['issuer']
    const issuerVcSchema = offeringRequiredClaims?.['vc.credentialSchema.id'] || offeringRequiredClaims?.['credentialSchem[*].id']

    useEffect(() => {
        if (relevantExchange) {
            const paymentState = paymentStage === PaymentStage.MAKE_TRANSFER
            const receivedQuote = relevantExchange.status === TBDEX_MESSAGE_TYPES_TO_STATUS.QUOTE
            const cancelledTransfer = relevantExchange.status === TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE
            const completedTransfer = relevantExchange.status === TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE_SUCCESS

            if (receivedQuote && !paymentState) {
                setPaymentStage(PaymentStage.MAKE_TRANSFER)
                setIsLoading(false)
            }

            if (cancelledTransfer && paymentState) {
                setIsCancelling(false)
                setActivateButton(false)
                setIsCancelled(true)

                // Create and store cancelled transaction
                const txn = createTransaction({
                    offering,
                    campaignAmount,
                    exchange: relevantExchange,
                })

                setTransactions((prev: any) => {
                    const results = getUniqueExchanges([...prev, txn])

                    localStorage?.setItem(TDBUNK_TRANSACTIONS_LOCAL_STORAGE_KEY, JSON.stringify(results))
                    return results
                })
                storeTbdexTransactionInDwn(txn)
                setShowModal(false)
            }

            if (completedTransfer) {
                setIsCompleted(true)
                setIsLoading(false)

                // Create and store completed transaction
                const txn = createTransaction({
                    offering,
                    campaignAmount,
                    exchange: relevantExchange,
                })
                setTransactions((prev: any) => {
                    const results = getUniqueExchanges([...prev, txn])
                    localStorage?.setItem(TDBUNK_TRANSACTIONS_LOCAL_STORAGE_KEY, JSON.stringify(results))
                    return results
                })
                storeTbdexTransactionInDwn(txn)
            }

            const quoteMessage = relevantExchange?.mostRecentMessage

            const quoteMessageData = quoteMessage?.data

            const quotePayin = quoteMessageData?.payin
            const quotePayout = quoteMessageData?.payout

            getPlatformFees([quotePayin, quotePayout]).then((feeDetails) => {
                // Get fee details in the source currency
                setFeeDetails(feeDetails)
            })
        }
    }, [relevantExchange])


    useEffect(() => {
        if (allExchanges?.length) {
            console.log("All Exchanges Here", allExchanges)
        } else {
            console.log("All Exchanges Has Nothing Here Out", allExchanges)
        }
    }, [allExchanges])

    useEffect(() => {
        const isUsingWlletBalance = !Object.keys(requiredPaymentDetails?.payin).length

        if (isUsingWlletBalance) {
            const currentBalance = money?.amount

            const totalAmount = !isRequestQuote
                ? parseFloat(overallFee) + parseFloat(campaignAmount)
                : parseFloat(campaignAmount)

            const hasSufficientBalance = currentBalance > totalAmount
        }
    }, [requiredPaymentDetails, feeDetails])

    return (
        <List.Item className="flex flex-row gap-2">
            {/* TODO: Move all these into a context to avoid the prop drilling 🤢 */}
            <PaymentFlowModal
                web5={web5}
                money={money}
                pfiDid={pfiDid}
                values={values}
                pfiName={pfiName}
                offering={offering}
                isLoading={isLoading}
                showModal={showModal}
                overallFee={overallFee}
                isSelected={isSelected}
                feeDetails={feeDetails}
                credentials={credentials}
                isCancelled={isCancelled}
                rawOffering={rawOffering}
                isCompleted={isCompleted}
                exchangeRate={exchangeRate}
                isCancelling={isCancelling}
                selectedCard={selectedCard}
                isSpecial={!Boolean(pfiName)}
                userBearerDid={userBearerDid}
                setIsSelected={setIsSelected}
                offeringReview={offeringReview}
                createExchange={createExchange}
                activateButton={activateButton}
                campaignAmount={campaignAmount}
                isRequestQuote={isRequestQuote}
                setSelectedCard={setSelectedCard}
                relevantExchange={relevantExchange}
                stateCredentials={stateCredentials}
                currentMarketRate={currentMarketRate}
                setCampaignAmount={setCampaignAmount}
                offeringCreatedAt={offeringCreatedAt}
                selectedPayinMethod={selectedPayinMethod}
                selectedPayoutMethod={selectedPayoutMethod}
                offeringFromCurrency={offeringFromCurrency}
                requiredPaymentDetails={requiredPaymentDetails}
                hasRequiredCredentials={hasRequiredCredentials}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
                offeringFromCurrencyMethods={offeringFromCurrencyMethods}
                hasSelectedRequiredCredential={hasSelectedRequiredCredential}

                setShowModal={setShowModal}
                setIsLoading={setIsLoading}
                setAllExchanges={setAllExchanges}
                setIsCancelling={setIsCancelling}
                setOfferingReview={setOfferingReview}
                setActivateButton={setActivateButton}
                setRelevantExchange={setRelevantExchange}
                setSelectedPayinMethod={setSelectedPayinMethod}
                setSelectedPayoutMethod={setSelectedPayoutMethod}
                setRequiredPaymentDetails={setRequiredPaymentDetails}
            />
            <AssetExchangePFIDetails
                cta={cta}
                fromUnit="1.0"
                pfiDid={pfiDid}
                pfiName={pfiName}
                offering={rawOffering}
                toUnit={offeringToCurrency?.unit}
                selectedOffering={selectedOffering}
                offeringCreatedAt={offeringCreatedAt}
                setSelectedOffering={setSelectedOffering}
                toCurrencyCode={offeringToCurrency?.currencyCode}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
                fromCurrencyCode={offeringFromCurrency?.currencyCode}

                showPaymentModal={showPaymentModal}
                toCurrencyFlag={getCurrencyFlag(offeringToCurrency?.currencyCode)}
                fromCurrencyFlag={getCurrencyFlag(offeringFromCurrency?.currencyCode)}
            />
            <AssetExchangeOffer
                issuerDid={issuerDid}
                isSelected={isSelected}
                offeringId={offeringId}
                selectedCard={selectedCard}
                isSpecial={!Boolean(pfiName)}
                issuerVcSchema={issuerVcSchema}
                selectedPayinMethod={selectedPayinMethod}
                selectedPayoutMethod={selectedPayoutMethod}
                setSelectedPayinMethod={setSelectedPayinMethod}
                setSelectedPayoutMethod={setSelectedPayoutMethod}
                hasRequiredClaims={offering?.requiredClaimsExist}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
                offeringFromCurrencyMethods={offeringFromCurrencyMethods}
                isRecommended={Boolean(pfiName) && isCheaperThanMarketRate}
            />
        </List.Item>

    )
}


export default OfferingDetails

