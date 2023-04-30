import React, { useEffect, useReducer } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { hidePopup } from "../../redux/actions/popupActions";
import { VscBellDot, VscPass } from "react-icons/vsc";

type PopupProps = {
  title?: String;
  contents: String;
  center: boolean;
  backdropClose?: boolean;
}

export default function Popup({ title = '', contents, center, backdropClose = true }: PopupProps) {

  const visible = useSelector((state: RootState) => state.popup.isVisible);
  const dispatch = useDispatch();

  function Backdrop({ onClick }: { onClick: () => void }) {
    return (
      <div className="backdrop" onClick={onClick}></div>
    );
  }

  return (
    <>
    {center && visible && 
      <Backdrop onClick={() => backdropClose && dispatch(hidePopup())}/>
    }
    {center &&
      <div className={'popup-center' + (visible ? ' visible' : ' hidden')}>
        <VscPass className='icon' color='greenyellow' size='42'/>
        <div className='popup-title'>
          { title }
        </div>
        <div className='popup-contents'>
          { contents }
        </div>
        <button className='popup-button' onClick={() => dispatch(hidePopup())}>OK</button>
      </div>
    }
    {!center &&
      <div className={'popup' + (visible ? ' visible' : ' hidden')} onClick={() => dispatch(hidePopup())}>
        <VscBellDot className='icon' size='24'/>
        <div>
          { contents }
        </div>
      </div>
    }
    </>
  )
}