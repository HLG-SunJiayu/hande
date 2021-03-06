import request from 'utils/request';
import { SRM_PLATFORM } from '_utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// function templatesApi() {
//   return isTenantRoleLevel() ? `${tenantId}/templates` : 'templates';
// }

/**
 * 数据查询
 * @async
 * @function fetchTemplates
 * @param {object} params - 查询条件
 * @param {?string} params.templateName - 模板名称
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchTemplates(params) {
  const param = parseParameters(params);
  return request(`${SRM_PLATFORM}/v1/${tenantId}/templates`, {
    method: 'GET',
    query: { ...param },
  });
}

/**
 * 数据查询
 * @async
 * @function fetchTemplatesEnabled
 * @param {object} params - 查询条件
 * @param {?string} params.templateName - 模板名称
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchTemplatesEnabled(params) {
  const param = parseParameters(params);
  return request(`${SRM_PLATFORM}/v1/${tenantId}/templates/enabled`, {
    method: 'GET',
    query: { ...param },
  });
}

/**
 * 添加模板信息
 * @async
 * @function createTemplate
 * @param {object} params - 请求参数
 * @param {?string} params.templateCode - 模板编码
 * @param {?string} params.templateName - 模板名称
 * @param {?string} params.templateAvatar - 模板缩略图
 * @param {?string} params.templateCode - 流程分类描述
 * @param {?string} params.templatePath - 模板路径
 * @param {?string} params.enable - 启用
 * @returns {object} fetch Promise
 */
export async function createTemplate(params) {
  return request(`${SRM_PLATFORM}/v1/${tenantId}/templates`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 编辑模板
 * @async
 * @function editTemplate
 * @param {object} params - 请求参数
 * @param {?string} params.templateName - 模板名称
 * @param {?string} params.templateAvatar - 模板缩略图
 * @param {?string} params.templateCode - 流程分类描述
 * @param {?string} params.templatePath - 模板路径
 * @param {?string} params.enable - 启用
 * @param {!string} params.objectVersionNumber - 版本号
 * @returns {object} fetch Promise
 */
export async function editTemplate(params) {
  return request(`${SRM_PLATFORM}/v1/${tenantId}/templates`, {
    method: 'PUT',
    body: params,
  });
}
