import { Card2, LogoIcon2 } from "@/app/components/atoms/Icon";
import { Flex, Typography } from "antd";
import Image from "next/image";

import countries from '@/public/countries.json';

const country = countries.filter((entry) => entry?.countryCode === "KE")[0]

const GovernmentInstitutionCredential = (props: any) => {
    const { showDrawer } = props
    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card2" src={Card2} width={300} height={300} />
                <Flex className="absolute right-4 top-2 flex-col justify-end items-end">
                    <Image alt="LogoIcon" src={LogoIcon2} width={40} height={40} />
                    <a href="https://mock-idv.tbddev.org" style={{ fontSize: 10, marginTop: -3, color: "white" }}>{`Government of ${country?.countryName}`} </a>
                </Flex>
                <Flex className="absolute right-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default GovernmentInstitutionCredential;