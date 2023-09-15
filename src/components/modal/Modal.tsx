import { useState } from 'react';
import './Modal.scss';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';

interface ModalProps {
  type?: string;
  data: Record<string, string>;
  open: boolean;
  onClose: any;
}

export default function Modal({ type, data, open, onClose }: ModalProps) {
  
  function handleClick() {
    console.info('You clicked the Chip.');
  };

  function save() {
    onClose();
  }
  
  if (type === 'brand') {
    return(
      <Dialog className='modal' open={open} onClose={onClose}>
        <DialogTitle className='title'>ブランド選択</DialogTitle>
        <DialogContent className='contents'>
          <div>
            {Object.entries(data).map(([brandKey, brandImg]) => (
              <Chip className='chip' onClick={handleClick} label={brandKey} key={brandKey} icon={<DoneIcon/>} size='small' variant='outlined'/>
            ))}
          </div>
        </DialogContent>
        <DialogActions className='bottom'>
          <button className='save' onClick={() => save()}>確認</button>
        </DialogActions>
      </Dialog>
    )
  } else if (type === 'category') {
    return(
      <Dialog className='modal' open={open} onClose={onClose}>
        <DialogTitle className='title'>カテゴリー選択</DialogTitle>
        <DialogContent className='contents'>
          <div>
            {Object.entries(data).map(([categoryKey, categoryIcon]) => (
              <Chip className='chip' onClick={handleClick} label={categoryIcon} key={categoryIcon} icon={<DoneIcon/>} size='small' variant='outlined'/>
            ))}
          </div>
        </DialogContent>
        <DialogActions className='bottom'>
          <button className='save' onClick={() => save()}>確認</button>
        </DialogActions>
      </Dialog>
    )
  } else if (type === 'app') {
    return(
      <Dialog className='modal' open={open} onClose={onClose}>
        <DialogTitle className='title'>環境設定</DialogTitle>
        <DialogContent className='contents'>
          まだ設定できるものが存在しません
        </DialogContent>
        <DialogActions className='bottom'>
          <button className='save' onClick={() => save()}>保存</button>
        </DialogActions>
      </Dialog>
    )
  } else {
    return(
      <></>
    )
  }
}