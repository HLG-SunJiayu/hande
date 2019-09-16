/*
 * configServer - 配置中心
 * @date: 2018/09/18 19:07:49
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import lodash, { isNumber, isNaN } from 'lodash';

import { getResponse, createPagination } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';

import {
  saveOuterPriceShieldHeader,
  searchHeader,
  searchLines,
  deleteLines,
  fetchSettings,
  fetchRcvTrxTypeList,
  saveSettings,
  resetSettings,
  searchInnerList,
  searchInnerShieldOrg,
  saveInnerShieldInner,
  deleteInnerLines,
  fetchOrderConfigList,
  saveOrderConfigList,
  queryDocMergeRulesList,
  saveDocMergeRule,
  fetchAsnMergeRules,
  deleteAsnMergeRules,
  saveAsnMergeRules,
  saveRcvTrxType,
  fetchPurchaseRequisitionApprovalList,
  savePurchaseRequisitionApproval,
  deletePurchaseRequisitionApproval,
  fetchPurchaseRequisitionSendBackPurchaseRequest, // 采购申请回传
  savefetchPurchaseRequisitionSendBackPurchaseRequest,
  deletefetchPurchaseRequisitionSendBackPurchaseRequest,
  fetchOrderMergeRuleList,
  saveOrderMergeRule,
  fetchSplitOrderRules,
  saveSplitOrderRules,
  fetchSupplierAddMonitor,
  saveSupplierAddMonitor,
  fetchRiskScan,
  saveRiskScan,
} from '@/services/configServerService';
import { queryMapIdpValue } from 'hzero-front/lib/services/api';

function getAllSelectedChilds(list) {
  let arr = [];
  list.forEach(record => {
    const findChilds = r => {
      if (r.checkedFlag) {
        arr = lodash.unionWith(arr, [r]);
      }
      if (r.children) {
        r.children.forEach(child => {
          findChilds(child);
        });
      }
    };
    findChilds(record);
  });
  return arr;
}

/**
 * @param {object} list --配置中心-对账单数据
 */
function setUpdateToData(list) {
  // 判断是否是编辑状态
  const lines = [];
  list.content.forEach(item => {
    const items = { ...item };
    if (!item._status) {
      items._status = 'update';
    }
    lines.push(items);
  });
  return lines;
}

function dealDataExist(response) {
  if (response.code === 'error.data_exists') {
    notification.error({
      description: intl
        .get('spfm.configServer.view.deliver.notification.dataExist')
        .d('数据已存在'),
    });
  }
}

export default {
  namespace: 'configServer',

  state: {
    settings: {}, // 配置信息
    enumMap: {}, // 值集

    innerControlList: [], // 内部控制列表
    innerControlListPagination: {}, // 内部控制分页
    selectedRowKeysInner: [], // 内部控制选中主键
    innerControlMap: {},
    leftCurrentRow: -1, // 内部控制左侧当前选中行

    outerControlList: [], // 外部控制列表
    includeAllFlag: false,
    outerControlHeader: {}, // 外部控制头信息
    outerControlListPagination: {}, // 外部控制分页
    selectedRowKeysOuter: [], // 外部控制选中主键
    outerQuery: {},

    organizationList: [], // 组织列表
    organizationPagination: {}, // 组织列表分页
    historyData: [], // 历史选中的组织数据
    checkedData: [], // 选中的组织数据

    activeKey: 'inner',
    versionRules: [], // 订单版本管理规则
    pagination: {},
    dataSourceMap: {},
    selectedRowKeys: [],

    orderConfigList: [], // 订单配置表列表
    orderConfigPagination: {},
    orderQuery: {},

    deliverTemplates: [], // 送货单打印模板
    doMergeRulesList: [], // 对账及开票并单规则数据

    mergeRules: [], // 并单规则列表
    mergeRulesPagination: {}, // 并单规则分页

    trxTypeList: {}, // 采购事务类型列表
    trxTypePagination: {}, // 采购事务类型分页信息

    splitOrderRules: [], // 拆分订单规则列表
    splitOrderPagination: {}, // 拆分订单规则分页信息

    supplierAddMonitorList: [], // 供应商加入监控列表
    riskScanList: [], // 风险扫描列表
  },

  effects: {
    // 查询值集
    *init(params, { call, put }) {
      const enumMap = getResponse(
        yield call(queryMapIdpValue, {
          templates: 'SODR.PO_PRINT_TYPE',
          delivery: 'SODR.DEFUALT_DELIVERY_DATE',
          rules: 'SPFM.ORDER.VERSION_RULE',
          approval: 'SODR.SRM_APPROVE_TYPE',
          mergeRules: 'SINV.ASN.DOC_MERGE_RULE_CODE',
          approvalMethod: 'SPRM.PR_APPROVAL_METHOD',
          prSrcPlateForm: 'SPRM.SRC_PLATFORM',
          sourceFrom: 'HPFM.DATA_SOURCE',
          pcApprovalMethod: 'SPCM.CONFIG.PC_APPROVAL_METHOD',
          supplierAddMonitor: 'SSLM.MONITOR_FUNCTION',
          riskScan: 'SSLM.RISK_SCAN',
          listType: 'SPRM.PR_ERP_EXEC_TYPE',
        })
      );
      yield put({
        type: 'updateState',
        payload: {
          enumMap,
        },
      });
    },
    // 查询配置信息
    *fetchSettings(params, { call, put }) {
      const result = getResponse(yield call(fetchSettings));
      if (result) {
        const newResult = {};
        for (const key in result) {
          if (isNumber(+result[key]) && !isNaN(+result[key]) && result[key] !== null) {
            newResult[key] = +result[key];
          } else if (result[key] === null) {
            newResult[key] = undefined;
          } else {
            newResult[key] = result[key];
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            settings: newResult,
          },
        });
      }
      return result;
    },
    // 保存配置信息
    *saveSettings({ payload }, { call }) {
      const result = getResponse(yield call(saveSettings, payload.customizeSetting));
      return result;
    },
    // 重置配置信息
    *resetSettings(params, { call, put }) {
      const result = getResponse(yield call(resetSettings));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            settings: result,
          },
        });
      }
      return result;
    },
    // 保存外部屏蔽头
    *saveOuterPriceShieldHeader({ payload }, { call, put }) {
      const result = getResponse(yield call(saveOuterPriceShieldHeader, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            includeAllFlag: result.includeAllFlag,
            outerControlHeader: result,
          },
        });
      }
      return result;
    },
    // 查询内部控制
    *searchInnerList({ payload }, { call, put }) {
      const result = getResponse(yield call(searchInnerList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            innerControlList: result.content,
            innerControlListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询内部控制屏蔽组织列表
    *searchInnerShieldOrg({ payload }, { call, put, select }) {
      const { innerControlMap } = yield select(state => state.configServer);
      const { shieldId } = payload;
      const result = getResponse(yield call(searchInnerShieldOrg, payload));
      if (result && result.treeList) {
        innerControlMap[shieldId] = getAllSelectedChilds(result.treeList);
        yield put({
          type: 'updateState',
          payload: {
            organizationList: result.treeList,
            historyData: getAllSelectedChilds(result.treeList),
            checkedData: getAllSelectedChilds(result.treeList),
            innerControlMap,
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            organizationList: [],
          },
        });
      }
      return result;
    },
    // 保存内部控制信息
    *saveInnerShieldInner({ payload }, { call }) {
      const result = getResponse(yield call(saveInnerShieldInner, payload));
      return result;
    },
    // 查询外部控制头
    *searchHeader({ payload }, { call, put }) {
      const result = getResponse(yield call(searchHeader, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            includeAllFlag: result.includeAllFlag,
            outerControlHeader: result,
          },
        });
      }
      return result;
    },
    // 查询外部控制行
    *searchLines({ payload }, { call, put, select }) {
      const { includeAllFlag } = yield select(state => state.configServer);
      const result = getResponse(yield call(searchLines, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            outerControlList: includeAllFlag ? [] : result.content,
            outerControlListPagination: includeAllFlag
              ? {
                  showSizeChanger: true,
                  current: 1,
                  pageSize: 10, // 每页大小
                  total: 0,
                  showTotal: 0,
                }
              : createPagination(result),
          },
        });
      }
    },

    // 查询对账单及开票规则数据
    *fetchDocMergeRulesList({ payload }, { call, put }) {
      const response = yield call(queryDocMergeRulesList, payload);
      const list = getResponse(response);
      yield put({
        type: 'updateState',
        payload: {
          doMergeRulesList: setUpdateToData(list),
        },
      });
    },

    // 查询租户级配置中心_接收事务类型数据
    *fetchReceiveTrxType({ payload }, { call, put }) {
      const response = yield call(fetchRcvTrxTypeList, payload);
      const list = getResponse(response);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            trxTypeList: list,
            trxTypePagination: createPagination(list),
          },
        });
      }
    },

    // 保存对账单及开票规则数据
    *saveDocMergeRulesList({ payload }, { call }) {
      const result = getResponse(yield call(saveDocMergeRule, payload));
      return result;
    },

    *deleteLines({ payload }, { call }) {
      const result = getResponse(yield call(deleteLines, payload));
      return result;
    },
    *deleteInnerLines({ payload }, { call }) {
      const result = getResponse(yield call(deleteInnerLines, payload));
      return result;
    },
    *fetchOrderConfigList({ payload }, { call }) {
      const result = getResponse(yield call(fetchOrderConfigList, payload));
      return result;
    },
    *saveOrderConfigList({ payload }, { call }) {
      const res = yield call(saveOrderConfigList, payload);
      return getResponse(res);
    },

    // 查询送货单并单规则列表
    *fetchAsnMergeRules({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchAsnMergeRules, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            mergeRules: result.content.map(item => ({ _status: 'update', ...item })) || [],
            mergeRulesPagination: createPagination(result),
          },
        });
      }
    },

    // 删除并单规则
    *deleteAsnMergeRules({ payload }, { call }) {
      const result = getResponse(yield call(deleteAsnMergeRules, payload));
      return result;
    },

    // 保存并单规则
    *saveAsnMergeRules({ payload }, { call }) {
      const result = getResponse(yield call(saveAsnMergeRules, payload), dealDataExist);
      return result;
    },

    // 保存租户级配置中心_接收事务类型数据
    *saveRcvTrxType({ payload }, { call }) {
      const list = getResponse(yield call(saveRcvTrxType, payload));
      return list;
    },

    // 查询采购申请审批列表
    *fetchPurchaseRequisitionApprovalList(_payload, { call }) {
      const list = getResponse(yield call(fetchPurchaseRequisitionApprovalList));
      return list;
    },

    // 保存采购申请审批数据
    *savePurchaseRequisitionApproval({ payload }, { call }) {
      const list = getResponse(yield call(savePurchaseRequisitionApproval, payload));
      return list;
    },

    // 删除采购申请审批数据
    *deletePurchaseRequisitionApproval({ payload }, { call }) {
      const list = getResponse(yield call(deletePurchaseRequisitionApproval, payload));
      return list;
    },

    // 查询采购申请回传列表
    *fetchPurchaseRequisitionSendBackPurchaseRequest(_payload, { call }) {
      const list = getResponse(yield call(fetchPurchaseRequisitionSendBackPurchaseRequest));
      return list;
    },

    // 保存采购申请回传数据
    *savefetchPurchaseRequisitionSendBackPurchaseRequest({ payload }, { call }) {
      const list = getResponse(
        yield call(savefetchPurchaseRequisitionSendBackPurchaseRequest, payload)
      );
      return list;
    },

    // 删除采购申请回传数据
    *deletefetchPurchaseRequisitionSendBackPurchaseRequest({ payload }, { call }) {
      const list = getResponse(
        yield call(deletefetchPurchaseRequisitionSendBackPurchaseRequest, payload)
      );
      return list;
    },

    // 查询采购申请审批列表
    *fetchOrderMergeRuleList(_payload, { call }) {
      const list = getResponse(yield call(fetchOrderMergeRuleList));
      return list;
    },

    // 查询采购申请审批列表
    *saveOrderMergeRule({ payload }, { call }) {
      const list = getResponse(yield call(saveOrderMergeRule, payload.poMergeRules));
      return list;
    },

    // 查询拆单规则
    *fetchSplitOrderRules({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSplitOrderRules, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            splitOrderRules: result.content.map(item => ({ _status: 'update', ...item })) || [],
            splitOrderPagination: createPagination(result),
          },
        });
      }
    },
    // 保存拆单规则
    *saveSplitOrderRules({ payload }, { call }) {
      const res = getResponse(yield call(saveSplitOrderRules, payload));
      return res;
    },
    // 查询供应商加入监控
    *fetchSupplierAddMonitor({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSupplierAddMonitor, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            supplierAddMonitorList: res,
          },
        });
      }
      return res;
    },
    // 保存供应商加入监控
    *saveSupplierAddMonitor({ payload }, { call }) {
      const res = getResponse(yield call(saveSupplierAddMonitor, payload));
      return res;
    },
    // 查询风险扫描
    *fetchRiskScan({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchRiskScan, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            riskScanList: res.content,
          },
        });
      }
      return res;
    },
    // 保存风险扫描
    *saveRiskScan({ payload }, { call }) {
      const res = getResponse(yield call(saveRiskScan, payload));
      return res;
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
