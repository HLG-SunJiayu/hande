import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import request from 'utils/request';

/**
 * 查询邀约汇总列表的数据
 * @param {Object} params - 查询参数
 * @param {String} params.page - 页码
 * @param {String} params.size - 页数
 * @param {String} params.companyId - 公司编码
 */
const organizationId = getCurrentOrganizationId();
export async function fetchInviteList(params) {
  const { page, size, ...otherParams } = parseParameters(params);
  return request(`/spfm/v1/${organizationId}/invites`, {
    method: 'POST',
    body: otherParams,
    query: {
      page,
      size,
    },
  });
}
