import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './StyleCard.scss';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
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
  id: number;
  favorited?: boolean;
  date: Date;
  profile: string;
  name: string;
  imgs: NonEmptyArray<string>;
  size: NonEmptyArray<SizeData>;
  type: string;
  tags?: Array<string>;
  additional?: Array<AdditionalData>;
}

export default function StyleCard({ styles }: { styles: StyleData[] }) {
  const navigate = useNavigate();
  const [favoriteStyles, setFavoriteStyles] = useState<number[]>([]);

  const favoriteClick = (event: React.MouseEvent, styleId: number) => {
    event.stopPropagation();
    if (favoriteStyles.includes(styleId)) {
      setFavoriteStyles(favoriteStyles.filter((id) => id !== styleId));
    } else {
      setFavoriteStyles([...favoriteStyles, styleId]);
    }
  };

  return(
    <div className='contents cardbox'>
      {styles.map((data) => (
        <Card className='style-card' key={data.id} onClick={() => navigate('/styles/' + data.id)}>
          <span className={favoriteStyles.includes(data.id) ? 'favorite favorited' : 'favorite'} onClick={(event) => favoriteClick(event, data.id)}>
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
                <span className='additional'>
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