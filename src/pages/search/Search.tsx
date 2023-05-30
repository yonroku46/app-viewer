import React, { useEffect, useState, ReactElement } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { IoRocketSharp } from "react-icons/io5";
import SearchNav, { SearchMenuItem } from '../../shared/components/SearchNav';
import { GrInstagram, GrFacebook, GrTwitter, GrYoutube } from "react-icons/gr";
import './Search.scss';

export default function Search() {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const menuItem: SearchMenuItem[] = [
    {
      category: 'カテゴリー1',
      items: [
        { id: 1, value: 'Choice1', icon: <IoRocketSharp className='labo' size='15'/>, title: '選択肢1'},
        { id: 2, value: 'Choice2', icon: <IoRocketSharp className='labo' size='15'/>, title: '選択肢2'},
      ]
    },
    {
      category: 'カテゴリー2',
      items: [
        { id: 3, value: 'Choice3', icon: <IoRocketSharp className='labo' size='15'/>, title: '選択肢3'},
        { id: 4, value: 'Choice4', icon: <IoRocketSharp className='labo' size='15'/>, title: '選択肢4'},
      ]
    },
  ]

  const navigate = useNavigate();
  const [navShow, setNavShow] = useState<boolean>(true);

  useEffect(() => {
  }, []);

  return(
    <>
    <SearchNav menuItem={menuItem} isSp={isSp}/>
    <section className={navShow ? isSp ? 'with-nav sp search' : 'with-nav search' : 'search'}>
      <div className='contents'>
        <figure className="userdata">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample87.jpg" alt="sample87" />
          <span className='batch'>
            <GrFacebook/>
          </span>
          <figcaption className='facebook'>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/profile-sample4.jpg" alt="profile-sample4" className="profile" />
            <h2>天神 太郎<span>インフルエンサー</span></h2>
            <p>紹介</p>
            <a href="#" className="info">リクエスト</a>
          </figcaption>
        </figure>
        <figure className="userdata">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample87.jpg" alt="sample87" />
          <span className='batch'>
            <GrYoutube/>
          </span>
          <figcaption className='youtube'>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/profile-sample4.jpg" alt="profile-sample4" className="profile" />
            <h2>博多 太郎<span>インフルエンサー</span></h2>
            <p>紹介</p>
            <a href="#" className="info">リクエスト</a>
          </figcaption>
        </figure>
        <figure className="userdata">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample74.jpg" alt="sample87" />
          <span className='batch'>
            <GrInstagram/>
          </span>
          <figcaption className='instagram'>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/profile-sample5.jpg" alt="profile-sample4" className="profile" />
            <h2>的場 太郎<span>インフルエンサー</span></h2>
            <p>紹介</p>
            <a href="#" className="info">リクエスト</a>
          </figcaption>
        </figure>
        <figure className="userdata">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample74.jpg" alt="sample87" />
          <span className='batch'>
            <GrTwitter/>
          </span>
          <figcaption className='twitter'>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/profile-sample5.jpg" alt="profile-sample4" className="profile" />
            <h2>中洲 太郎<span>インフルエンサー</span></h2>
            <p>紹介</p>
            <a href="#" className="info">リクエスト</a>
          </figcaption>
        </figure>
      </div>
      <div className='contents'>
        <p className='title'>Title2</p>
      </div>
      <div className='contents'>
      <p className='title'>Title3</p>
      </div>
    </section>
    </>
  )
}