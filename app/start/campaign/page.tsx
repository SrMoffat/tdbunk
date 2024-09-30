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
import { isNextButtonDisabledForStepOne, StepContent, StepNavigation, StepTracker, Title } from '@/app/start/campaign/components';
import { Flex, Layout } from 'antd';
import { useEffect, useState } from 'react';

export interface UserStorage { }

export enum StartCampaignSteps {
    CREDENTIALS = 'Credentials',
    CAMPAIGN_DETAILS = 'Campaign Details',
    VERIFY_DETAILS = 'Verify Details',
    START_CAMPAIGN = 'Start Campaign',
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
            content: <StepTwo {...commonProps} />,
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
        const isStepOne = current === 0

        const isDisabled = isStepOne
            ? isNextButtonDisabledForStepOne(
                localStorageData,
                credentials as unknown as any[]
            )
            : nextButtonDisabled

        setNextButtonDisabled(isDisabled)
    }, [current])

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

