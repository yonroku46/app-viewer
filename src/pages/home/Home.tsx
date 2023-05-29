import React, { useEffect, useState, useMemo } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import './Home.scss';

export default function Home() {
  const navigate = useNavigate();

  return(
    <section className='home'>
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
  )
}