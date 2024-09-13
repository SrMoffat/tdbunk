import AssetExchangeOffer from "@/app/components/atoms/OfferDetails";
import AssetExchangePFIDetails from "@/app/components/molecules/cards/OfferingPFIDetails";
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import MakePayment from "@/app/components/molecules/forms/MakePayment";
import { Credentials } from "@/app/components/organisms/Credentials";
import { INTERVALS_LOCAL_STORAGE_KEY, PFIs, STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY, TBDEX_MESSAGE_TYPES_TO_STATUS, TDBUNK_CANCEL_REASON } from "@/app/lib/constants";
import { pollExchanges, sendCloseMessage, sendOrderMessage } from "@/app/lib/tbdex";
import { getCurrencyFlag, getPlatformFees } from "@/app/lib/utils";
import { createOfferingReviewCredential } from "@/app/lib/web5";
import { useNotificationContext } from "@/app/providers/NotificationProvider";
import { Offering } from "@tbdex/http-client";
import { List } from "antd";
import { SetStateAction, useEffect, useState } from "react";
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

function clearAllIntervals(intervalIds: string[]) {
    for (const interval of intervalIds) {
        console.log("Clearing interval with ID:", interval)
        window && window.clearInterval(interval);
    }
    localStorage && localStorage.removeItem(INTERVALS_LOCAL_STORAGE_KEY)
}


const OfferingDetails = (props: any) => {
    const {
        web5,
        money,
        isCancelled,
        isSelected,
        credentials,
        isCompleted,
        currentMarketRate,
        setIsCompleted,
        setIsCancelled,
        stateCredentials,
        selectedCard,
        setIsSelected,
        userBearerDid,
        createExchange,
        campaignAmount,
        setSelectedCard,
        offering: values,
        selectedOffering,
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


    const clearAllPollingTimers = () => {
        const storedIntervals = localStorage.getItem(INTERVALS_LOCAL_STORAGE_KEY)
        if (storedIntervals) {
            const existingIntervals = JSON.parse(storedIntervals)
            const newIntervals = [...existingIntervals]
            clearAllIntervals(newIntervals)
        }
    }

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
            <PaymentFlowModal
                offering={offering}
                isLoading={isLoading}
                showModal={showModal}
                overallFee={overallFee}
                isSelected={isSelected}
                feeDetails={feeDetails}
                isCancelled={isCancelled}
                rawOffering={rawOffering}
                isCompleted={isCompleted}
                isCancelling={isCancelling}
                setShowModal={setShowModal}
                activateButton={activateButton}
                campaignAmount={campaignAmount}
                isRequestQuote={isRequestQuote}
                setOfferingReview={setOfferingReview}
                hasRequiredCredentials={hasRequiredCredentials}

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



