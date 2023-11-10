import './Modal.scss';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface ModalProps {
  type?: string;
  data: Record<string, string>;
  open: boolean;
  onClose: any;
}

export default function Modal({ type, open, onClose }: ModalProps) {

  function save() {
    onClose();
  }
  
  if (type === 'app') {
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