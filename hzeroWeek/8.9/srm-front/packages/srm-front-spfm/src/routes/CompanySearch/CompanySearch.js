import React from 'react';
import { withRouter } from 'react-router';
import {
  Card,
  Pagination,
  Form,
  Row,
  Col,
  Input,
  Button,
  Tooltip,
  Modal,
  Spin,
  Drawer,
  Avatar,
} from 'hzero-ui';
import { map, forEach, isFunction, isEmpty, join, intersectionWith } from 'lodash';
import { Bind, Debounce } from 'lodash-decorators';
import intl from 'utils/intl';
import { createPagination } from 'utils/utils';
import { Header, Content } from 'components/Page';
import TagSelect from 'components/TagSelect';
import { DEBOUNCE_TIME } from 'utils/constants';
import { openTab } from 'utils/menuTab';

import Invitation from '../Invitation/Invitation';
import InvitationRegisterModal from '../InvitationRegister/InvitationRegisterModel';
import CompanyInformation from './CompanyInformation';

import styles from './index.less';
import companyNotFindPng from '@/assets/company-search-icon-no-result.png';

const { Item: FormItem } = Form;

/**
 * 左右组件 描述 与 值
 * 值会加上 Tooltip 提示框
 * @param {String} className - 额外的className
 * @param {React.Element} first - 左侧的组件 描述
 * @param {React.Element} second - 右侧的组件 值
 * @example
 *    <Tuple
 *      first={intl.get(`${this.promptCode}.model.company.industry`).d('行业')}
 *      second="计算机，农业，畜牧业"
 *      className={styles['table-item-content']}
 *    />
 */
function Tuple({ className, first, second }) {
  const mergeClassName = `${styles['list-item-content']} ${className || ''}`;
  return (
    <div className={mergeClassName}>
      <div className={styles['list-item-content-first']}>{first}:&nbsp;</div>
      <div className={styles['list-item-content-second']}>
        <Tooltip placement="top" title={second}>
          {second.length > 12 ? `${second.substr(0, 12)}...` : second}
        </Tooltip>
      </div>
    </div>
  );
}
/**
 * @reactProps {Boolean} isSupplier - 是否是 发现采购页面, 如果不是发现采购页面，则是发现供应商
 */
@withRouter
export default class CompanySearch extends React.PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  promptCode = 'spfm.companySearch';

  state = {
    invitationProps: {
      visible: false,
    },
    companyInfoVisible: false, // 公司模态框
  };

  componentWillUnmount() {
    this.queryPage.cancel();
  }

  /**
   * 邀请 供应商/采购商 按钮点击
   * 打开 供应商/采购商 邀请模态框
   * @param {Object} company - 公司信息
   * @param {!Number} company.companyId - 公司id
   * @param {!Number} company.tenantId - 公司对应的租户id
   * @param {String} company.companyName - 公司名称
   * @memberof CompanySearch
   */
  @Bind()
  handleInviteBtnClick(company) {
    // 需要打开 邀请模态框
    const { isSupplier } = this.props;
    const { invitationProps } = this.state;
    this.setState({
      invitationProps: {
        ...invitationProps,
        isSupplier,
        inviteCompanyName: company.companyName,
        inviteCompanyId: company.companyId,
        inviteTenantId: company.tenantId,
        visible: true,
      },
    });
  }

  /**
   * 关闭 供应商/采购商 邀请模态框
   * @memberof CompanySearch
   */
  @Bind()
  hideModal() {
    const { invitationProps } = this.state;
    this.setState({
      invitationProps: {
        ...invitationProps,
        visible: false,
      },
    });
  }

  /**
   * relInvitationRegisterModal - 拿到 邀请注册组件的 引用
   * @memberof CompanySearch
   */
  @Bind()
  relInvitationRegisterModal(invitationRegisterModal) {
    this.invitationRegisterModal = invitationRegisterModal;
  }

  /**
   * 打开 邀请注册 模态框
   * @memberof CompanySearch
   */
  @Bind()
  handleInviteRegisterBtnClick() {
    // 需要打开 邀请注册
    const { invitationRegisterModal } = this;
    const { isSupplier } = this.props;
    if (isSupplier && invitationRegisterModal && isFunction(invitationRegisterModal.showModal)) {
      invitationRegisterModal.showModal();
    }
  }

  /**
   * 一级行业改变,重新设置二级行业
   * @param {Number[]} industryIds - 一级行业的id数组
   */
  @Bind()
  handleIndustryChange(industryIds) {
    const { form, industries: { industryMap = {} } = {} } = this.props;
    const childIndustryIds = form.getFieldValue('childrenIndustryIds') || [];
    if (!isEmpty(industryIds)) {
      let allLegalChildIndustries = [];
      forEach(industryIds, industryId => {
        allLegalChildIndustries = allLegalChildIndustries.concat(
          (industryMap[industryId] && industryMap[industryId].children) || []
        );
      });
      const legalChildIndustryIds = intersectionWith(
        childIndustryIds,
        allLegalChildIndustries,
        (industryId, industry) => {
          return industryId === industry.industryId;
        }
      );
      if (legalChildIndustryIds.length !== childIndustryIds.length) {
        form.setFieldsValue({ childrenIndustryIds: legalChildIndustryIds });
      }
    }
    this.handleFormSearch();
  }

  /**
   * 查询表单 查询
   * 调用查询接口
   * @param {e} e - submit 事件
   * @memberof CompanySearch
   */
  @Bind()
  handleFormSearch(e) {
    if (e && isFunction(e.preventDefault)) {
      e.preventDefault();
    }
    this.queryPage();
  }

  /**
   * 分页改变
   * 调用查询接口
   * @param {Number} current - 页码
   * @param {Number} pageSize - 分页大小
   * @memberof CompanySearch
   */
  @Bind()
  handlePaginationChange(current, pageSize) {
    this.queryPage({ page: current - 1, size: pageSize });
  }

  /**
   * 为了 防抖
   */
  @Debounce(DEBOUNCE_TIME)
  queryPage(pagination) {
    const { queryPage } = this.props;
    if (isFunction(queryPage)) {
      queryPage(pagination);
    }
  }

  /**
   *展示公司信息modal
   *
   * @param {*} srmCompanyId
   * @memberof CompanySearch
   */
  @Bind()
  showCompanyInfo(srmCompanyId) {
    this.props.onQueryCompanyInformation(srmCompanyId);
    this.setState({ companyInfoVisible: true });
  }

  /**
   * 关闭公司信息modal
   */
  @Bind()
  hideCompanyInfoModal() {
    this.setState({ companyInfoVisible: false });
  }

  /**
   * 渲染查询表单
   * @memberof CompanySearch
   */
  @Bind()
  renderForm() {
    const {
      form: { getFieldDecorator, getFieldsValue },
      code,
      industries = {},
      isSupplier,
      searchLabelWidth = 140,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        style: { width: searchLabelWidth, minWidth: searchLabelWidth, maxWidth: searchLabelWidth },
      },
      wrapperCol: { style: { flex: 'auto' } },
    };
    const colGrid = { xxl: 6, xl: 8, md: 12, xs: 24 };
    const formValues = getFieldsValue();
    const selectedIndustry = {};
    const { industries: allIndustries = [] } = industries;
    let containsIndustries = [];
    if (!isEmpty(formValues.industryIds)) {
      forEach(formValues.industryIds, industryId => {
        selectedIndustry[industryId] = true;
      });
      forEach(allIndustries, industry => {
        if (selectedIndustry[industry.industryId]) {
          containsIndustries = containsIndustries.concat(industry.children || []);
        }
      });
    } else {
      forEach(allIndustries, industry => {
        containsIndustries = containsIndustries.concat(industry.children || []);
      });
    }
    return (
      <Form className={styles['search-form']}>
        <Row>
          <Col {...colGrid}>
            <FormItem>
              {getFieldDecorator('companyName')(
                <Input
                  placeholder={intl
                    .get(`${this.promptCode}.view.message.companyName.placeholder`)
                    .d('请输入公司名称查询')}
                />
              )}
            </FormItem>
          </Col>
          <Col {...colGrid}>
            <FormItem>
              {isSupplier && (
                <Button style={{ marginLeft: 8 }} onClick={this.handleInviteRegisterBtnClick}>
                  {intl.get(`${this.promptCode}.view.option.inviteRegister`).d('邀请注册')}
                </Button>
              )}
              <Button
                onClick={this.handleFormSearch}
                htmlType="submit"
                style={{ marginRight: 8, marginLeft: 8 }}
                type="primary"
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row className={styles['search-form-content']}>
          <Col>
            <FormItem
              {...formItemLayout}
              className={styles['first-form-item']}
              label={intl.get(`${this.promptCode}.model.company.industry`).d('行业')}
            >
              {getFieldDecorator('industryIds')(
                <TagSelect
                  onChange={this.handleIndustryChange}
                  className={styles['tag-select']}
                  expandable
                >
                  {map(allIndustries, industry => {
                    return (
                      <TagSelect.Option value={industry.industryId} key={industry.industryId}>
                        {industry.industryName}
                      </TagSelect.Option>
                    );
                  })}
                </TagSelect>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl
                .get(`${this.promptCode}.model.company.childrenIndustry`)
                .d('产品服务分类')}
            >
              {getFieldDecorator('childrenIndustryIds')(
                <TagSelect expandable onChange={this.handleFormSearch}>
                  {map(containsIndustries, childIndustry => {
                    return (
                      <TagSelect.Option
                        value={childIndustry.industryId}
                        key={childIndustry.industryId}
                      >
                        {childIndustry.industryName}
                      </TagSelect.Option>
                    );
                  })}
                </TagSelect>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl.get(`${this.promptCode}.model.company.serviceArea`).d('送货或服务范围')}
            >
              {getFieldDecorator('serviceAreaCodes')(
                <TagSelect expandable onChange={this.handleFormSearch}>
                  {map(code.serviceArea, area => {
                    return (
                      <TagSelect.Option value={area.value} key={area.value}>
                        {area.meaning}
                      </TagSelect.Option>
                    );
                  })}
                </TagSelect>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl.get(`${this.promptCode}.model.company.capitalRange`).d('注册资本')}
            >
              {getFieldDecorator('capitalRanges')(
                <TagSelect expandable onChange={this.handleFormSearch}>
                  {map(code.registeredCapital, capital => {
                    return (
                      <TagSelect.Option value={capital.value} key={capital.value}>
                        {capital.meaning}
                      </TagSelect.Option>
                    );
                  })}
                </TagSelect>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 查询数据为空时显示的界面
   * 当发现采购商 isSupplier === true 没有查找到对应的公司时,
   * 显示 邀请注册按钮
   * @memberof CompanySearch
   */
  @Bind()
  renderInviteRegisterBtn() {
    const { isSupplier } = this.props;
    return (
      <div className={styles['company-not-find']}>
        <div className={styles['invite-register']}>
          <img
            src={companyNotFindPng}
            alt={intl.get(`${this.promptCode}.view.option.inviteRegister`).d('邀请注册')}
          />
          <div className={styles.description}>
            <p
              style={{
                fontSize: 18,
                color: '#434e59',
              }}
            >
              {intl.get(`${this.promptCode}.view.message.noResult`).d('没有检索到相关企业')}
            </p>
            {isSupplier && (
              <p
                style={{
                  fontSize: 14,
                  color: '#848587',
                }}
              >
                {intl
                  .get(`${this.promptCode}.view.message.invitePart1`)
                  .d('目标企业还未注册？试试')}
                <a
                  style={{
                    color: '#6c8be0',
                  }}
                  onClick={this.handleInviteRegisterBtnClick}
                >
                  &nbsp;{intl.get(`${this.promptCode}.view.option.inviteRegister`).d('邀请注册')}
                  &nbsp;
                </a>
                {intl.get(`${this.promptCode}.view.message.invitePart2`).d('吧')}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /**
   * 渲染查询到的公司列表
   *
   * @param {Object} list - 后台返回的查询数据
   * @param {Object[]} list.content - 公司信息
   * @returns
   * @memberof CompanySearch
   */
  @Bind()
  renderList(list) {
    const { isRiskScan } = this.props;
    const {
      loading: { loadingQueryList },
    } = this.props;
    const tableItemStyle = {
      padding: 0,
      width: 246,
      height: 291,
      margin: 30,
      marginLeft: 0,
      marginBottom: 0,
    };
    const tableItemBodyStyle = {
      padding: 0,
    };
    return (
      <Spin spinning={loadingQueryList}>
        <Card bordered={false} bodyStyle={{ padding: 0, marginRight: -30 }}>
          {map(list.content, company => {
            return (
              <Card.Grid
                style={tableItemStyle}
                key={company.companyId}
                className={styles['table-item']}
              >
                <Card
                  title={this.companyHead(company)}
                  bordered={false}
                  bodyStyle={tableItemBodyStyle}
                >
                  <div className={styles['list-item']}>
                    <Tuple
                      first={intl.get(`${this.promptCode}.model.company.industry`).d('行业')}
                      second={join(company.industries, ',')}
                      className={styles['table-item-content']}
                    />
                    <Tuple
                      first={intl
                        .get(`${this.promptCode}.model.company.childIndustry`)
                        .d('产品服务分类')}
                      second={join(company.childrenIndustries, ',')}
                      className={styles['table-item-content']}
                    />
                    <Tuple
                      first={intl
                        .get(`${this.promptCode}.model.company.registeredCapital`)
                        .d('注册资本')}
                      second={`${
                        company.registeredCapital === undefined
                          ? intl.get('hzero.common.currency.none').d('无')
                          : `${company.registeredCapital}${intl
                              .get(`hzerp.common.currency.ten.thousand`)
                              .d('万元')}`
                      }`}
                      className={styles['table-item-content']}
                    />
                    <Tuple
                      first={intl
                        .get(`${this.promptCode}.model.company.serviceArea`)
                        .d('送货或服务范围')}
                      second={join(company.serviceAreas, ',')}
                      className={styles['table-item-content']}
                    />
                  </div>
                  <div className={styles['table-item-footer']}>
                    {isRiskScan ? (
                      <div>
                        <Button
                          type="primary"
                          style={{ width: '80px', marginRight: 8 }}
                          onClick={() => {
                            this.handleInviteBtnClick(company);
                          }}
                        >
                          {intl.get('spfm.companySearch.view.option.invite').d('邀请合作')}
                        </Button>
                        <Button
                          onClick={() => this.handleSickSacn(company)}
                          style={{ width: '80px' }}
                        >
                          {intl.get(`${this.promptCode}.view.message.riskScan`).d('风险扫描')}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="primary"
                        style={{ width: '144px' }}
                        onClick={() => {
                          this.handleInviteBtnClick(company);
                        }}
                      >
                        {intl.get('spfm.companySearch.view.option.invite').d('邀请合作')}
                      </Button>
                    )}
                  </div>
                </Card>
              </Card.Grid>
            );
          })}
        </Card>
        <div className={styles['content-footer']}>
          <Pagination
            {...createPagination(list)}
            onChange={this.handlePaginationChange}
            onShowSizeChange={this.handlePaginationChange}
          />
        </div>
      </Spin>
    );
  }

  /**
   * 点击已认证跳转页面
   */
  @Bind()
  handleJumpPage(companyName) {
    const { isSupplier } = this.props;
    const router = isSupplier ? '/seci/supplier-credit-info' : '/seci/purchaser-credit-info';
    openTab({
      title: intl.get('hzero.common.title.creditInfo').d('企业扩展信息'),
      key: router,
      path: `${router}`,
      icon: 'info',
      search: `companyName=${companyName}`,
      closable: true,
    });
  }

  /**
   * 再渲染公司列表的 公司的头界面
   * @param {Object} company - 公司信息
   * @param {String} company.companyName - 公司名称
   * @memberof CompanySearch
   */
  @Bind()
  companyHead(company = {}) {
    // const companyIconColorStyle = { fill: '#8991f1' };
    // const companyIconBorderColorStyle = { fill: '#a5c7ff' };
    // const companyIconBgColorStyle = { fill: '#fff' };
    const { companyName = '', logoUrl, srmCompanyId, certificationStatus } = company;
    const companyAvatar = logoUrl ? (
      <Avatar size={44} className={styles['company-icon']} src={logoUrl} />
    ) : (
      <Avatar size={44} className={styles['company-icon']}>
        {companyName.substr(0, 1)}
      </Avatar>
    );
    return (
      <div className={styles['company-head']}>
        {companyAvatar}
        <div className={styles['company-title']}>
          <a
            title={companyName}
            onClick={() => {
              this.showCompanyInfo(srmCompanyId);
            }}
          >
            {companyName}
          </a>
          {certificationStatus === 'PASS' && (
            <span
              title={intl.get(`${this.promptCode}.view.message.title.moreInfo`).d('更多信息')}
              onClick={() => this.handleJumpPage(companyName)}
            />
          )}
        </div>
      </div>
    );
  }

  @Bind()
  handleSickSacn(company) {
    const { handleEmbedPage } = this.props;
    const onOk = () => {
      handleEmbedPage(company);
    };
    Modal.confirm({
      title: intl
        .get(`spfm.supplier.model.supplier.platform.confirmMessage`)
        .d('该企业未加入监控，扫描将扣除扫描额度，确认扫描吗？'),
      onOk,
    });
  }

  /**
   * @returns React.Element
   * @memberof CompanySearch
   */
  render() {
    const {
      isSupplier,
      invite,
      inviteRegister,
      list = {},
      organizationId,
      loading = {},
      code = {},
      queryInvestigateTemplates,
      investigateTemplates = [],
      companyInformation,
    } = this.props;
    const { invitationProps = {}, companyInfoVisible } = this.state;
    const headerTitle = isSupplier
      ? intl.get(`${this.promptCode}.view.option.title.supplier`).d('发现供应商')
      : intl.get(`${this.promptCode}.view.option.title.purchaser`).d('发现采购商');
    return (
      <React.Fragment>
        <Header title={headerTitle} />
        <Content style={{ padding: 30 }}>
          <div className="table-list-search">{this.renderForm()}</div>
          {isEmpty(list) ? (
            <Spin />
          ) : isEmpty(list.content) ? (
            this.renderInviteRegisterBtn()
          ) : (
            this.renderList(list)
          )}
        </Content>
        <Modal
          width={700}
          destroyOnClose
          visible={invitationProps.visible}
          onCancel={this.hideModal}
          footer={null}
        >
          <Invitation
            {...invitationProps}
            hideModal={this.hideModal}
            invite={invite}
            organizationId={organizationId}
            investigateType={code.investigateType || []}
            saving={loading.loadingInvite}
          />
        </Modal>
        {isSupplier && (
          <InvitationRegisterModal
            organizationId={organizationId}
            inviteRegister={inviteRegister}
            onRef={this.relInvitationRegisterModal}
            confirmLoading={loading.loadingInviteRegister}
            queryInvestigateTemplates={queryInvestigateTemplates}
            investigateTemplates={investigateTemplates.content || []}
            investigateType={code.investigateType || []}
          />
        )}
        <Drawer
          width={1000}
          destroyOnClose
          visible={companyInfoVisible}
          onClose={this.hideCompanyInfoModal}
        >
          <CompanyInformation
            companyLoading={loading.companyLoading}
            companyInformation={companyInformation}
          />
        </Drawer>
      </React.Fragment>
    );
  }
}
