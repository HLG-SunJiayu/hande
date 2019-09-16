/**
 * importErpService.js - 导入Erp service
 * @date: 2019-01-10
 * @author: YKK <kaikai.yang@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */

import request from 'utils/request';
import { getUserOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { SRM_SSLM } from '_utils/config';

const organizationId = getUserOrganizationId();

/**
 * 供应商地址查询接口
 */
export async function querySupplierAddress(params) {
  const { supplierSyncId, ...other } = params;
  const query = filterNullValueObject(parseParameters(other));
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync-addresss/${supplierSyncId}`, {
    method: 'GET',
    query,
  });
}

/**
 * 供应商联系人查询接口
 */
export async function querySupplierContact(params) {
  const { supplierSyncId, ...other } = params;
  const query = filterNullValueObject(parseParameters(other));
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync-contacts/${supplierSyncId}`, {
    method: 'GET',
    query,
  });
}

/**
 * 供应商账户查询接口
 */
export async function querySupplierAccount(params) {
  const { supplierSyncId, ...other } = params;
  const query = filterNullValueObject(parseParameters(other));
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync-accounts/${supplierSyncId}`, {
    method: 'GET',
    query,
  });
}

/**
 * 供应商账户保存
 * @param {Object} params - 保存参数
 */
export async function saveSupplierAccount(params) {
  const { supplierSyncAccount } = params;
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync-accounts`, {
    method: 'PUT',
    body: [...supplierSyncAccount],
  });
}

/**
 * 查询采购/财务
 *
 * @export
 * @param {Object} params
 * @returns
 */
export async function queryFinance(params) {
  const { supplierSyncId, ...other } = params;
  const param = filterNullValueObject(parseParameters(other));
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync-pfs/${supplierSyncId}`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存采购/财务
 *
 * @export
 * @param {Array} params
 * @returns
 */
export async function saveFinance(params) {
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync-pfs`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除采购/财务
 *
 * @export
 * @param {Array} params
 * @returns
 */
export async function deleteFinance(params) {
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync-pfs`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * 导入Erp查询
 *
 * @export
 * @param {Array} params
 * @returns
 */
export async function queryErp(params) {
  const { supplierSyncId, ...other } = params;
  const param = filterNullValueObject(parseParameters(other));
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 修改导入Erp数据
 *
 * @export
 * @param {Array} params
 * @returns
 */
export async function saveErp(params) {
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 导入Erp
 *
 * @export
 * @param {Array} params
 * @returns
 */
export async function importData(params) {
  return request(`${SRM_SSLM}/v1/${organizationId}/supplier-sync/import`, {
    method: 'POST',
    body: params,
  });
}
