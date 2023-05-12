import React, { useState, useRef } from 'react';
import { VscWorkspaceTrusted } from "react-icons/vsc";
import './Authenticator.scss';

export default function Authenticator() {

  const code: string = "1234";
  const [inputCode, setInputCode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  function handleInputChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
  
    // 数字以外は無視
    if (!/^\d*$/.test(value)) {
      return;
    }
    // 入力するたびに次の入力欄へ移動
    if (value.length > 0 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
    // 入力値が1桁以上の場合コードアップデート
    if (value.length <= 1) {
      const newCode = inputCode.substring(0, index) + value + inputCode.substring(index + 1);
      setInputCode(newCode);
    }
  }
    
  function handleInputKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && index > 0) {
      inputRefs[index - 1].current?.focus();
      setIsError(false);
    }
    if (e.key === "ArrowRight" && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === "Enter") {
      codeCheck();
    }
  }

  function codeCheck() {
    setIsError(code !== inputCode);
    setIsDone(code === inputCode);
  }

  return (
    <>
    {/* 認証コンポネント */}
    <div className='authenticator' onClick={() => {}}>
      <div>
        <VscWorkspaceTrusted className='icon' size='64'/>
        <p className='title'>認証</p>
        <p className={'sub-title' + (isError ? ' err' : '')}>{ isError ? '正しくありません\nもう一度お確かめください' : isDone ? '少々お待ちください' : '送信された番号を入力してください' }</p>
      </div>
      {inputRefs.map((inputRef, index) => (
        <input className={inputCode[index] ? 'entered' : 'not-entered'} key={index} type="text" maxLength={1} ref={inputRef} value={inputCode[index] || ""}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleInputKeyDown(index, e)}
        />
      ))}
      <div>
        <button className={'ok-button' + (inputCode.length === 4 ? '' : ' disable')} onClick={() => codeCheck()}>OK</button>
      </div>
    </div>
    </>
  )
}