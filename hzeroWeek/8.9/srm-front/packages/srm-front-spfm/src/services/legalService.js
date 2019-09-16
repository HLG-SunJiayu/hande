import { isUndefined, isNull } from 'lodash';
import { getCurrentOrganizationId, isTenantRoleLevel } from 'utils/utils';
import request from 'utils/request';
import { HZERO_PLATFORM, HZERO_IAM } from 'utils/config';
import { SRM_PLATFORM } from '_utils/config';
import { queryMapIdpValue } from 'hzero-front/lib/services/api';

export const SERVICE_URL = `${SRM_PLATFORM}/v1/companies`;
const TenantRoleLevel = isTenantRoleLevel();
const organizationId = getCurrentOrganizationId();

/**
 * 初始化值集.
 * @export
 */
export async function initValueList() {
  return queryMapIdpValue({
    companyType: 'HPFM.COMPANY_TYPE',
    taxpayerType: 'HPFM.TAXPAYER_TYPE',
  });
}

/**
 * 查询当前最新的企业信息.
 * @export
 */
export async function queryCompanyBasic() {
  return request(`${SERVICE_URL}/basic`);
}

/**
 * 查询国家地区.
 * @param {Number} countryId 国家ID
 * @export
 */
export async function queryProvinceCity(countryId) {
  return request(`${HZERO_PLATFORM}/v1/countries/${countryId}/regions`, {
    method: 'GET',
    query: {
      enabledFlag: 1,
    },
  });
}

/**
 * 动态查询地区
 * @param {*} params
 * @returns
 */
export async function loadCityData(params) {
  if (TenantRoleLevel) {
    return request(`${SRM_PLATFORM}/v1/${organizationId}/regions/regional-linkage`, {
      method: 'GET',
      query: params,
    });
  } else {
    return request(`${SRM_PLATFORM}/v1/regions/regional-linkage`, {
      method: 'GET',
      query: params,
    });
  }
}

/**
 * 从百度OCR接口获取企业信息.
 * @param {Object} params
 * @export
 */
export async function fetchCompanyInfoFromOcr(params) {
  const { url } = params;
  return request(`${SERVICE_URL}/ocr`, {
    method: 'GET',
    query: {
      url,
    },
  });
}

/**
 * 保存.
 * @param {Object} params
 * @export
 */
export async function saveLegalInfo(params) {
  if (isUndefined(params.companyId) || isNull(params.companyId)) {
    return request(`${SERVICE_URL}/basic`, {
      method: 'POST',
      body: params,
    });
  } else {
    return request(`${SERVICE_URL}/basic/${params.companyId}`, {
      method: 'PUT',
      body: params,
    });
  }
}

/**
 * 保存公司基础信息-租户级.
 * @param {Object} params
 * @export
 */
export async function saveOrgLegalInfo(params) {
  return request(`${SRM_PLATFORM}/v1/${params.organizationId}/companies/basic`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 验证统一社会信用代码.
 * @param {Object} params
 * @export
 */
export async function validateUnifiedSocialCode(param) {
  return request(`${SERVICE_URL}/basic/unified-social-code`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 验证统一社会信用代码.
 * @param {Object} params
 * @export
 */
export async function validateCompanyName(param) {
  return request(`${SERVICE_URL}/basic/company-name`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询用户注册时的企业名称.
 * @function queryCompanyName
 * @export
 */
export async function queryCompanyName() {
  return request(`${HZERO_IAM}/hzero/v1/users/self/company-name`, {
    method: 'GET',
  });
}
