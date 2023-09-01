import { useEffect, useState, useRef } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from 'components/card/ProductCard';
import SocialCard from 'components/card/SocialCard';
import { imgSrc, handleImgError } from "common/utils/ImgUtils";
import AuthService from 'api/service/AuthService';
import { UserState } from "store/types/UserActionTypes";
import SocialService, { SocialFilter, SocialInfo, CommentInfo } from 'api/service/SocialService';
import ProductService, { ProductFilter, ProductInfo } from 'api/service/ProductService';
import Empty from "components/empty/Empty";
import { showTopPopup } from "store/actions/popupActions";
import { loading, unloading } from "store/actions/loadingActions";
import { relativeTime } from 'common/utils/StringUtils';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Social.scss';

import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';

export default function SocialDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const authService = new AuthService();
  const socialService = new SocialService();
  const productService = new ProductService();

  const [user, setUser] = useState<UserState|undefined>(undefined);
  const [load, setLoad] = useState<boolean>(true);
  const [social, setSocial] = useState<SocialInfo|undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [socialList, setSocialList] = useState<SocialInfo[]>([]);
  const [commentList, setCommentList] = useState<Array<CommentInfo>>([]);
  const [commentAreaHeight, setCommentAreaHeight] = useState<number|null>(null);
  const [reply, setReply] = useState<number|undefined>(undefined);
  const mediaAreaRef = useRef<HTMLDivElement|null>(null);

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
    // comment-area高さ設定ロジック
    const setInitialCommentAreaHeight = () => {
      if (mediaAreaRef.current && commentAreaHeight === null) {
        setCommentAreaHeight(mediaAreaRef.current.clientHeight);
      }
    };
    // 最初mediaAreaRefが設定されるまで待機
    const waitForMediaAreaRef = setInterval(() => {
      if (mediaAreaRef.current) {
        clearInterval(waitForMediaAreaRef);
        setInitialCommentAreaHeight();
      }
    }, 50);
    // windowサイズ変更によるリサイズ
    const handleResize = () => {
      setInitialCommentAreaHeight();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
            {...social, liked: liked}
          );
        }
      });
    } else {
      await socialService.socialUnlike(socialId).then(data => {
        if (social) {
          setSocial(
            {...social, liked: liked}
          );
        }
      });
    }
  }

  async function getProductList(recommendFilter?: ProductFilter) {
    const filter: ProductFilter = recommendFilter || {
      keyword: 'Nike'
    };
    await productService.productList(filter).then(data => {
      const productListWithDateConverted = data.responseData.productList.map((product: ProductInfo) => ({
        ...product,
        date: new Date(product.date),
      }));
      setProductList(productListWithDateConverted);
    });
  }

  async function getSocialList(recommendFilter?: SocialFilter) {
    const filter: SocialFilter = recommendFilter || {
      keyword: 'Summer'
    };
    await socialService.socialList(filter).then(data => {
      const socialListWithDateConverted = data.responseData.socialList.map((social: SocialInfo) => ({
        ...social,
        date: new Date(social.date),
      }));
      setSocialList(socialListWithDateConverted);
    });
  }

  async function getSocialCommentList(socialId: number) {
    await socialService.commentList(socialId).then(data => {
      const commentListWithDateConverted = data.responseData.commentList.map((comment: CommentInfo) => ({
        ...comment,
        date: new Date(comment.date),
      }));
      setCommentList(commentListWithDateConverted);
    });
  }

  function keyHandler(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) {
      return;
    }
    if (event.key === 'Enter') {
      sendMessage(message);
    }
  }

  function sendMessage(comment: string) {
    if (comment.length === 0) {
      return;
    }
    if (authService.loginRequire() && social) {
      socialService.commentInsert(social.socialId, reply, comment).then(data => {
        getSocialCommentList(social.socialId);
        setReply(undefined);
        setMessage('');
      });
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

  if (load) {
    return(
      <section className='social-detail'/>
    )
  }

  if (social) {
    return(
      <section className='social-detail'>
        <div className='social-media'>
          {/* ソーシャルパーツ */}
          <div className='media-area' ref={mediaAreaRef}>
            <img className='thumbnail' src={imgSrc(social.imgs[0])} onError={handleImgError}/>
            <div className='info'>
              <div className='profile'>
                <img src={imgSrc(social.profileImg)} onError={handleImgError}/>
                {social.name} / {social.profileHeight}cm
              </div>
              <div className='buttons'>
                <div className={social.liked ? 'like liked' : 'like'} onClick={(event) => likeClick()}>
                  <FavoriteRoundedIcon className='icon'/>
                </div>
                <div className='share' onClick={() => share()}>
                  <ShareTwoToneIcon className='icon'/>
                </div>
              </div>
            </div>
            <div className='content'>
              <p>
                {social.contents}
              </p>
              {social.tags?.map(tag => (
                <a href={'#'} key={tag}>
                    {'#' + tag + ' '}
                </a>
                ))
              }
              <div className='time'>{relativeTime(social.date)}</div>
            </div>
          </div>
          {/* コメントパーツ */}
          <div className='comment-area' style={{ height: commentAreaHeight + 'px' }}>
            <div className='view'>
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
                        <div className='name'>{comment.name}</div>
                        <div className='message'>{comment.contents}</div>
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
                          <div className='name'>{reply.name}</div>
                          <div className='message'>{reply.contents}</div>
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
            <div className='write'>
              <input type='text' onKeyDown={keyHandler} value={message} placeholder='コメントを作成' onChange={(e) => setMessage(e.target.value)}/>
              <button className='send-btn' onClick={() => sendMessage(message)}>
                <SendIcon className='icon'/>
              </button>
            </div>
          </div>
        </div>
        {/* タグ商品パーツ */}
        <div className='recommends products'>
          <p>
            タグ付け商品
          </p>
          <ProductCard dataList={productList}/>
        </div>
        <div className='recommends style'>
          <p>
            <span className='name'>{social.name}</span>さんのスタイル
          </p>
          <SocialCard dataList={socialList} additional={false} owned={true}/>
          <button className='more-btn social'>
            + もっと見る
          </button>
        </div>
      </section>
    )
  } else {
    return (
      <Empty/>
    )
  }
}