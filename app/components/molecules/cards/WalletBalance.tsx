import { MonopolyMoney } from "@/app/providers/TbdexProvider";
import { Card, Flex, Statistic, StatisticProps, theme } from "antd";
import CountUp from "react-countup";

export interface WalletBalanceProps {
    money: MonopolyMoney | undefined;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
    money
}) => {
    const {
        token: { colorPrimary },
    } = theme.useToken()

    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );
    return (
        <Flex>
            <Card className="h-[100px]">
                <Statistic
                    prefix={money?.currency}
                    title="Wallet Balance"
                    value={money?.amount}
                    precision={2}
                    formatter={formatter}
                    valueStyle={{ color: colorPrimary, fontSize: 18, fontWeight: "bold" }}
                />
            </Card>
        </Flex>

    )
}