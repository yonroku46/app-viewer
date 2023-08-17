import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './StyleCard.scss';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { Card, Typography, CardActionArea } from '@mui/material';

type NonEmptyArray<T> = [T, ...T[]];

export interface SizeData {
  name: string;
  value: string;
  unit: string;
}

export interface AdditionalData {
  name: string;
  value: string;
}

export interface StyleData {
  styleId: number;
  liked?: boolean;
  date: Date;
  profile: string;
  name: string;
  imgs: NonEmptyArray<string>;
  size: NonEmptyArray<SizeData>;
  gender: string;
  tags?: Array<string>;
  additional?: Array<AdditionalData>;
}

export default function StyleCard({ dataList }: { dataList: StyleData[] }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [styles, setStyles] = useState<StyleData[]>([]);

  useEffect(() => {
    if (dataList.length > 0) {
      setIsLoading(false);
      setStyles(dataList)
    }
  }, [dataList]);

  const likeClick = (event: React.MouseEvent, styleId: number) => {
    event.stopPropagation();
    const updatedDataList = styles.map(data => {
      if (data.styleId === styleId) {
        return {...data, liked: !data.liked};
      }
      return data;
    });
    setStyles(updatedDataList);
    // TODO: save liked by styleId
  };

  function CardSkeleton() {
    return(
      <div className='style-card'>
        <Skeleton variant='rectangular' height={160}/>
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width='60%'/>
        </Box>
      </div>
    )
  }

  if (isLoading) {
    return(
      <div className='contents cardbox skeleton'>
        {Array.from(new Array(5)).map((item, index) => (
          <CardSkeleton key={index}/>
        ))}
      </div>
    )
  }

  return(
    <div className='contents cardbox'>
      {styles.map((data) => (
        <Card className='style-card' key={data.styleId} onClick={() => navigate('/styles/' + data.styleId)}>
          <span className={data.liked ? 'like liked' : 'like'} onClick={(event) => likeClick(event, data.styleId)}>
            <FavoriteRoundedIcon className='icon'/>
          </span>
          <CardActionArea className='media'>
            <CardMedia component='img' image={data.imgs[0]} loading='lazy' alt={data.name}/>
          </CardActionArea>
          <CardContent className='content'>
            <img className='profile' src={data.profile}/>
            <Typography className='sub-area' gutterBottom variant='h5' component='div'>
              <span className='name'>
                {data.name}
              </span>
              {data.size.map(size =>
                <span className='additional' key={size.name}>
                  {size.value}{size.unit}
                </span>
              )}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}