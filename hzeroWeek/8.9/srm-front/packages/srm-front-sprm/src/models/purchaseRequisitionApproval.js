/*
 * purchaseRequisitionApproval - 采购申请审批
 * @date: 2019-01-24
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse } from 'utils/utils';
import {
  approval,
  reject,
  queryList,
  queryDetailList,
  fetchOperationRecordList,
  approvalApprovalList,
  rejectApprovalList,
  queryDetailHeader,
} from '@/services/purchaseRequisitionApprovalService';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';

export default {
  namespace: 'purchaseRequisitionApproval',
  state: {
    listPagination: {},
    approvalList: [], // 列表数据
    enumMap: {}, // 值集
    detail: {},
    flag: [],
    prSourcePlatformList: [], // 申请人列表
  },

  effects: {
    // 获取初始化数据
    *init(_, { call, put }) {
      const prSourcePlatformList = getResponse(yield call(queryUnifyIdpValue, 'SPRM.SRC_PLATFORM'));
      yield put({
        type: 'updateState',
        payload: {
          prSourcePlatformList,
        },
      });
    },

    // 查询列表
    *queryList({ payload }, { call }) {
      const result = getResponse(yield call(queryList, payload));
      return result;
    },

    // 初始化值集查询
    *fetchEnum(params, { call, put }) {
      const enumMap = getResponse(
        yield call(queryMapIdpValue, {
          erpStatus: 'SODR.ERP_STATUS',
        })
      );
      if (enumMap) {
        yield put({
          type: 'updateState',
          payload: {
            enumMap,
          },
        });
      }
    },

    // 采购申请erp审批通过
    *approval({ payload }, { call }) {
      const result = getResponse(yield call(approval, payload.prHeaderList));
      return result;
    },

    // 采购申请erp审批拒绝
    *reject({ payload }, { call }) {
      const result = getResponse(yield call(reject, payload));
      return result;
    },

    // 采购申请非erp审批通过
    *approvalApprovalList({ payload }, { call }) {
      const result = getResponse(yield call(approvalApprovalList, payload.prHeaderList));
      return result;
    },

    // 采购申请非erp审批拒绝
    *rejectApprovalList({ payload }, { call }) {
      const result = getResponse(yield call(rejectApprovalList, payload.prHeaderList));
      return result;
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

    // 获取操作记录列表数据
    *fetchOperationRecordList({ payload }, { call }) {
      const result = getResponse(yield call(fetchOperationRecordList, payload));
      return result;
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
