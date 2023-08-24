import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from 'api/service/AuthService';
import { handleImgError } from "common/utils/ImgUtils";
import searchEmpty from 'assets/img/search-empty.png';
import ProductService, { ProductInfo } from 'api/service/ProductService';
import { currency, calcDiscountRate } from "common/utils/StringUtils";
import './ProductCard.scss';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { Card, Typography, CardActionArea } from '@mui/material';

export default function ProductCard({ dataList }: { dataList: ProductInfo[] }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductInfo[]>([]);

  const authService = new AuthService();
  const productService = new ProductService();

  useEffect(() => {
    setProducts([]);
    if (dataList.length > 0) {
      setLoading(false);
      setProducts(dataList)
    } else {
      const timeoutId = setTimeout(() => {
        if (dataList.length === 0) {
          setLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [dataList]);

  async function productLike(productId: number, liked: boolean) {
    if (liked) {
      await productService.productLike(productId).then(data => {
        const updatedDataList = products.map(data => {
          if (data.productId === productId) {
            return {...data, liked: liked};
          }
          return data;
        });
        setProducts(updatedDataList);
      });
    } else {
      await productService.productUnlike(productId).then(data => {
        const updatedDataList = products.map(data => {
          if (data.productId === productId) {
            return {...data, liked: liked};
          }
          return data;
        });
        setProducts(updatedDataList);
      });
    }
  }

  const likeClick = (event: React.MouseEvent, productId: number, liked: boolean) => {
    event.stopPropagation();
    if (authService.loginRequire()) {
      productLike(productId, liked)
    }
  };

  function CardSkeleton() {
    return(
      <div className='product-card skeleton'>
        <Skeleton variant='rectangular' height={170}/>
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width='60%'/>
        </Box>
      </div>
    )
  }

  if (loading) {
    return(
      <div className='contents cardbox'>
        {Array.from(new Array(10)).map((item, index) => (
          <CardSkeleton key={index}/>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return(
      <div className='empty'>
        <img src={searchEmpty}/>
        <div className='message'>{'条件に一致する商品が見つかりません'}</div>
      </div>
    )
  }

  return(
    <div className='contents cardbox'>
      {products.map((data) => (
        <Card className='product-card' key={data.productId} onClick={() => navigate('/products/' + data.productId)}>
          <span className={data.liked ? 'like liked' : 'like'} onClick={(event) => likeClick(event, data.productId, !data.liked)}>
            <StarRoundedIcon className='icon'/>
          </span>
          <CardActionArea className='media'>
            <CardMedia component='img' image={data.imgs[0]} onError={handleImgError} loading='lazy' alt={data.name}/>
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