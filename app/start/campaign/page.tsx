"use client"
import { Footer } from '@/app/components/atoms';
import LandingHeader from '@/app/components/molecules/headers/LandingHeader';
import StepFour from '@/app/components/organisms/steps/campaign/StepFour';
import StepOne from '@/app/components/organisms/steps/campaign/StepOne';
import StepThree from '@/app/components/organisms/steps/campaign/StepThree';
import StepTwo from '@/app/components/organisms/steps/campaign/StepTwo';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import { CreateCampaignContextProvider } from '@/app/providers/CreateCampaignProvider';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import { StepContent, StepNavigation, StepTracker, Title } from '@/app/start/campaign/components';
import { Flex, Layout } from 'antd';
import { useState, useEffect } from 'react';

export interface UserStorage { }

export enum StartCampaignSteps {
    CREDENTIALS = 'Credentials',
    CAMPAIGN_DETAILS = 'Campaign Details',
    VERIFY_DETAILS = 'Verify Details',
    START_CAMPAIGN = 'Start Campaign',
}

const isNextButtonDisabledForStepOne = (localStorageData: any, credentials: any[]) => {
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

    console.log("Activate", {
        hasLocalCreds,
        localCredentials,

        hasStateCreds,
        contextCredentials,

        isDisabled: !(hasStateCreds || hasLocalCreds)
    })

    // return hasStateCreds || hasLocalCreds
    //     ? false
    //     : true
    return !(hasStateCreds || hasLocalCreds)
}

export default function StartCampaignPage() {
    const {
        credentials,

        setUserDid,
        setCredentials,
        setWeb5Instance,
        setUserBearerDid,
        setRecoveryPhrase,
    } = useWeb5Context()

    const [current, setCurrent] = useState<number>(0);
    const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(true);

    const [localStorageData] = useBrowserStorage<UserStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const commonProps = {
        nextButtonDisabled,
        setNextButtonDisabled,

        setUserDid,
        setCredentials,
        setWeb5Instance,
        setUserBearerDid,
        setRecoveryPhrase,
    }

    const steps = [
        {
            title: StartCampaignSteps.CREDENTIALS,
            content: <StepOne {...commonProps} />,
        },
        {
            title: StartCampaignSteps.CAMPAIGN_DETAILS,
            content: <StepTwo />,
        },
        {
            title: StartCampaignSteps.VERIFY_DETAILS,
            content: <StepThree />,
        },
        {
            title: StartCampaignSteps.START_CAMPAIGN,
            content: <StepFour />,
        },
    ];

    const items = steps.map(({ title }) => ({ key: title, title }));

    useEffect(() => {
        const isDisabled = isNextButtonDisabledForStepOne(
            localStorageData,
            credentials as unknown as any[]
        )

        setNextButtonDisabled(isDisabled)
        console.log("isDisabled", isDisabled)
    }, [])

    return (
        <Layout className="h-screen">
            <CreateCampaignContextProvider>
                <LandingHeader />
                <Flex className=" items-center flex-col pt-12 gap-5 h-auto mb-4">
                    <Title />
                    <StepTracker
                        items={items}
                        current={current}
                    />
                    <StepContent
                        steps={steps}
                        current={current}
                    />
                    <StepNavigation
                        steps={steps}
                        current={current}
                        setCurrent={setCurrent}
                        nextButtonDisabled={nextButtonDisabled}
                    />
                </Flex>
                <Footer />
            </CreateCampaignContextProvider>
        </Layout>
    );
};

