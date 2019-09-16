/**
 * PurchaseRequisitionAssignmentService - 需求分配
 * @date: 2019-1-23
 * @author: lixiaolong <xialong.li02@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import request from 'utils/request';
import { SRM_SREQ, SRM_SODR } from '_utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
/**
 * 查询请求
 * @export
 * @params {?string} params.applyCode - 申请编号
 * @params {?string} params.productCode - 物料编码
 * @params {?string} params.status - 状态
 * @params {?string} params.applySource - 需求来源
 * @params {?string} params.applyDateStart - 需求日期从
 * @params {?string} params.applyDateEnd - 需求日期至
 * @params {?string} params.applyPerson - 申请人
 * @params {?string} params.sourceCode - 寻源单据编号
 * @params {?string} params.sourceType - 寻源类型
 * @params {?string} params.handlePerson - 处理人
 * @returns
 */
export async function queryList(params) {
  return request(`${SRM_SREQ}/v1/${organizationId}/purchase-requisition-assignment/list`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 保存分配信息
 * @export
 * @params {?string} params.handlePerson - 需求执行人
 * @params {?string} params.distributeDescribtion - 分配说明
 * @returns
 */
export async function saveAssignmentConfigure(params) {
  return request(
    `${SRM_SREQ}/v1/${organizationId}/purchase-requisition-assignment/save-assignment`,
    {
      method: 'POST',
      body: params,
    }
  );
}
/**
 * 保存暂挂信息
 * @export
 * @params {?sting} params.suspendReason - 暂挂原因
 * @returns
 */
export async function saveSuspendConfigure(params) {
  return request(`${SRM_SREQ}/v1/${organizationId}/purchase-requisition-assignment/save-suspend`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 启用暂挂的申请
 * @export
 * @params {string[]} params - 需要启用的申请的 rowkey
 * @returns
 */
export async function enable(params) {
  return request(`${SRM_SREQ}/v1/${organizationId}/purchase-requisition-assignment/enable`, {
    mothod: 'POST',
    body: params,
  });
}
/**
 * 附件查看
 * @export
 * @param {string} params - 附件所在的需求申请的 id
 * @returns
 */
export async function viewAttachment(params) {
  return request(`${SRM_SREQ}/v1/${organizationId}/purchase-requisition-assignment/attachment`, {
    method: 'GET',
    query: params,
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
