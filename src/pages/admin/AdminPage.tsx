import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import SideNav, { SideMenuItem } from 'components/nav/SideNav';
import AuthService from 'api/service/AuthService';
import DashBoard from "./DashBoard";
import UserManage from "./UserManage";
import DataManage from "./DataManage";
import './AdminPage.scss';

import ForumTwoToneIcon from '@mui/icons-material/ForumTwoTone';
import SpaceDashboardTwoToneIcon from '@mui/icons-material/SpaceDashboardTwoTone';
import PhotoCameraFrontTwoToneIcon from '@mui/icons-material/PhotoCameraFrontTwoTone';
import StoreMallDirectoryTwoToneIcon from '@mui/icons-material/StoreMallDirectoryTwoTone';
import HeadsetTwoToneIcon from '@mui/icons-material/HeadsetTwoTone';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';

export default function AdminPage() {
  const navigate = useNavigate();
  const isSp = useMediaQuery({ maxWidth: 767 });
  const [fold, setFold] = useState<boolean>(isSp);
  const { tab } = useParams();

  const authService = new AuthService();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, []);

  const menuItem: SideMenuItem[] = [
    {
      category: '全体',
      items: [
        { value: 'main', link: '/admin/manage/main', icon: <SpaceDashboardTwoToneIcon/>, title: 'ダッシュボード'},
        { value: 'messages', link: '/admin/manage/messages', icon: <ForumTwoToneIcon/>, title: 'メッセージ'},
      ]
    },
    {
      category: '管理項目',
      items: [
        { value: 'user', link: '/admin/manage/user', icon: <PhotoCameraFrontTwoToneIcon/>, title: 'ユーザー管理'},
        { value: 'shop', link: '/admin/manage/shop', icon: <StoreMallDirectoryTwoToneIcon/>, title: 'ショップ管理'},
        { value: 'contact', link: '/admin/manage/contact', icon: <HeadsetTwoToneIcon/>, title: 'お問い合わせ管理'},
        { value: 'notice', link: '/admin/manage/notice', icon: <NotificationsActiveTwoToneIcon/>, title: 'お知らせ管理'},
      ]
    },
  ]

  function TabView() {
    if (tab === 'user') {
      return <UserManage/>;
    } else if (tab === 'messages') {
      return <DataManage/>;
    } else if (tab === 'shop') {
      return <DataManage/>;
    } else if (tab === 'contact') {
      return <DataManage/>;
    } else if (tab === 'notice') {
      return <DataManage/>;
    } else if (tab === 'main') {
      return <DashBoard/>;
    } else {
      return null;
    }
  }

  return(
    <section className='admin'>
      <SideNav menuItem={menuItem} fold={fold} setFold={setFold}/>
      <section className={fold ? 'with-nav sp' : 'with-nav'}>
        <TabView/>
      </section>
    </section>
  )
}