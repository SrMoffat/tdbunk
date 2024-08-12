import { theme, StatisticProps, Flex, Card, Statistic } from "antd";
import CountUp from "react-countup";

export interface WalletBalanceProps {}

export const WalletBalance: React.FC<WalletBalanceProps> = () => {
    const currency = 'USD'
    const {
        token: { colorPrimary },
    } = theme.useToken()
    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );
    return (
        <Flex>
            <Card className="h-[100px]">
                <Statistic prefix={currency} valueStyle={{ color: colorPrimary, fontSize: 18, fontWeight: "bold" }} title="Wallet Balance" value={1000} precision={2} formatter={formatter} />
            </Card>
        </Flex>

    )
}