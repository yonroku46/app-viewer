import { useNavigate } from "react-router-dom";
import { currency } from "common/utils/StringUtils";
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
  status?: string;
  colors: NonEmptyArray<string>;
}

export default function ProductCard({ products }: { products: ProductData[] }) {
  const navigate = useNavigate();

  return(
    <div className='contents cardbox'>
      {products.map((prod) => (
        <Card className='product-card' key={prod.id} onClick={() => navigate('/products/' + prod.id)}>
          {prod.status && (
            <label className={prod.status}>{prod.status}</label>
          )}
          <CardActionArea className='media'>
            <CardMedia component='img' image={prod.imgs[0]} alt={prod.name}/>
          </CardActionArea>
          <CardContent className='content'>
            <Typography className='name' gutterBottom variant='h5' component='div'>
              {prod.name}
            </Typography>
            <Typography className='sub-area' variant='body2' color='text.secondary'>
              <div className='colors'>
                {prod.colors.slice(0, 3).map((color) => (
                  <span style={{ backgroundColor: color }} key={color}></span>
                ))}
                {prod.colors.length > 3 && (
                  <span className='additional'>+{prod.colors.length - 3}</span>
                )}
              </div>
              <div>
                <span className={prod.priceSale ? 'sale' : 'price'}>{currency(prod.price)}</span>
                {prod.priceSale && <span className='price'>{currency(prod.priceSale)}</span>}
              </div>
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}