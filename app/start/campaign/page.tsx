"use client"
import { Footer } from '@/app/components/atoms';
import LandingHeader from '@/app/components/molecules/headers/LandingHeader';
import StepFour from '@/app/components/organisms/steps/campaign/StepFour';
import StepOne from '@/app/components/organisms/steps/campaign/StepOne';
import StepThree from '@/app/components/organisms/steps/campaign/StepThree';
import StepTwo from '@/app/components/organisms/steps/campaign/StepTwo';
import { Flex, Layout } from 'antd';
import { useEffect, useState } from 'react';
import { StepContent, StepNavigation, StepTracker, Title } from '@/app/start/campaign/components';

export default function StartCampaignPage() {
    const [current, setCurrent] = useState(0);
    const [copied, setCopied] = useState(false)

    const steps = [
        {
            title: 'Credentials',
            content: <StepOne />,
        },
        {
            title: 'Campaign Details',
            content: <StepTwo />,
        },
        {
            title: 'Verify Details',
            content: <StepThree />,
        },
        {
            title: 'Start Campaign',
            content: <StepFour />,
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined
        if (copied) {
            timer = setTimeout(() => {
                setCopied(false)
            }, 1000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [copied])

    return (
        <Layout className="h-screen">
            <LandingHeader />
            <Flex className=" items-center flex-col pt-12 gap-5 h-auto mb-4">
                <Title />
                <StepTracker current={current} items={items} />
                <StepContent current={current} steps={steps} />
                <StepNavigation setCurrent={setCurrent} current={current} steps={steps} />
            </Flex>
            <Footer />
        </Layout>
    );
}

