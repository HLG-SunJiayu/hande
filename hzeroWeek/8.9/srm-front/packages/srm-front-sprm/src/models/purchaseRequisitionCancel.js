/**
 * purchaseRequisitionCancel - 需求取消
 * @date: 2019-1-25
 * @author: lixiaolong <xiaolong.li02@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { isEmpty } from 'lodash';
import { queryIdpValue } from 'services/api';

import {
  fetchOperationRecordList,
  cancelPurchase,
  searchList,
  searchSingleList,
  fetchSingleData,
  cancelERP,
  cancel,
  queryDetailHeader,
  queryDetailList,
} from '@/services/purchaseRequisitionCancelService';

export default {
  namespace: 'purchaseRequisitionCancel',
  state: {
    statusList: [], // 状态值集
    sourceList: [], // 单据来源值集
    tableData: [], // 列表数据源
    pagination: {}, // 分页信息
    dataSource: [], // 整单取消tab页数据源
    singlePagination: {}, // 整单取消tab页分页数据
    erpDataSource: [], // erp页数据源
    erpPagination: {}, // erp页分页数据
    erpBasicInfo: {}, // erp页基本数据

    lastActiveTabKey: 'lineCancel',
  },
  effects: {
    // 按行取消tab页查询请求
    *searchList({ payload }, { call, put }) {
      const res = getResponse(yield call(searchList, payload));
      if (!isEmpty(res)) {
        yield put({
          type: 'updateState',
          payload: {
            tableData: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 整单取消tab页查询请求
    *searchSingleOrder({ payload }, { call, put }) {
      const res = getResponse(yield call(searchSingleList, payload));
      if (!isEmpty(res)) {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: res.content,
            singlePagination: createPagination(res),
          },
        });
      }
    },
    // 获取erp页面基本数据
    *fetchData({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSingleData, payload));
      if (!isEmpty(res)) {
        yield put({
          type: 'updateState',
          payload: {
            erpDataSource: res.content,
            erpPagination: createPagination(res),
            erpBasicInfo: res.erpBasicInfo,
          },
        });
      }
    },
    // 取消erp采购申请
    *cancelERP({ payload }, { call }) {
      const res = getResponse(yield call(cancelERP, payload));
      return res;
    },
    // 获取操作记录列表数据
    *fetchOperationRecordList({ payload }, { call }) {
      const result = getResponse(yield call(fetchOperationRecordList, payload));
      return result;
    },
    *cancelPurchase({ payload }, { call }) {
      const { selectedRows } = payload;
      const res = getResponse(yield call(cancelPurchase, selectedRows));
      return res;
    },

    // 查询明细头
    *queryDetailHeader({ prHeaderId }, { call }) {
      const response = yield call(queryDetailHeader, prHeaderId);
      return getResponse(response);
    },

    // 查询明细行
    *queryDetailList({ payload }, { call }) {
      const res = yield call(queryDetailList, payload);
      return getResponse(res);
    },

    // 取消采购申请
    *cancel({ payload }, { call }) {
      const response = getResponse(yield call(cancel, payload.prHeaderDTOs));
      return response;
    },
    *fetchValue(_, { call, put, all }) {
      const [statusCode, sourceCode] = yield all([
        call(queryIdpValue, 'SPRM.PR_LIST_CANCEL_STATUS'),
        call(queryIdpValue, 'SPRM.SRC_PLATFORM'),
      ]);
      const statusRes = getResponse(statusCode);
      const sourceRes = getResponse(sourceCode);
      yield put({
        type: 'updateState',
        payload: {
          statusList: statusRes,
          sourceList: sourceRes,
        },
      });
    },
  },

  reducers: {
    // 更新页面状态
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
