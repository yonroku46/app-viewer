import './Backdrop.scss';

export default function Backdrop({ open, onClick }: { open: boolean, onClick?: () => void }) {

  return(
    <div className={open ? 'backdrop visible' : 'backdrop'} onClick={onClick}/>
  )
}