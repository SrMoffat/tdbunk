"use client"
import { Footer } from '@/app/components/atoms';
import { StartCampaign } from '@/app/components/atoms/Icon';
import LandingHeader from '@/app/components/molecules/headers/LandingHeader';
import StepFour from '@/app/components/organisms/steps/campaign/StepFour';
import StepOne from '@/app/components/organisms/steps/campaign/StepOne';
import StepThree from '@/app/components/organisms/steps/campaign/StepThree';
import StepTwo from '@/app/components/organisms/steps/campaign/StepTwo';
import { Button, Card, Flex, Layout, message, Steps } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function StartCampaignPage() {
    const [current, setCurrent] = useState(1);
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

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const handleDone = () => {
        // next()
        message.success('Processing complete!')
    }

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const isNotFirstStep = current > 0
    const hasMoreSteps = current < steps.length - 1
    const isLastStep = current === steps.length - 1


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
                <Flex className="w-1/2 justify-center">
                    <Image alt="Start Campaign" src={StartCampaign} width={300} height={300} />
                </Flex>
                <Flex className="w-[calc(100%-8rem)]">
                    <Card className="w-full">
                        <Steps current={current} items={items} />
                    </Card>
                </Flex>
                <Flex className="w-[calc(100%-8rem)] h-auto min-h-[750px]">
                    <Card className="w-full">
                        {steps[current].content}
                    </Card>
                </Flex>
                <Flex className="w-[calc(100%-8rem)] justify-between">
                    {isNotFirstStep ? <Button onClick={() => prev()}>Back</Button> : <Button className="opacity-0 cursor-none pointer-events-none" />}
                    {hasMoreSteps && <Button type="primary" onClick={() => next()}>Next</Button>}
                    {isLastStep && <Button type="primary" onClick={() => handleDone()}>Done</Button>}
                </Flex>
            </Flex>
            <Footer />
        </Layout>
    );
}

