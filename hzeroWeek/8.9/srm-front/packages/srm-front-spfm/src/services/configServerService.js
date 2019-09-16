/*
 * configServerService - 配置中心
 * @date: 2018/10/13 11:39:25
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import request from 'utils/request';
import { SRM_PLATFORM, SRM_SODR, SRM_SCEC, SRM_SSLM } from '_utils/config';

const organizationId = getCurrentOrganizationId();

/**
 * 查询配置
 */
export async function fetchSettings(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/settings`, {
    method: 'GET',
    body: params,
  });
}
/**
 * 保存配置
 */
export async function saveSettings(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/settings`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 重置配置
 */
export async function resetSettings() {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/settings/init`, {
    method: 'GET',
  });
}
/**
 * 保存外部屏蔽头行
 */
export async function saveOuterPriceShieldHeader(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/price-shield/outer`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 查询内部控制
 */
export async function searchInnerList(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/price-shield/inner`, {
    method: 'GET',
    query: parseParameters(params),
  });
}
/**
 * 查询内部控制屏蔽组织
 */
export async function searchInnerShieldOrg({ shieldId }) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/price-shield/inner/org`, {
    method: 'GET',
    query: {
      shieldId,
    },
  });
}
/**
 * 删除外部控制行
 */
export async function deleteInnerLines(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/price-shield/inner`, {
    method: 'DELETE',
    body: params,
  });
}
/**
 * 查询外部控制头
 */
export async function searchHeader(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/price-shield/outer`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 查询外部控制行
 */
export async function searchLines(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/price-shield/outer/sup`, {
    method: 'GET',
    query: parseParameters(params),
  });
}
/**
 * 删除外部控制行
 */
export async function deleteLines(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/price-shield/outer/sup`, {
    method: 'DELETE',
    body: params,
  });
}
/**
 * 保存内部控制信息
 */
export async function saveInnerShieldInner(params) {
  return request(`${SRM_PLATFORM}/v1/${organizationId}/price-shield/inner`, {
    method: 'POST',
    body: params.newInnerControlList,
  });
}

export async function fetchOrderConfigList(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/po-change-configs/paging`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

export async function saveOrderConfigList(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/po-change-configs`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询对账及开票并单规则
 */
export async function queryDocMergeRulesList(params) {
  return request(`${SRM_SODR}/v1/${params.organizationId}/doc-merge-rules`, {
    method: 'GET',
    query: params,
  });
}

export async function saveDocMergeRule(params) {
  return request(`${SRM_SODR}/v1/${params.organizationId}/doc-merge-rules`, {
    method: 'PUT',
    body: params.editList,
  });
}

// 查询并单规则列表
export async function fetchAsnMergeRules(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/asn-merge-rules`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

// 删除并单规则
export async function deleteAsnMergeRules(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/asn-merge-rules`, {
    method: 'DELETE',
    body: params,
  });
}

// 保存并单规则
export async function saveAsnMergeRules(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/asn-merge-rules`, {
    method: 'POST',
    body: params,
  });
}

// 查询租户级配置中心_接收事务类型数据
export async function fetchRcvTrxTypeList(params) {
  const param = parseParameters(params);
  return request(`${SRM_SODR}/v1/${organizationId}/receive-trx-type`, {
    method: 'GET',
    query: param,
  });
}

// 保存租户级配置中心_接收事务类型
export async function saveRcvTrxType(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/receive-trx-type`, {
    method: 'POST',
    body: params,
  });
}

// 查询采购申请审批列表
export async function fetchPurchaseRequisitionApprovalList() {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-request/approve-rules`, {
    method: 'GET',
  });
}

// 保存采购申请审批列表
export async function savePurchaseRequisitionApproval(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-request/approve-rules`, {
    method: 'POST',
    body: params,
  });
}

// 删除采购申请审批列表
export async function deletePurchaseRequisitionApproval(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-request/approve-rules`, {
    method: 'DELETE',
    body: params,
  });
}

// 查询采购申请回传列表
export async function fetchPurchaseRequisitionSendBackPurchaseRequest() {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-request/sync-configs/list`, {
    method: 'GET',
    // query: parseParameters(params),
  });
}

// 保存采购申请回传列表
export async function savefetchPurchaseRequisitionSendBackPurchaseRequest(params) {
  return request(
    `${SRM_SODR}/v1/${organizationId}/purchase-request/sync-configs/batch-create-update`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 删除采购申请回传列表
export async function deletefetchPurchaseRequisitionSendBackPurchaseRequest(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-request/sync-configs/batch`, {
    method: 'DELETE',
    body: params,
  });
}

// 查询订单并单规则列表
export async function fetchOrderMergeRuleList() {
  return request(`${SRM_SODR}/v1/${organizationId}/po-merge-rule`, {
    method: 'GET',
  });
}

// 订单保存并单规则列表
export async function saveOrderMergeRule(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/po-merge-rule`, {
    method: 'POST',
    body,
  });
}

// 订单保存并单规则列表
export async function fetchSplitOrderRules(params) {
  const param = parseParameters(params);
  return request(`${SRM_SCEC}/v1/${organizationId}/pur-req-merge-rules`, {
    method: 'GET',
    query: param,
  });
}

// 保存拆单规则列表
export async function saveSplitOrderRules(body) {
  return request(`${SRM_SCEC}/v1/${organizationId}/pur-req-merge-rules`, {
    method: 'POST',
    body,
  });
}

// 查询供应商加入监控
export async function fetchSupplierAddMonitor(params) {
  return request(`${SRM_SSLM}/v1/${organizationId}/monitor-function`, {
    method: 'GET',
    query: params,
  });
}

// 保存供应商加入监控
export async function saveSupplierAddMonitor(params) {
  return request(`${SRM_SSLM}/v1/${organizationId}/monitor-function`, {
    method: 'POST',
    body: params.adds,
  });
}

// 查询风险扫描
export async function fetchRiskScan(params) {
  return request(`${SRM_SSLM}/v1/${organizationId}/risk-scan`, {
    method: 'GET',
    query: params,
  });
}

// 保存风险扫描
export async function saveRiskScan(params) {
  return request(`${SRM_SSLM}/v1/${organizationId}/risk-scan`, {
    method: 'POST',
    body: params.adds,
  });
}
