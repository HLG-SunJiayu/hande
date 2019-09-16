import React from 'react';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import CompanySearch from './CompanySearch';

export default class CompanySearchRoute extends React.Component {
  componentDidMount() {
    // const routerParam = qs.parse(this.props.history.location.search.substr(1));
    // const { _back } = routerParam;
    const { isSupplier } = this.state;
    const {
      location: { state: { _back } = {} },
    } = this.props;
    if (_back === -1) {
      this.reloadList();
    } else {
      this.queryList();
    }
    if (isSupplier) {
      this.handleEnable();
    }
  }

  // 获取companySearch子组件
  companySearch;

  /**
   * 初始化 以及 查询一次
   */
  @Bind()
  queryList() {
    const { dispatch } = this.props;
    // 初始化 行业
    dispatch({
      type: `${this.namespace}/initIndustry`,
    });
    const { isSupplier } = this.state;
    const lovCodes = {
      // 送货服务范围值集
      serviceArea: 'SPFM.COMPANY.SERVICE_AREA',
      // 注册资本范围值集
      registeredCapital: 'SPFM.COMPANY.CAPITAL_RANGE',
    };
    if (isSupplier) {
      lovCodes.investigateType = 'SSLM.INVESTIGATE_TYPE';
      lovCodes.investigateTemplateId = 'SSLM.INVESTIGATE_TEMPLATE_ID';
    }
    // 初始化 值集
    dispatch({
      type: `${this.namespace}/batchCode`,
      payload: {
        lovCodes,
      },
    });
    // 查询信息
    this.queryPage();
  }

  /**
   * 通过 form 表单中的值 以及 传过来的分页信息 查询数据
   * 将 分页信息存在 state 中
   * @param {Object} pagination - 分页信息
   */
  @Bind()
  queryPage(pagination = { page: 0, size: 10 }) {
    const {
      form,
      companySearch: { code = {}, industries = {} },
      organizationId,
    } = this.props;

    const formValues = form.getFieldsValue([
      'companyName',
      'industryIds',
      'childrenIndustryIds',
      'serviceAreaCodes',
      'capitalRanges',
    ]);
    // 清除 所有 全选的条件
    if (
      formValues.industryIds &&
      industries.industries &&
      industries.industries.length <= formValues.industryIds.length
    ) {
      // 如果 一级行业全选了, 就不传 一级行业 给后台
      delete formValues.industryIds;
    }
    if (
      formValues.childrenIndustryIds &&
      industries.childIndustryLength <= formValues.childrenIndustryIds.length
    ) {
      // 所有的 二级行业全部选了, 就不传 二级行业 给后台
      delete formValues.childrenIndustryIds;
    }
    if (
      formValues.serviceAreaCodes &&
      code.serviceArea &&
      code.serviceArea.length <= formValues.serviceAreaCodes.length
    ) {
      // 所有的 服务或送货范围 都选中了,就不传 范围 给后台
      delete formValues.serviceAreaCodes;
    }
    if (
      formValues.capitalRanges &&
      code.registeredCapital &&
      code.registeredCapital.length <= formValues.capitalRanges.length
    ) {
      // 所有的 注册资本 都选中了,就不传 注册资本 给后台
      delete formValues.capitalRanges;
    }
    this.setState({
      pagination,
    });
    this.fetchList({ params: formValues, pagination, organizationId });
  }

  /**
   * fetchList - 查询公司
   */
  @Bind()
  fetchList(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.namespace}/queryList`,
      payload,
    });
  }

  /**
   * 创建邀约
   * @param {!Object} values
   */
  @Bind()
  invite(values) {
    const { dispatch, organizationId } = this.props;
    dispatch({
      type: `${this.namespace}/invite`,
      payload: { ...values, organizationId },
    }).then(res => {
      if (res) {
        notification.success();
        this.companySearch.hideModal();
      }
    });
  }

  /**
   * 依据缓存中的数据 重新查询
   */
  @Bind()
  reloadList() {
    const { pagination = { page: 0, size: 10 } } = this.state;
    this.queryPage(pagination);
  }

  /**
   * 查询调查表模板
   */
  @Bind()
  queryInvestigateTemplates(params) {
    const { dispatch, organizationId } = this.props;
    dispatch({
      type: `${this.namespace}/queryInvestigateTemplates`,
      payload: {
        organizationId,
        ...params,
      },
    });
  }

  @Bind()
  queryCompanyInformation(companyId) {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.namespace}/queryCompanyInformation`,
      payload: { companyId },
    });
  }

  @Bind()
  handleRef(ref = {}) {
    this.companySearch = ref || {};
  }

  render() {
    // 根据路径的不同传不同参数给真正的公司查询页面
    const { isSupplier, isRiskScan } = this.state;
    const {
      form,
      organizationId,
      loadingInit = false,
      loadingQueryList = false,
      loadingInvite = false,
      loadingInviteRegister = false,
      companyLoading = false,
      companySearch: {
        list,
        code = {},
        codeMap = {},
        industries = {},
        investigateTemplates = {},
        companyInformation = {},
      },
    } = this.props;

    const loading = {
      loadingInit,
      loadingInvite,
      loadingInviteRegister,
      loadingQueryList,
      companyLoading,
    };
    const companySearchProps = {
      loading,
      isSupplier,
      isRiskScan,
      form,
      list,
      codeMap,
      code,
      industries,
      organizationId,
      companyInformation,
      investigateTemplates,
      onRef: this.handleRef,
      searchLabelWidth: 140,
      queryPage: this.queryPage,
      // 邀请 客户/供应商
      invite: this.invite,
      // 邀请供应商注册
      inviteRegister: this.inviteRegister,
      queryInvestigateTemplates: this.queryInvestigateTemplates,
      onQueryCompanyInformation: this.queryCompanyInformation,
      handleEmbedPage: this.handleEmbedPage,
    };
    return <CompanySearch {...companySearchProps} />;
  }
}
