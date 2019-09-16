/**
 * model - 导入Erp
 * @date: 2019-1-8
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'hzero-front/lib/services/api';
import {
  querySupplierAddress,
  querySupplierContact,
  querySupplierAccount,
  saveSupplierAccount,
  queryFinance,
  saveFinance,
  deleteFinance,
  queryErp,
  saveErp,
  importData,
} from '@/services/importErpService';

export default {
  namespace: 'importErp',

  state: {
    code: {}, // 值集
    financeList: [], // 采购财务
    financePagination: {}, // 采购财务分页参数
    erpList: [], // 导入Erp数据
    erpPagination: {}, // 分页
    supplierAddressList: [],
    supplierAddressPagination: {},
    supplierContactList: [],
    supplierContactPagination: {},
    supplierAccountList: [],
    supplierAccountPagination: {},
  },

  effects: {
    // 查询值集
    *queryValueCode({ payload }, { call, put }) {
      const code = getResponse(yield call(queryMapIdpValue, payload));
      if (code) {
        yield put({
          type: 'updateState',
          payload: { code },
        });
      }
    },

    // 供应商地址查询
    *querySupplierAddress({ payload }, { call, put }) {
      const response = yield call(querySupplierAddress, payload);
      const data = getResponse(response);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            supplierAddressList: data,
            supplierAddressPagination: createPagination(data),
          },
        });
      }
    },

    // 供应商联系人查询
    *querySupplierContact({ payload }, { call, put }) {
      const response = yield call(querySupplierContact, payload);
      const data = getResponse(response);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            supplierContactList: data,
            supplierContactPagination: createPagination(data),
          },
        });
      }
    },

    // 供应商账户查询
    *querySupplierAccount({ payload }, { call, put }) {
      const response = yield call(querySupplierAccount, payload);
      const data = getResponse(response);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            supplierAccountList: data.content,
            supplierAccountPagination: createPagination(data),
          },
        });
      }
    },

    // 供应商账户保存
    *saveSupplierAccount({ payload }, { call }) {
      return getResponse(yield call(saveSupplierAccount, payload));
    },

    // 采购/财务查询
    *queryFinance({ payload }, { call, put }) {
      const response = yield call(queryFinance, payload);
      const data = getResponse(response);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            financeList: data.content,
            financePagination: createPagination(data),
          },
        });
      }
    },

    // 保存采购/财务
    *saveFinance({ payload }, { call }) {
      const response = yield call(saveFinance, payload);
      return getResponse(response);
    },

    // 删除采购/财务
    *deleteFinance({ payload }, { call }) {
      const response = yield call(deleteFinance, payload);
      return getResponse(response);
    },

    // 导入Erp查询
    *queryErp({ payload }, { call, put }) {
      const response = yield call(queryErp, payload);
      const data = getResponse(response);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            erpList: data.content,
            erpPagination: createPagination(data),
          },
        });
      }
    },

    // 保存
    *saveErp({ payload }, { call }) {
      const response = yield call(saveErp, payload);
      return getResponse(response);
    },

    // 导入Erp
    *importData({ payload }, { call }) {
      const response = yield call(importData, payload);
      return getResponse(response);
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
