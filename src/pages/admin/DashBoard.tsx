import { MouseEvent, useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

export default function DashBoard() {
  const [text, setText] = useState<string>('');

  function send() {
    console.log(text)
  }

  return(
    <section className="contents">
      <textarea value={text} onChange={(e) => setText(e.target.value)}/>
      <button onClick={() => send()}>send</button>
    </section>
  )
}