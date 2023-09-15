import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UserState } from "store/types/UserActionTypes";
import AuthService from 'api/service/AuthService';
import './Contact.scss';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Checkbox from '@mui/material/Checkbox';

export default function Contact() {
  const navigate = useNavigate();
  const authService = AuthService();
  
  const categoryList: string[] = ['バグ対応', '商品注文・返品', 'その他']

  const [user, setUser] = useState<UserState|undefined>(undefined);
  const [mail, setMail] = useState<string>("");
  const [category, setCategory] = useState<string>(categoryList[0]);
  const [content, setContent] = useState<string>("");
  const [termsCheck, setTermsCheck] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  function checkHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setTermsCheck(checked);
  }

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mail === "" || category === "" || content === "") {
      return;
    }
    submit();
  }

  async function submit() {
    console.log(mail, category, content)
  }

  return(
    <section className="contact fullsize">
      <div className='sub-title'>
        Inquiry
      </div>
      <div className='title'>
        お問い合わせ
      </div>
      <form className='contact-form' onSubmit={onSubmitHandler}>
        <div className='email'>
          <label>メールアドレス</label>
          <input type='email' id='email' readOnly={user?.mail !== undefined} value={user?.mail ? user.mail : mail} onChange={(e) => setMail(e.target.value)}/>
        </div>
        <div className='category'>
          <label>お問い合わせ内容</label>
          <div className='select-box'>
            <select onChange={(e) => setCategory(e.target.value)}>
              {categoryList.map((category, index) => (
                <option value={category} key={index}>{category}</option>
              ))}
            </select>
            <ArrowDropDownIcon className='icon'/>
          </div>
        </div>
        <div className='content'>
          <label>内容詳細</label>
          <textarea id='content' value={content} onChange={(e) => setContent(e.target.value)}/>
        </div>
        <div className='terms-check'>
          <Checkbox className='icon' value={termsCheck} onChange={checkHandler}/>
          <span>
            <span className='policy' onClick={() => window.open('/policy?close=true', '_blank')}>個人情報の取り扱い</span>について同意する
          </span>
        </div>
        <button type='submit' className='submit-btn'>送信</button>
      </form>
    </section>
  )
}