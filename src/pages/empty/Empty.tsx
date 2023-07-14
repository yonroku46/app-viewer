import { useNavigate } from "react-router-dom";
import empty from "assets/img/empty.png";
import './Empty.scss';

export default function Empty() {
  const navigate = useNavigate();
  const emptyMessage: string = 'ページが見つかりません\nURLをもう一度お確かめください';

  return(
    <section className="empty fullsize">
      <p className="message">{ emptyMessage }</p>
      <img src={empty} alt='empty'/>
      <button className="back-btn" onClick={() => navigate(-1)}>戻る</button>
    </section>
  )
}