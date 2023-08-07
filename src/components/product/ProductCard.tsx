import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { currency, calcDiscountRate } from "common/utils/StringUtils";
import './ProductCard.scss';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Card, Typography, CardActionArea } from '@mui/material';

type NonEmptyArray<T> = [T, ...T[]];

export interface ProductData {
  id: number;
  liked?: boolean;
  date: Date;
  name: string;
  imgs: NonEmptyArray<string>;
  price: number;
  priceSale?: number;
  colors: NonEmptyArray<string>;
  status: string;
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
      {products.map((prod) => (
        <Card className='product-card' key={prod.id} onClick={() => navigate('/products/' + prod.id)}>
          <span className={likedProducts.includes(prod.id) ? 'like liked' : 'like'} onClick={(event) => likeClick(event, prod.id)}>
            <StarRoundedIcon className='icon'/>
          </span>
          <CardActionArea className='media'>
            <CardMedia component='img' image={prod.imgs[0]} alt={prod.name}/>
            {prod.priceSale &&
              <span className='sale-label'>
                {calcDiscountRate(prod.price, prod.priceSale) + 'OFF'}
              </span>
            }
          </CardActionArea>
          <CardContent className='content'>
            <Typography className='name' gutterBottom variant='h5' component='div'>
              {prod.name}
            </Typography>
            <Typography className='sub-area' color='text.secondary' component='div'>
              <div>
                {prod.priceSale && <span className='price'>{currency(prod.priceSale)}</span>}
                <span className={prod.priceSale ? 'sale' : 'price'}>{currency(prod.price)}</span>
              </div>
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}