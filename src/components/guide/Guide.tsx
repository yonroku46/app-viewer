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
          <label>商品について</label>
        </div>
        <div className='link'>
          <SavingsTwoToneIcon className='icon'/>
          <label>決済について</label>
        </div>
        <div className='link'>
          <LocalShippingTwoToneIcon className='icon'/>
          <label>配送について</label>
        </div>
        <div className='link'>
          <SwapHorizontalCircleTwoToneIcon className='icon'/>
          <label>返品について</label>
        </div>
        <div className='link'>
          <ContactSupportTwoToneIcon className='icon'/>
          <label>よくある質問</label>
        </div>
      </div>
    </div>
  )
}