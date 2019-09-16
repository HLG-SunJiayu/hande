import { isEmpty, forEach, isNumber, isNaN } from 'lodash';
import { getResponse } from 'utils/utils';

import { queryMapIdpValue } from 'hzero-front/lib/services/api';
import {
  companySearchQueryPageSupplier,
  companySearchIndustry,
  companySearchInvitePurchaser,
  companySearchInviteRegisterSupplier,
  queryInvestigateTemplates,
  queryCompanyInformation,
  fetchSettings,
  fetchRiskScan,
  riskEmbedPage,
} from '@/services/companySearchService';

export default {
  namespace: 'companySearchSupplier',
  state: {
    // 值集
    code: {},
    // 行业信息
    // childIndustryLength 所有二级行业的 数量, 在选中 全部的 二级行业时, 不传二级行业给 接口
    // industries 所有的一级行业
    // industryMap 一级行业的Map  industryId: industry
    industries: {},
    // 后台 返回的 分页数据
    list: {},
    investigateTemplates: [],
    settings: {}, // 配置中心配置
    riskScanList: [], // 查询风险扫描列表
  },
  effects: {
    // 合并请求 值集
    *batchCode({ payload }, { put, call }) {
      const { lovCodes } = payload;
      const code = getResponse(yield call(queryMapIdpValue, lovCodes));
      if (!isEmpty(code)) {
        yield put({
          type: 'updateState',
          payload: {
            code,
          },
        });
      }
    },
    // 初始化 行业
    *initIndustry(_, { call, put }) {
      const industries = getResponse(yield call(companySearchIndustry));
      if (!isEmpty(industries)) {
        const dealIndustries = { industries: [], industryMap: {}, childIndustryLength: 0 };
        forEach(industries, industry => {
          const { children, ...copyIndustry } = industry;
          copyIndustry.children = [];
          dealIndustries.industries.push(copyIndustry);
          dealIndustries.industryMap[copyIndustry.industryId] = copyIndustry;
          forEach(children, childIndustry => {
            copyIndustry.children.push(childIndustry);
          });
          dealIndustries.childIndustryLength += copyIndustry.children.length;
        });
        // 对 行业做处理，转换为需要的形式
        yield put({
          type: 'updateState',
          payload: {
            industries: dealIndustries,
          },
        });
      }
    },
    // 查询公司信息
    *queryList({ payload }, { call, put }) {
      const { params, pagination, organizationId } = payload;
      const res = getResponse(
        yield call(companySearchQueryPageSupplier, organizationId, params, pagination)
      );
      if (!isEmpty(res)) {
        yield put({
          type: 'updateState',
          payload: {
            list: res,
          },
        });
      }
    },
    // 发送供应商邀约
    *invite({ payload }, { call }) {
      const response = yield call(companySearchInvitePurchaser, payload);
      return getResponse(response);
    },
    // 发起 邀请 供应商 注册
    *inviteRegister({ payload }, { call }) {
      const res = yield call(companySearchInviteRegisterSupplier, payload);
      return getResponse(res);
    },
    // 调查表模板信息查询
    *queryInvestigateTemplates({ payload }, { call, put }) {
      const res = yield call(queryInvestigateTemplates, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            investigateTemplates: list,
          },
        });
      }
    },

    // 查询公司信息
    *queryCompanyInformation({ payload }, { call, put }) {
      const response = yield call(queryCompanyInformation, payload);
      const data = getResponse(response);
      if (data) {
        const { basic = {}, business = {} } = data;
        yield put({
          type: 'updateState',
          payload: { companyInformation: { ...basic, ...business } },
        });
      }
    },

    // 查询配置信息
    *fetchSettings(_, { call, put }) {
      const result = getResponse(yield call(fetchSettings));
      const res = getResponse(yield call(fetchRiskScan));
      if (result && res) {
        const newResult = {};
        for (const key in result) {
          if (isNumber(+result[key]) && !isNaN(+result[key]) && result[key] !== null) {
            newResult[key] = +result[key];
          } else if (result[key] === null) {
            newResult[key] = undefined;
          } else {
            newResult[key] = result[key];
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            settings: newResult,
            riskScanList: res,
          },
        });
      }
      return result;
    },

    // 斯瑞德风险扫描内嵌页
    *riskEmbedPage({ payload }, { call }) {
      const res = yield call(riskEmbedPage, payload);
      return res;
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
