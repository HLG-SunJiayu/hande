/*
 * deliveryCreationService - 送货单创建
 * @date: 2018/11/13 11:50:23
 * @author: lijun <jun.li06@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import request from 'utils/request';
import {
  getCurrentOrganizationId,
  parseParameters,
  filterNullValueObject,
  getResponse,
} from 'utils/utils';
import { SRM_SODR, SRM_SCEI, SRM_SCEC, SRM_MDM } from '_utils/config';

const organizationId = getCurrentOrganizationId();
/**
 * 查询采购申请创建列表数据
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function fetchList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/maintain`, {
    query,
  });
}

/**
 * 查询采购申请创建列表数据
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function handleSearchRecord(params) {
  const query = parseParameters(params);
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/maintain`, {
    query,
  });
}

/**
 * 需求头创建
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 */
export async function handleAddHeader(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests`, {
    body,
    method: 'POST',
  });
}

/**
 * 需求维护头查询
 * @param {String} prHeaderId - 头id
 */
export async function queryDetailHeader(prHeaderId) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-request/${prHeaderId}`, {
    method: 'GET',
  });
}

// /**
//  * 需求维护行查询
//  * @param {String} params - 参数
//  */
// export async function queryDetailList(params) {
//   const { prHeaderId, ...otherParams } = filterNullValueObject(parseParameters(params));
//   return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/${prHeaderId}/lines`, {
//     method: 'GET',
//     query: otherParams,
//   });
// }
/**
 * 不分页需求维护行查询
 * @param {String} params - 参数
 */
export async function queryAllDetailList(params) {
  const { prHeaderId, ...otherParams } = filterNullValueObject(params);
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/${prHeaderId}/lines/all`, {
    method: 'GET',
    query: otherParams,
  });
}
/**
 * 新增采购申请头
 * @async
 * @function add
 * @param {object} body - 头数据
 * @returns {object} fetch Promise
 */
export async function add(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests`, {
    method: 'POST',
    body,
  });
}
/* 获取操作记录列表
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
/**
 * 更新采购申请头
 * @async
 * @function update
 * @param {object} body - 头数据
 * @returns {object} fetch Promise
 */
export async function update(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests`, {
    method: 'PUT',
    body,
  });
}
/**
 * 提交采购申请
 * @async
 * @function submit
 * @param {object} body - 头数据
 * @returns {object} fetch Promise
 */
export async function submit(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/submit`, {
    method: 'POST',
    body,
  });
}
/**
 * 提交单条采购申请
 * @async
 * @function submit
 * @param {object} body - 头数据
 * @returns {object} fetch Promise
 */
export async function singleSubmit(body) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/singleton-submit`, {
    method: 'POST',
    body,
  });
}
/**
 * 删除采购申请
 * @async
 * @function deleteHeader
 * @param {object} params - 头数据
 * @returns {object} fetch Promise
 */
export async function deleteHeader(params) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests`, {
    method: 'DELETE',
    body: params,
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
 * 绑定头附件id
 * @async
 * @function bindHeaderAttachmentUuid
 * @param {object} query - 头数据
 * @returns {object} fetch Promise
 */
export async function bindHeaderAttachmentUuid(query) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/attachment-uuid`, {
    method: 'POST',
    query,
  });
}
/**
 * 绑定行附件id
 * @async
 * @function bindHeaderAttachmentUuid
 * @param {object} query - 头数据
 * @returns {object} fetch Promise
 */
export async function bindLineAttachmentUuid(query) {
  const { prHeaderId, ...otherQuery } = query;
  return request(
    `${SRM_SODR}/v1/${organizationId}/purchase-requests/${prHeaderId}/lines/attachment-uuid`,
    {
      method: 'POST',
      query: otherQuery,
    }
  );
}
/**
 * 删除行
 * @async
 * @function bindHeaderAttachmentUuid
 * @param {object} query - 头数据
 * @returns {object} fetch Promise
 */
export async function deleteLines({ prHeaderId, prLines }) {
  return request(`${SRM_SODR}/v1/${organizationId}/purchase-requests/${prHeaderId}/lines`, {
    method: 'DELETE',
    body: prLines,
  });
}

/**
 * 查询支付方式值集
 * @export
 * @param {Object} params
 */
export async function queryPaymentMethod(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${SRM_SCEI}/v1/${organizationId}/ec-payments/by-company`, {
    method: 'GET',
    query,
  });
}
/**
 * 查询收单地址
 * @export
 * @param {Object} params
 */
export async function queryInvoiceAddress(params) {
  const query = filterNullValueObject(parseParameters(params));
  const res = request(`${SRM_SCEC}/v1/${organizationId}/addresss/list`, {
    method: 'GET',
    query,
  });
  return getResponse(res);
}

/**
 * 查询品类定义
 * @param {Object} params
 */
export async function fetchCategory(params) {
  const query = filterNullValueObject(parseParameters(params));
  const { itemId, ...otherQuery } = query;
  return request(`${SRM_MDM}/v1/${organizationId}/item-categories/categories/${itemId}`, {
    method: 'GET',
    query: otherQuery,
  });
}
