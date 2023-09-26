import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export interface SocialFilter {
  keyword?: string;
  sort?: string;
  limit?: number;
}

export interface SocialInfo {
  socialId: number;
  owner: number;
  name: string;
  profileImg: string;
  imgs: Array<string>;
  contents?: string;
  tags?: Array<string>;
  date: Date;
  liked: boolean;
  likedCount: number;
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

export default function SocialService() {

  async function socialInfo(socialId: number): Promise<any> {
    try {
      const params = {
        socialId: socialId
      };
      const response = await axios.get<ApiResponse>(ApiRoutes.SOCIAL_INFO, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching social info:', error);
    }
  }
  
  async function socialList(filter: SocialFilter): Promise<any> {
    try {
      const params = {
        keyword: filter.keyword,
        sort: filter.sort,
        limit: filter.limit
      };
      const response = await axios.get<ApiResponse>(ApiRoutes.SOCIAL_FILTER, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching social list:', error);
    }
  }

  async function socialLike(socialId: number): Promise<any> {
    try {
      const response = await axios.post<ApiResponse>(ApiRoutes.SOCIAL_LIKE, { socialId });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error liking social:', error);
    }
  }

  async function socialUnlike(socialId: number): Promise<any> {
    try {
      const params = {
        socialId: socialId
      };
      const response = await axios.delete<ApiResponse>(ApiRoutes.SOCIAL_LIKE, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error unliking social:', error);
    }
  }

  async function commentList(socialId: number): Promise<any> {
    try {
      const params = {
        socialId: socialId
      };
      const response = await axios.get<ApiResponse>(ApiRoutes.SOCIAL_COMMENT, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  async function commentInsert(socialId: number, reply: number|undefined, contents: string): Promise<any> {
    try {
      const response = await axios.post<ApiResponse>(ApiRoutes.SOCIAL_COMMENT, { socialId, reply, contents });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error inserting comment:', error);
    }
  }

  async function commentDelete(socialId: number, commentId: number): Promise<any> {
    try {
      const params = {
        socialId: socialId,
        commentId: commentId
      };
      const response = await axios.delete<ApiResponse>(ApiRoutes.SOCIAL_COMMENT, { params });
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  return {
    socialInfo,
    socialList,
    socialLike,
    socialUnlike,
    commentList,
    commentInsert,
    commentDelete,
  };
}