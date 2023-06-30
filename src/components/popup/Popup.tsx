import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "redux/reducers";
import { hidePopup } from "redux/actions/popupActions";
import Backdrop from 'components/backdrop/Backdrop'
import './Popup.scss';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

interface PopupProps {
  title?: string;
  contents: string;
  center: boolean;
  link?: string;
  backdropClose?: boolean;
}

export default function Popup({ title = '', contents, link, center, backdropClose = true }: PopupProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const show = useSelector((state: RootState) => state.popup.isShow);
  const [iconShow, setIconShow] = useState<boolean>(false);
  const [errFlg, setErrFlg] = useState<boolean>(false);
  const errKeyword = ['error','エラー','権限'];

  useEffect(() => {
    if (show) {
      setIconShow(false);
      setIconShow(true);
    }
  }, [show]);

  useEffect(() => {
    const containsError:boolean = errKeyword.some(err => {
      const lowercaseContents = contents.toLowerCase();
      const lowercaseErr = err.toLowerCase();
      return lowercaseContents.includes(lowercaseErr);
    });
    setErrFlg(containsError);
  }, [contents]);
  
  // 上段ポップアップアイコン表示ロジック
  useEffect(() => {
    if (center) {
      setIconShow(false);
    } else {
      if (iconShow) {
        const timer = setTimeout(() => {
          setIconShow(false);
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [center, iconShow]);

  function popupClose() {
    dispatch(hidePopup());
    if (link) {
      navigate(link);
    }
  }

  return(
    <>
    <Backdrop open={center && show} onClick={() => backdropClose && popupClose()}/>
    {/* 上段ポップアップ */}
    <div className={'popup' + (show ? ' show' : ' hide') + (center ? ' none' : '')} onClick={() => popupClose()}>
      {iconShow && <NotificationsActiveIcon className='icon'/>}
      <div className='text'>
        { contents }
      </div>
    </div>
    {/* 中央ポップアップ */}
    <div className={'popup-center' + (show ? ' show' : ' hide') + (center ? '' : ' none')}>
      {errFlg ? 
        <OfflineBoltIcon className='icon error' sx={{ fontSize: 35 }}/>
        :
        <CheckCircleIcon className='icon' sx={{ fontSize: 35 }}/>
      }
      <div className='popup-title'>
        { title }
      </div>
      <div className='popup-contents'>
        { contents }
      </div>
      <button className='popup-button' onClick={() => popupClose()}>OK</button>
    </div>
    </>
  )
}