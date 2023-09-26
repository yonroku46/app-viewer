import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { imgSrc, handleImgError } from "common/utils/ImgUtils";
import searchEmpty from 'assets/img/search-empty.png';
import AuthService from 'api/service/AuthService';
import SocialService, { SocialInfo } from 'api/service/SocialService';
import StackGrid, { Grid, easings, transitions } from 'react-stack-grid';
import './SocialCard.scss';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { Card, Typography, CardActionArea } from '@mui/material';

export default function SocialCard({ dataList, contentHide, loading, additional, owned, grid }: { dataList: SocialInfo[], contentHide?:boolean, loading: boolean, additional: boolean, owned?: boolean, grid?: boolean }) {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  const authService = AuthService();
  const socialService = SocialService();

  const [social, setSocial] = useState<SocialInfo[]>([]);
  const [cardWidth, setCardWidth] = useState<string>('');
  const [gutter, setGutter] = useState<number>(8);
  const [gridRef, setGridRef] = useState<Grid>();
  const [gridUpdateFlg, setGridUpdateFlg] = useState<boolean>(false);
  const { fade } = transitions;

  useEffect(() => {
    setCardWidth(isSp ? '50%' : '25%');
    setGutter(isSp ? 8 : 16);
    setGridUpdateFlg(true);
    const timer = setTimeout(() => {
      setGridUpdateFlg(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [isSp]);

  useEffect(() => {
    if (gridRef) {
      gridRef.updateLayout();
    }
  }, [dataList]);

  useEffect(() => {
    setSocial(dataList);
  }, [dataList]);

  async function socialLike(socialId: number, liked: boolean) {
    if (liked) {
      await socialService.socialLike(socialId).then(data => {
        const updatedDataList = social.map(data => {
          if (data.socialId === socialId) {
            return {...data, liked: liked, likedCount: data.likedCount ? data.likedCount + 1 : 1};
          }
          return data;
        });
        setSocial(updatedDataList);
      });
    } else {
      await socialService.socialUnlike(socialId).then(data => {
        const updatedDataList = social.map(data => {
          if (data.socialId === socialId) {
            return {...data, liked: liked, likedCount: data.likedCount ? data.likedCount - 1 : 0};
          }
          return data;
        });
        setSocial(updatedDataList);
      });
    }
  }

  const likeClick = (e: React.MouseEvent, socialId: number, liked: boolean) => {
    e.stopPropagation();
    if (authService.loginRequire()) {
      socialLike(socialId, liked)
    }
  };

  function CardSkeleton() {
    return(
      <div className='social-card'>
        <Skeleton variant='rectangular' height={160}/>
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width='60%'/>
        </Box>
      </div>
    )
  }

  if (loading) {
    return(
      <div className='contents cardbox skeleton'>
        {Array.from(new Array(5)).map((item, index) => (
          <CardSkeleton key={index}/>
        ))}
      </div>
    )
  }

  if (social.length === 0) {
    return(
      <div className='empty-cardbox'>
        <img src={searchEmpty}/>
        <div className='message'>{'条件に一致するデータが見つかりません'}</div>
      </div>
    )
  }

  if (grid) {
    return(
      <StackGrid className={gridUpdateFlg ? 'cardbox grid load' : 'cardbox grid'} gridRef={ref => setGridRef(ref)} columnWidth={cardWidth} gutterWidth={gutter} gutterHeight={gutter} monitorImagesLoaded={true}
        easing={easings.expoOut} appear={fade.appear} appeared={fade.appeared} enter={fade.enter} entered={fade.entered} leaved={fade.leaved}>
        {social.map((data) => (
          <Card className='social-card' key={data.socialId} onClick={() => navigate('/social/' + data.socialId)}>
            <CardMedia component='img' image={imgSrc(data.imgs[0])} onError={handleImgError} loading='lazy' alt={data.contents} key={data.socialId}/>
            {data.imgs.length > 1 &&
              <span className='more-label'>
                +{data.imgs.length - 1}
              </span>
            }
            <CardActionArea className='media'>
              <div className={data.liked ? 'like liked' : 'like'} onClick={(event) => likeClick(event, data.socialId, !data.liked)}>
                {data.likedCount !== undefined && data.likedCount > 0 &&
                  <div className={data.liked ? 'count liked' : 'count'}>{data.likedCount}</div>
                }
                <FavoriteRoundedIcon className='icon'/>
              </div>
            </CardActionArea>
            <CardContent className='content'>
              <div className='info'>
                <img className='profile' src={imgSrc(data.profileImg)} onError={handleImgError}/>
                <Typography className='sub-area' component='div'>
                  <div className='name'>
                    {data.name}
                  </div>
                </Typography>
              </div>
              <div className='additional'>
              {data.contents ?
                <span className='text'>{data.contents}</span>
                :
                <span className='text hashtag'>{data.tags?.map(tag => (
                  '#' + tag + ' '
                ))}</span>
              }
              </div>
            </CardContent>
          </Card>
        ))}
      </StackGrid>
    )
  } else {
    return(
      <div className='contents cardbox'>
        {social.map((data) => (
          <Card className='social-card' key={data.socialId} onClick={() => navigate('/social/' + data.socialId)}>
            <CardActionArea className='media'>
              <CardMedia component='img' image={imgSrc(data.imgs[0])} onError={handleImgError} loading='lazy' alt={data.contents}/>
              {data.imgs.length > 1 &&
                <span className='more-label'>
                  +{data.imgs.length - 1}
                </span>
              }
              <div className={data.liked ? 'like liked' : 'like'} onClick={(event) => likeClick(event, data.socialId, !data.liked)}>
                {data.likedCount !== undefined && data.likedCount > 0 &&
                  <div className={data.liked ? 'count liked' : 'count'}>{data.likedCount}</div>
                }
                <FavoriteRoundedIcon className='icon'/>
              </div>
            </CardActionArea>
            {!owned &&
            <CardContent className={contentHide ? 'content hide' :'content'}>
              <div className='info'>
                <img className='profile' src={imgSrc(data.profileImg)} onError={handleImgError}/>
                <Typography className='sub-area' component='div'>
                  <div className='name'>
                    {data.name}
                  </div>
                </Typography>
              </div>
              {additional &&
                <div className='additional'>
                  <span className='text'>{data.contents}</span>
                </div>
              }
            </CardContent>
            }
          </Card>
        ))}
      </div>
    );
  }
}