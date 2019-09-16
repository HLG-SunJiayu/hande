import request from 'utils/request';
import { SRM_PLATFORM } from '_utils/config';

export const SERVICE_URL = `${SRM_PLATFORM}/v1/companies`;

/**
 * 查询公司信息.
 * @export
 */
export async function fetchEnterpriseInfo(companyId) {
  return request(SERVICE_URL, {
    method: 'GET',
    query: {
      companyId,
    },
  });
}

/**
 * 查询当前最新的业务信息.
 * @export
 */
export async function queryCompanyBusiness(companyId) {
  return request(`${SERVICE_URL}/business/${companyId}`);
}
