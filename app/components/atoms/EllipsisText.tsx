import { Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const EllipsisMiddle: React.FC<{ suffixCount: number; children: string }> = ({
    suffixCount,
    children,
}) => {
    const start = children.slice(0, children.length - suffixCount);
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text copyable style={{ fontSize: 10 }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};

export default EllipsisMiddle;
