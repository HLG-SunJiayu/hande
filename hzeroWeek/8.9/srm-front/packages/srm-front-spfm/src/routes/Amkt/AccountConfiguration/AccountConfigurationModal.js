/**
 * AccountConfiguration - 账户配置
 * @date: 2019-7-15
 * @author: guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'spfm.accountConfiguration.view.message';

/**
 * 维护密码表单
 * @extends {Component} - React.Component
 * @reactProps {Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
export default class AccountConfigurationModal extends React.Component {
  /**
   * 点击确定触发事件
   */
  @Bind()
  okHandle() {
    const { form, saveModalData, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (saveModalData) {
          saveModalData({ ...fieldsValue });
        }
        dispatch({ type: 'accountConfiguration/cancelHandle' });
      }
    });
  }

  /**
   * 点击取消触发事件
   */
  @Bind()
  cancelHandle() {
    const { showChangeModal, dispatch } = this.props;
    dispatch({ type: 'accountConfiguration/cancelHandle' });
    showChangeModal(false);
  }

  render() {
    const {
      form,
      modalVisible,
      modalSaveLoading = false,
      modalFetchLoading = false,
      modalData,
    } = this.props;
    const {
      apiKey = '',
      // domainUrl = '',
      // serviceTypeName = '',
      // typeName = '',
      // serviceTypeId = 0,
      // grantTypeId = '',
      username = '',
      password = '',
      clientId = '',
      clientSecret = '',
      // scope = '',
    } = modalData;
    return (
      <Modal
        destroyOnClose
        confirmLoading={modalSaveLoading || modalFetchLoading}
        title={intl.get(`${viewMessagePrompt}.accountConfiguration`).d('账户配置')}
        visible={modalVisible}
        onOk={this.okHandle}
        width={520}
        onCancel={this.cancelHandle}
      >
        <Spin spinning={modalSaveLoading || modalFetchLoading}>
          {/* <FormItem label="域名地址" {...formLayout}>
            {form.getFieldDecorator('domainUrl', {
              initialValue: domainUrl,
              rules: [
                {
                  required: true,
                  message: `域名地址不能为空`,
                },
                {
                  max: 120,
                  message: intl.get('hzero.common.validation.max', {
                    max: 120,
                  }),
                },
              ],
            })(<Input />)}
          </FormItem> */}
          {/* <FormItem label="服务类型" {...formLayout}>
            {form.getFieldDecorator('serviceTypeId', {
              initialValue: serviceTypeId || 0,
              rules: [
                {
                  required: true,
                  message: `服务类型不能为空`,
                },
              ],
            })(<Lov code="AMKT.SERVICE_TYPE" textValue={serviceTypeName} disabled />)}
          </FormItem> */}
          {/* <FormItem label="授权类型" {...formLayout}>
            {form.getFieldDecorator('grantTypeId', {
              initialValue: grantTypeId,
              rules: [
                {
                  required: true,
                  message: `授权类型不能为空`,
                },
              ],
            })(<Lov code="AMKT.GRANT_TYPE" textValue={typeName} />)}
          </FormItem> */}
          <FormItem label={intl.get(`${viewMessagePrompt}.username`).d('用户名')} {...formLayout}>
            {form.getFieldDecorator('username', {
              initialValue: username,
              rules: [
                {
                  max: 120,
                  message: intl.get('hzero.common.validation.max', {
                    max: 120,
                  }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={intl.get(`${commonPrompt}.password`).d('密码')} {...formLayout}>
            {form.getFieldDecorator('password', {
              initialValue: password,
              rules: [
                {
                  max: 120,
                  message: intl.get('hzero.common.validation.max', {
                    max: 120,
                  }),
                },
              ],
            })(<Input type="password" autoComplete="new-password" />)}
          </FormItem>
          <FormItem label={intl.get(`${viewMessagePrompt}.clientId`).d('客户端ID')} {...formLayout}>
            {form.getFieldDecorator('clientId', {
              initialValue: clientId,
              rules: [
                {
                  max: 120,
                  message: intl.get('hzero.common.validation.max', {
                    max: 120,
                  }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            label={intl.get(`${viewMessagePrompt}.clientSecret`).d('客户端密钥')}
            {...formLayout}
          >
            {form.getFieldDecorator('clientSecret', {
              initialValue: clientSecret,
              rules: [
                {
                  max: 120,
                  message: intl.get('hzero.common.validation.max', {
                    max: 120,
                  }),
                },
              ],
            })(<Input type="password" autoComplete="new-password" />)}
          </FormItem>
          {/* <FormItem label="授权范围" {...formLayout}>
            {form.getFieldDecorator('scope', {
              initialValue: scope,
              rules: [
                {
                  max: 120,
                  message: intl.get('hzero.common.validation.max', {
                    max: 120,
                  }),
                },
              ],
            })(<Input />)}
          </FormItem> */}
          <FormItem label={intl.get(`${viewMessagePrompt}.apiKey`).d('API密钥')} {...formLayout}>
            {form.getFieldDecorator('apiKey', {
              initialValue: apiKey,
              rules: [
                {
                  max: 120,
                  message: intl.get('hzero.common.validation.max', {
                    max: 120,
                  }),
                },
              ],
            })(<Input type="password" autoComplete="new-password" />)}
          </FormItem>
        </Spin>
      </Modal>
    );
  }
}
