import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from 'components/card/ProductCard';
import SocialCard from 'components/card/SocialCard';
import { Helmet } from 'react-helmet-async';
import { imgSrc, handleImgError } from "common/utils/ImgUtils";
import AuthService from 'api/service/AuthService';
import { UserState } from "store/types/UserActionTypes";
import SocialService, { SocialFilter, SocialInfo, CommentInfo } from 'api/service/SocialService';
import ProductService, { ProductFilter, ProductInfo } from 'api/service/ProductService';
import Empty from "components/empty/Empty";
import { showTopPopup } from "store/actions/popupActions";
import { loading, unloading } from "store/actions/loadingActions";
import { relativeTime } from 'common/utils/StringUtils';
import { Carousel } from "react-responsive-carousel";
import './Social.scss';

import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplyIcon from '@mui/icons-material/Reply';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';
import SendInput from 'components/input/SendInput';

export default function SocialDetail() {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const authService = AuthService();
  const socialService = SocialService();
  const productService = ProductService();

  const [user, setUser] = useState<UserState|undefined>(undefined);
  const [load, setLoad] = useState<boolean>(true);
  const [social, setSocial] = useState<SocialInfo|undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [socialList, setSocialList] = useState<SocialInfo[]>([]);
  const [commentList, setCommentList] = useState<Array<CommentInfo>>([]);
  const [reply, setReply] = useState<number|undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [tagOffset, setTagOffset] = useState<number>(0);
  const [tagOffsetLimit, setTagOffsetLimit] = useState<number>(0);

  useEffect(() => {
    if (id) {
      const user = authService.getCurrentUser();
      setUser(user);
      const socialId = parseInt(id);
      getSocialInfo(socialId);
      getSocialCommentList(socialId);
      getProductList();
      getSocialList();
    }
  }, [id]);

  useEffect(() => {
    setTagOffsetLimit(isSp ? 3 : 5);
    setTagOffset(0)
  }, [isSp]);

  async function getSocialInfo(socialId: number) {
    dispatch(loading(false, true));
    setLoad(true);
    await socialService.socialInfo(socialId).then(data => {
      if (data.responseData) {
        setSocial(data.responseData);
      }
    });
    dispatch(unloading());
    setLoad(false);
  }

  async function socialLike(socialId: number, liked: boolean) {
    if (liked) {
      await socialService.socialLike(socialId).then(data => {
        if (social) {
          setSocial(
            {...social, liked: liked, likedCount: social.likedCount ? social.likedCount + 1 : 1}
          );
        }
      });
    } else {
      await socialService.socialUnlike(socialId).then(data => {
        if (social) {
          setSocial(
            {...social, liked: liked, likedCount: social.likedCount ? social.likedCount - 1 : 0}
          );
        }
      });
    }
  }

  async function getProductList() {
    const filter: ProductFilter = {
      // keyword: 'Nike'
    };
    await productService.productList(filter).then(data => {
      setProductList(data.responseData.productList);
    });
  }

  async function getSocialList() {
    const filter: SocialFilter = {
      keyword: 'Summer',
      limit: 5
    };
    await socialService.socialList(filter).then(data => {
      setSocialList(data.responseData.socialList);
    });
  }

  async function getSocialCommentList(socialId: number) {
    await socialService.commentList(socialId).then(data => {
      setCommentList(data.responseData.commentList);
    });
  }

  function handleChange(index: number) {
    setCurrentIndex(index);
  }

  function onChangeMessage(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (message === "" || message.length === 0) {
      return;
    }
    if (authService.loginRequire() && social) {
      socialService.commentInsert(social.socialId, reply, message).then(data => {
        getSocialCommentList(social.socialId);
        setReply(undefined);
        setMessage("");
        scrollToCommentEnd();
      });
    }
  }

  function scrollToCommentEnd() {
    const commentArea = document.querySelector('.view');
    if (commentArea) {
      commentArea.scrollTop = 0;
    }
  }

  function deleteMessage(socialId: number, commentId: number) {
    if (authService.loginRequire() && social) {
      socialService.commentDelete(socialId, commentId).then(data => {
        getSocialCommentList(social.socialId);
      });
    }
  }

  function likeClick() {
    if (social) {
      if (authService.loginRequire()) {
        socialLike(social.socialId, !social.liked);
      }
    }
  }

  function share() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        dispatch(showTopPopup('URLをコピーしました'));
      }, (error) => {
        dispatch(showTopPopup('サポートしないブラウザです'));
      }
    );
  }

  function setReplyComment(commentId: number|undefined) {
    if (reply === commentId) {
      setReply(undefined);
    } else {
      setReply(commentId);
    }
  }

  function handlePrevClick() {
    if (tagOffset > 0) {
      setTagOffset(tagOffset - tagOffsetLimit);
    }
  };
  
  function handleNextClick() {
    if (tagOffset + tagOffsetLimit < productList.length) {
      setTagOffset(tagOffset + tagOffsetLimit);
    }
  };

  if (load) {
    return(
      <section className='social-detail'/>
    )
  }

  if (social) {
    return(
      <>
      <Helmet title={social ? '@' + social.name + 'のスタイル - DadLabo' : 'DadLabo'}/>
      <section className='social-detail'>
        <div className='social-media'>
          {/* ソーシャルパーツ */}
          <div className='media-area'>
            <div className='info'>
              <div className='profile'>
                <img src={imgSrc(social.profileImg)} onError={handleImgError}/>
                <div className='name'>
                  {social.name}
                  <div className='time'>{relativeTime(social.date)}</div>
                </div>
              </div>
              <button className='follow-btn'>
                フォロー
              </button>
            </div>
            <Carousel
              showStatus={false} infiniteLoop={false} showThumbs={false} selectedItem={currentIndex}
              emulateTouch={true} showIndicators={social.imgs.length > 1} onChange={handleChange}>
              {social.imgs.map(img => (
                <div key={img}>
                  <img src={img} loading='eager' onError={handleImgError}/>
                </div>
              ))}
            </Carousel>
            <div className='buttons'>
              <div className={social.liked ? 'like liked' : 'like'} onClick={(event) => likeClick()}>
                <span className='count'>{social.likedCount}</span>
                <FavoriteRoundedIcon className='icon'/>
              </div>
              <div className='share' onClick={() => share()}>
                <ShareTwoToneIcon className='icon'/>
              </div>
            </div>
            <div className='contents-box'>
              <p className='content'>
                {social.contents}
              </p>
              {social.tags?.map(tag => (
                <a className='hashtag' href={'#'} key={tag}>
                    {'#' + tag + ' '}
                </a>
                ))
              }
            </div>
          </div>
          {/* タグ商品パーツ */}
          {productList.length !== 0 &&
            <div className='tagged-area'>
              <div className='title'>
                <label>
                  <b>{productList.length}</b> 個のタグ商品
                </label>
                <div className='buttons'>
                  <button className={tagOffset === 0 ? 'prev-btn hide' : 'prev-btn'} onClick={handlePrevClick}>
                    <KeyboardArrowLeftSharpIcon className='icon'/>
                  </button>
                  <button className={tagOffset + tagOffsetLimit >= productList.length ? 'next-btn hide' : 'next-btn'} onClick={handleNextClick}>
                    <KeyboardArrowRightSharpIcon className='icon'/>
                  </button>
                </div>
              </div>
              <div className='tagged'>
                <ProductCard dataList={productList.slice(tagOffset, tagOffset + tagOffsetLimit)} mini={true} loading={load}/>
              </div>
            </div>
          }
          {/* コメントパーツ */}
          <div className='comment-area'>
            <div className='additional'>
              <label>
                <b>{commentList.length}</b> コメント
              </label>
            </div>
            <div className='view scroll'>
              {commentList.length === 0 ? 
                <div className='comment-empty'>
                  まだコメントがありません
                </div>
                :
                commentList.map((comment) => (
                  <div className={comment.replies.length > 0 ? 'comment-box replied' : 'comment-box'} key={comment.commentId}>
                    <div className={reply === comment.commentId ? 'comment selected' : 'comment'}>
                      <img className='profile' src={imgSrc(comment.profileImg)} onError={handleImgError}/>
                      <div className='contents-box'>
                        <div className='main'>
                          <div className='name'>
                            {comment.name}
                          </div>
                          <div className='message'>
                            {comment.contents}
                          </div>
                        </div>
                        <div className='bottom'>
                          <div className='time'>{relativeTime(comment.date)}</div>
                          {user?.userId !== comment.owner &&
                            <div className='reply' onClick={() => setReplyComment(comment.commentId)}>返信</div>
                          }
                        </div>
                      </div>
                      {user?.userId === comment.owner &&
                        <MoreHorizIcon className='icon' onClick={() => deleteMessage(comment.socialId, comment.commentId)}/>
                      }
                      {reply === comment.commentId &&
                        <ReplyIcon className='selected icon' onClick={() => setReplyComment(undefined)}/>
                      }
                    </div>
                    {comment.replies.map((reply) => (
                      <div className='comment reply' key={reply.commentId}>
                        <img className='profile' src={imgSrc(reply.profileImg)} onError={handleImgError}/>
                        <div className='contents-box'>
                          <div className='main'>
                            <div className='name'>
                              {reply.name}
                            </div>
                            <div className='message'>
                              {reply.contents}
                            </div>
                          </div>
                          <div className='bottom'>
                            <div className='time'>{relativeTime(reply.date)}</div>
                          </div>
                        </div>
                        {user?.userId === reply.owner &&
                          <MoreHorizIcon className='icon' onClick={() => deleteMessage(reply.socialId, reply.commentId)}/>
                        }
                      </div>
                    ))
                    }
                  </div>
                ))
              }
            </div>
            <SendInput className='social' value={message} placeholder={'コメントを作成'} onChange={onChangeMessage} submit={sendMessage}/>
          </div>
        </div>
        {/* 投稿ユーザースタイルパーツ */}
        <div className='recommends style'>
          <div className='title'>
            <span>
              <b>@{social.name}</b>のスタイルブック
            </span>
            <button className='more-btn'>
              もっと見る<KeyboardArrowRightSharpIcon className='icon'/>
            </button>
          </div>
          <SocialCard dataList={socialList} loading={load} additional={false} owned={true}/>
        </div>
      </section>
      </>
    )
  } else {
    return (
      <Empty/>
    )
  }
}