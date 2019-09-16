/*
 * purchaseRequisitionApproval - 采购申请审批
 * @date: 2019-01-24
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { SRM_SODR } from '_utils/config';
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
/**
 * 查询列表的数据
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function queryList(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/approve`, {
    method: 'GET',
    query: parseParameters(params),
  });
}

/**
 * 采购申请erp列表通过
 * @async
 * @function passApprovalList
 * @param {!number} organizationId - 组织ID
 * @param {object} body - 数据
 * @returns {object} fetch Promise
 */
export async function approval(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/erp/approve/approval`, {
    method: 'POST',
    body,
  });
}

/**
 * 采购申请erp列表拒绝
 * @async
 * @function passApprovalList
 * @param {!number} organizationId - 组织ID
 * @param {object} body - 数据
 * @returns {object} fetch Promise
 */
export async function reject(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/erp/approve/reject`, {
    method: 'POST',
    body,
  });
}

/**
 * 采购申请非erp列表通过
 * @async
 * @function passApprovalList
 * @param {!number} organizationId - 组织ID
 * @param {object} body - 数据
 * @returns {object} fetch Promise
 */
export async function approvalApprovalList(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/approve/approval`, {
    method: 'POST',
    body,
  });
}

/**
 * 采购申请非erp列表拒绝
 * @async
 * @function passApprovalList
 * @param {!number} organizationId - 组织ID
 * @param {object} body - 数据
 * @returns {object} fetch Promise
 */
export async function rejectApprovalList(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/approve/reject`, {
    method: 'POST',
    body,
  });
}

/**
 * 需求审批头查询
 * @param {String} prHeaderId - 头id
 */
export async function queryDetailHeader(prHeaderId) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-request/${prHeaderId}`, {
    method: 'GET',
  });
}

/**
 * 需求审批行查询
 * @param {String} prHeaderId - 头id
 */
export async function queryDetailList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/${query.prHeaderId}/lines`, {
    method: 'GET',
    query,
  });
}
/**
 * 获取操作记录列表
 * @async
 * @function fetchOperationRecordList
 * @param {!number} organizationId - 组织ID
 * @param {!number} prHeaderId - 头ID
 * @param {String} page - 页码
 * @param {String} size - 页数
 * @returns {object} fetch Promise
 */
export async function fetchOperationRecordList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/${query.prHeaderId}/actions`, {
    method: 'GET',
    query,
  });
}
