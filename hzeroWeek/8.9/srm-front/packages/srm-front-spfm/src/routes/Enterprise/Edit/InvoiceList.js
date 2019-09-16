/**
 * 企业信息 - 开票信息
 * @date: 2018-7-15
 * @author: chenjing <jing.chen05@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { EMAIL, PHONE } from 'utils/regExp';
import intl from 'utils/intl';
import notification from 'utils/notification';

const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const submitFormLayout = {
  wrapperCol: { span: 10, offset: 6 },
};

@connect(({ invoiceInfo, loading }) => ({
  invoiceInfo,
  fetchLoading: loading.effects['invoiceInfo/fetchInvoiceInfo'],
}))
@Form.create({ fieldNameProp: null })
export default class InvoiceList extends PureComponent {
  /**
   * 挂载后执行方法
   */
  componentDidMount() {
    const { dispatch, companyId, onRef } = this.props;
    dispatch({
      type: 'invoiceInfo/queryCompanyBasic',
    }).then((res = {}) => {
      const { companyBasicId } = res;
      if (companyBasicId) {
        if (onRef) onRef(this);
        const data = {
          companyId,
          companyBasicId,
        };
        dispatch({
          type: 'invoiceInfo/fetchInvoiceInfo',
          payload: data,
        }).then(res1 => {
          const { bankAccountNum, scbaBankAccountNum, depositBank, scbadepositBank } = res1;
          if (scbaBankAccountNum && scbadepositBank) {
            if (bankAccountNum !== scbaBankAccountNum || depositBank !== scbadepositBank) {
              notification.info({
                message: intl
                  .get('spfm.enterprise.model.invoice.validateBankInfo')
                  .d('您的银行主账户信息已变更，请注意是否修改开票信息的银行账户信息！'),
              });
            }
          }
        });
      }
    });
  }

  /**
   * 进行下一步时保存当前页面数据
   */
  @Bind()
  saveAndNext() {
    const { invoiceInfo = {}, companyId, form, dispatch, callback } = this.props;
    const { companyInvoiceId } = invoiceInfo;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const payload = {
        companyId,
        ...invoiceInfo,
        invoiceHeader: fieldsValue.invoiceHeader,
        taxRegistrationNumber: fieldsValue.taxRegistrationNumber,
        depositBank: fieldsValue.depositBank,
        bankAccountNum: fieldsValue.bankAccountNum,
        taxRegistrationAddress: fieldsValue.taxRegistrationAddress,
        taxRegistrationPhone: fieldsValue.taxRegistrationPhone,
        receiveMail: fieldsValue.receiveMail,
        receivePhone: fieldsValue.receivePhone,
        objectVersionNumber: fieldsValue.objectVersionNumber,
      };
      dispatch({
        type: companyInvoiceId ? 'invoiceInfo/updateInvoiceInfo' : 'invoiceInfo/createInvoiceInfo',
        payload,
      }).then(res => {
        if (res) {
          if (callback) {
            callback(res);
          }
        }
      });
    });
  }

  /**
   * 返回上一步
   */
  @Bind()
  handlePrevious() {
    const { previousCallback } = this.props;
    if (previousCallback) {
      previousCallback();
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      updating,
      saving,
      buttonText = intl.get('hzero.common.button.save').d('保存'),
      backBtnText = intl.get('hzero.common.button.previous').d('上一步'),
      previousCallback,
      invoiceInfo = {},
      invoiceInfo: { legalInfo = {} },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form style={{ marginTop: 8, width: '720px' }}>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.invoice.invoiceHeader').d('发票头')}
        >
          {getFieldDecorator('invoiceHeader', {
            initialValue: legalInfo.companyName,
            rules: [
              {
                message: intl.get('hzero.common.validation.notNull', {
                  name: intl.get('spfm.enterprise.model.invoice.invoiceHeader'),
                }),
              },
            ],
          })(<Input disabled />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.invoice.taxRegistrationNumber').d('税务登记号')}
        >
          {getFieldDecorator('taxRegistrationNumber', {
            initialValue: legalInfo.unifiedSocialCode,
            rules: [
              {
                message: intl.get('hzero.common.validation.notNull', {
                  name: intl.get('spfm.enterprise.invoice.invoice.taxRegistrationNumber'),
                }),
              },
            ],
          })(<Input style={{ width: '200px' }} disabled />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.invoice.depositBank').d('开户行')}
        >
          {getFieldDecorator('depositBank', {
            initialValue: invoiceInfo.depositBank,
            rules: [
              {
                required: true,
                message: intl
                  .get('hzero.common.validation.notNull', {
                    name: intl.get('spfm.enterprise.model.invoice.depositBank'),
                  })
                  .d('开户行不能为空！'),
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.invoice.bankAccountNum').d('开户行账号')}
        >
          {getFieldDecorator('bankAccountNum', {
            initialValue: invoiceInfo.bankAccountNum,
            rules: [
              {
                required: true,
                message: intl
                  .get('hzero.common.validation.notNull', {
                    name: intl.get('spfm.enterprise.model.invoice.bankAccountNum'),
                  })
                  .d('开户行账号不能为空！'),
              },
            ],
          })(<Input style={{ width: '240px' }} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.invoice.taxRegistrationAddress').d('税务登记地址')}
        >
          {getFieldDecorator('taxRegistrationAddress', {
            initialValue: invoiceInfo.taxRegistrationAddress,
            rules: [
              {
                required: true,
                message: intl
                  .get('hzero.common.validation.notNull', {
                    name: intl.get('spfm.enterprise.model.invoice.taxRegistrationAddress'),
                  })
                  .d('税务登记地址不能为空！'),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.invoice.taxRegistrationPhone').d('税务登记电话')}
        >
          {getFieldDecorator('taxRegistrationPhone', {
            initialValue: invoiceInfo.taxRegistrationPhone,
            rules: [
              {
                required: true,
                message: intl
                  .get('hzero.common.validation.notNull', {
                    name: intl.get('spfm.enterprise.model.invoice.taxRegistrationPhone'),
                  })
                  .d('税务登记电话不能为空！'),
              },
            ],
          })(<Input style={{ width: '180px' }} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.invoice.receiveMail').d('收票人邮箱')}
        >
          {getFieldDecorator('receiveMail', {
            initialValue: invoiceInfo.receiveMail,
            rules: [
              {
                required: true,
                message: intl
                  .get('hzero.common.validation.notNull', {
                    name: intl.get('spfm.enterprise.model.invoice.receiveMail'),
                  })
                  .d('收票人邮箱不能为空！'),
              },
              {
                pattern: EMAIL,
                message: intl.get('hzero.common.validation.email').d('收票人邮箱格式不正确！'),
              },
            ],
          })(<Input style={{ width: '200px' }} />)}
        </FormItem>
        {getFieldDecorator('objectVersionNumber', {
          initialValue: invoiceInfo.objectVersionNumber,
        })(<div />)}
        <FormItem
          {...formItemLayout}
          label={intl.get('spfm.enterprise.model.invoice.receivePhone').d('收票人手机号')}
        >
          {getFieldDecorator('receivePhone', {
            initialValue: invoiceInfo.receivePhone,
            rules: [
              {
                required: true,
                message: intl
                  .get('hzero.common.validation.notNull', {
                    name: intl.get('spfm.enterprise.model.invoice.receivePhone'),
                  })
                  .d('收票人手机号不能为空！'),
              },
              {
                pattern: PHONE,
                message: intl.get('hzero.common.validation.phone').d('收票人手机号格式不正确！'),
              },
            ],
          })(<Input style={{ width: '180px' }} />)}
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 40 }}>
          {previousCallback && (
            <Button type="primary" onClick={this.handlePrevious} style={{ marginRight: 16 }}>
              {backBtnText}
            </Button>
          )}
          <Button type="primary" onClick={this.saveAndNext} loading={updating || saving}>
            {buttonText}
          </Button>
        </FormItem>
      </Form>
    );
  }
}
