import DebunkingCampaign from "@/app/components/molecules/description/DebunkCampaign";
import DebunkCampaignStats from "@/app/components/molecules/description/DebunkCampaignStats";
import DebunkSubject from "@/app/components/molecules/description/DebunkSubject";
import { Flex, Layout, theme } from "antd";

const StepThree = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="justify-center gap-4 w-full">
            <DebunkCampaignStats isFull={false} />
            <Flex className="flex-col justify-between gap-4 w-full">
                <DebunkSubject />
                <DebunkingCampaign />
            </Flex>
        </Flex>
    </Layout>
}

export default StepThree;
