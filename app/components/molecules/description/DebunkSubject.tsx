import { Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

const DebunkingSubject = () => {
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Article Title',
            children: 'Article Title',
            span: 3,
        },
        {
            key: '2',
            label: 'Article Source',
            children: 'Article Source',
            span: 3,

        },
        {
            key: '3',
            label: 'Article Link',
            children: 'Article Link',
            span: 3,

        },
    ];
    return (
        <Descriptions title="Debunking Subject" bordered items={items} />
    );
};

export default DebunkingSubject;


