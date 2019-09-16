import React, { PureComponent } from 'react';
import { Button, Table, Form, Checkbox } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { isEmpty, isFunction, isNumber, isArray, sum } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import UploadModal from 'components/Upload';
import notification from 'utils/notification';
import DetailForm from './Form';
import OperationRecord from './OperationRecord';
import styles from './index.less';

@connect(({ loading, certificationApproval }) => ({
  queryDetailLoading: loading.effects['certificationApproval/queryDetail'],
  approveLoading: loading.effects['certificationApproval/approve'],
  rejectLoading: loading.effects['certificationApproval/reject'],
  certificationLoaing: loading.effects['certificationApproval/certificationBusiness'],
  effectLoading:
    loading.effects['certificationApproval/queryDetail'] ||
    loading.effects['certificationApproval/queryRecord'],
  certificationApproval,
}))
@formatterCollections({ code: 'spfm.certificationApproval' })
@Form.create({ fieldNameProp: null })
export default class Detail extends PureComponent {
  constructor(props) {
    super(props);
    // 方法注册
    ['onCell'].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  state = {
    isReject: false,
    visible: false,
  };

  componentDidMount() {
    const {
      match = {},
      location: { state = {} },
    } = this.props;
    const { params = {} } = match;
    const { processUser } = state;
    if (!isNumber(processUser)) {
      this.handleRedirectList();
    } else {
      this.fetchDetail({ companyId: params.id, processUser });
    }
  }

  @Bind()
  handleRedirectList() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: `/spfm/certification-approval/list` }));
  }

  @Bind()
  approve() {
    const {
      dispatch,
      form: { getFieldsValue },
      certificationApproval: { detail = {} },
      match: { params = {} },
      location: { state = {} },
    } = this.props;
    const { id } = params;
    const { action = {}, basic = {} } = detail;
    const { processUser } = state;
    dispatch({
      type: 'certificationApproval/approve',
      payload: [
        {
          ...getFieldsValue(['processMsg']),
          companyActionId: action.companyActionId,
          companyBasicId: basic.companyBasicId,
          companyId: id,
        },
      ],
    }).then(res => {
      if (isEmpty(res)) {
        notification.success();
        this.handleRedirectList();
      } else {
        notification.error({
          description: isArray(res)
            ? (res[0] || {}).processMsg
            : res && res.failed
            ? res.message
            : null,
        });
        this.fetchDetail({ companyId: params.id, processUser });
      }
    });
  }

  @Bind()
  reject() {
    const {
      form: { validateFields },
      dispatch,
      match: { params = {} },
      certificationApproval: { detail = {} },
      // location: { state = {} },
    } = this.props;
    const { id } = params;
    const { action = {} } = detail;
    // const { processUser } = state;
    this.setIsReject(true, () => {
      validateFields((err, values) => {
        if (isEmpty(err)) {
          dispatch({
            type: 'certificationApproval/reject',
            payload: { ...values, companyActionId: action.companyActionId, companyId: id },
          }).then(res => {
            if (isEmpty(res)) {
              notification.success();
              // this.fetchDetail({ companyId: params.id, processUser });
              this.handleRedirectList();
            } else {
              notification.error({
                description: res.message,
              });
            }
          });
        }
      });
    });
  }

  @Bind()
  fetchDetail(payload) {
    const { dispatch } = this.props;
    dispatch({ type: 'certificationApproval/queryDetail', payload });
  }

  @Bind()
  fetchRecord() {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    const { id } = params;
    dispatch({ type: 'certificationApproval/queryRecord', payload: id });
  }

  @Bind()
  handleOpenVisible() {
    this.fetchRecord();
    this.setRecordDrawerVisible(true);
  }

  @Bind()
  setRecordDrawerVisible(visible) {
    this.setState({
      visible,
    });
  }

  setIsReject(isReject, cb) {
    this.setState(
      {
        isReject,
      },
      () => {
        if (isFunction(cb)) {
          cb();
        }
      }
    );
  }

  /**
   * 三证验证
   */
  @Bind()
  handleCertification() {
    const {
      dispatch,
      history,
      match = {},
      location: { state = {} },
      certificationApproval: { detail = {} },
    } = this.props;
    const { params = {} } = match;
    const { processUser } = state;
    const {
      action = {},
      basic: { companyBasicId },
    } = detail;
    dispatch({
      type: 'certificationApproval/certificationBusiness',
      payload: {
        ...action,
        companyBasicId,
        companyId: params.id,
        processUser,
      },
    }).then((res = {}) => {
      const { processStatus } = res;
      // 暂处理
      if (processStatus === 'COMPLETE') {
        notification.success();
        this.fetchDetail({ companyId: params.id, processUser });
      } else {
        notification.warning({
          message: intl.get('spfm.certification.approval.message.CertificationFail').d('认证失败'),
        });
        history.push('/spfm/certification-approval/list');
      }
    });
  }

  /**
   * onCell
   * @param {number} maxWidth - 单元格最大宽度
   */
  onCell(maxWidth) {
    return {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: maxWidth || 180,
        whiteSpace: 'nowrap',
      },
      onClick: e => {
        const { target } = e;
        if (target.style.whiteSpace === 'normal') {
          target.style.whiteSpace = 'nowrap';
        } else {
          target.style.whiteSpace = 'normal';
        }
      },
    };
  }

  render() {
    const {
      certificationApproval = {},
      form,
      queryDetailLoading,
      effectLoading,
      approveLoading,
      rejectLoading,
      certificationLoaing,
    } = this.props;
    const { isReject, visible } = this.state;
    const { detail = {}, record = [] } = certificationApproval;
    const {
      attachmentList = [],
      financeList = [],
      bankAccountList = [],
      addressList = [],
      contactList = [],
      business = {},
      basic = {},
      action = {},
    } = detail;
    // UNCERTIFIED未认证， PASS认证通过，FAIL认证失败
    const { certificationStatus } = action;
    const formProps = {
      certificationStatus,
      form,
      isReject,
      suppressionWarning: this.setIsReject.bind(this, false),
      loading: queryDetailLoading,
      dataSource: {
        ...business,
        ...basic,
      },
    };
    const contactTableProps = {
      columns: [
        {
          title: intl.get('spfm.certificationApproval.model.contactTable.name').d('姓名'),
          align: 'center',
          dataIndex: 'name',
          width: 120,
        },
        {
          title: intl.get('spfm.certificationApproval.model.contactTable.gender').d('性别'),
          align: 'center',
          dataIndex: 'gender',
          width: 60,
          render: text => (text === 1 ? '男' : '女'),
        },
        {
          title: intl.get('spfm.certificationApproval.model.contactTable.mail').d('邮箱'),
          dataIndex: 'mail',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.contactTable.mobilephone')
            .d('手机号码'),
          align: 'center',
          width: 120,
          dataIndex: 'mobilephone',
        },
        {
          title: intl.get('spfm.certificationApproval.model.contactTable.telephone').d('固定电话'),
          align: 'center',
          dataIndex: 'telephone',
          width: 120,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.contactTable.idTypeMeaning')
            .d('证件类型'),
          align: 'center',
          width: 120,
          dataIndex: 'idTypeMeaning',
        },
        {
          title: intl.get('spfm.certificationApproval.model.contactTable.idNum').d('证件号码'),
          align: 'center',
          width: 150,
          dataIndex: 'idNum',
        },
        {
          title: intl.get('spfm.certificationApproval.model.contactTable.department').d('部门'),
          dataIndex: 'department',
          width: 150,
          onCell: this.onCell,
        },
        {
          title: intl.get('spfm.certificationApproval.model.contactTable.position').d('职位'),
          dataIndex: 'position',
          width: 150,
          onCell: this.onCell,
        },
        {
          title: intl.get('hzero.common.remark').d('备注'),
          dataIndex: 'description',
          width: 180,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.contactTable.defaultFlag')
            .d('默认联系人'),
          align: 'center',
          dataIndex: 'defaultFlag',
          width: 140,
          render: text => <Checkbox disabled checked={text === 1} />,
        },
        {
          title: intl.get('hzero.common.status.enable').d('启用'),
          align: 'center',
          dataIndex: 'enabledFlag',
          width: 90,
          render: text => <Checkbox disabled checked={text === 1} />,
        },
      ],
      pagination: false,
      dataSource: contactList,
      bordered: true,
      rowKey: 'companyContactId',
    };
    contactTableProps.scroll = { x: sum(contactTableProps.columns.map(n => n.width)) };
    const addressTableProps = {
      columns: [
        {
          title: intl.get('spfm.certificationApproval.model.addressTable.countryName').d('国家'),
          align: 'center',
          dataIndex: 'countryName',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.addressTable.regionPathName')
            .d('省/市'),
          align: 'center',
          dataIndex: 'regionPathName',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.addressTable.addressDetail')
            .d('详细地址'),
          dataIndex: 'addressDetail',
          width: 180,
          onCell: this.onCell,
        },
        {
          title: intl.get('spfm.certificationApproval.model.addressTable.postCode').d('邮政编码'),
          align: 'center',
          dataIndex: 'postCode',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.addressTable.description')
            .d('地址备注'),
          dataIndex: 'description',
          width: 180,
          onCell: this.onCell,
        },
        {
          title: intl.get('hzero.common.status.enable').d('启用'),
          align: 'center',
          dataIndex: 'enabledFlag',
          render: text => <Checkbox disabled checked={text === 1} />,
          width: 90,
        },
      ],
      pagination: false,
      dataSource: addressList,
      bordered: true,
      rowKey: 'companyAddressId',
    };
    addressTableProps.scroll = { x: sum(addressTableProps.columns.map(n => n.width)) };
    const bankTableProps = {
      columns: [
        {
          title: intl.get('spfm.certificationApproval.model.bankTable.bankTypeCode').d('银行代码'),
          align: 'center',
          dataIndex: 'bankTypeCode',
          width: 150,
          onCell: this.onCell,
        },
        {
          title: intl.get('spfm.certificationApproval.model.bankTable.bankName').d('银行名称'),
          align: 'center',
          dataIndex: 'bankName',
          width: 180,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.bankTable.bankBranchName')
            .d('开户行名称'),
          align: 'center',
          dataIndex: 'bankBranchName',
          width: 180,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.bankTable.bankAccountName')
            .d('账户名称'),
          align: 'center',
          dataIndex: 'bankAccountName',
          width: 220,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.bankTable.bankAccountNum')
            .d('银行账号'),
          align: 'center',
          dataIndex: 'bankAccountNum',
          width: 240,
          onCell: this.onCell,
        },
        {
          title: intl.get('hzero.common.status.enable').d('启用'),
          align: 'center',
          dataIndex: 'enabledFlag',
          width: 90,
          render: text => <Checkbox disabled checked={text === 1} />,
        },
      ],
      pagination: false,
      dataSource: bankAccountList,
      bordered: true,
      rowKey: 'companyBankAccountId',
    };
    const financeTableProps = {
      columns: [
        {
          title: intl.get('spfm.certificationApproval.model.financeTable.year').d('年份'),
          dataIndex: 'year',
          width: 120,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.totalAssets')
            .d('企业总资产（万元）'),
          align: 'right',
          dataIndex: 'totalAssets',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.totalLiabilities')
            .d('总负债（万元）'),
          align: 'right',
          dataIndex: 'totalLiabilities',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.currentAssets')
            .d('流动资产（万元）'),
          align: 'right',
          dataIndex: 'currentAssets',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.currentLiabilities')
            .d('流动负债（万元）'),
          align: 'right',
          dataIndex: 'currentLiabilities',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.revenue')
            .d('营业收入（万元）'),
          align: 'right',
          dataIndex: 'revenue',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.netProfit')
            .d('净利润（万元）'),
          align: 'right',
          dataIndex: 'netProfit',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.assetLiabilityRatio')
            .d('资产负债率'),
          align: 'right',
          dataIndex: 'assetLiabilityRatio',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.currentRatio')
            .d('流动比率'),
          align: 'right',
          dataIndex: 'currentRatio',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.financeTable.totalAssetsEarningsRatio')
            .d('总资产收益率'),
          align: 'right',
          dataIndex: 'totalAssetsEarningsRatio',
          width: 140,
          onCell: this.onCell,
        },
      ],
      pagination: false,
      dataSource: financeList,
      bordered: true,
      rowKey: 'companyFinanceId',
    };
    financeTableProps.scroll = { x: sum(financeTableProps.columns.map(n => n.width)) };
    const attachmentTableProps = {
      columns: [
        {
          title: intl
            .get('spfm.certificationApproval.model.attachmentTable.attachmentTypeMeaning')
            .d('附件类型'),
          align: 'center',
          width: 120,
          dataIndex: 'attachmentTypeMeaning',
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.attachmentTable.subAttachmentMeaning')
            .d('附件描述'),
          dataIndex: 'subAttachmentMeaning',
          width: 180,
          onCell: this.onCell,
        },
        {
          title: intl.get('spfm.certificationApproval.model.attachmentTable.description').d('说明'),
          dataIndex: 'description',
          width: 180,
          onCell: this.onCell,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.attachmentTable.endDate')
            .d('文件到期日'),
          align: 'center',
          dataIndex: 'endDate',
          width: 120,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.attachmentTable.uploadDate')
            .d('最后上传时间'),
          align: 'center',
          dataIndex: 'uploadDate',
          width: 140,
        },
        {
          title: intl
            .get('spfm.certificationApproval.model.attachmentTable.attachmentUrl')
            .d('附件上传'),
          align: 'center',
          dataIndex: 'attachmentUrl',
          width: 140,
          render: (text, rowData) => (
            <UploadModal
              attachmentUUID={rowData.attachmentUuid}
              viewOnly
              filesNumber={rowData.attachmentCount}
            />
          ),
        },
      ],
      pagination: false,
      dataSource: attachmentList,
      bordered: true,
      rowKey: 'companyAttachmentId',
    };
    const operationRecordProps = {
      visible,
      onCancel: this.setRecordDrawerVisible.bind(this, false),
      dataSource: record,
    };
    return (
      <div className={styles['spfm-certification-approval-detail']}>
        <Header
          title={intl
            .get('spfm.certificationApproval.view.title.certificationApprovalDetail')
            .d('企业认证审批明细')}
          backPath="/spfm/certification-approval/list"
        >
          {certificationStatus === 'UNCERTIFIED' && (
            <Button
              type="primary"
              icon="safety"
              loading={effectLoading || certificationLoaing}
              onClick={this.handleCertification}
            >
              {intl.get('spfm.certificationApproval.view.button.verify').d('三证验证')}
            </Button>
          )}
          <Button
            type="primary"
            icon="check"
            loading={approveLoading}
            disabled={effectLoading || rejectLoading}
            onClick={this.approve}
          >
            {intl.get('spfm.certificationApproval.view.button.approval').d('审批通过')}
          </Button>
          <Button
            icon="exclamation-circle-o"
            onClick={this.reject}
            loading={rejectLoading}
            disabled={effectLoading || approveLoading}
          >
            {intl.get('spfm.certificationApproval.view.button.reject').d('审批拒绝')}
          </Button>
          <Button icon="info-circle-o" onClick={this.handleOpenVisible} disabled={effectLoading}>
            {intl.get('spfm.certificationApproval.view.button.actionHistory').d('操作记录')}
          </Button>
        </Header>
        <Content>
          <DetailForm {...formProps} />
          <br />
          <h3>
            {intl.get('spfm.certificationApproval.view.title.tab.contactTable').d('联系人信息')}
          </h3>
          <Table {...contactTableProps} />
          <br />
          <h3>
            {intl.get('spfm.certificationApproval.view.title.tab.addressTable').d('地址信息')}
          </h3>
          <Table {...addressTableProps} />
          <br />
          <h3>{intl.get('spfm.certificationApproval.view.title.tab.bankTable').d('银行信息')}</h3>
          <Table {...bankTableProps} />
          <br />
          <h3>
            {intl.get('spfm.certificationApproval.view.title.tab.financeTable').d('财务信息')}
          </h3>
          <Table {...financeTableProps} />
          <br />
          <h3>
            {intl.get('spfm.certificationApproval.view.title.tab.attachmentTable').d('附件信息')}
          </h3>
          <Table {...attachmentTableProps} />
        </Content>
        <OperationRecord {...operationRecordProps} />
      </div>
    );
  }
}
