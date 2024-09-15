import MakePayment from "@/app/components/molecules/forms/MakePayment";
import { Credentials } from "@/app/components/organisms/Credentials";
import { INTERVALS_LOCAL_STORAGE_KEY, STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY, TDBUNK_CANCEL_REASON } from "@/app/lib/constants";
import { sendCloseMessage, sendOrderMessage, pollExchanges } from "@/app/lib/tbdex";
import { Button, Modal, Spin } from "antd";
import ReviewOffering from "../cards/Review";
import { createOfferingReviewCredential } from "@/app/lib/web5";
import { useState, useEffect } from "react"

const PaymentFlowModal = (props: any) => {
    const {
        money,
        values,
        pfiDid,
        pfiName,
        offering,
        showModal,
        isLoading,
        overallFee,
        feeDetails,
        isSelected,
        credentials,
        rawOffering,
        isCancelled,
        // isCompleted,
        setShowModal,
        isCancelling,
        selectedCard,
        setIsLoading,
        exchangeRate,
        userBearerDid,
        setIsSelected,
        campaignAmount,
        activateButton,
        isRequestQuote,
        offeringReview,
        createExchange,
        setSelectedCard,
        setAllExchanges,
        setIsCancelling,
        stateCredentials,
        relevantExchange,
        setActivateButton,
        setCampaignAmount,
        currentMarketRate,
        setOfferingReview,
        offeringCreatedAt,
        setRelevantExchange,
        offeringFromCurrency,
        hasRequiredCredentials,
        requiredPaymentDetails,
        setRequiredPaymentDetails,
        offeringToCurrencyMethods,
    } = props

    const isCompleted = true

    const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false)
    const [startPollingForMessages, setStartPollingForMessages] = useState(false)

    const isButtonDisabled = !activateButton

    const currencyCode = feeDetails?.currencyCode

    const allFee = `${currencyCode} ${overallFee}`

    const isPaymentStep = hasRequiredCredentials && isSelected

    const sourceCurrencyCode = rawOffering?.data?.payin.currencyCode

    const cancelText = isRequestQuote
        ? 'Cancel'
        : `${isCancelled || isCompleted ? 'Close' : 'Cancel Transfer'}`

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
                : isCompleted
                    ? 'Review Transfer'
                    : 'Make Transfer'
            : 'Select Credential'
        : 'Request Credentials'

    const handleOk = async () => {
        setIsLoading(true)

        if (isCancelled) return

        if (isCompleted) {
            console.log("IS Completed submit review", {
                offeringReview,
                // campaignDetails
                // transactionDetails
            })
            // Create review VC
            // const status = await createOfferingReviewCredential(
            //     web5,
            //     userBearerDid,
            //     {
            //         ...offeringReview,
            //         pfiDid
            //     }
            // )

            // if (status?.status.code === 202) {
            //     setIsLoading(false)
            //     notify?.('success', {
            //         message: 'Review Submitted!',
            //         description: 'Your review of  the transaction has submitted!'
            //     })
            // }

            // setShowModal(false)
        } else if (isRequestQuote) {
            setStartPollingForMessages(true)

            const convertedCampaignAmount = Math.floor(campaignAmount / parseFloat(exchangeRate))

            createExchange({
                requiredPaymentDetails,
                credentials,
                userBearerDid,
                amount: convertedCampaignAmount,
                offering: rawOffering,
                stateCredentials
            })

            console.log("IS Request Quote", {
                isRequestQuote,
                requiredPaymentDetails,
                credentials,
                userBearerDid,
                amount: convertedCampaignAmount,
                offering: rawOffering,
                stateCredentials
            })

        } else {
            console.log("IS Make Transfer")
            // Extract t

            // Start timer for the transfer
            localStorage?.setItem(STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY, JSON.stringify(new Date()))

            const isUsingWalletBalance = !Object.keys(requiredPaymentDetails?.payin).length

            if (isUsingWalletBalance) {
                const currentBalance = money?.amount
                const sameCurrency = money?.currency === offeringFromCurrency?.currencyCode

                const totalAmount = overallFee + campaignAmount

                const hasSufficientBalance = currentBalance > totalAmount

                if (!hasSufficientBalance && sameCurrency) {
                    // Set error and disable button, insufficient balance
                    console.log("Set error and disable button", {
                        hasSufficientBalance,
                        sameCurrency
                    })
                } else {
                    // Make deduction of amount from wallet
                    // Update state value with new amount
                    // Update wallet balance in local storage
                    console.log("make wallet deduction and store new value")
                }
            }

            // To Do: Check if the offering allows cancellations also aler user after they request quote
            const orderMessage = await sendOrderMessage({
                pfiDid,
                userBearerDid,
                exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
            })

            //   To Do: Since we are assuming the user of wallet balance here
            //     we should also check for insufficient balance and send
            //         Close message

            if (orderMessage) {
                // To Do: Create and store completed transaction in state and local storage



                console.log("Close modal and toast success txn complete", orderMessage)
                // setShowModal(false);
                // setIsCompleted(true)
                setStartPollingForMessages(false)
            }
        }
    };

    const handleCancel = async () => {
        if (isCompleted || isRequestQuote || isCancelled) {
            // Create a VC without user review?
            console.log("Canelled out of a review of PFI", offeringReview)
            setShowModal(false);
        } else {
            setIsCancelling(true)
            // Start Timer for Cancelling

            // To Do: Check if the offering allows cancellations also aler user after they request quote
            const closeMessage = await sendCloseMessage({
                pfiDid,
                userBearerDid,
                reason: TDBUNK_CANCEL_REASON,
                exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
            })

            console.log("Canelled out sendCloseMessage", {
                pfiDid,
                closeMessage,
                userBearerDid,
                reason: TDBUNK_CANCEL_REASON,
                exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
            })


            if (closeMessage) {
                // To Do: Create and store cancelled transaction in state and local storage

                console.log("Cancel Message returned", closeMessage)
                // End Timer for Cancelling

                // To Do: Reset form and all relevant state
                setStartPollingForMessages(false)

            }
        }
    };

    const showActionButtons = isPaymentStep || isCompleted

    const flow = hasRequiredCredentials
        ? isSelected
            ? <MakePayment
                money={money}
                pfiDid={pfiDid}
                pfiName={pfiName}
                monopolyMoney={money}
                offering={rawOffering}
                feeDetails={feeDetails}
                userBearerDid={userBearerDid}
                isRequestQuote={isRequestQuote}
                campaignAmount={campaignAmount}
                createExchange={createExchange}
                currentMarketRate={currentMarketRate}
                relevantExchange={relevantExchange}
                isLoading={isLoading || isCancelling}
                setActivateButton={setActivateButton}
                setCampaignAmount={setCampaignAmount}
                offeringCreatedAt={offeringCreatedAt}
                setPaymentDetails={setRequiredPaymentDetails}
                requiredPaymentDetails={requiredPaymentDetails}
                setHasInsufficientBalance={setHasInsufficientBalance}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
            : <Credentials
                offering={values}
                isSelected={isSelected}
                credentials={credentials}
                selectedCard={selectedCard}
                setIsSelected={setIsSelected}
                setSelectedCard={setSelectedCard}
            />
        : 'Create New Credential Form'


    // const insufficientBalance = Math.floor(campaignAmount / exchangeRate) > money?.amount

    // // To Do: Clean this up 🤢
    // // Maybe const disableActionButton = insufficientBalance || (!isCompleted && (isButtonDisabled || isCancelling));

    // console.log("Disable Action Button?", {
    //     result: insufficientBalance || (!isCompleted && (isButtonDisabled || isCancelling)),
    //     insufficientBalance,
    //     isCompleted,
    //     isButtonDisabled,
    //     isCancelling
    // })

    const disableActionButton = hasInsufficientBalance
        ? true
        : isCompleted ? false : isButtonDisabled || isCancelling

    useEffect(() => {
        if (startPollingForMessages) {
            console.log("Start Polling Messages")
            const intervalId = pollExchanges(userBearerDid, {
                latest: setRelevantExchange,
                all: setAllExchanges
            })
            const storedIntervals = localStorage.getItem(INTERVALS_LOCAL_STORAGE_KEY)

            if (storedIntervals) {
                const existingIntervals = JSON.parse(storedIntervals)
                const newIntervals = [...existingIntervals, intervalId]
                localStorage.setItem(INTERVALS_LOCAL_STORAGE_KEY, JSON.stringify(newIntervals))
            } else {
                localStorage.setItem(INTERVALS_LOCAL_STORAGE_KEY, JSON.stringify([intervalId]))
            }
        } else {
            console.log("🗑️ Stop Polling Messages and Clear all intervals 🗑️")
            // clearAllPollingTimers()
        }

    }, [startPollingForMessages])

    return (
        <Modal
            width={800}
            destroyOnClose
            open={showModal}
            title={isCompleted ? 'Review Offering' : modalTitle}
            footer={showActionButtons ? [
                <Button danger key="back" onClick={handleCancel} loading={isCancelling}>
                    {cancelText}
                </Button>,
                <Button loading={isLoading} key="submit" type="primary" onClick={handleOk} disabled={disableActionButton}>
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
