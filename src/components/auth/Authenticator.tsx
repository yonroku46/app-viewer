import React, { useEffect, useState, useRef } from 'react';
import './Authenticator.scss';

export default function Authenticator() {

  const code: string = "12345";
  const [inputCode, setInputCode] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (inputCode.length === 5) {
      codeCheck()
    }
  }, [inputCode]);

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
    setIsComplete(code === inputCode);
  }

  return(
    <>
    {/* 認証コンポネント */}
    <div className='authenticator' onClick={() => {}}>
      <div className='code-area'>
      {inputRefs.map((inputRef, index) => (
        <input className={inputCode[index] ? 'entered' : 'not-entered'} key={index} type="text" maxLength={1} ref={inputRef} value={inputCode[index] || ""}
        onChange={(e) => handleInputChange(index, e)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleInputKeyDown(index, e)}
        />
        ))}
      </div>
      <div>
        <p className={'description' + (isError ? ' err' : '')}>{ isError ? '正しくありません\nもう一度お確かめください' : isComplete ? '確認中' : 'メールに送信された番号を\n入力してください' }</p>
      </div>
    </div>
    </>
  )
}