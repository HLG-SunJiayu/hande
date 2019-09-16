/**
 * supplier.js - 我的合作伙伴供应商 model
 * @date: 2018-10-29
 * @author: geekrainy <chao.zheng02@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  queryPlatformSupplier,
  queryErpSupplier,
  enablePartner,
  disablePartner,
  linkErpSupplier,
  unlinkErpSupplier,
  queryGroup,
  saveGroup,
  riskEmbedPage,
  enableAddMonitor,
  enableRiskScan,
} from '@/services/supplierService';

export default {
  namespace: 'supplier',

  state: {
    platformList: {}, // 平台供应商列表
    erpList: {}, // ERP 供应商列表
    editContent: [], // ERP 关联供应商暂存
    platformPagination: {}, // 平台供应商分页数据
    erpPagination: {}, // ERP 供应商分页数据
    groupList: [], // 监控分组列表
    addMonitor: {}, // 加入监控
    riskScan: {}, // 风险扫描
  },

  effects: {
    // 查询平台供应商列表
    *queryPlatformSupplier({ payload }, { call, put }) {
      const res = yield call(queryPlatformSupplier, payload);
      const platformList = getResponse(res);
      const platformPagination = createPagination(platformList);
      yield put({
        type: 'updateState',
        payload: { platformList, platformPagination },
      });
      return platformList;
    },

    // 查询 ERP 供应商列表
    *queryErpSupplier({ payload }, { call, put }) {
      const res = yield call(queryErpSupplier, payload);
      const erpList = getResponse(res);
      const erpPagination = createPagination(erpList);
      yield put({
        type: 'updateState',
        payload: { erpList, erpPagination },
      });
      return erpList;
    },

    // 启用供应商
    *enablePartner({ payload }, { call }) {
      const res = yield call(enablePartner, payload);
      return getResponse(res);
    },

    // 禁用供应商
    *disablePartner({ payload }, { call }) {
      const res = yield call(disablePartner, payload);
      return getResponse(res);
    },

    // 关联 ERP 供应商
    *linkErpSupplier({ payload }, { call }) {
      const res = yield call(linkErpSupplier, payload);
      return getResponse(res);
    },

    // 取消关联 ERP 供应商
    *unlinkErpSupplier({ payload }, { call }) {
      const res = yield call(unlinkErpSupplier, payload);
      return getResponse(res);
    },

    // 查询分组
    *queryGroup({ payload }, { call, put }) {
      const res = getResponse(yield call(queryGroup, payload));
      yield put({
        type: 'updateState',
        payload: {
          groupList: res,
        },
      });
      return res;
    },

    // 保存分组
    *saveGroup({ payload }, { call }) {
      const res = getResponse(yield call(saveGroup, payload));
      return res;
    },

    // 斯瑞德风险扫描内嵌页
    *riskEmbedPage({ payload }, { call }) {
      const res = yield call(riskEmbedPage, payload);
      return res;
    },

    // 配置中心是否启用加入监控、风险扫描
    *queryConfigEnable(_, { call, put }) {
      const addMonitor = yield call(enableAddMonitor, { functionCode: 'partner' });
      const riskScan = yield call(enableRiskScan, { scanCode: 'partner' });
      yield put({
        type: 'updateState',
        payload: {
          addMonitor,
          riskScan,
        },
      });
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
