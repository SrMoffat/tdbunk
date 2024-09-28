import { Sponsorships } from "@/app/components/atoms/Icon"
import { Flex, Tag } from "antd"
import Image from "next/image"

export const CampaignAmount = () => {
    return (
        <Flex className="border items-center">
            <Image src={Sponsorships} alt="sponsorships" width={40} height={40} />
            <Tag color="gold">USD 300</Tag>
        </Flex>
    )
}