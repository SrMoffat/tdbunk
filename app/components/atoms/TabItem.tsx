import { Flex, Typography } from "antd";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from 'next/image';
import React from "react";

export interface TabItemProps {
    name: string;
    icon: string | StaticImport;
}

const TabItem: React.FC<TabItemProps> = ({
    icon,
    name
}) => {
    return (
        <Flex className="flex items-center gap-1">
            <Image alt={name} src={icon} width={30} height={30} />
            <Typography.Text>{name}</Typography.Text>
        </Flex>
    );
};

export default TabItem;
