import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { hidePopup } from "../../redux/actions/popupActions";
import { VscBellDot, VscPass } from "react-icons/vsc";

type PopupProps = {
  title?: string;
  contents: string;
  center: boolean;
  backdropClose?: boolean;
}

export default function Popup({ title = '', contents, center, backdropClose = true }: PopupProps) {

  const show = useSelector((state: RootState) => state.popup.isShow);
  const dispatch = useDispatch();

  const [iconShow, setIconShow] = useState(false);

  useEffect(() => {
    if (show) {
      setIconShow(false);
      setIconShow(true);
    }
  }, [show]);
  
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

  function Backdrop({ onClick }: { onClick: () => void }) {
    return (
      <div className={"backdrop" + (center && show ? ' show' : ' hide')} onClick={onClick}></div>
    );
  }

  return (
    <>
    <Backdrop onClick={() => backdropClose && dispatch(hidePopup())}/>
    {/* 上段ポップアップ */}
    <div className={'popup' + (show ? ' show' : ' hide') + (center ? ' none' : '')} onClick={() => dispatch(hidePopup())}>
      {iconShow && <VscBellDot className='icon' size='24'/>}
      <div>
        { contents }
      </div>
    </div>
    {/* 中央ポップアップ */}
    <div className={'popup-center' + (show ? ' show' : ' hide') + (center ? '' : ' none')}>
      <VscPass className='icon' color='greenyellow' size='42'/>
      <div className='popup-title'>
        { title }
      </div>
      <div className='popup-contents'>
        { contents }
      </div>
      <button className='popup-button' onClick={() => dispatch(hidePopup())}>OK</button>
    </div>
    </>
  )
}