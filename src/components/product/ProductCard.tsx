import { useNavigate } from "react-router-dom";
import { currency, calcDiscountRate } from "common/utils/StringUtils";
import './ProductCard.scss';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Card, Typography, CardActionArea } from '@mui/material';

type NonEmptyArray<T> = [T, ...T[]];

export interface ProductData {
  id: number;
  date: Date;
  name: string;
  imgs: NonEmptyArray<string>;
  price: number;
  priceSale?: number;
  colors: NonEmptyArray<string>;
}

export default function ProductCard({ products }: { products: ProductData[] }) {
  const navigate = useNavigate();

  return(
    <div className='contents cardbox'>
      {products.map((prod) => (
        <Card className='product-card' key={prod.id} onClick={() => navigate('/products/' + prod.id)}>
          <CardActionArea className='media'>
            <CardMedia component='img' image={prod.imgs[0]} alt={prod.name}/>
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
              {prod.priceSale &&
                <div className='sale-label'>
                  <span>
                    {calcDiscountRate(prod.price, prod.priceSale) + 'OFF'}
                  </span>
                </div>
              }
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}