import { useNavigate } from "react-router-dom";
import './Contact.scss';

export default function Contact() {
  const navigate = useNavigate();

  return(
    <section className="contact fullsize">
      お問い合わせ
      <button className="back-btn" onClick={() => navigate(-1)}>戻る</button>
    </section>
  )
}