import { useNavigate } from "react-router-dom";
import empty from "../../assets/img/empty-img.jpg";

export default function Empty() {

  const navigate = useNavigate();
  const emptyMessage = 'ページが見つかりません\nURLをもう一度お確かめください';

  return(
    <div className="empty contents">
      <p className="message">{ emptyMessage }</p>
      <img src={empty}/>
      <button className="back-button" onClick={() => navigate(-1)}>戻る</button>
    </div>
  )
}