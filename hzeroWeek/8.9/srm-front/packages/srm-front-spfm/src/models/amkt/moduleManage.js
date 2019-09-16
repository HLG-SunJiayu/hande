/**
 * moduleManage - 模块管理
 * @date: 2019-07-02
 * @author: wangyang <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */
import uuid from 'uuid/v4';
import {
  createPagination,
  getResponse,
  addItemToPagination,
  delItemsToPagination,
} from 'utils/utils';
import { queryIdpValue } from 'services/api';
import {
  fetchClientModule,
  fetchExistentService, // 查询模块下已分配服务
  fetchNoExistentService, // 查询模块下未分配服务
  addService,
  removeService,
  saveModule,
} from '@/services/amkt/moduleManageService';

export default {
  namespace: 'moduleManage',
  state: {
    enumMap: [], // 列表值集
    dataSource: [], // 列表数据
    pagination: {},
    productLineFormData: {}, // 产品线详细头表信息
    moduleTable: [], // 模块管理表格
    modulePagination: {}, // 模块管理表格分页
    exitServiceList: [], // 模块下已分配服务
    noExitServiceList: [], // 模块下未分配服务
    exitPagination: {}, // 模块下已分配服务分页
    noExitPagination: {}, // 模块下未分配服务分页
  },

  effects: {
    // 查询值集
    *init(_, { call, put }) {
      const res = yield call(queryIdpValue, 'HPFM.FLAG');
      const enumMap = getResponse(res);
      yield put({
        type: 'updateState',
        payload: {
          enumMap: enumMap || {},
        },
      });
    },
    // 查询模块表格
    *fetchClientModule({ payload }, { call, put }) {
      const res = yield call(fetchClientModule, payload);
      const response = getResponse(res);
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            moduleTable: response.content.map(item => ({ ...item, _status: 'update' })) || [],
            modulePagination: createPagination(response),
          },
        });
      }
    },
    // 查询模块下已分配服务
    *fetchExitServiceList({ payload }, { call, put }) {
      const exitRes = getResponse(yield call(fetchExistentService, payload));
      if (exitRes) {
        yield put({
          type: 'updateState',
          payload: {
            exitServiceList: exitRes.content || [],
            exitPagination: createPagination(exitRes),
          },
        });
      }
    },
    // 查询模块下未分配服务
    *fetchNoExitServiceList({ payload }, { call, put }) {
      const exitNoRes = getResponse(yield call(fetchNoExistentService, payload));
      if (exitNoRes) {
        yield put({
          type: 'updateState',
          payload: {
            noExitServiceList: exitNoRes.content || [],
            noExitPagination: createPagination(exitNoRes),
          },
        });
      }
    },
    // 添加服务
    *addService({ payload }, { call }) {
      const res = yield call(addService, payload);
      return getResponse(res);
    },
    // 删除服务
    *removeService({ payload }, { call }) {
      const res = yield call(removeService, payload);
      return getResponse(res);
    },
    // 保存模块
    *saveModule({ payload }, { call }) {
      const res = yield call(saveModule, payload);
      return getResponse(res);
    },
  },

  reducers: {
    addRow(state) {
      const newRow = {
        moduleId: uuid(),
        moduleCode: '',
        moduleName: '',
        clientCode: 'HZERO',
        enabledFlag: 1,
        editFlag: true,
        _status: 'create',
      };
      return {
        ...state,
        moduleTable: [newRow, ...state.moduleTable],
        modulePagination: addItemToPagination(state.moduleTable.length, state.modulePagination),
      };
    },
    deleteRow(state, { payload }) {
      const newState = state.moduleTable.filter(item => !payload.includes(item.moduleId));
      return {
        ...state,
        moduleTable: newState,
        modulePagination: delItemsToPagination(
          payload.length,
          state.moduleTable.length,
          state.modulePagination
        ),
      };
    },
    editFlag(state, { payload }) {
      const newState = state.moduleTable.map(item => {
        if (item.moduleId === payload.moduleId) {
          return { ...item, editFlag: true };
        }
        return item;
      });
      return { ...state, moduleTable: newState };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
