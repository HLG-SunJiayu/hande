/**
 * PurchaseRequisitionAssignment - 需求分配
 * @date: 2019-1-23
 * @author: lixiaolong <xiaolong.li02@hand-china.com>
 * @version: 0.0.1
 * @copyaright: Copyright (c) 2019, Hand
 */
import { getResponse } from 'utils/utils';
import { isEmpty } from 'lodash';
import {
  queryList,
  saveAssignmentConfigure,
  saveSuspendConfigure,
  enable,
  fetchOperationRecordList,
  viewAttachment,
} from '@/services/purchaseRequisitionAssignmentService';

export default {
  namespace: 'purchaseRequisitionAssignment',
  state: {
    sourceType: [],
    sourceCode: [],
    tableData: [],
    pagination: {},
    fileList: [],
  },
  effects: {
    /**
     * 查询
     * @params {object} params -查询字段对象
     * @params {*} { call, put }
     */
    *search({ params }, { call, put }) {
      const code = getResponse(yield call(queryList, params));
      if (!isEmpty(code)) {
        yield put({
          type: 'updateList',
          payload: code,
        });
      }
    },
    /**
     * 分配
     * @params {object} payload.data - 分配的信息
     * @params {*} { call }
     * @returns
     */
    *saveAssignmentConfigure({ payload }, { call }) {
      const { data } = payload;
      const res = getResponse(yield call(saveAssignmentConfigure, data));
      return res;
    },
    /**
     * 暂挂
     * @params {object} payload.data - 暂挂的信息
     * @params {*} { call }
     * @returns
     */
    *saveSuspendConfigure({ payload }, { call }) {
      const { data } = payload;
      const res = getResponse(yield call(saveSuspendConfigure, data));
      return res;
    },
    /**
     * 启用
     * @params {string[]} payload.selectedRowKeys - 启用的行数据的 key
     * @params {*} { call, put }
     */
    *enable({ payload }, { call, put }) {
      const { selectedRowKeys } = payload;
      const code = getResponse(yield call(enable, selectedRowKeys));
      if (!isEmpty(code)) {
        yield put({
          type: 'updateList',
          payload: code,
        });
      }
    },
    /**
     * 查看附件
     * @params {string} id - 需求申请的 id
     * @param {*} { call, put }
     */
    *viewAttachment({ payload }, { call, put }) {
      const { id = '' } = payload;
      const code = getResponse(yield call(viewAttachment, id));
      if (!isEmpty(code)) {
        yield put({
          type: 'updateList',
          payload: code,
        });
      }
    },

    // 获取操作记录列表数据
    *fetchOperationRecordList({ payload }, { call }) {
      const result = getResponse(yield call(fetchOperationRecordList, payload));
      return result;
    },
  },

  reducers: {
    updateList(state, { payload }) {
      const { sourceType, sourceCode, tableData, pagination, fileList } = payload;
      return {
        ...state,
        sourceType,
        sourceCode,
        tableData,
        pagination,
        fileList,
      };
    },
  },
};
