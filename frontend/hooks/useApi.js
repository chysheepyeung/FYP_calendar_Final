import { USER_DATA } from '../shared/constant';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useRouter } from 'next/router';
import API_ERROR_MSG from '../shared/constant';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.defaults.transformResponse = (response) => {
  try {
    return JSON.parse(String(response)).data;
  } catch (error) {
    return null;
  }
};
const authInstance = axios.create();

const useAPI = () => {
  const [persistUserData] = useLocalStorage(USER_DATA, null);
  const router = useRouter();

  // Auto add bearer token for all private API
  const handleAuthRequestConfig = (config) => {
    const { headers } = config;
    if (headers && persistUserData?.token)
      headers.Authorization = `Bearer ${persistUserData.token}`;
    return config;
  };

  // Auto show error alert box when API status code is 4xx
  const handleGlobalResponseError = (error) => {
    const errorMsgList = {
      401: 'Login Token Expired, Please Login Again.',
    };
    const errorCode = Number(error?.response?.status);
    const errorMsg = errorMsgList[errorCode];
    if (!toast.isActive(API_ERROR_MSG) && errorMsg) {
      toast.error(errorMsg, { toastId: API_ERROR_MSG });
    }

    if (errorCode === 401) {
      localStorage.removeItem(USER_DATA);
      router.push('/auth/login');
    }
    return Promise.reject(error);
  };

  useEffect(() => {
    const defaultResInterceptor = axios.interceptors.response.use(
      undefined,
      handleGlobalResponseError
    );
    const authResInterceptor = authInstance.interceptors.response.use(
      undefined,
      handleGlobalResponseError
    );
    const authReqInterceptor = authInstance.interceptors.request.use(
      handleAuthRequestConfig
    );

    return () => {
      axios.interceptors.response.eject(defaultResInterceptor);
      authInstance.interceptors.request.eject(authReqInterceptor);
      authInstance.interceptors.response.eject(authResInterceptor);
    };
  }, []);

  const privateAPI = {
    getUser: async (id) => {
      const { data } = await authInstance.get(`/user/${id}`);
      return data;
    },
    getEvent: async () => {
      const { data } = await authInstance.get('/event');
      return data;
    },
    getGroup: async () => {
      const { data } = await authInstance.get('/group');
      return data;
    },
    getGroupDetails: async (id) => {
      const { data } = await authInstance.get(`/group/${id}`);
      return data;
    },
    createEvent: async (formData) => {
      return authInstance.post('/event', formData);
    },
    createGroup: async (formData) => {
      return authInstance.post('/group', formData);
    },
    updateEvent: async (id, formData) => {
      return authInstance.patch(`/event/${id}`, formData);
    },
    deleteEvent: async (id) => {
      return authInstance.delete(`/event/${id}`);
    },
    deleteGroup: async (id) => {
      return authInstance.delete(`/group/${id}`);
    },
    getInvite: async () => {
      const { data } = await authInstance.get(`/invite`);
      return data;
    },
    handleInvite: async (id, isAccept) => {
      const { data } = await authInstance.post(`/invite/handle/${id}`, {
        isAccept,
      });
      return data;
    },
    leaveGroup: async (id) => {
      const { data } = await authInstance.post(`/group/${id}/leave`);
      return data;
    },
    invitePeople: async (formData) => {
      let result = null;
      try {
        result = await authInstance.post('/invite', formData);
      } catch (error) {
        //
      }
      return result;
    },
    findFreeDays: async (id, formData) => {
      const { data } = await authInstance.post(
        `/event/findFreeDays/${id}`,
        formData
      );
      return data;
    },
    creatVoteEvent: async (id, formData) => {
      const { data } = await authInstance.post(`/votes/event/${id}`, formData);
      return data;
    },
    getVoteEvent: async (id) => {
      const { data } = await authInstance.get(`/votes/group/${id}`);
      return data;
    },
    voteEvent: async (id, isAccept) => {
      const { data } = await authInstance.patch(`/votes/${id}`, { isAccept });
      return data;
    },
    getSuggestChange: async (id) => {
      const { data } = await authInstance.post(`/event/suggest/${id}`);
      return data;
    },
    checkIsDuplicate: async (id) => {
      const { data } = await authInstance.post(`/event/checkDup/${id}`);
      return data;
    },
    acceptSuggest: async (id, formData) => {
      const { data } = await authInstance.post(
        `/votes/acceptSuggest/${id}`,
        formData
      );
      return data;
    },
  };

  const publicAPI = {
    register: async (formData) => {
      let result = null;
      try {
        result = await axios.post('/register', formData);
      } catch (error) {
        if (error?.response?.status === 500)
          toast.error('Email already registed, please use another one');
        else toast.error('Unexpected error');
      }
      return result;
    },
    login: async (formData) => {
      let result = null;
      try {
        result = await axios.post('/login', formData);
      } catch (error) {
        toast.error('Invalid email or password');
      }
      return result;
    },
  };

  return { ...privateAPI, ...publicAPI };
};

export { useAPI };
