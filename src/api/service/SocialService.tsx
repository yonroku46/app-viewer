import { useDispatch } from "react-redux";
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export interface SocialFilter {
  keyword?: string;
}

export interface SocialInfo {
  socialId: number;
  owner: number;
  name: string;
  profileImg: string;
  profileHeight: number;
  imgs: Array<string>;
  contents?: string;
  tags?: Array<string>;
  date: Date;
  liked: boolean;
  likedCount?: number;
}

export interface CommentInfo {
  commentId: number;
  socialId: number;
  reply: number;
  replies: Array<CommentInfo>;
  owner: number;
  name: string;
  profileImg: string;
  contents: string;
  date: Date;
}

export default class SocialService {
  dispatch = useDispatch();

  async socialInfo(socialId: number): Promise<any> {
    const params = {
      socialId: socialId
    }
    return axios.get<ApiResponse>(ApiRoutes.SOCIAL_INFO, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }
  
  async socialList(filter: SocialFilter): Promise<any> {
    const params = {
      keyword: filter.keyword
    }
    return axios.get<ApiResponse>(ApiRoutes.SOCIAL_FILTER, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async socialLike(socialId: number): Promise<any> {
    return axios.put<ApiResponse>(ApiRoutes.SOCIAL_LIKE, {
      socialId
    })
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async socialUnlike(socialId: number): Promise<any> {
    const params = {
      socialId: socialId
    }
    return axios.delete<ApiResponse>(ApiRoutes.SOCIAL_LIKE, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async commentList(socialId: number): Promise<any> {
    const params = {
      socialId: socialId
    }
    return axios.get<ApiResponse>(ApiRoutes.SOCIAL_COMMENT, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async commentInsert(socialId: number, reply: number|undefined, contents: string): Promise<any> {
    return axios.put<ApiResponse>(ApiRoutes.SOCIAL_COMMENT, {
      socialId,
      reply,
      contents
    })
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async commentDelete(socialId: number, commentId: number): Promise<any> {
    const params = {
      socialId: socialId,
      commentId: commentId
    }
    return axios.delete<ApiResponse>(ApiRoutes.SOCIAL_COMMENT, {params})
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }
}