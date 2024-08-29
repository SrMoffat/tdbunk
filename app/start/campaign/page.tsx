"use client"
import { Footer } from '@/app/components/atoms';
import LandingHeader from '@/app/components/molecules/headers/LandingHeader';
import StepFour from '@/app/components/organisms/steps/campaign/StepFour';
import StepOne from '@/app/components/organisms/steps/campaign/StepOne';
import StepThree from '@/app/components/organisms/steps/campaign/StepThree';
import StepTwo from '@/app/components/organisms/steps/campaign/StepTwo';
import { CreateCampaignContextProvider } from '@/app/providers/CreateCampaignProvider';
import { StepContent, StepNavigation, StepTracker, Title } from '@/app/start/campaign/components';
import { Flex, Layout } from 'antd';
import { useState } from 'react';

export enum StartCampaignSteps {
    CREDENTIALS = 'Credentials',
    CAMPAIGN_DETAILS = 'Campaign Details',
    VERIFY_DETAILS = 'Verify Details',
    START_CAMPAIGN = 'Start Campaign',
}

export default function StartCampaignPage() {
    const [current, setCurrent] = useState<number>(0);
    const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(true);

    const commonProps = {
        nextButtonDisabled,
        setNextButtonDisabled
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

