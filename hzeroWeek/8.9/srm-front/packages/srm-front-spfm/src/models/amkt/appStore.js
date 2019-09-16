/**
 * appStore - 应用商城
 * @date: 2019-07-09
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { fetchClientModule, fetchClientService, addCart } from '@/services/amkt/appStoreService';

export default {
  namespace: 'appStore',
  state: {
    serviceList: [],
    servicePagination: {},
  },

  effects: {
    // 查询应用商店模块列表
    *fetchClientModule({ payload }, { call }) {
      const response = getResponse(yield call(fetchClientModule, payload));
      return response || [];
    },
    // 查询模块下的服务
    *fetchClientService({ payload }, { call, put }) {
      const response = getResponse(yield call(fetchClientService, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            serviceList: response.content || [],
            servicePagination: createPagination(response),
          },
        });
      }
    },
    // 加入购物车
    *addCart({ payload }, { call }) {
      const response = getResponse(yield call(addCart, payload));
      return response;
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
