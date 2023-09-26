import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { imgSrc, handleImgError } from "common/utils/ImgUtils";
import { format } from 'date-fns';
import { showTopPopup, showCenterPopup } from "store/actions/popupActions";
import { loading, unloading } from "store/actions/loadingActions";
import './Labo.scss';

export default function Labo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentTime, setCurrentTime] = useState(new Date());
  const pdfFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  

  const handleUploadClick = async (e: any) => {
    if (!pdfFileInputRef.current) {
      alert('PDFファイルを選択してください。');
      return;
    }
    const pdfFile = pdfFileInputRef.current.files?.[0];
    if (!pdfFile) {
      alert('PDFファイルを選択してください。');
      return;
    }

    const apiGatewayEndpoint = 'https://bt7tec6lnc.execute-api.ap-northeast-1.amazonaws.com/v1';
    const bucketName = '/mk-tool/';
    const fileName = 'labo/' + pdfFile.name;
    const url = apiGatewayEndpoint + bucketName + fileName;

    fetch(url, {
      method: "PUT",
      body: pdfFile,
      headers: {
          "Content-Type": "application/pdf"
      }
    })
    .then(response => {
        if (response.ok) {
            alert("Success");
            // 保存されるURL、appUrlはリリースURL決まる次第変更予定
            const appurl = 'https://d3ldc4zez8gat7.cloudfront.net/'
            const savedPath = appurl + fileName;
            console.log(savedPath);
        } else {
            alert("Fail: " + response.status);
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
  };

  function openTopPopup(contents: string) {
    dispatch(showTopPopup(contents));
  }

  function openCenterPopup(title: string, contents: string) {
    dispatch(showCenterPopup(title, contents));
  }

  return(
    <>
    <section className='labo-page contents'>
      <img src={useMemo(() => imgSrc('tmp/dummy.jpg'), [])} onError={handleImgError} width='100px'/>
      <img src={useMemo(() => imgSrc('tmp/dummy.png'), [])} onError={handleImgError} width='100px'/>
      <div>{format(currentTime, 'yyyy-MM-dd')}</div>
      <div>{format(currentTime, 'HH:mm:ss')}</div>
      <br/>
      <button className='top' onClick={() => openTopPopup('top popup')}>topPop</button>
      <button className='center' onClick={() => openCenterPopup('title', 'center popup')}>topCenter</button>
      <br/>
      <button onClick={() => dispatch(loading(true, true))}>darkLoading</button>
      <button onClick={() => dispatch(loading(false, true))}>defaultLoading</button>
      <button onClick={() => dispatch(unloading())}>unLoading</button>
      <br/>
      <div>
        <h1>PDFアップロード</h1>
        <input type="file" id="pdfFile" accept=".pdf" ref={pdfFileInputRef} />
        <button onClick={handleUploadClick}>アップロード</button>
        <a href="https://d3ldc4zez8gat7.cloudfront.net/配達（パン）.pdf" target="_blank" rel="noopener noreferrer">
          View PDF
        </a>
        <iframe src='https://d3ldc4zez8gat7.cloudfront.net/配達（パン）.pdf#toolbar=0&navpanes=0'/>
      </div>
    </section>
    </>
  )
}