import { Space } from "antd";
import React from "react";

export interface IconTextProps {
    icon: React.FC;
    text: string;
};

const IconText: React.FC<IconTextProps> = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

export default IconText;
