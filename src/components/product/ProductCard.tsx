import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { currency, calcDiscountRate } from "common/utils/StringUtils";
import './ProductCard.scss';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
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

export interface ProductData {
  id: number;
  liked?: boolean;
  date: Date;
  name: string;
  imgs: NonEmptyArray<string>;
  sizeImgIndex?: number;
  price: number;
  priceSale?: number;
  brand?: string;
  colors: NonEmptyArray<string>;
  status: string;
  size: NonEmptyArray<SizeData>;
  mainCategory: string;
  subCategory?: string;
  type: string;
  tags?: Array<string>;
  additional?: Array<AdditionalData>;
  history?: Array<ProductData>;
}

export default function ProductCard({ products }: { products: ProductData[] }) {
  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  const likeClick = (event: React.MouseEvent, productId: number) => {
    event.stopPropagation();
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter((id) => id !== productId));
    } else {
      setLikedProducts([...likedProducts, productId]);
    }
  };

  return(
    <div className='contents cardbox'>
      {products.map((data) => (
        <Card className='product-card' key={data.id} onClick={() => navigate('/products/' + data.id)}>
          <span className={likedProducts.includes(data.id) ? 'like liked' : 'like'} onClick={(event) => likeClick(event, data.id)}>
            <StarRoundedIcon className='icon'/>
          </span>
          <CardActionArea className='media'>
            <CardMedia component='img' image={data.imgs[0]} alt={data.name}/>
            {data.priceSale &&
              <span className='sale-label'>
                {calcDiscountRate(data.price, data.priceSale) + 'OFF'}
              </span>
            }
          </CardActionArea>
          <CardContent className='content'>
            <Typography className='name' gutterBottom variant='h5' component='div'>
              {data.name}
            </Typography>
            <Typography className='sub-area' color='text.secondary' component='div'>
              <div>
                {data.priceSale && <span className='price'>{currency(data.priceSale)}</span>}
                <span className={data.priceSale ? 'sale' : 'price'}>{currency(data.price)}</span>
              </div>
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}