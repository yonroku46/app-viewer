import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import mainBanner from "assets/img/main-banner.webp";
import './Home.scss';

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

export default function HomeHeader() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [indexChange, setIndexChange] = useState<boolean>(false);

  interface BannerProps {
    img: string;
    backgroundColor: string;
    title: string;
    subTitle: string;
    link: string;
  }

  const banners: BannerProps[] = [
    {
      img: mainBanner,
      backgroundColor: 'cornflowerblue', 
      title: 'アプリ作成中',
      subTitle: 'まもなく公開されます\n詳しくは担当者へ',
      link: '/products'
    },
    {
      img: 'https://grepp-programmers.s3.amazonaws.com/production/file_resource/4352/KDT-Linux_System-main_banner_PC__1_.png',
      backgroundColor: 'orange',
      title: 'イベント開催',
      subTitle: 'オープン記念イベント開催\n詳しくは詳細ページから',
      link: '/products'
    },
    {
      img:'https://asset.programmers.co.kr/image/origin/production/banner/167969/6aad48a6-2f2e-45e8-9d73-794e8ca3aaba.png',
      backgroundColor: 'mediumpurple',
      title: '管理スタッフ募集',
      subTitle: 'OFFLINEショップの\n管理スタッフを募集します',
      link: '/social'
    },
  ]

  function handleChange(index: number) {
    setCurrentIndex(index);
    setIndexChange(true);
    setTimeout(() => {
      setIndexChange(false);
    }, 500);
  }

  return(
    <section className='home-header' style={{ backgroundColor: banners[currentIndex].backgroundColor }}>
      <Carousel className='banner'
        showStatus={false} autoPlay={true} infiniteLoop={true} showArrows={false} showThumbs={false} selectedItem={currentIndex}
        emulateTouch={true} showIndicators={false} interval={7000} transitionTime={750} onChange={handleChange}>
        {banners.map(banner => (
          <div className='img-box' key={banner.img} onClick={() => navigate(banner.link)}>
            <img src={banner.img} loading='eager'/>
          </div>
        ))}
      </Carousel>
      <div className='slider-text' onClick={() => navigate(banners[currentIndex].link)}>
        <div className={indexChange ? 'title hide' : 'title'}>
          {banners[currentIndex].title}
        </div>
        <div className={indexChange ? 'sub-title hide' : 'sub-title'}>
          {banners[currentIndex].subTitle}
        </div>
      </div>
      <div className='slider-btn'>
        <div className='prev' onClick={() => setCurrentIndex(prev => (prev === 0 ? banners.length - 1 : prev - 1))}>
          <KeyboardArrowLeftRoundedIcon className='icon'/>
        </div>
        {currentIndex + 1} / {banners.length}
        <div className='next' onClick={() => setCurrentIndex(prev => (prev === banners.length - 1 ? 0 : prev + 1))}>
          <KeyboardArrowRightRoundedIcon className='icon'/>
        </div>
      </div>
    </section>
  )
}