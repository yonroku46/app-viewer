import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { hidePopup } from "../../redux/actions/popupActions";
import { VscBellDot, VscPass, VscWorkspaceUntrusted } from "react-icons/vsc";
import './Popup.scss';

interface PopupProps {
  title?: string;
  contents: string;
  center: boolean;
  backdropClose?: boolean;
}

export default function Popup({ title = '', contents, center, backdropClose = true }: PopupProps) {
  const dispatch = useDispatch();

  const show = useSelector((state: RootState) => state.popup.isShow);
  const [iconShow, setIconShow] = useState<boolean>(false);
  const [errFlg, setErrFlg] = useState<boolean>(false);
  const errKeyword = ['error','エラー'];

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

  function Backdrop({ onClick }: { onClick: () => void }) {
    return (center && show ?
      <div className="backdrop" onClick={onClick}></div> : <></>
    );
  }

  return(
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
      {errFlg ? 
        <VscWorkspaceUntrusted className='icon' color='orange' size='42'/>
        :
        <VscPass className='icon' color='greenyellow' size='42'/>
      }
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