import { Flex } from 'antd';
import { PFIs } from '@/app/lib/constants';
import {
    Area,
    AreaChart,
    Legend,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { PFI } from '@/app/partners/page';

const first = PFIs[0]
const second = PFIs[1]
const third = PFIs[2]
const fourth = PFIs[3]


const NumberOfMonthlyTransactionsPerPFIAreaChart = (props: any) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const randomNumber = () => Math.floor(Math.random() * 10) + 1;


    const generateRandomData = (
        first: PFI,
        second: PFI,
        third: PFI,
        fourth: PFI
    ) => {
        return months.map((month) => ({
            name: month,
            [first.name]: randomNumber(),
            [second.name]: randomNumber(),
            [third.name]: randomNumber(),
            [fourth.name]: randomNumber(),
        }));
    };

    const data = generateRandomData(first, second, third, fourth);
    return (
        <Flex className="w-full">
            <AreaChart width={700} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />

                <Area type="monotone" dataKey={first?.name} stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey={second?.name} stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey={third?.name} stroke="#fcba03" fill="#fcba03" />
                <Area type="monotone" dataKey={fourth?.name} stroke="#fc03c2" fill="#fc03c2" />

                <Tooltip />
                <Legend />
            </AreaChart>
        </Flex>
    )
}

export default NumberOfMonthlyTransactionsPerPFIAreaChart