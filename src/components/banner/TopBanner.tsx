import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './TopBanner.scss';

export default function TopBanner({ background, url }: { background: string, url?: string }) {
  const navigate = useNavigate();

  const dummyBackground = 'https://ferret-one.akamaized.net/images/6246de0214292815545fdf29/original.jpeg?utime=1648811522'

  const bannerStyle = {
    backgroundImage: `url(${dummyBackground})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    height: '100%'
  };

  const bannerBackgroundStyle = {
    backgroundImage: `url(${dummyBackground})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    filter: 'blur(4px)',
  };

  return(
    <div className='top-banner' style={bannerBackgroundStyle} onClick={() => url && navigate(url)}>
      <div style={bannerStyle}></div>
    </div>
  )
}