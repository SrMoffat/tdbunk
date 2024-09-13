"use client"
import CampaignDetails from '@/app/components/molecules/forms/CampaignDetails';
import DebunkSubject from '@/app/components/molecules/forms/DebunkSubject';
import InvestigatorsCredentials from '@/app/components/molecules/forms/InvestigatorsCredentials';
import { Flex, Layout, Steps, theme } from 'antd';
import React, { useState, useEffect } from 'react';
import { CampaignStepProps } from './StepOne';

const StepTwo: React.FC<CampaignStepProps> = ({
    setNextButtonDisabled: disableNextButton
}) => {
    const [current, setCurrent] = useState(0);
    const [nextButtonDisabled, setNextButtonDisabled] = useState<{ [x: string]: boolean }>({
        stepOne: true,
        stepTwo: true,
        stepThree: true,
    });

    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const commonProps = {
        setNextButtonDisabled
    }

    const steps = [
        {
            title: 'Debunk Subject',
            description: 'Add the details of the article to be debunked',
            content: (
                <DebunkSubject {...commonProps} />
            )
        },
        {
            title: 'Campaign Details',
            description: 'Add the details of the campaign debunking the article',
            content: (
                <CampaignDetails {...commonProps} />
            )
        },
        {
            title: "Investigators' Credentials",
            description: 'Add the credentials needed by face checkers to debunk the campaign subject. List of Selectable Credentials from those TDBunk has Integrated',
            content: (
                <InvestigatorsCredentials {...commonProps} />
            )
        },
    ];

    const onChange = (value: number) => {
        setCurrent(value);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    useEffect(() => {
        const {
            stepOne,
            stepTwo,
            stepThree,
        } = nextButtonDisabled

        const result = Boolean(stepOne)
            || Boolean(stepTwo)
            || Boolean(stepThree)

        disableNextButton(result)
    }, [nextButtonDisabled])

    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="h-auto min-h-[600px] flex-col">
            <Flex className="w-1/2 self-center">
                <Steps
                    size="small"
                    current={current}
                    items={items}
                    onChange={onChange}
                />
            </Flex>
            <Flex className="w-full mt-4">
                {steps[current]?.content}
            </Flex>
        </Flex>
    </Layout>
}

export default StepTwo;
