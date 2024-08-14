import { Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

const DebunkingSubject = () => {
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Debunk Title',
            children: 'Debunk Title',
            span: 3,
        },
        {
            key: '2',
            label: 'Debunk Source',
            children: 'Debunk Source',
            span: 3,

        },
        {
            key: '3',
            label: 'Debunk Link',
            children: 'Debunk Link',
            span: 3,

        },
    ];
    return (
        <Descriptions title="Debunking Subject" bordered items={items} />
    );
};

export default DebunkingSubject;


