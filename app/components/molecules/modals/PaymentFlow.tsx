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
import { List, Modal, Button, Spin } from "antd";
import { SetStateAction, useEffect, useState } from "react";
import ReviewOffering from "../cards/Review";

const PaymentFlowModal = (props: any) => {
    const {
        // showModal,
        // modalTitle,
        // isCompleted,
        // isLoading,
        // handleOk,
        // offering,
        // activateButton,
        // isCancelling,
        // handleCancel,
        // setOfferingReview,
        // flow

        offering,
        showModal,
        isLoading,
        overallFee,
        feeDetails,
        isSelected,
        isCancelled,
        rawOffering,
        isCompleted,
        setShowModal,
        isCancelling,
        campaignAmount,
        activateButton,
        isRequestQuote,
        setOfferingReview,
        hasRequiredCredentials,
    } = props



    const isButtonDisabled = !activateButton

    const currencyCode = feeDetails?.currencyCode

    const allFee = `${currencyCode} ${overallFee}`

    const isPaymentStep = hasRequiredCredentials && isSelected

    const sourceCurrencyCode = rawOffering?.data?.payin.currencyCode

    const cancelText = isRequestQuote
        ? 'Cancel'
        : `${isCancelled ? 'Close' : 'Cancel Transfer'}`

    const finalPayoutValue = campaignAmount + parseFloat(allFee?.split(" ")[1])

    const submitText = isRequestQuote
        ? 'Request for Quote'
        : isCompleted
            ? 'Review Transfer'
            : `Transfer ${sourceCurrencyCode} ${Number(finalPayoutValue).toFixed(2)}`

    const modalTitle = hasRequiredCredentials
        ? isSelected
            ? isRequestQuote
                ? 'Request for Quote'
                : 'Make Transfer'
            : 'Select Credential'
        : 'Request Credentials'

    // const handleOk = async () => {
    //     setIsLoading(true)

    //     if (isCancelled) return

    //     if (isCompleted) {
    //         // Create review VC
    //         const status = await createOfferingReviewCredential(
    //             web5,
    //             userBearerDid,
    //             {
    //                 ...offeringReview,
    //                 pfiDid
    //             }
    //         )

    //         if (status?.status.code === 202) {
    //             setIsLoading(false)
    //             notify?.('success', {
    //                 message: 'Review Submitted!',
    //                 description: 'Your review of  the transaction has submitted!'
    //             })
    //         }

    //         setShowModal(false)
    //     } else if (isRequestQuote) {
    //         const convertedCampaignAmount = Math.floor(campaignAmount / parseFloat(exchangeRate))

    //         createExchange({
    //             requiredPaymentDetails,
    //             credentials,
    //             userBearerDid,
    //             amount: convertedCampaignAmount,
    //             offering: rawOffering,
    //             stateCredentials
    //         })
    //     } else {
    //         // Start timer for the transfer
    //         localStorage?.setItem(STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY, JSON.stringify(new Date()))

    //         const isUsingWlletBalance = !Object.keys(requiredPaymentDetails?.payin).length

    //         if (isUsingWlletBalance) {
    //             const currentBalance = money?.amount
    //             const sameCurrency = money?.currency === offeringFromCurrency

    //             const totalAmount = overallFee + campaignAmount

    //             const hasSufficientBalance = currentBalance > totalAmount

    //             if (!hasSufficientBalance && sameCurrency) {
    //                 // Set error and disable button
    //                 console.log("Set error and disable button", {
    //                     hasSufficientBalance,
    //                     sameCurrency
    //                 })
    //             }
    //         }

    //         // To Do: Check if the offering allows cancellations also aler user after they request quote
    //         const orderMessage = await sendOrderMessage({
    //             pfiDid,
    //             userBearerDid,
    //             exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
    //         })

    //         //   To Do: Since we are assuming the user of wallet balance here
    //         //     we should also check for insufficient balance and send
    //         //         Close message

    //         if (orderMessage) {
    //             console.log("Close modal and toast success txn complete", orderMessage)
    //             // setShowModal(false);
    //             // setIsCompleted(true)
    //         }

    //         clearAllPollingTimers()
    //     }
    // };

    // const handleCancel = async () => {
    //     if (isCompleted) {
    //         // Create a VC without user review?
    //         console.log("Canelled out of a review of PFI", offeringReview)
    //     } else if (isRequestQuote || isCancelled) {
    //         setShowModal(false);
    //     } else {
    //         setIsCancelling(true)
    //         // Start Timer for Cancelling

    //         // To Do: Check if the offering allows cancellations also aler user after they request quote
    //         const closeMessage = await sendCloseMessage({
    //             pfiDid,
    //             userBearerDid,
    //             reason: TDBUNK_CANCEL_REASON,
    //             exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
    //         })

    //         if (closeMessage) {
    //             console.log("Cancel Message returned", closeMessage)
    //             // End Timer for Cancelling

    //             // To Do: Reset form and all relevant state

    //         }

    //         clearAllPollingTimers()
    //     }
    // };

    const flow = hasRequiredCredentials
        ? isSelected
            ? 'Make Payment'
            : 'Credentials'
        : 'Create New Form'

    // const flow = hasRequiredCredentials
    //     ? isSelected
    //         ? <MakePayment
    //             money={money}
    //             pfiDid={pfiDid}
    //             pfiName={pfiName}
    //             monopolyMoney={money}
    //             offering={rawOffering}
    //             feeDetails={feeDetails}
    //             userBearerDid={userBearerDid}
    //             isRequestQuote={isRequestQuote}
    //             campaignAmount={campaignAmount}
    //             createExchange={createExchange}
    //             currentMarketRate={currentMarketRate}
    //             relevantExchange={relevantExchange}
    //             isLoading={isLoading || isCancelling}
    //             setActivateButton={setActivateButton}
    //             setCampaignAmount={setCampaignAmount}
    //             offeringCreatedAt={offeringCreatedAt}
    //             requiredPaymentDetails={requiredPaymentDetails}
    //             setPaymentDetails={setRequiredPaymentDetails}
    //             offeringToCurrencyMethods={offeringToCurrencyMethods}
    //         />
    //         : <Credentials
    //             offering={values}
    //             isSelected={isSelected}
    //             credentials={credentials}
    //             selectedCard={selectedCard}
    //             setIsSelected={setIsSelected}
    //             setSelectedCard={setSelectedCard}
    //         />
    //     : <CredentialsForm
    //         nextButtonDisabled={false}
    //         noCredentialsFound={false}
    //         localStorageCredentials={[]}
    //         stateCredentials={undefined}
    //         setNextButtonDisabled={function (value: SetStateAction<boolean>): void {
    //             throw new Error("Function not implemented.");
    //         }}
    //         setUserDid={undefined}
    //         setWeb5Instance={undefined}
    //         setCredentials={undefined}
    //         setRecoveryPhrase={undefined}
    //         setUserBearerDid={undefined} setIsCreatingCredential={function (value: SetStateAction<boolean>): void {
    //             throw new Error("Function not implemented.");
    //         }} isCreatingCredential={false} />

    const handleCancel = () => {
        setShowModal(false)
    }

    const handleOk = () => {

    }

    const showActionButtons = true
    // const showActionButtons = isPaymentStep || isCompleted



    return (
        <Modal
            width={800}
            open={showModal}
            title={isCompleted ? 'Review Offering' : modalTitle}
            footer={showActionButtons ? [
                <Button danger key="back" onClick={handleCancel} loading={isCancelling}>
                    {cancelText}
                </Button>,
                <Button loading={isLoading} key="submit" type="primary" onClick={handleOk} disabled={isCompleted ? false : isButtonDisabled || isCancelling}>
                    {submitText}
                </Button>
            ] : []}
        >
            <Spin spinning={isCancelling || isLoading}>
                {
                    isCompleted
                        ? <ReviewOffering offering={offering} setOfferingReview={setOfferingReview} />
                        : flow
                }
            </Spin>
        </Modal>
    )
}

export default PaymentFlowModal
