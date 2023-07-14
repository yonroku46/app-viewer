import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import SideNav, { SideMenuItem } from 'components/nav/SideNav';
import DashBoard from "./DashBoard";
import UserManage from "./UserManage";
import DataManage from "./DataManage";
import './AdminPage.scss';

import SpaceDashboardTwoToneIcon from '@mui/icons-material/SpaceDashboardTwoTone';
import DonutSmallTwoToneIcon from '@mui/icons-material/DonutSmallTwoTone';
import PhotoCameraFrontTwoToneIcon from '@mui/icons-material/PhotoCameraFrontTwoTone';

export default function AdminPage() {
  const navigate = useNavigate();
  const isSp = useMediaQuery({ maxWidth: 767 });
  const [fold, setFold] = useState<boolean>(isSp);
  const { tab } = useParams();

  const menuItem: SideMenuItem[] = [
    {
      category: '全体',
      items: [
        { value: 'dashboard', link: '/admin/dashboard', icon: <SpaceDashboardTwoToneIcon/>, title: 'ダッシュボード'},
      ]
    },{
      category: '管理項目',
      items: [
        { value: 'user', link: '/admin/user', icon: <PhotoCameraFrontTwoToneIcon/>, title: 'ユーザー管理'},
        { value: 'data', link: '/admin/data', icon: <DonutSmallTwoToneIcon/>, title: 'データ管理'},
      ]
    },
  ]

  function TabView() {
    if (tab === 'user') {
      return <UserManage/>;
    } else if (tab === 'data') {
      return <DataManage/>;
    } else if (tab === 'dashboard') {
      return <DashBoard/>;
    } else {
      return null;
    }
  }

  return(
    <>
    <SideNav menuItem={menuItem} fold={fold} setFold={setFold}/>
    <section className={fold ? 'with-nav sp admin' : 'with-nav admin'}>
      <TabView/>
    </section>
    </>
  )
}