import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import SideNav, { SideMenuItem } from 'components/nav/SideNav';
import DashBoard from "./DashBoard";
import DataManage from "./DataManage";
import './ShopPage.scss';

import ForumTwoToneIcon from '@mui/icons-material/ForumTwoTone';
import SpaceDashboardTwoToneIcon from '@mui/icons-material/SpaceDashboardTwoTone';
import ConnectWithoutContactTwoToneIcon from '@mui/icons-material/ConnectWithoutContactTwoTone';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import ContentPasteSearchTwoToneIcon from '@mui/icons-material/ContentPasteSearchTwoTone';

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
        { value: 'messages', link: '/manage/shop/messages', icon: <ForumTwoToneIcon/>, title: 'メッセージ'},
      ]
    },{
      category: '管理項目',
      items: [
        { value: 'products', link: '/manage/shop/products', icon: <ContentPasteSearchTwoToneIcon/>, title: '商品管理'},
        { value: 'consign', link: '/manage/shop/consign', icon: <ConnectWithoutContactTwoToneIcon/>, title: '委託管理'},
        { value: 'order', link: '/manage/shop/order', icon: <LocalShippingTwoToneIcon/>, title: '注文管理'},
      ]
    },
  ]

  function TabView() {
    if (tab === 'products') {
      return <DataManage/>;
    } else if (tab === 'messages') {
      return <DashBoard/>;
    } else if (tab === 'consign') {
      return <DashBoard/>;
    } else if (tab === 'order') {
      return <DashBoard/>;
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