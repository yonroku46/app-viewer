import { useEffect, useState, useRef } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthService from 'api/service/AuthService';
import UserService, { UserInfo } from 'api/service/UserService';
import { showCenterPopup } from "store/actions/popupActions";
import { loading, unloading } from "store/actions/loadingActions";
import './MyPage.scss';

export default function MyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userService = new UserService();
  const authService = new AuthService();

  const [userInfo, setUserInfo] = useState<UserInfo|undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSIze = 5 * 1024 * 1024;
  const supportedExtensions = ["jpg", "jpeg", "png"];

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      getUserInfo();
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  useEffect(() => {
    updateUserInfo();
  }, [selectedFile]);

  function profileUpdate() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file.size <= maxFileSIze) {
        setSelectedFile(file);
      } else {
        event.target.value = '';
        setSelectedFile(null);
        dispatch(showCenterPopup("ご確認", "ファイルサイズは\n5MB以下である必要があります"));
      }
    }
  };

  async function getUserInfo() {
    await userService.getUserInfo().then(data => {
      setUserInfo(data?.responseData);
    });
  }
  async function updateUserInfo() {
    if (selectedFile) {
      dispatch(loading(true, true));
      const idxDot = selectedFile.name.lastIndexOf(".") + 1;
      const extFile = selectedFile.name.substr(idxDot, selectedFile.name.length).toLowerCase();
      if (supportedExtensions.includes(extFile)) {
        const formData = new FormData();
        formData.append('profileImg', selectedFile);
        await userService.updateUserInfo(formData).then(data => {
          window.location.reload();
        });
        dispatch(unloading());
      } else {
        dispatch(showCenterPopup("ご確認", "サポートしてない形式のファイルです\n確認の上もう一度お試しください"));
      }
    }
  }
  
  return(
    <section className='mypage contents'>
      <h3>basic profile</h3>
      <div>{userInfo?.userName}</div>
      <div>{userInfo?.mail}</div>
      <input type="file" accept=".png,.jpg,.jpeg" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
      <button onClick={() => profileUpdate()}>プロフィール変更</button>
      <button>会員退会</button>
      <div className='mypage contents'>
        <h3>sns data</h3>
      </div>
      <div className='mypage contents'>
        <h3>casting data</h3>
      </div>
    </section>
  )
}