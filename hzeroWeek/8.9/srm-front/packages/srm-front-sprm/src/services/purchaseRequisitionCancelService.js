/**
 * purchaseRequisitionCancelService - 需求取消
 * @date: 2019-1-25
 * @author: lixiaolong <xiaolong.li02@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { SRM_SODR } from '_utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

/**
 * 需求取消
 * @param {Array[]} params
 */
export async function cancelPurchase(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/lines/cancel`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询请求
 * @export
 * @param {?string} params.prNum - 申请编号
 * @param {?string} params.prStatusCode - 状态
 * @param {?string} params.prSourcePlatform - 单据来源
 * @param {?string} params.createdDateStart - 创建日期从
 * @param {?string} params.createdDateEnd - 创建日期至
 * @param {?string} params.neededDateStart - 需求日期从
 * @param {?string} params.neededDateEnd - 需求日期至
 */
export async function searchList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/lines/cancel`, {
    method: 'GET',
    query,
  });
}
/**
 * 整单取消tab页查询请求
 */
export async function searchSingleList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/cancel`, {
    method: 'GET',
    query,
  });
}
/**
 * 取消采购申请
 * @async
 * @function cancel
 * @param {object} body - 头数据
 * @returns {object} fetch Promise
 */
export async function cancel(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/cancel`, {
    method: 'POST',
    body,
  });
}
/**
 * erp 详情页获取信息请求
 * @param {string} params.id - 需要获取数据的 id
 */
export async function fetchSingleData(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/lines/erp-cancel`, {
    method: 'GET',
    query: params,
  });
}
/**
 * erp 详情页获取消请求
 * @param {string} params.id - 需要获取数据的 id
 */
export async function cancelERP(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/lines/erp-cancel`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 非erp 详情页获取消请求
 * @param {String} prHeaderId - 头id
 */
export async function queryDetailHeader(prHeaderId) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-request/${prHeaderId}`, {
    method: 'GET',
  });
}

/**
 * 非erp 详情页获取消请求
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
