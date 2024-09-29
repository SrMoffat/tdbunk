import { Flex } from 'antd';
import { PFIs } from '@/app/lib/constants';
import {
    Bar,
    BarChart,
    Legend,
    Rectangle,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { PFI } from '@/app/partners/page';


const first = PFIs[0]
const second = PFIs[1]
const third = PFIs[2]
const fourth = PFIs[3]

const NumberOfMonthlyTransactionsPerPFIBarChart = (props: any) => {

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
            <BarChart
                width={700}
                height={300}
                data={data}
            >
                <XAxis dataKey="name" />
                <YAxis />

                <Bar dataKey={first?.name} fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                <Bar dataKey={second?.name} fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                <Bar dataKey={third?.name} fill="#fcba03" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                <Bar dataKey={fourth?.name} fill="#fc03c2" activeBar={<Rectangle fill="gold" stroke="purple" />} />

                <Tooltip />
                <Legend />
            </BarChart>
        </Flex>
    )
}

export default NumberOfMonthlyTransactionsPerPFIBarChart