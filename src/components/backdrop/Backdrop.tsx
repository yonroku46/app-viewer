import Loading from 'components/backdrop/Loading'
import './Backdrop.scss';

export default function Backdrop({ onClick, open, loading }: { onClick?: () => void, open: boolean, loading?: boolean}) {

  return(
    <>
      <div className={open ? 'backdrop visible' : 'backdrop'} onClick={onClick}>
        {loading && <Loading/>}
      </div>
    </>
  )
}