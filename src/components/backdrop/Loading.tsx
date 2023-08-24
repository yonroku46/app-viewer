import Backdrop from './Backdrop';
import './Loading.scss';

export default function Loading({ dark, show }: { dark?: boolean, show?: boolean }) {
  return(
    <>
      {dark && <Backdrop open={dark}/>}
      <div className={show ? dark ? 'loading' : 'loading darkbar' : 'loading hide'}/>
    </>
  )
}