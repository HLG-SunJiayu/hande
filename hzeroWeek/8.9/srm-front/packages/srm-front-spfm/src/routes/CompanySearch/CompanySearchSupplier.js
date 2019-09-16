import { Form } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
// import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

// import { openTab } from 'utils/menuTab';
import CompanySearch from './index';

@formatterCollections({ code: 'spfm.companySearch' })
@connect(({ loading, companySearchSupplier }) => ({
  loadingInit:
    loading.effects['companySearchSupplier/batchCode'] ||
    loading.effects['companySearchSupplier/initIndustry'],
  loadingQueryList: loading.effects['companySearchSupplier/queryList'],
  loadingInvite: loading.effects['companySearchSupplier/invite'],
  loadingInviteRegister: loading.effects['companySearchSupplier/inviteRegister'],
  companyLoading: loading.effects['companySearchSupplier/queryCompanyInformation'],
  companySearch: companySearchSupplier,
  organizationId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
export default class CompanySearchSupplier extends CompanySearch {
  state = {
    isSupplier: true,
    isRiskScan: false,
  };

  namespace = 'companySearchSupplier';

  /**
   * 调用 邀请注册的接口
   * @param {Object} payload - 租户id 和 邀请注册的信息
   * @returns
   */
  @Bind()
  inviteRegister(payload) {
    const { dispatch } = this.props;
    return dispatch({
      type: 'companySearchSupplier/inviteRegister',
      payload,
    });
  }

  /**
   * 判断配置中心是否开启
   */
  @Bind()
  handleEnable() {
    const { dispatch } = this.props;
    dispatch({
      type: 'companySearchSupplier/fetchSettings',
    }).then(res => {
      if (res) {
        const {
          companySearch: { settings = {}, riskScanList = [] },
        } = this.props;
        riskScanList.forEach(n => {
          if (n.value === 'supplier' || n.scanCode === 'supplier') {
            if (settings['010002'] === 1 && n.enabledFlag === 1) {
              this.setState({
                isRiskScan: true,
              });
            }
          }
        });
      }
    });
  }

  /**
   * 斯瑞德风险扫描内嵌页
   */
  @Bind()
  handleEmbedPage(company) {
    const { dispatch } = this.props;
    dispatch({
      type: 'companySearchSupplier/riskEmbedPage',
      payload: {
        enterpriseName: company.companyName,
      },
    }).then(url => {
      if (url) {
        window.open(url);
      }
    });
  }
}
