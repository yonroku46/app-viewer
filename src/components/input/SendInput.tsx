import React, { useRef, useEffect } from "react";
import './SendInput.scss';

import SendIcon from '@mui/icons-material/Send';

export default function SendInput({ className, value, placeholder, submit, onChange }:
    { className?: string, value: string, placeholder: string, submit: () => void, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && className === 'chat') {
      inputRef.current.focus();
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  };

  function keyHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === 'Enter') {
      submit();
    }
  }

  return(
    <form className={className ? 'send-input ' + className : 'send-input'} onSubmit={handleSubmit}>
      <input className={value.length > 0 ? 'active' : ''} type='text' ref={inputRef} value={value} placeholder={placeholder} onChange={onChange} onKeyDown={keyHandler}/>
      <button type='submit' className={value.length > 0 ? 'send-btn active' : 'send-btn'} onClick={submit}>
        <SendIcon className='icon'/>
      </button>
    </form>
  );
}