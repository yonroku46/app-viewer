import React, { useEffect, useState, ReactElement } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SearchNav, { SearchMenuItem } from 'components/nav/SearchNav';
import './Search.scss';

export default function Search() {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const menuItem: SearchMenuItem[] = [
    {
      category: 'カテゴリー1',
      items: [
        { value: 'Choice1', icon: <RocketLaunchIcon/>, title: '選択肢1'},
        { value: 'Choice2', icon: <RocketLaunchIcon/>, title: '選択肢2'},
      ]
    },
    {
      category: 'カテゴリー2',
      items: [
        { value: 'Choice3', icon: <RocketLaunchIcon/>, title: '選択肢3'},
        { value: 'Choice4', icon: <RocketLaunchIcon/>, title: '選択肢4'},
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
        <p className='title'>Title1</p>
      </div>
      <div className='contents'>
        <p className='title'>Title2</p>
      </div>
      <div className='contents'>
        <p className='title'>Title3</p>
      </div>
      <div className='contents'>
        <p className='title'>Title4</p>
      </div>
    </section>
    </>
  )
}