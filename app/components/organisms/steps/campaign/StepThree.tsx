import DebunkingCampaign from "@/app/components/molecules/description/DebunkCampaign";
import DebunkingSubject from "@/app/components/molecules/description/DebunkSubject";
import { Flex, Layout, theme } from "antd";

const StepThree = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col self-center">
            <DebunkingSubject />
            <DebunkingCampaign />
        </Flex>
    </Layout>
}

export default StepThree;
