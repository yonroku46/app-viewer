import './SectionTitle.scss';

export default function SectionTitle({ main, sub, count }: { main: string, sub?: string, count?: number }) {

  return(
    <div className='section-title'>
      {count !== undefined ? 
      <>
        <div className='sub'>
          Result
        </div>
        <div className='main'>
          <span className='key'>{main}</span> {count}件
        </div>
      </>
      :
      <>
        <div className='sub'>
          {sub}
        </div>
        <div className='main'>
          {main}
        </div>
      </>
      }
    </div>
  )
}