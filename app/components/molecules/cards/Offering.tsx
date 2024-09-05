import AssetExchangeOffer from "@/app/components/atoms/OfferDetails";
import AssetExchangePFIDetails from "@/app/components/molecules/cards/OfferingPFIDetails";
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import MakePayment from "@/app/components/molecules/forms/MakePayment";
import { Credentials } from "@/app/components/organisms/Credentials";
import { INTERVALS_LOCAL_STORAGE_KEY, PFIs, TBDEX_MESSAGE_TYPES_TO_STATUS, TDBUNK_CANCEL_REASON } from "@/app/lib/constants";
import { pollExchanges, sendCloseMessage, sendOrderMessage } from "@/app/lib/tbdex";
import { getCurrencyFlag } from "@/app/lib/utils";
import { useNotificationContext } from "@/app/providers/NotificationProvider";
import { Offering } from "@tbdex/http-client";
import { Button, List, Modal } from "antd";
import { formatDistanceToNow } from 'date-fns';
import { SetStateAction, useEffect, useState } from "react";

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

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [activateButton, setActivateButton] = useState(false)
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

    const handleOk = async () => {
        if (isCancelled) return

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
            // To Do: Check if the offering allows cancellations also aler user after they request quote
            const orderMessage = await sendOrderMessage({
                pfiDid,
                userBearerDid,
                exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
            })

            if (orderMessage) {
                console.log("Close modal and toast success txn complete", orderMessage)
                // setShowModal(false);
                // setIsCompleted(true)
            }

            clearAllPollingTimers()
        }
    };

    const handleCancel = async () => {
        if (isRequestQuote || isCancelled) {
            setShowModal(false);
        } else {
            setIsCancelling(true)

            // To Do: Check if the offering allows cancellations also aler user after they request quote
            const closeMessage = await sendCloseMessage({
                pfiDid,
                userBearerDid,
                reason: TDBUNK_CANCEL_REASON,
                exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
            })

            if (closeMessage) {
                console.log("Cancel Message returned", closeMessage)
                // To Do: Reset form and all relevant state

            }

            clearAllPollingTimers()
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
                isLoading={isLoading || isCancelling}
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
            setUserBearerDid={undefined} setIsCreatingCredential={function (value: SetStateAction<boolean>): void {
                throw new Error("Function not implemented.");
            }} isCreatingCredential={false} />

    const issuerDid = offeringRequiredClaims?.['vc.issuer'] || offeringRequiredClaims?.['issuer']
    const issuerVcSchema = offeringRequiredClaims?.['vc.credentialSchema.id'] || offeringRequiredClaims?.['credentialSchem[*].id']

    const isPaymentStep = hasRequiredCredentials && isSelected

    const destinationCurrencyCode = rawOffering?.data?.payout?.currencyCode


    const cancelText = isRequestQuote
        ? 'Cancel'
        : `${isCancelled ? 'Close' : 'Cancel Transfer'}`

    const submitText = isRequestQuote
        ? 'Request for Quote'
        : `Transfer ${destinationCurrencyCode} ${campaignAmount}`

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
                setShowModal(false)
                console.log("Transfer complete")
            }
        }

        console.log("received message", relevantExchange)
    }, [relevantExchange])

    useEffect(() => {
        if (isCancelled) {
            notify?.('error', {
                message: 'Transaction Cancelled!',
                description: 'Your transaction has been cancelled!'
            })
            // setIsCancelled(false)
        }
    }, [isCancelled])

    useEffect(() => {
        if (isCompleted) {
            // To Do: Reset form and all relevant state
            notify?.('success', {
                message: 'Transaction Complete!',
                description: 'Your transaction has been completed succesfully!'
            })
            // setIsCompleted(false)
        }
    }, [isCompleted])

    const isButtonDisabled = !activateButton

    return (
        <List.Item className="flex flex-row gap-2">
            <Modal
                width={800}
                open={showModal}
                title={modalTitle}
                footer={isPaymentStep ? [
                    <Button danger key="back" onClick={handleCancel} loading={isCancelling}>
                        {cancelText}
                    </Button>,
                    <Button loading={isLoading} key="submit" type="primary" onClick={handleOk} disabled={isButtonDisabled || isCancelling}>
                        {submitText}
                    </Button>
                ] : []}
            >
                {flow}
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
                issuerDid={issuerDid}
                isSelected={isSelected}
                offeringId={offeringId}
                issuerVcSchema={issuerVcSchema}
                isRecommended={Boolean(pfiName)}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </List.Item>

    )
}


export default OfferingDetails
