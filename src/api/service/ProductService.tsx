import { useDispatch } from "react-redux";
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

type NonEmptyArray<T> = [T, ...T[]];

export interface ProductFilter {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: Array<string>;
  category?: Array<number>;
  status?: Array<number>;
}

export interface ProductInfo {
  productId: number;
  owner: number;
  name: string;
  imgs: NonEmptyArray<string>;
  sizeIdx?: number;
  price: number;
  priceSale?: number;
  brand?: string;
  colors: NonEmptyArray<string>;
  status: string;
  size: NonEmptyArray<any>;
  mainCategory: string;
  subCategory?: string;
  gender: string;
  tags?: Array<string>;
  additional?: Array<any>;
  history: Array<number>;
  date: Date;
  liked: boolean;
}

export default class ProductService {
  dispatch = useDispatch();

  async productInfo(productId: number): Promise<any> {
    const params = {
      productId: productId
    }
    return axios.get<ApiResponse>(ApiRoutes.PRODUCT_INFO, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }
  
  async productList(filter: ProductFilter): Promise<any> {
    const params = {
      keyword: filter.keyword,
      minPrice: filter.minPrice,
      maxPrice: filter.maxPrice,
      brands: filter.brands?.join(','),
      category: filter.category?.join(','),
      status: filter.status?.join(',')
    }
    return axios.get<ApiResponse>(ApiRoutes.PRODUCT_FILTER, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async getProductHistoryInfo(productId: number, productIdList: Array<number>): Promise<any> {
    const params = {
      productId: productId,
      productIdList: productIdList.join(',')
    }
    return axios.get<ApiResponse>(ApiRoutes.PRODUCT_HISTORY, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async productLike(productId: number): Promise<any> {
    return axios.put<ApiResponse>(ApiRoutes.PRODUCT_LIKED, {
      productId
    })
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async productUnlike(productId: number): Promise<any> {
    const params = {
      productId: productId
    }
    return axios.delete<ApiResponse>(ApiRoutes.PRODUCT_LIKED, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }
}