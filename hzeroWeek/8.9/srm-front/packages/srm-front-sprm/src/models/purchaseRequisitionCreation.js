/*
 * deliveryCreation - 订单确认
 * @date: 2018/12/13
 * @author: lijun <jun.li06@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchList,
  handleAddHeader,
  handleSearchRecord,
  deleteHeader,
} from '@/services/purchaseRequisitionCreationService';

export default {
  namespace: 'purchaseRequisitionCreation',

  state: {
    dataSource: [], // 数据
  },

  effects: {
    // 查询列表
    *fetchList({ payload }, { call, put }) {
      const response = getResponse(yield call(fetchList, payload));
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: (response.content || []).map(item => ({ ...item, _status: 'update' })),
            pagination: createPagination(response),
          },
        });
      }
    },
    // 查询操作记录
    *handleSearchRecord({ payload }, { call }) {
      return getResponse(yield call(handleSearchRecord, payload));
    },
    // 需求头申请
    *handleAddHeader({ payload }, { call }) {
      return getResponse(yield call(handleAddHeader, payload.prHeaderCreateDTO));
    },
    // 查询值集
    *handleSearchEnum(_, { call, put }) {
      const response = getResponse(
        yield call(queryMapIdpValue, {
          status: 'SPRM.PR_STATUS',
        })
      );
      if (response) {
        yield put({
          type: 'updateState',
          payload: {
            enumMap: response,
          },
        });
      }
    },
    // // 新增采购申请头
    // *add({ payload }, { call }) {
    //   const response = getResponse(yield call(add, payload.headerData));
    //   return response;
    // },
    // // 更新采购申请头
    // *update({ payload }, { call }) {
    //   const response = getResponse(yield call(update, payload.headerData));
    //   return response;
    // },

    // // 提交采购申请
    // *submit({ payload }, { call }) {
    //   const response = yield call(submit, payload.prHeaderList);
    //   return response;
    // },

    // // 详情页提交单条采购申请
    // *singleSubmit({ payload }, { call }) {
    //   const response = getResponse(yield call(singleSubmit, payload.prHeaderList));
    //   return response;
    // },

    // 删除采购申请
    *delete({ payload }, { call }) {
      const response = getResponse(yield call(deleteHeader, payload.dataSource));
      return response;
    },

    // // 取消采购申请
    // *cancel({ payload }, { call }) {
    //   const response = getResponse(yield call(cancel, payload.prHeaderDTOs));
    //   return response;
    // },
    // // 查询明细头
    // *queryDetailHeader({ prHeaderId }, { call }) {
    //   const response = yield call(queryDetailHeader, prHeaderId);
    //   return getResponse(response);
    // },
    // // 查询明细行
    // *queryDetailList({ payload }, { call }) {
    //   const res = yield call(queryDetailList, payload);
    //   return getResponse(res);
    // },
    // 不分页查询明细行
    //   *queryAllDetailList({ payload }, { call }) {
    //     const res = yield call(queryAllDetailList, payload);
    //     return getResponse(res);
    //   },
    //   // 查询明细行
    //   *deleteLines({ payload }, { call }) {
    //     const res = yield call(deleteLines, payload);
    //     return getResponse(res);
    //   },

    //   // 获取操作记录列表数据
    //   *fetchOperationRecordList({ payload }, { call }) {
    //     const result = getResponse(yield call(fetchOperationRecordList, payload));
    //     return result;
    //   },
    //   // 绑定头附件id
    //   *bindHeaderAttachmentUuid({ payload }, { call }) {
    //     const result = getResponse(yield call(bindHeaderAttachmentUuid, payload));
    //     return result;
    //   },
    //   // 绑定行附件id
    //   *bindLineAttachmentUuid({ payload }, { call }) {
    //     const result = getResponse(yield call(bindLineAttachmentUuid, payload));
    //     return result;
    //   },
    //   // 查询品类定义
    //   *fetchCategory({ payload }, { call }) {
    //     const res = getResponse(yield call(fetchCategory, payload));
    //     return res;
    //   },
    // },

    reducers: {
      updateState(state, { payload }) {
        return {
          ...state,
          ...payload,
        };
      },
    },
  },
};
