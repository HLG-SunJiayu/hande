/**
 * InvitationRegisterModel 邀请供应商注册弹框
 * @date: 2018-8-1
 * @author dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.2
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Form, Input, Select, Radio, Modal } from 'hzero-ui';
import Lov from 'components/Lov';
import { isEmpty, isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { getUserOrganizationId } from 'utils/utils';
import styles from './InvitationRegisterModel.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'sslm.invitationRegister',
})
export default class InvitationRegisterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userOrganizationId: getUserOrganizationId(),
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    if (isFunction(onRef)) {
      onRef(this);
    }
  }

  @Bind()
  showModal() {
    this.setState({
      visible: true,
    });
  }

  /**
   * 关闭 模态框
   * @memberof InvitationRegisterModel
   */
  @Bind()
  closeInviteRegisterModal() {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  }

  // 获取自动发动合作邀约的状态
  @Bind()
  onChangePartner(e) {
    const { form } = this.props;
    if (e.target.value === 0) {
      form.setFieldsValue({ investigateType: '' });

      form.setFieldsValue({ investigateTemplateId: '' });
    }
    form.setFieldsValue({ autosendInvestigateFlag: e.target.value });
  }

  // 获取发送调查表的状态
  @Bind()
  onChange(e) {
    const { form } = this.props;
    if (e.target.value === 0) {
      form.setFieldsValue({ investigateType: '' });

      form.setFieldsValue({ investigateTemplateId: '' });
    }
  }

  // 发送供应商注册邀请
  @Bind()
  sendInviteRegister() {
    const { form, organizationId, inviteRegister } = this.props;
    if (isFunction(inviteRegister)) {
      form.validateFields((err, fieldsValue) => {
        if (isEmpty(err)) {
          // 判断调查表是选择，为否且下拉款有值时
          const params = {
            body: {
              tenantId: organizationId,
              ...fieldsValue,
            },
            organizationId,
          };
          inviteRegister(params).then(res => {
            if (!isEmpty(res)) {
              notification.success({
                message: intl.get('model.invitationRegister.invitationSuccess').d('邀请成功'),
              });
              this.setState({
                visible: false,
              });
            }
          });
        }
      });
    }
  }

  @Bind()
  handleSelectChange(value) {
    const { queryInvestigateTemplates, organizationId, form } = this.props;
    if (value === undefined) {
      form.setFieldsValue({ investigateTemplateId: '' });
    }
    queryInvestigateTemplates({
      organizationId,
      ...value,
    });
  }

  renderForm() {
    const {
      form: { getFieldDecorator, getFieldsValue },
      organizationId,
      confirmLoading = false,
      investigateType,
      //   investigateTemplates,
    } = this.props;
    const { visible, userOrganizationId } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title={intl.get('view.invitationRegister.invitationRegister').d('邀请供应商注册')}
        visible={visible}
        style={{ top: 20 }}
        onOk={this.sendInviteRegister}
        onCancel={this.closeInviteRegisterModal}
        bodyStyle={{ height: 550 }}
        okText={intl.get('view.invitationRegister.sendInvitation').d('发送邀请')}
        cancelText={intl.get('view.invitationRegister.callBack').d('返回')}
        confirmLoading={confirmLoading}
      >
        <Form style={{ overflow: 'auto' }} className={styles.formContent}>
          <FormItem
            label={intl.get('model.invitationRegister.companyId').d('邀请方')}
            {...formItemLayout}
            style={{ width: '100%' }}
          >
            {getFieldDecorator('companyId', {
              rules: [
                {
                  required: true,
                  message: intl.get('view.invitationRegister.companyId').d('请选择邀请方!'),
                },
              ],
            })(
              <Lov
                style={{ width: '300px' }}
                code="SPFM.USER_AUTHORITY_COMPANY"
                queryParams={{ organizationId: userOrganizationId }}
              />
            )}
          </FormItem>
          <FormItem
            label={intl.get('model.invitationRegister.supplierName').d('供应商企业')}
            {...formItemLayout}
            style={{ width: '100%' }}
          >
            {getFieldDecorator('supplierName', {
              rules: [
                {
                  required: true,
                  message: intl.get('view.invitationRegister.supplierName').d('请输入供应商企业!'),
                },
              ],
            })(<Input style={{ width: 300 }} />)}
          </FormItem>
          <FormItem
            label={intl.get('model.invitationRegister.supplierMail').d('供应商邮箱')}
            {...formItemLayout}
            style={{ width: '100%' }}
          >
            {getFieldDecorator('supplierMail', {
              rules: [
                {
                  type: 'email',
                  message: intl.get('view.invitationRegister.supplierMail').d('邮箱格式不正确!'),
                },
                {
                  required: true,
                  message: intl.get('view.invitationRegister.noSupplierMail').d('请输入邮箱!'),
                },
              ],
            })(<Input style={{ width: 300 }} />)}
          </FormItem>
          <FormItem
            label={intl.get('model.invitationRegister.inviteRegisterRemark').d('邀请说明')}
            {...formItemLayout}
            style={{ width: '100%' }}
          >
            {getFieldDecorator('inviteRegisterRemark', { rules: [{ required: false }] })(
              <TextArea autosize={{ minRows: 3, maxRows: 8 }} style={{ width: 300 }} />
            )}
          </FormItem>
          <FormItem
            label={intl.get('model.invitationRegister.autosendPartnerInviteFlag').d('发送邀约')}
            {...formItemLayout}
            style={{ width: '100%' }}
          >
            {getFieldDecorator('autosendPartnerInviteFlag', {
              rules: [{ required: true }],
              initialValue: 0,
            })(
              <RadioGroup name="autosendPartnerInviteFlag" onChange={this.onChangePartner}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <div className={styles.invitationTwo}>
            {intl
              .get('view.invitationRegister.remarkOne')
              .d('若选择是，则供应商完成注册后将自动收到您发送的合作邀约，否则您需要手动邀约')}
          </div>
          <FormItem
            label={intl.get('model.invitationRegister.autosendInvestigateFlag').d('发送调查表')}
            {...formItemLayout}
            style={{ width: '100%' }}
          >
            {getFieldDecorator('autosendInvestigateFlag', {
              rules: [{ required: true }],
              initialValue: getFieldsValue().autosendPartnerInviteFlag,
            })(
              <RadioGroup
                name="autosendInvestigateFlag"
                disabled={!getFieldsValue().autosendPartnerInviteFlag}
                onChange={this.onChange}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <div className={styles.invitationTwo}>
            {intl
              .get('view.invitationRegister.remarkTwo')
              .d(
                '若选择是，则供应商完成注册并同意邀约后将自动收到您发送的调查表，供应商需填写并提交您审批；否则您需手动发送调查表'
              )}
          </div>
          {!!getFieldsValue().autosendInvestigateFlag && (
            <FormItem
              label={intl.get('model.invitationRegister.investigateType').d('调查类型')}
              {...formItemLayout}
              style={{ width: '100%', marginTop: 5 }}
            >
              {getFieldDecorator('investigateType', {
                rules: getFieldsValue().autosendInvestigateFlag
                  ? [
                      {
                        required: true,
                        message: intl
                          .get('view.invitationRegister.investigateType')
                          .d('请选择调查类型！'),
                      },
                    ]
                  : null,
              })(
                <Select allowClear onChange={this.handleSelectChange}>
                  {(investigateType || []).map(n =>
                    (n || {}).value ? (
                      <Option
                        key={n.value}
                        value={n.value}
                        disabled={!getFieldsValue().autosendInvestigateFlag}
                      >
                        {n.meaning}
                      </Option>
                    ) : (
                      undefined
                    )
                  )}
                </Select>
              )}
            </FormItem>
          )}
          {!!getFieldsValue().autosendInvestigateFlag && (
            <FormItem
              label={intl.get('model.invitationRegister.investigateTemplateId').d('调查表模板')}
              {...formItemLayout}
              style={{ width: '100%' }}
            >
              {getFieldDecorator('investigateTemplateId', {
                rules: getFieldsValue().autosendInvestigateFlag
                  ? [
                      {
                        required: true,
                        message: intl
                          .get('view.invitationRegister.investigateTemplateId')
                          .d('请选择调查模板'),
                      },
                    ]
                  : null,
              })(
                getFieldsValue().investigateType ? (
                  <Lov
                    code="SSLM.INVESTIGATE_TEMPLATE_ID"
                    queryParams={{
                      organizationId,
                      enabledFlag: 1,
                      investigateType: getFieldsValue().investigateType,
                    }}
                    disabled={!getFieldsValue().autosendInvestigateFlag}
                  />
                ) : (
                  <Lov
                    code="SSLM.INVESTIGATE_TEMPLATE_ID"
                    disabled={!getFieldsValue().autosendInvestigateFlag}
                  />
                )
              )}
            </FormItem>
          )}
        </Form>
      </Modal>
    );
  }

  render() {
    return <React.Fragment>{this.renderForm()}</React.Fragment>;
  }
}
