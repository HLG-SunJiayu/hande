/**
 * disposeInvite 处理邀约
 * @date: 2018-8-23
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.3
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Spin, Button } from 'hzero-ui';
import { isEmpty, isNumber, isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import querystring from 'querystring';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { closeTab, openTab } from 'utils/menuTab';
import { Header, Content } from 'components/Page';
import Lov from 'components/Lov';
import ValueList from 'components/ValueList';
import Checkbox from 'components/Checkbox';

import ReceivedTop from './components/ReceivedTop';
import SendTop from './components/SendTop';
import CompanyInformation from './components/CompanyInformation';
import CompanyForm from './components/CompanyForm';
import HeaderInfo from './components/HeaderInfo';
import Investigation from '../Investigation/Component/Investigation';
import Approval from './components/Approval';
import InvestigatePreview from './components/InvestigatePreview';
// import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;
const promptCode = 'spfm.disposeInvite';
/**
 * 供应商同意邀约
 * @extends {Component} - PureComponent
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} purchaserCooperation - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @reactProps {String} organizationId - 租户Id
 * @reactProps {String} textValue - 拒绝邀约的说明
 * @return React.element
 */
@connect(({ disposeInvite, loading, userMessage }) => ({
  disposeInvite,
  userMessage,
  loading: loading.effects['disposeInvite/getInvitingInformation'],
  modalLoading:
    loading.effects['disposeInvite/sendInvestigate'] ||
    loading.effects['disposeInvite/rejectCoop'] ||
    loading.effects['disposeInvite/approveCoop'],
  refuseLoading: loading.effects['disposeInvite/rejectCoop'],
  approvalLoading: loading.effects['disposeInvite/approveCoop'],
  agree: loading.effects['disposeInvite/handleAgree'],
  reject: loading.effects['disposeInvite/handleReject'],
  organizationId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: ['spfm.disposeInvite', 'entity.customer', 'entity.supplier'] })
export default class DisposeInvite extends React.Component {
  constructor(props) {
    super(props);
    const { search = {} } = props.history.location;
    const routerParams = querystring.parse(search.substr(1));
    const {
      match: {
        params: { inviteId },
      },
    } = props;
    this.state = {
      inviteId: +inviteId,
      visible: false,
      modalVisible: false,
      saveLoading: false, // 保存按钮loading
      submitLoading: false, // 提交按钮loading
      modalType: 'refuse', // 模态框的类型
      status: routerParams.status, // 邀约的状态
      back: routerParams.back, // 判断返回的参数
    };
  }

  componentDidMount() {
    this.handSendInviteId();
    this.getInvitingInformation();
  }

  /**
   * 把inviteId传到model里
   */
  @Bind()
  handSendInviteId() {
    const { inviteId } = this.state;
    const { dispatch } = this.props;
    dispatch({ type: 'disposeInvite/updateState', payload: { inviteId } });
  }

  /**
   * 查询调查表审批头信息
   */
  @Bind()
  queryHeadInfo() {
    const { inviteId } = this.state;
    const {
      disposeInvite: {
        [inviteId]: { headerInfo = {} },
      },
      dispatch,
    } = this.props;
    if (headerInfo.investgHeaderId) {
      dispatch({
        type: 'disposeInvite/fetchInvestigationHeader',
        payload: {
          investigateHeaderId: headerInfo.investgHeaderId,
        },
      });
    }
  }

  /**
   * 获取邀请信息
   */
  @Bind()
  getInvitingInformation() {
    const { dispatch, match, organizationId } = this.props;
    const {
      params: { inviteId },
    } = match;
    dispatch({
      type: 'disposeInvite/getInvitingInformation',
      payload: { inviteId, organizationId },
    }).then(invitingInfo => {
      if (!isEmpty(invitingInfo)) {
        const { investigateTemplateId } = invitingInfo;
        if (investigateTemplateId) {
          this.fetchHeaderInfo({
            triggerById: inviteId,
            triggerByCode: 'INVITE',
            organizationId,
          });
        }
      }
    });
  }

  // /**
  //  * 查询值集
  //  */
  // @Bind()
  // queryValue() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'disposeInvite/init',
  //     payload: {
  //       investigateType: 'SSLM.INVESTIGATE_TYPE',
  //     },
  //   });
  // }
  /**
   * 查询调查表头信息
   * @param {Number} params.triggerById - 邀约Id
   * @param {String} params.triggerByCode - 邀约编码
   * @param {Number} params.organizationId - 租户Id
   */
  fetchHeaderInfo(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'disposeInvite/fetchHeaderInfo',
      payload: params,
    }).then(() => {
      this.queryHeadInfo(); // 调查表审批头信息
    });
  }

  /**
   * 查询调查表模板信息
   * @param {Number} investigateTemplateId - 调查表模板Id
   */
  fetchTemplate(investigateTemplateId) {
    const { dispatch } = this.props;
    if (isNumber(investigateTemplateId)) {
      dispatch({
        type: 'disposeInvite/fetchTemplate',
        payload: { investigateTemplateId },
      });
    }
  }

  /**
   * 获取textarea value
   */
  @Bind()
  getTextValue(e) {
    this.setState({ textValue: e.target.value });
  }

  /**
   * 同意邀约
   */
  @Bind()
  handleAgree() {
    const { inviteId } = this.state;
    const {
      dispatch,
      organizationId,
      disposeInvite: {
        [inviteId]: { invitingInfo = {} },
      },
    } = this.props;
    dispatch({
      type: 'disposeInvite/approveCoop',
      payload: {
        organizationId,
        inviteId,
        objectVersionNumber: invitingInfo.objectVersionNumber,
      },
    }).then(res => {
      if (res) {
        this.handleCancel();
        notification.success({
          message: intl.get(`${promptCode}.message.agreeToInvite`).d('您已同意该合作邀约'),
        });
        // this.getInvitingInformation();
        this.handleCloseTab();
      }
    });
  }

  /**
   * 拒绝邀约
   */
  @Bind()
  handleRefuse() {
    const { inviteId } = this.state;
    const {
      dispatch,
      organizationId,
      disposeInvite: {
        [inviteId]: { invitingInfo = {} },
      },
    } = this.props;
    const { textValue } = this.state;
    confirm({
      title: intl.get('hzero.common.message.confirm.reject').d('是否确认拒绝'),
      // content: '',
      onOk: () => {
        dispatch({
          type: 'disposeInvite/rejectCoop',
          payload: {
            textValue,
            organizationId,
            inviteId,
            objectVersionNumber: invitingInfo.objectVersionNumber,
          },
        }).then(res => {
          this.handleCancel();
          if (res) {
            notification.success({
              message: intl.get(`${promptCode}.message.refuseToInvite`).d('您已拒绝该合作邀约'),
            });
            this.handleCloseTab();
          }
        });
      },
    });
  }

  /**
   * 发送调查表
   */
  @Bind()
  handleQuestionnaire() {
    const { inviteId } = this.state;
    const {
      dispatch,
      organizationId,
      form,
      disposeInvite: {
        [inviteId]: {
          invitingInfo: { objectVersionNumber },
        },
      },
    } = this.props;
    form.validateFields((err, fieldsValues) => {
      if (!err) {
        dispatch({
          type: 'disposeInvite/sendInvestigate',
          payload: { organizationId, ...fieldsValues, inviteId, objectVersionNumber },
        }).then(res => {
          if (res) {
            this.handleCancel();
            notification.success();
            this.getInvitingInformation();
          }
        });
      }
    });
  }

  /**
   * 打开拒绝模态框
   */
  @Bind()
  showRefuseModal() {
    this.setState({
      visible: true,
      modalType: 'refuse',
    });
  }

  /**
   * 打开同意合作模态框
   */
  @Bind()
  showSuppleModal() {
    this.setState({
      visible: true,
      modalType: 'supplement',
    });
  }

  /**
   * 关闭模态框
   */
  @Bind()
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  /**
   * 打开侧边模态框
   */
  @Bind()
  showDrawer() {
    this.setState({
      modalVisible: true,
    });
  }

  /**
   * 关闭侧边模态框
   */
  @Bind()
  hideDrawer() {
    this.setState({
      modalVisible: false,
    });
  }

  /**
   * 改变调查类型
   */
  @Bind()
  handleSelectChange() {
    const { form } = this.props;
    form.resetFields('investigateTemplateId');
  }

  renderForm() {
    const { form, organizationId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const isSend = getFieldValue('flag') === 1; // true 发送
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form>
        <FormItem
          label={intl.get(`${promptCode}.view.message.sendQuestionnaire`).d('发送调查表')}
          {...formLayout}
        >
          {getFieldDecorator('flag', {
            initialValue: 0,
          })(<Checkbox />)}
        </FormItem>
        {isSend && (
          <React.Fragment>
            <FormItem
              label={intl
                .get(`${promptCode}.model.purchaserCooperation.investigateType`)
                .d('调查类型')}
              {...formLayout}
            >
              {getFieldDecorator('investigateType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl
                        .get(`${promptCode}.model.purchaserCooperation.investigateType`)
                        .d('调查类型'),
                    }),
                  },
                ],
              })(
                <ValueList
                  allowClear
                  lovCode="SSLM.INVESTIGATE_TYPE"
                  onChange={this.handleSelectChange}
                />
              )}
            </FormItem>
            <FormItem
              label={intl
                .get(`${promptCode}.model.purchaserCooperation.investigateTemplateId`)
                .d('调查表模板')}
              {...formLayout}
            >
              {getFieldDecorator('investigateTemplateId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl
                        .get(`${promptCode}.model.purchaserCooperation.investigateTemplateId`)
                        .d('调查表模板'),
                    }),
                  },
                ],
              })(
                <Lov
                  disabled={isEmpty(getFieldValue('investigateType'))}
                  code="SSLM.INVESTIGATE_TEMPLATE_ID"
                  queryParams={{
                    organizationId,
                    enabledFlag: 1,
                    investigateType: getFieldValue('investigateType'),
                  }}
                />
              )}
            </FormItem>
          </React.Fragment>
        )}
      </Form>
    );
  }

  // 审批通过
  @Bind()
  handleApprovalAgree() {
    const { inviteId } = this.state;
    const {
      disposeInvite: {
        [inviteId]: { headerInfo = {} },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'disposeInvite/handleAgree',
      payload: {
        investigateHeaderId: headerInfo.investgHeaderId,
      },
    }).then(result => {
      if (result) {
        notification.success();
        // this.getInvitingInformation();
        this.handleCloseTab();
      }
    });
  }

  /**
   * 审批拒绝
   * @param {String} rejectRemark - 拒绝说明
   */
  @Bind()
  handleApprovalReject(rejectRemark) {
    const { inviteId } = this.state;
    const {
      disposeInvite: {
        [inviteId]: { headerInfo = {} },
      },
      dispatch,
    } = this.props;
    confirm({
      title: intl.get('hzero.common.message.confirm.reject').d('是否确认拒绝'),
      // content: '',
      onOk: () => {
        dispatch({
          type: 'disposeInvite/handleReject',
          payload: {
            investgHeaderId: headerInfo.investgHeaderId,
            rejectRemark,
          },
        }).then(result => {
          if (result) {
            notification.success();
            // this.getInvitingInformation();
            this.handleCloseTab();
          }
        });
      },
    });
  }

  /**
   * 获取Investigation的保存方法
   */
  @Bind()
  getSaveValidateData(getSaveValidate) {
    this.saveData = getSaveValidate;
  }

  /**
   * 获取Investigation的提交方法
   */
  @Bind()
  onSubmitHook(submit) {
    this.onSubmitInvestigation = submit;
  }

  /**
   * 保存按钮方法
   */
  @Bind()
  handleSave() {
    const { inviteId } = this.state;
    const {
      disposeInvite: {
        [inviteId]: { headerInfo = {} },
      },
    } = this.props;
    const { partnerRemark } = this.state;
    const newHeaderInfo = { ...headerInfo, partnerRemark };
    if (isFunction(this.saveData)) {
      if (partnerRemark !== undefined && partnerRemark !== headerInfo.partnerRemark) {
        this.saveData(newHeaderInfo);
      } else {
        this.saveData();
      }
    }
  }

  /**
   * 提交按钮
   */
  @Bind()
  handleSubmit() {
    confirm({
      title: intl.get('hzero.common.message.confirm.submit').d('是否确认提交'),
      // content: '',
      onOk: () => {
        const { inviteId } = this.state;
        const {
          disposeInvite: {
            [inviteId]: { headerInfo = {} },
          },
        } = this.props;
        const { partnerRemark } = this.state;
        const newHeaderInfo = { ...headerInfo, partnerRemark };
        if (isFunction(this.onSubmitInvestigation)) {
          if (partnerRemark !== undefined && partnerRemark !== headerInfo.partnerRemark) {
            this.onSubmitInvestigation(this.handleCloseTab, newHeaderInfo);
          } else {
            this.onSubmitInvestigation(this.handleCloseTab);
          }
        }
      },
    });
  }

  /**
   * 打开tab并关闭当前页
   */
  @Bind()
  handleCloseTab() {
    const { inviteId } = this.state;
    openTab({
      title: `${promptCode}.view.message.invitationList`,
      key: '/spfm/invitation-list',
      path: '/spfm/invitation-list',
      icon: 'form',
      closable: true,
    });
    closeTab(`/spfm/dispose-invite/${inviteId}`);
  }

  /**
   * 把调查说明存到state里
   * @param {String} partnerRemark - 调查说明
   */
  @Bind()
  getHeaderInfo(partnerRemark) {
    this.setState({ partnerRemark });
  }

  /**
   * 改变loading true false
   */
  @Bind()
  handleChangeSaveLoading(boolean) {
    this.setState({ saveLoading: boolean });
  }

  /**
   * 改变loading true false
   */
  @Bind()
  handleChangeSubmitLoading(boolean) {
    this.setState({ submitLoading: boolean });
  }

  render() {
    const {
      visible,
      modalVisible,
      modalType,
      status,
      saveLoading,
      submitLoading,
      inviteId,
      back,
    } = this.state;
    const {
      loading = false,
      modalLoading,
      agree,
      reject,
      form,
      refuseLoading,
      approvalLoading,
      organizationId,
      userMessage: { messageId },
      disposeInvite: { [inviteId]: { invitingInfo = {}, headerInfo = {}, detail = {} } = {} },
    } = this.props;
    const isSend = form.getFieldValue('flag') === 1; // true 发送

    const backPath =
      back === 'invitation'
        ? '/spfm/invitation-list'
        : isEmpty(messageId)
        ? true
        : `/hmsg/user-message/detail/${messageId}`;

    const footer = [
      form.getFieldValue('investigateTemplateId') && (
        <Button onClick={this.handleShowModal}>
          {intl.get(`${promptCode}.view.message.templatePreview`).d('预览模板')}
        </Button>
      ),
      <Button onClick={this.handleCancel}>
        {intl.get('hzero.common.status.cancel').d('取消')}
      </Button>,
      <Button type="primary" onClick={this.handleQuestionnaire}>
        {intl.get(`${promptCode}.view.option.sendOut`).d('发送')}
      </Button>,
    ];

    const previewTitle = intl.get(`${promptCode}.view.message.templateDetail`).d('模板明细');
    const previewProps = {
      previewTitle,
      organizationId,
      investigateTemplateId: form.getFieldValue('investigateTemplateId'),
      onRef: ref => {
        this.handleShowModal = ref;
      },
    };

    const submitButtonProps = {
      // type: 'primary',
      style: { marginLeft: 8 },
      loading: submitLoading,
      icon: 'check',
      onClick: this.handleSubmit,
    };
    const saveButtonProps = {
      type: 'primary',
      style: { marginLeft: 8 },
      loading: saveLoading,
      icon: 'save',
      onClick: this.handleSave,
    };

    const sendTopProps = {
      agree,
      reject,
      invitingInfo,
      isSupplier: !!(invitingInfo.inviteType === 'CUSTOMER'),
      onShowDrawer: this.showDrawer,
      onHandleApprovalAgree: this.handleApprovalAgree,
      onHandleApprovalReject: this.handleApprovalReject,
    };

    const receivedTopProps = {
      agree,
      reject,
      loading,
      headerInfo,
      invitingInfo,
      refuseLoading,
      approvalLoading,
      isSupplier: !!(invitingInfo.inviteType === 'CUSTOMER'),
      onAgree: this.handleAgree,
      onShowRefuseModal: this.showRefuseModal,
      onShowDrawer: this.showDrawer,
      onShowSuppleModal: this.showSuppleModal,
      onHandleApprovalReject: this.handleApprovalReject,
      onHandleApprovalAgree: this.handleApprovalAgree,
    };

    const headerInfoProps = {
      headerInfo,
      isEdit: invitingInfo.processStatus === 'INVESTIGATE',
      onGetHeaderInfo: this.getHeaderInfo,
    };

    const investigationSendProps = {
      key: invitingInfo.investigateTemplateId,
      isQueryData: !(invitingInfo.processStatus === 'REJECT'),
      isEdit: invitingInfo.processStatus === 'INVESTIGATE',
      organizationId: invitingInfo.inviteTenantId,
      investigateTemplateId: invitingInfo.investigateTemplateId,
      investgHeaderId: headerInfo.investgHeaderId,
      onRefresh: this.getInvitingInformation,
      onSaveData: this.handleSave,
      onSaveValidateDataHook: this.getSaveValidateData,
      onSubmitHook: this.onSubmitHook,
      onChangeSaveLoading: this.handleChangeSaveLoading,
      onChangeSubmitLoading: this.handleChangeSubmitLoading,
    };

    const investigationReceivedProps = {
      key: invitingInfo.investigateTemplateId,
      isQueryData: !(invitingInfo.processStatus === 'REJECT'),
      isEdit: invitingInfo.processStatus === 'INVESTIGATE',
      organizationId: invitingInfo.tenantId,
      investigateTemplateId: invitingInfo.investigateTemplateId,
      investgHeaderId: headerInfo.investgHeaderId,
      onRefresh: this.getInvitingInformation,
      onSaveValidateDataHook: this.getSaveValidateData,
      onSubmitHook: this.onSubmitHook,
      onChangeSaveLoading: this.handleChangeSaveLoading,
      onChangeSubmitLoading: this.handleChangeSubmitLoading,
    };

    const approvalProps = {
      detail,
      investigateTemplateId: invitingInfo.investigateTemplateId,
      investgHeaderId: headerInfo.investgHeaderId,
    };

    const modalProps = isSend
      ? {
          visible,
          footer,
          destroyOnClose: true,
          width: 520,
          title:
            modalType === 'refuse'
              ? intl.get(`${promptCode}.view.message.title.modal.refuse`).d('拒绝说明')
              : intl.get(`${promptCode}.view.message.title.modal.supplement`).d('补充调查'),
          confirmLoading: modalLoading,
          onOk: modalType === 'refuse' ? this.handleRefuse : this.handleAgree,
          onCancel: this.handleCancel,
          okText:
            modalType === 'refuse'
              ? intl.get(`${promptCode}.view.option.refuse`).d('拒绝')
              : intl.get(`${promptCode}.view.option.agree`).d('同意合作'),
          cancelText: intl.get('hzero.common.status.cancel').d('取消'),
        }
      : {
          visible,
          destroyOnClose: true,
          width: 520,
          title:
            modalType === 'refuse'
              ? intl.get(`${promptCode}.view.message.title.modal.refuse`).d('拒绝说明')
              : intl.get(`${promptCode}.view.message.title.modal.supplement`).d('补充调查'),
          confirmLoading: modalLoading,
          onOk: modalType === 'refuse' ? this.handleRefuse : this.handleAgree,
          onCancel: this.handleCancel,
          okText:
            modalType === 'refuse'
              ? intl.get(`${promptCode}.view.option.refuse`).d('拒绝')
              : intl.get(`${promptCode}.view.option.agree`).d('同意合作'),
          cancelText: intl.get('hzero.common.status.cancel').d('取消'),
        };

    return (
      <React.Fragment>
        <Header
          // backPath="/spfm/invitation-list"
          backPath={backPath}
          title={intl.get(`${promptCode}.view.message.title`).d('合作邀约')}
        >
          {status === 'send'
            ? invitingInfo.inviteType === 'CUSTOMER' &&
              invitingInfo.processStatus === 'INVESTIGATE' &&
              !isEmpty(headerInfo) && (
                <React.Fragment>
                  <Button {...saveButtonProps}>
                    {intl.get(`hzero.common.button.save`).d('保存')}
                  </Button>
                  <Button {...submitButtonProps}>
                    {intl.get(`${promptCode}.view.button.submit`).d('提交')}
                  </Button>
                  <Button
                    icon="close"
                    style={{ marginLeft: 8 }}
                    loading={refuseLoading}
                    onClick={this.showRefuseModal}
                  >
                    {intl.get(`${promptCode}.view.button.reject`).d('拒绝')}
                  </Button>
                </React.Fragment>
              )
            : invitingInfo.inviteType === 'SUPPLIER' &&
              invitingInfo.processStatus === 'INVESTIGATE' &&
              !isEmpty(headerInfo) && (
                <React.Fragment>
                  <Button {...saveButtonProps}>
                    {intl.get(`hzero.common.button.save`).d('保存')}
                  </Button>
                  <Button {...submitButtonProps}>
                    {intl.get(`${promptCode}.view.button.submit`).d('提交')}
                  </Button>
                  <Button
                    icon="close"
                    style={{ marginLeft: 8 }}
                    loading={refuseLoading}
                    onClick={this.showRefuseModal}
                  >
                    {intl.get(`${promptCode}.view.button.reject`).d('拒绝')}
                  </Button>
                </React.Fragment>
              )}
        </Header>
        <Content>
          <Spin spinning={loading && !isEmpty(invitingInfo)}>
            {status === 'send' ? (
              <div>
                <SendTop {...sendTopProps} />
                {invitingInfo.inviteType === 'CUSTOMER' ? (
                  // 填写调查表
                  // borderBottom: '1px solid #e8e8e8', paddingBottom: 15
                  !isEmpty(headerInfo) &&
                  invitingInfo.investigateTemplateId && (
                    <div>
                      <HeaderInfo {...headerInfoProps} />
                      <Investigation {...investigationSendProps} />
                    </div>
                  )
                ) : (
                  <div>
                    <CompanyInformation
                      key={
                        status === 'send' ? invitingInfo.inviteCompanyId : invitingInfo.companyId
                      }
                      inviteId={inviteId}
                      companyId={
                        status === 'send' ? invitingInfo.inviteSourceKey : invitingInfo.sourceKey
                      }
                    />
                    {(invitingInfo.processStatus === 'SUBMIT' ||
                      invitingInfo.processStatus === 'APPROVED' ||
                      invitingInfo.processStatus === 'REJECT') &&
                      invitingInfo.investigateTemplateId &&
                      headerInfo.investgHeaderId && <Approval {...approvalProps} />}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <ReceivedTop {...receivedTopProps} />
                {invitingInfo.inviteType === 'SUPPLIER' ? (
                  // 填写调查表
                  // borderBottom: '1px solid #e8e8e8', paddingBottom: 15
                  !isEmpty(headerInfo) &&
                  invitingInfo.investigateTemplateId && (
                    <div>
                      <HeaderInfo {...headerInfoProps} />
                      <Investigation {...investigationReceivedProps} />
                    </div>
                  )
                ) : (
                  <div>
                    <CompanyInformation
                      key={
                        status === 'send' ? invitingInfo.inviteCompanyId : invitingInfo.companyId
                      }
                      inviteId={inviteId}
                      companyId={
                        status === 'send' ? invitingInfo.inviteSourceKey : invitingInfo.sourceKey
                      }
                    />
                    {(invitingInfo.processStatus === 'SUBMIT' ||
                      invitingInfo.processStatus === 'APPROVED' ||
                      invitingInfo.processStatus === 'REJECT') &&
                      invitingInfo.investigateTemplateId &&
                      headerInfo.investgHeaderId && <Approval {...approvalProps} />}
                  </div>
                )}
              </div>
            )}
          </Spin>
        </Content>
        {/* 模态框 */}
        <Modal
          {...modalProps}
          // footer={[<Button key="back" onClick={this.handleCancel}>Return</Button>]}
        >
          {modalType === 'refuse' ? (
            <TextArea
              style={{ height: '100px', resize: 'none' }}
              placeholder={intl.get(`${promptCode}.view.message.placeholder`).d('请输入拒绝说明')}
              onChange={this.getTextValue}
            />
          ) : (
            <React.Fragment>
              <p style={{ color: '#999' }}>
                {intl
                  .get(`${promptCode}.view.message.tab.describe`)
                  .d(
                    '如果选择给对方发送调查表，则当对方提交的调查表通过您的审核后，才会建立合作伙伴关系。'
                  )}
              </p>
              {this.renderForm()}
            </React.Fragment>
          )}
        </Modal>
        {/* 侧边模态框 */}
        <CompanyForm
          sideBar
          width="1000px"
          footer={null}
          inviteId={inviteId}
          companyId={status === 'send' ? invitingInfo.inviteSourceKey : invitingInfo.sourceKey}
          handleAdd={this.handleAdd}
          modalVisible={modalVisible}
          hideModal={this.hideDrawer}
        />
        <InvestigatePreview {...previewProps} />
      </React.Fragment>
    );
  }
}
