import { CampaignAmount } from "@/app/components/atoms/AmountTag";
import { SearchOffers } from "@/app/components/atoms/SearchOffersInput";
import { DidUrlWithCopy } from "@/app/components/atoms/UrlWithCopy";
import { FactCheckersAvatars } from "@/app/components/molecules/avatars/FactCheckersGroup";
import { WalletBalance } from "@/app/components/molecules/cards/WalletBalance";
import { Flex, Layout, theme } from "antd";
import { Credentials } from "../../Credentials";

const StepFour = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col">
            <Flex className="justify-between">
                <Credentials />
                <WalletBalance />
            </Flex>
            <Flex className="border border-yellow-500 flex-col mt-4">
                <SearchOffers />
                <DidUrlWithCopy />
                <CampaignAmount />
                <FactCheckersAvatars />
                List of relevant PFI based on selection
            </Flex>
        </Flex>
    </Layout>
}

export default StepFour;
