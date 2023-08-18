import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import SideNav, { SideMenuItem } from 'components/nav/SideNav';
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

  const menuItem: SideMenuItem[] = [
    {
      category: '全体',
      items: [
        { value: 'dashboard', link: '/manage/admin/dashboard', icon: <SpaceDashboardTwoToneIcon/>, title: 'ダッシュボード'},
        { value: 'messages', link: '/manage/admin/messages', icon: <ForumTwoToneIcon/>, title: 'メッセージ'},
      ]
    },
    {
      category: '管理項目',
      items: [
        { value: 'user', link: '/manage/admin/user', icon: <PhotoCameraFrontTwoToneIcon/>, title: 'ユーザー管理'},
        { value: 'shop', link: '/manage/admin/shop', icon: <StoreMallDirectoryTwoToneIcon/>, title: 'ショップ管理'},
        { value: 'contact', link: '/manage/admin/contact', icon: <HeadsetTwoToneIcon/>, title: 'お問い合わせ管理'},
        { value: 'notice', link: '/manage/admin/notice', icon: <NotificationsActiveTwoToneIcon/>, title: 'お知らせ管理'},
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
    } else if (tab === 'dashboard') {
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