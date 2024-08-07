import React from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';

const contentStyle: React.CSSProperties = {
    // height: '560px',
    // color: '#fff',
    // lineHeight: '160px',
    // textAlign: 'center',
    // background: '#364d79',
};

const LandingPageCarousel: React.FC = () => (
    <Carousel autoplay>
        <div className="bg-[url('/Slide1.png')] h-[560px] bg-contain bg-no-repeat">
        </div>
        <div className="bg-[url('/Slide2.png')] h-[560px] bg-contain bg-no-repeat">
        </div>
        <div className="bg-[url('/Slide3.png')] h-[560px] bg-contain bg-no-repeat">
        </div>
    </Carousel>
);

export default LandingPageCarousel;