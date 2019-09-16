import { HZERO_PLATFORM } from 'utils/config';
import { SRM_PLATFORM } from '_utils/config';
import request from 'utils/request';

export const SERVICE_URL = `${SRM_PLATFORM}/v1/companies`;

/**
 * 查询当前最新的业务信息.
 * @export
 */
export async function queryCompanyBusiness(companyId) {
  return request(`${SERVICE_URL}/business/${companyId}`);
}

/**
 * 更新公司业务信息.
 * @export
 */
export async function updateBusiness(params) {
  return request(`${SERVICE_URL}/business/${params.companyId}`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 创建公司业务信息.
 * @export
 */
export async function createBusiness(params) {
  return request(`${SERVICE_URL}/business/${params.companyId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取行业.
 * @export
 */
export async function fetchIndustries() {
  return request(`${HZERO_PLATFORM}/v1/industries/tree`);
}

/**
 * 获取行业品类.
 * @export
 */
export async function fetchIndustryCategories(idList) {
  // TODO:
  return request(`${HZERO_PLATFORM}/v1/industries/categories/tree`, {
    method: 'GET',
    query: {
      industryIdList: idList.join(','),
      enabledFlag: 1,
    },
  });
}
