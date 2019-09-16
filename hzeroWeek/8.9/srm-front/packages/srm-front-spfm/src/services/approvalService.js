/**
 * approvalService - 企业认证审批service
 * @date: 2018-7-24
 * @author: lijun <jun.li06@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { stringify } from 'qs';
import request from 'utils/request';
import { SRM_PLATFORM } from '_utils/config';
import { parseParameters } from 'utils/utils';

export async function queryList(params = {}) {
  const param = parseParameters(params);
  return request(`${SRM_PLATFORM}/v1/company-actions/submited`, {
    method: 'GET',
    query: param,
  });
}

export async function queryDetail(params = {}) {
  return request(`${SRM_PLATFORM}/v1/companies/process?${stringify(params)}`);
}

export async function approve(params = {}) {
  return request(`${SRM_PLATFORM}/v1/company-actions/batch-approve`, {
    method: 'POST',
    body: params,
  });
}

export async function reject(params = {}) {
  return request(`${SRM_PLATFORM}/v1/company-actions/reject`, {
    method: 'POST',
    body: params,
  });
}

export async function queryRecord(companyId) {
  return request(`${SRM_PLATFORM}/v1/company-actions/${companyId}/history`);
}

export async function certificationBusiness(params) {
  return request(`${SRM_PLATFORM}/v1/company-actions/batch-approve-auto`, {
    method: 'POST',
    body: params,
  });
}
