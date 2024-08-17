"use client"
import CampaignDetails from '@/app/components/molecules/forms/CampaignDetails';
import DebunkSubject from '@/app/components/molecules/forms/DebunkSubject';
import InvestigatorsCredentials from '@/app/components/molecules/forms/InvestigatorsCredentials';
import { Flex, Layout, Steps, theme } from 'antd';
import { useState } from 'react';

const StepTwo = () => {
    const [current, setCurrent] = useState(0);

    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const steps = [
        {
            title: 'Debunk Subject',
            description: 'Add the details of the article to be debunked',
            content: (
                <DebunkSubject />
            )
        },
        {
            title: 'Campaign Details',
            description: 'Add the details of the campaign debunking the article',
            content: (
                <CampaignDetails />
            )
        },
        {
            title: "Investigators' Credentials",
            description: 'Add the credentials needed by face checkers to debunk the campaign subject. List of Selectable Credentials from those TDBunk has Integrated',
            content: (
                <InvestigatorsCredentials />
            )
        },
    ];

    const onChange = (value: number) => {
        console.log('onChange:', value);
        setCurrent(value);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

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
