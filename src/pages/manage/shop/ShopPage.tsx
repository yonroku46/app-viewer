import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import SideNav, { SideMenuItem } from 'components/nav/SideNav';
import DashBoard from "./DashBoard";
import DataManage from "./DataManage";
import './ShopPage.scss';

import SpaceDashboardTwoToneIcon from '@mui/icons-material/SpaceDashboardTwoTone';
import DonutSmallTwoToneIcon from '@mui/icons-material/DonutSmallTwoTone';

export default function ShopPage() {
  const navigate = useNavigate();
  const isSp = useMediaQuery({ maxWidth: 767 });
  const [fold, setFold] = useState<boolean>(isSp);
  const { tab } = useParams();

  const menuItem: SideMenuItem[] = [
    {
      category: '全体',
      items: [
        { value: 'dashboard', link: '/manage/shop/dashboard', icon: <SpaceDashboardTwoToneIcon/>, title: 'ダッシュボード'},
      ]
    },{
      category: '管理項目',
      items: [
        { value: 'data', link: '/manage/shop/products', icon: <DonutSmallTwoToneIcon/>, title: '商品管理'},
      ]
    },
  ]

  function TabView() {
    if (tab === 'products') {
      return <DataManage/>;
    } else if (tab === 'dashboard') {
      return <DashBoard/>;
    } else {
      return null;
    }
  }

  return(
    <section className='shop'>
      <SideNav menuItem={menuItem} fold={fold} setFold={setFold}/>
      <section className={fold ? 'with-nav sp' : 'with-nav'}>
        <TabView/>
      </section>
    </section>
  )
}