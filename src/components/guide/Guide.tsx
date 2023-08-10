import './Guide.scss';

import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import SwapHorizontalCircleTwoToneIcon from '@mui/icons-material/SwapHorizontalCircleTwoTone';
import ContactSupportTwoToneIcon from '@mui/icons-material/ContactSupportTwoTone';

export default function Guide() {

  return(
    <div className='guide'>
      <div className='sub'>Guide</div>
      <div className='main'>ショッピングガイド</div>
      <div className='links'>
        <div className='link'>
          <ShoppingBagTwoToneIcon className='icon'/>
          <span>商品について</span>
        </div>
        <div className='link'>
          <SavingsTwoToneIcon className='icon'/>
          <span>決済について</span>
        </div>
        <div className='link'>
          <LocalShippingTwoToneIcon className='icon'/>
          <span>配送について</span>
        </div>
        <div className='link'>
          <SwapHorizontalCircleTwoToneIcon className='icon'/>
          <span>返品について</span>
        </div>
        <div className='link'>
          <ContactSupportTwoToneIcon className='icon'/>
          <span>よくある質問</span>
        </div>
      </div>
    </div>
  )
}