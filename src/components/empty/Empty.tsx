import { useNavigate } from "react-router-dom";
import empty from "assets/img/empty.gif";
import './Empty.scss';

export default function Empty() {
  const navigate = useNavigate();
  const emptyMessageEng: string = 'Not found Page or Data';
  const emptyMessage: string = 'ページ又は\nデータがありません';

  return(
    <section className="empty fullsize">
      <div className="box">
        <img src={empty} alt='empty'/>
        <div className="message">
          <span className='eng'>{emptyMessageEng}</span>
          <span>{ emptyMessage }</span>
          <button className="back-btn" onClick={() => navigate(-1)}>戻る</button>
        </div>
      </div>
    </section>
  )
}