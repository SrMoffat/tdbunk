import { Carousel } from 'antd';
import React from 'react';

const bgImageClassnames = 'h-[560px] bg-contain bg-no-repeat'

const LandingPageCarousel: React.FC = () => (
    <Carousel autoplay>
        <div className={`bg-[url('/Slide1.png')] ${bgImageClassnames}`}>
        </div>
        <div className={`bg-[url('/Slide2.png')] ${bgImageClassnames}`}>
        </div>
        <div className={`bg-[url('/Slide3.png')] ${bgImageClassnames}`}>
        </div>
    </Carousel>
);

export default LandingPageCarousel;
