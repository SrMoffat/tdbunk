import { Flex } from 'antd';
import {
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { PFI } from '@/app/partners/page';
import { PFIs } from '@/app/lib/constants';

const first = PFIs[0]
const second = PFIs[1]
const third = PFIs[2]
const fourth = PFIs[3]


const NumberOfMonthlyTransactionsPerPFILineChart = (props: any) => {
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
            <LineChart width={700} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />

                <Line type="monotone" dataKey={first?.name} stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey={second?.name} stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey={third?.name} stroke="#fcba03" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey={fourth?.name} stroke="#fc03c2" strokeWidth={2} activeDot={{ r: 8 }} />

                <Legend />
                <Tooltip />
            </LineChart>
        </Flex>
    )
}

export default NumberOfMonthlyTransactionsPerPFILineChart

