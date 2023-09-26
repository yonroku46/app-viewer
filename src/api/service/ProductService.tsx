import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

type NonEmptyArray<T> = [T, ...T[]];

export interface ProductFilter {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: Array<string>;
  brands?: Array<string>;
  category?: Array<number>;
  status?: Array<number>;
  colors?: Array<string>;
  types?: Array<string>;
  sort?: string;
  limit?: number;
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

export default function ProductService() {

  async function productInfo(productId: number): Promise<any> {
    try {
      const params = {
        productId: productId
      };
      const response = await axios.get<ApiResponse>(ApiRoutes.PRODUCT_INFO, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching product info:', error);
    }
  }

  async function productList(filter: ProductFilter): Promise<any> {
    try {
      const params = {
        keyword: filter.keyword,
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        gender: filter.gender?.join(','),
        brands: filter.brands?.join(','),
        category: filter.category?.join(','),
        status: filter.status?.join(','),
        colors: filter.colors?.join(','),
        types: filter.types?.join(','),
        sort: filter.sort,
        limit: filter.limit
      };
      const response = await axios.get<ApiResponse>(ApiRoutes.PRODUCT_FILTER, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching product list:', error);
    }
  }

  async function getProductHistoryInfo(productId: number, productIdList: Array<number>): Promise<any> {
    try {
      const params = {
        productId: productId,
        productIdList: productIdList.join(',')
      };
      const response = await axios.get<ApiResponse>(ApiRoutes.PRODUCT_HISTORY, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching product history info:', error);
    }
  }

  async function productLike(productId: number): Promise<any> {
    try {
      const response = await axios.post<ApiResponse>(ApiRoutes.PRODUCT_LIKED, { productId });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error liking product:', error);
    }
  }

  async function productUnlike(productId: number): Promise<any> {
    try {
      const params = {
        productId: productId
      };
      const response = await axios.delete<ApiResponse>(ApiRoutes.PRODUCT_LIKED, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error unliking product:', error);
    }
  }

  return {
    productInfo,
    productList,
    getProductHistoryInfo,
    productLike,
    productUnlike,
  };
}