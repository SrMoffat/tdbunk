import { Card1, TBDVCLogoYellow } from "@/app/components/atoms/Icon";
import { Flex, Typography } from "antd";
import Image from "next/image";

import countries from '@/public/countries.json';

const country = countries.filter((entry) => entry?.countryCode === "KE")[0]

const FinancialInstitutionCredential = (props: any) => {
    const { showDrawer } = props
    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="card" src={Card1} width={300} height={300} />
                <Flex className="absolute left-4 top-4 flex-col">
                    <Image alt="LogoIcon" src={TBDVCLogoYellow} width={40} height={40} />
                    <a href="https://mock-idv.tbddev.org" style={{ fontSize: 10, marginTop: 8, color: "white" }}>TBD Issuer</a>
                </Flex>
                <Flex className="absolute left-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12 }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10 }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default FinancialInstitutionCredential;
