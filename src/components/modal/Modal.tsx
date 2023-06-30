import Backdrop from 'components/backdrop/Backdrop'
import './Modal.scss';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface ModalProps {
  open: boolean;
  onClose: any;
}

export default function Modal({ open, onClose }: ModalProps) {
  
  function save() {
    onClose();
  }

  return(
    <>
      <Backdrop open={open} onClick={onClose}/>
      <Dialog className='modal' open={open} onClose={onClose}>
        <DialogTitle>環境設定</DialogTitle>
        <DialogContent>
          まだ設定できるものが存在しません
        </DialogContent>
        <DialogActions>
          <button className='save' onClick={() => save()}>保存</button>
        </DialogActions>
      </Dialog>
    </>
  )
}