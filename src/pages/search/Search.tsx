import React, { useEffect, useState, ReactElement } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { IoRocketSharp } from "react-icons/io5";
import SearchNav, { SearchMenuItem } from '../../shared/components/SearchNav';
import './Search.scss';

export default function Search() {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const menuItem: SearchMenuItem[] = [
    {
      category: 'Category1',
      items: [
        { id: 1, value: 'Choice1', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Choice1'},
        { id: 2, value: 'Choice2', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Choice2'},
      ]
    },
    {
      category: 'Category2',
      items: [
        { id: 3, value: 'Choice3', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Choice3'},
        { id: 4, value: 'Choice4', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Choice4'},
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
    </section>
    </>
  )
}