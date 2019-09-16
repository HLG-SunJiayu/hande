/**
 * model - 服务开通记录
 * @date: 2019-07-10
 * @author: WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import {
  applyQueryList,
  dredgeQueryList,
  serveQueryList,
  serveDetail,
  serveSave,
  serveSubmit,
  serveDelete,
} from '@/services/amkt/serveLogService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'serveLog',
  state: {
    applyDataSource: [],
    applyPagination: {},
    DredgeDataSource: [],
    DredgePagination: {},
    statusEnumMap: {}, // 状态值集
  },

  effects: {
    // 服务申请单查询列表
    *applyQueryList({ payload }, { call, put }) {
      const response = getResponse(yield call(applyQueryList, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            applyDataSource: response.content,
            applyPagination: createPagination(response),
          },
        });
      }
    },
    // 已开通服务查询列表
    *dredgeQueryList({ payload }, { call, put }) {
      const response = getResponse(yield call(dredgeQueryList, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            DredgeDataSource: response.content,
            DredgePagination: createPagination(response),
          },
        });
      }
    },
    // 服务开通记录明细-申请头
    *serveDetail({ payload }, { call }) {
      const response = getResponse(yield call(serveDetail, payload));
      return response;
    },
    // 服务开通记录明细-服务列表
    *serveQueryList({ payload }, { call }) {
      const response = getResponse(yield call(serveQueryList, payload));
      return response;
    },
    // 服务开通记录明细-保存
    *serveSave({ payload }, { call }) {
      const response = getResponse(yield call(serveSave, payload));
      return response;
    },
    // 服务开通记录明细-提交
    *serveSubmit({ payload }, { call }) {
      const response = getResponse(yield call(serveSubmit, payload));
      return response;
    },
    // 服务开通记录明细-删除
    *serveDelete({ payload }, { call }) {
      const response = getResponse(yield call(serveDelete, payload));
      return response;
    },
    // 查询状态值集
    *statusEnumMap(params, { call, put }) {
      const statusEnumMap = getResponse(
        yield call(queryMapIdpValue, {
          flag: 'AMKT.REQUEST_STATUS',
        })
      );
      yield put({
        type: 'updateState',
        payload: {
          statusEnumMap,
        },
      });
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
