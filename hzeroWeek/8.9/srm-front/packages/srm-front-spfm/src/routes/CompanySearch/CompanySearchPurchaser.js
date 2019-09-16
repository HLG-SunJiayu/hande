import { Form } from 'hzero-ui';
import { connect } from 'dva';

import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import CompanySearch from './index';

@formatterCollections({ code: 'spfm.companySearch' })
@connect(({ loading, companySearchPurchaser }) => ({
  loadingInit:
    loading.effects['companySearchPurchaser/batchCode'] ||
    loading.effects['companySearchPurchaser/initIndustry'],
  loadingQueryList: loading.effects['companySearchPurchaser/queryList'],
  loadingInvite: loading.effects['companySearchPurchaser/invite'],
  loadingInviteRegister: loading.effects['companySearchPurchaser/inviteRegister'],
  companyLoading: loading.effects['companySearchPurchaser/queryCompanyInformation'],
  companySearch: companySearchPurchaser,
  organizationId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
export default class CompanySearchPurchaser extends CompanySearch {
  state = {
    isSupplier: false,
  };

  namespace = 'companySearchPurchaser';
}
