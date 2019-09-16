/*
 * bankService - 企业注册/银行信息
 * @date: 2018/10/13 10:42:57
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import { SRM_PLATFORM } from '_utils/config';

const prefix = `${SRM_PLATFORM}/v1`;

/**
 * 查询银行信息列表的数据
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 * @param {String} params.companyId - 公司编码
 */
export async function fetchBankData(params) {
  return request(`${prefix}/companies/bank-accounts/${params.companyId}`, {
    method: 'GET',
  });
}
export async function saveBankData(params) {
  return request(`${prefix}/companies/bank-accounts/${params.companyId}`, {
    method: 'POST',
    body: params.companyBankAccountList,
  });
}
