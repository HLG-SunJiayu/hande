/**
 * partnerManagement -合作伙伴管理 Model
 * @date: 2019-7-4
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import notification from 'utils/notification';
import { queryIdpValue } from 'services/api';
import {
  fetchList,
  fetchDeleteShoppingCart,
  fetchSave,
  fetchSubmit,
  fetchServeInfo,
  serveDetail,
  serveQueryList,
  deleteApplicationListAsync,
} from '@/services/amkt/shoppingCartService';

export default {
  namespace: 'shoppingCart',
  state: {
    list: {},
    pagination: {},
    applicationList: {
      list: {
        content: [],
      },
    },
  },
  effects: {
    *initValuesJson(_, { call, put }) {
      const res = yield call(queryIdpValue, 'AMKT.ACCOUNT_TYPE');
      const enumMap = getResponse(res);
      yield put({
        type: 'updateState',
        payload: {
          enumMap: enumMap || [],
        },
      });
    },
    *fetchList({ payload }, { call, put }) {
      let partnerList = yield call(fetchList, payload);
      if (!partnerList) {
        partnerList = {};
      }
      const result = getResponse(partnerList);
      const pagination = createPagination(result);
      yield put({
        type: 'updateState',
        payload: {
          list: result,
          pagination,
        },
      });
    },
    *fetchSave({ payload }, { call }) {
      const res = yield call(fetchSave, payload);
      return getResponse(res);
    },
    *fetchSubmit({ payload }, { call }) {
      const res = yield call(fetchSubmit, payload);
      return getResponse(res);
    },
    *deleteShoppingCart({ payload }, { call }) {
      const res = yield call(fetchDeleteShoppingCart, payload);
      return getResponse(res);
    },
    *fetchServeInfo({ payload }, { call }) {
      const res = yield call(fetchServeInfo, payload);
      return getResponse(res);
    },
    // 服务申请-申请头
    *serveDetail({ payload }, { call }) {
      const response = getResponse(yield call(serveDetail, payload));
      return response;
    },
    // 服务申请-服务列表
    *serveQueryList({ payload }, { call }) {
      const response = getResponse(yield call(serveQueryList, payload));
      return response;
    },
    *deleteApplicationListAsync({ payload }, { call }) {
      const response = getResponse(yield call(deleteApplicationListAsync, payload));
      return response;
    },
  },
  reducers: {
    addApplicationList(state, { payload }) {
      const { selectedRowKeys, selectedRowData } = payload;
      const temData = selectedRowData.filter(item => selectedRowKeys.includes(item.cartId));
      const selectedRowDataIdList = temData.map(n => n.serviceCode);
      const newList = new Set(selectedRowDataIdList);
      if (newList.size < selectedRowDataIdList.length) {
        notification.warning({ message: '服务重复' });
        return state;
      } else {
        return { ...state, applicationList: { list: { content: temData } } };
      }
    },
    deleteApplicationList(state, { payload }) {
      const { applicationList } = state;
      const { list = {} } = applicationList;
      const { content = [] } = list;
      const { selectedRowKeys } = payload;
      const temData = content.filter(item => !selectedRowKeys.includes(item.partnerServiceId));
      return { ...state, applicationList: { list: { content: temData } } };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
