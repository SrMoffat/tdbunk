"use client"
import { StartCampaign } from '@/app/components/atoms/Icon';
import { Button, Card, Flex, message, Steps } from 'antd';
import Image from 'next/image';

export interface UserStorage {}

export interface StepTrackerProps {
    current: number;
    items: any[];
}

export interface StepContentProps {
    current: number;
    steps: any[];
}

export interface StepNavigationProps {
    steps: any[];
    current: number;
    nextButtonDisabled: boolean;
    setCurrent: React.Dispatch<React.SetStateAction<number>>
}

export const Title = () => {
    return (
        <Flex className="w-1/2 justify-center">
            <Image alt="Start Campaign" src={StartCampaign} width={300} height={300} />
        </Flex>
    )
}

export const StepTracker: React.FC<StepTrackerProps> = ({
    current,
    items
}) => {
    return (
        <Flex className="w-[calc(100%-8rem)]">
            <Card className="w-full">
                <Steps current={current} items={items} />
            </Card>
        </Flex>
    )
}

export const StepContent: React.FC<StepContentProps> = ({
    current,
    steps
}) => {
    return (
        <Flex className="w-[calc(100%-8rem)] h-auto min-h-[750px]">
            <Card className="w-full">
                {steps[current].content}
            </Card>
        </Flex>
    )
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
    steps,
    current,
    nextButtonDisabled,

    setCurrent
}) => {
    const isNotFirstStep = current > 0
    const hasMoreSteps = current < steps.length - 1
    const isLastStep = current === steps.length - 1

    const handleDone = () => {
        // next()
        message.success('Processing complete!')
    }

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    return (
        <Flex className="w-[calc(100%-8rem)] justify-between">
            {isNotFirstStep ? <Button onClick={() => prev()}>Back</Button> : <Button className="opacity-0 cursor-none pointer-events-none" />}
            {hasMoreSteps && <Button disabled={nextButtonDisabled} type="primary" onClick={() => next()}>Next</Button>}
            {isLastStep && <Button disabled type="primary" onClick={() => handleDone()}>Done</Button>}
        </Flex>
    )
}


export const isNextButtonDisabledForStepOne = (localStorageData: any, credentials: any[]) => {
    // @ts-ignore
    const existingLocalStorageCreds = localStorageData?.credentials
    const localStorageCredentials = existingLocalStorageCreds
        ? Object.values(existingLocalStorageCreds)
        : []
    const localCredentials = localStorageCredentials.flat()
    const hasLocalCreds = localCredentials.length > 0

    const stateCredentials = credentials
        ? Object.values(credentials)
        : []
    const contextCredentials = stateCredentials.flat()
    const hasStateCreds = contextCredentials.length > 0

    return !(hasStateCreds || hasLocalCreds)
}