import AssetExchangeOffer from "@/app/components/atoms/OfferDetails";
import AssetExchangePFIDetails from "@/app/components/molecules/cards/OfferingPFIDetails";
import { INTERVALS_LOCAL_STORAGE_KEY, PFIs, TBDEX_MESSAGE_TYPES_TO_STATUS } from "@/app/lib/constants";
import { pollExchanges } from "@/app/lib/tbdex";
import { getCurrencyFlag, getPlatformFees } from "@/app/lib/utils";
import { useNotificationContext } from "@/app/providers/NotificationProvider";
import { Offering } from "@tbdex/http-client";
import { List } from "antd";
import { useEffect, useState } from "react";
import PaymentFlowModal from "../modals/PaymentFlow";

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
        offering: values,
        stateCredentials,
        selectedOffering,
        currentMarketRate,
        setCampaignAmount,
        setSelectedOffering,
        unformattedOfferings,
    } = props

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [activateButton, setActivateButton] = useState(false)
    const [offeringReview, setOfferingReview] = useState({})
    const [feeDetails, setFeeDetails] = useState<any>({})
    const [relevantExchange, setRelevantExchanges] = useState<any>()
    const [requiredPaymentDetails, setRequiredPaymentDetails] = useState<any>({
        payin: {},
        payout: {}
    })
    const { notify } = useNotificationContext()
    const [paymentStage, setPaymentStage] = useState<PaymentStage>(PaymentStage.REQUEST_QUOTE)

    const offering = Object.values(values ? values : {})[0] as any
    const pfiDid = Object.keys(values ? values : {})[0] as any

    const offeringId = offering?.id
    const offeringCreatedAt = offering?.createdAt
    const offeringRequiredClaims = offering?.requiredClaims
    const offeringFromCurrency = offering?.pair[0]
    const offeringToCurrency = offering?.pair[1]
    const offeringToCurrencyMethods = offeringToCurrency?.methods

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




    const showPaymentModal = () => {
        const isReadyForQuote = hasRequiredCredentials && isSelected

        if (isReadyForQuote) {
            setShowModal(true)
        }

        setShowModal(true)
    }

    const cta = isSelected
        ? 'Start Transfer'
        : 'Request Credentials'


    const issuerDid = offeringRequiredClaims?.['vc.issuer'] || offeringRequiredClaims?.['issuer']
    const issuerVcSchema = offeringRequiredClaims?.['vc.credentialSchema.id'] || offeringRequiredClaims?.['credentialSchem[*].id']

    useEffect(() => {
        const intervalId = pollExchanges(userBearerDid, setRelevantExchanges)
        const storedIntervals = localStorage.getItem(INTERVALS_LOCAL_STORAGE_KEY)

        if (storedIntervals) {
            const existingIntervals = JSON.parse(storedIntervals)
            const newIntervals = [...existingIntervals, intervalId]
            localStorage.setItem(INTERVALS_LOCAL_STORAGE_KEY, JSON.stringify(newIntervals))
        } else {
            localStorage.setItem(INTERVALS_LOCAL_STORAGE_KEY, JSON.stringify([intervalId]))
        }
    }, [])

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
            }

            if (completedTransfer) {
                setIsCompleted(true)
                setIsLoading(false)
                // setShowModal(false)
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
                setShowModal={setShowModal}
                setIsLoading={setIsLoading}
                userBearerDid={userBearerDid}
                setIsSelected={setIsSelected}
                offeringReview={offeringReview}
                createExchange={createExchange}
                activateButton={activateButton}
                campaignAmount={campaignAmount}
                isRequestQuote={isRequestQuote}
                setSelectedCard={setSelectedCard}
                setIsCancelling={setIsCancelling}
                stateCredentials={stateCredentials}
                relevantExchange={relevantExchange}
                currentMarketRate={currentMarketRate}
                setOfferingReview={setOfferingReview}
                setActivateButton={setActivateButton}
                setCampaignAmount={setCampaignAmount}
                offeringCreatedAt={offeringCreatedAt}
                requiredPaymentDetails={requiredPaymentDetails}
                hasRequiredCredentials={hasRequiredCredentials}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
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
                showPaymentModal={showPaymentModal}
                offeringCreatedAt={offeringCreatedAt}
                setSelectedOffering={setSelectedOffering}
                toCurrencyCode={offeringToCurrency?.currencyCode}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
                fromCurrencyCode={offeringFromCurrency?.currencyCode}
                fromCurrencyFlag={getCurrencyFlag(offeringFromCurrency?.currencyCode)}
                toCurrencyFlag={getCurrencyFlag(offeringToCurrency?.currencyCode)}
            />
            <AssetExchangeOffer
                issuerDid={issuerDid}
                isSelected={isSelected}
                offeringId={offeringId}
                issuerVcSchema={issuerVcSchema}
                isRecommended={Boolean(pfiName) && isCheaperThanMarketRate}
                isSpecial={!Boolean(pfiName)}
                hasRequiredClaims={offering?.requiredClaimsExist}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </List.Item>

    )
}


export default OfferingDetails



