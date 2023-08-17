import './Loading.scss';

export default function Loading({ dark }: { dark?: boolean}) {

  return(
    <div className={dark ? 'loading-pulse dark' : 'loading-pulse'}/>
  )
}