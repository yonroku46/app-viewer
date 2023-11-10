import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import './Home.scss';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

export default function HomeHeader() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [indexChange, setIndexChange] = useState<boolean>(false);
  const [swipe, setSwipe] = useState<boolean>(false);

  interface BannerProps {
    img: string;
    backgroundColor: string;
    title: string;
    subTitle: string;
    link: string;
    eventText?: string;
  }

  const banners: Array<BannerProps> = [
    {
      img: 'https://grepp-programmers.s3.amazonaws.com/production/file_resource/4793/KDT-clouding_application-main_banner_PC__1_.png',
      backgroundColor: 'cornflowerblue', 
      title: 'アプリ作成中',
      subTitle: '詳しくは担当の方へ',
      link: '/products',
    },
    {
      img: 'https://grepp-programmers.s3.amazonaws.com/production/file_resource/4352/KDT-Linux_System-main_banner_PC__1_.png',
      backgroundColor: 'orange',
      title: 'イベント開催',
      subTitle: '新着アイテムをゲット',
      link: '/products',
      eventText: '今すぐチェック'
    },
    {
      img:'https://grepp-programmers.s3.amazonaws.com/production/file_resource/4796/KDT-DataAnalysis-main_banner_PC.png',
      backgroundColor: '#e5b175',
      title: '管理スタッフ募集',
      subTitle: '一緒に働きましょう',
      link: '/social',
      eventText: '今すぐチェック'
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
        emulateTouch={true} showIndicators={true} interval={7000} transitionTime={750} onChange={handleChange}
        onSwipeStart={() => setSwipe(true)} onSwipeEnd={() => setSwipe(false)}>
        {banners.map(banner => (
          <div className='img-box' key={banner.img} onClick={() => navigate(banner.link)}>
            <img src={banner.img} loading='eager'/>
            <div className='slider-text' onClick={() => navigate(banners[currentIndex].link)}>
              <div className={indexChange || swipe ? 'sub-title hide' : 'sub-title'}>
                {banners[currentIndex].subTitle}
              </div>
              <div className={indexChange || swipe ? 'title hide' : 'title'}>
                {banners[currentIndex].title}
              </div>
              {banner.eventText &&
                <button className={indexChange || swipe ? 'check-btn hide' : 'check-btn'}>
                  {banner.eventText}<KeyboardArrowRightRoundedIcon/>
                </button>
              }
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  )
}