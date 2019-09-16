/**
 * 发起邀请 Modal
 * @date: 2018-8-4
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, Modal } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import Lov from 'components/Lov';
import Checkbox from 'components/Checkbox';
import ValueList from 'components/ValueList';
import intl from 'utils/intl';
import { getUserOrganizationId } from 'utils/utils';

import InvestigatePreview from './components/InvestigatePreview';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;
// const { Option } = Select;
const promptCode = 'spfm.companySearch';
/**
 * 合作伙伴邀请模态框
 * @extends {Component} - PureComponent
 * @reactProps {String} isSupplier 是供应商 True
 * @reactProps {String} hideModal 关闭模态框的函数
 * @reactProps {String} inviteCompanyName 被邀请的公司Id
 * @reactProps {String} inviteCompanyId 被邀请的公司Id
 * @reactProps {String} inviteTenantId 被邀请的公司租户id
 * @reactProps {Function} invite 确认邀请函数
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
export default class Invitation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userOrganizationId: getUserOrganizationId(),
    };
  }

  /**
   *确定发送邀请
   *
   * @memberof Invitation
   */
  @Bind()
  handleInvitation() {
    const { form, invite, inviteCompanyId, inviteTenantId } = this.props;
    form.validateFields((err, filesValue) => {
      const { flag, ...other } = filesValue;
      if (!err) {
        confirm({
          title: intl
            .get(
              `hzero.common.message.confirm.invite
`
            )
            .d('是否确认邀请'),
          onOk() {
            invite({ ...other, inviteCompanyId, inviteTenantId });
          },
          onCancel() {},
        });
      }
    });
  }

  /**
   * 判断调查表类型和模板是否必填
   */
  @Bind()
  handleCheckChange() {
    const { form } = this.props;
    if (form.getFieldValue('flag') === 1) {
      form.resetFields(['investigateType', 'investigateTemplateId']);
    }
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
    const { userOrganizationId } = this.state;
    const { form, hideModal, isSupplier, organizationId, saving } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const isCheck = getFieldValue('flag') !== 0;
    const formLayOut = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form layout="horizontal">
        <Row style={{ marginBottom: 10 }}>
          <Col md={12}>
            <FormItem
              label={intl.get(`${promptCode}.view.message.inviter`).d('邀请方')}
              {...formLayOut}
              style={{ textAlign: 'left' }}
            >
              {getFieldDecorator('companyId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${promptCode}.view.message.inviter`).d('邀请方'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="SPFM.USER_AUTHORITY_COMPANY"
                  queryParams={{ organizationId: userOrganizationId }}
                />
              )}
            </FormItem>
          </Col>
          {isSupplier && (
            <Col md={12}>
              <FormItem
                label={intl.get(`${promptCode}.view.message.sendInvestigation`).d('发送调查表')}
                {...formLayOut}
              >
                {getFieldDecorator('flag', {
                  // rules: [{ required: true, message: '发送调查表不能为空' }],
                  initialValue: 1,
                })(<Checkbox onChange={this.handleCheckChange} />)}
              </FormItem>
            </Col>
          )}
        </Row>
        {isSupplier && (
          <Row style={{ marginBottom: 10 }}>
            <Col md={12}>
              <FormItem
                label={intl.get(`${promptCode}.view.message.investigateType`).d('调查类型')}
                {...formLayOut}
              >
                {getFieldDecorator(
                  'investigateType',
                  isCheck
                    ? {
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl
                                .get(`${promptCode}.view.message.investigateType`)
                                .d('调查类型'),
                            }),
                          },
                        ],
                      }
                    : {}
                )(
                  <ValueList
                    allowClear
                    disabled={!isCheck}
                    lovCode="SSLM.INVESTIGATE_TYPE"
                    onChange={this.handleSelectChange}
                  />
                  // <Select allowClear disabled={!isCheck} onChange={this.onHandleSelectChange}>
                  //   {investigateType.map(item => {
                  //     return (
                  //       <Option key={item.value} value={item.value}>
                  //         {item.meaning}
                  //       </Option>
                  //     );
                  //   })}
                  // </Select>
                )}
              </FormItem>
            </Col>
            <Col md={12}>
              <FormItem
                label={intl.get(`${promptCode}.view.message.investigateTemplate`).d('调查表模板')}
                {...formLayOut}
              >
                {getFieldDecorator(
                  'investigateTemplateId',
                  isCheck
                    ? {
                        rules: [
                          {
                            required: true,
                            message: intl.get('hzero.common.validation.notNull', {
                              name: intl
                                .get(`${promptCode}.view.message.investigateTemplateId`)
                                .d('调查表模板'),
                            }),
                          },
                        ],
                      }
                    : {}
                )(
                  <Lov
                    disabled={!isCheck || isEmpty(getFieldValue('investigateType'))}
                    code="SSLM.INVESTIGATE_TEMPLATE_ID"
                    queryParams={{
                      organizationId,
                      enabledFlag: 1,
                      investigateType: getFieldValue('investigateType'),
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )}
        <Row style={{ marginBottom: 10 }}>
          <Col md={24}>
            <FormItem
              label={intl.get(`${promptCode}.view.message.inviteRemark`).d('邀请说明')}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              {getFieldDecorator('inviteRemark', {
                // rules: [{ required: true, message: '邀请说明不能为空' }],
              })(<TextArea style={{ height: '95px', resize: 'none' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset={4}>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                onClick={this.handleInvitation}
              >
                {intl.get(`${promptCode}.view.option.confirmInvitation`).d('确认邀请')}
              </Button>
              <Button className={styles.button} onClick={hideModal}>
                {intl.get(`hzero.common.button.cancel`).d('取消')}
              </Button>
              {getFieldValue('investigateTemplateId') && (
                <Button className={styles.button} onClick={this.handleShowModal}>
                  {intl.get(`${promptCode}.view.message.templatePreview`).d('预览模板')}
                </Button>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      isSupplier,
      inviteCompanyName,
      organizationId,
      form: { getFieldValue },
    } = this.props;

    const previewTitle = intl.get(`${promptCode}.view.message.templateDetail`).d('模板明细');
    const previewProps = {
      previewTitle,
      organizationId,
      investigateTemplateId: getFieldValue('investigateTemplateId'),
      onRef: ref => {
        this.handleShowModal = ref;
      },
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.title.invitingInformation`).d('邀请信息')} />
        <Content>
          <div className={styles.content}>
            <div className={styles.title}>
              {isSupplier ? (
                <span>
                  {intl.get(`${promptCode}.view.message.sendInvitation`).d('您正在向')}【
                  <span className={styles.company}>{inviteCompanyName}</span>】
                  {intl
                    .get(`${promptCode}.view.message.sendInvitationOne`)
                    .d('发出合作邀约，邀请它成为你的【供应商】')}
                </span>
              ) : (
                <span>
                  {intl.get(`${promptCode}.view.message.sendInvitation`).d('您正在向')}【
                  <span className={styles.company}>{inviteCompanyName}</span>】
                  {intl
                    .get(`${promptCode}.view.message.sendInvitationTwo`)
                    .d('发出合作邀约，邀请它成为您的【客户】')}
                </span>
              )}
            </div>
            <div className={styles.form}>{this.renderForm()}</div>
          </div>
        </Content>
        <InvestigatePreview {...previewProps} />
      </React.Fragment>
    );
  }
}
