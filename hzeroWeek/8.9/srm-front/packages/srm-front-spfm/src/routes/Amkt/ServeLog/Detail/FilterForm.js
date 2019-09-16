/**
 * FilterForm.js -服务开通记录明细-申请头
 * @date: 2019-07-10
 * @author WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'hzero-ui';
import classnames from 'classnames';
import intl from 'utils/intl';
import { PHONE, EMAIL } from 'utils/regExp';

const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};
const promptCode = 'spfm.serveLog';

@Form.create({ fieldNameProp: null })
export default class FilterForm extends Component {
  constructor(props) {
    super(props);
    const { formOnRef } = props;
    formOnRef(this);
  }

  render() {
    const {
      form: { getFieldDecorator = e => e },
      rowDataSource,
    } = this.props;
    return (
      <Form>
        <Row gutter={48} className="inclusion-row">
          <Col span={8}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.crmTenantNum`).d('集团编码')}
            >
              {rowDataSource.crmTenantNum}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.crmTenantName`).d('集团名称')}
            >
              {rowDataSource.crmTenantName}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.contactUser`).d('联系人')}
            >
              {rowDataSource.status === 'NEW'
                ? getFieldDecorator('contactUser', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.model.serveLog.contactUser`).d('联系人'),
                        }),
                      },
                      {
                        max: 30,
                        message: intl.get('hzero.common.validation.max', { max: 30 }),
                      },
                    ],
                    initialValue: rowDataSource.contactUser,
                  })(<Input />)
                : rowDataSource.contactUser}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={48} className="inclusion-row">
          <Col span={8}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.phone`).d('联系人电话')}
            >
              {rowDataSource.status === 'NEW'
                ? getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.model.serveLog.phone`).d('联系人电话'),
                        }),
                      },
                      {
                        pattern: PHONE,
                        message: intl
                          .get(`${promptCode}.model.serveLog.hint.phone`)
                          .d('联系人电话格式不正确'),
                      },
                    ],
                    initialValue: rowDataSource.phone,
                  })(<Input />)
                : rowDataSource.phone}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.email`).d('联系人邮箱')}
            >
              {rowDataSource.status === 'NEW'
                ? getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${promptCode}.model.serveLog.email`).d('联系人邮箱'),
                        }),
                      },
                      {
                        pattern: EMAIL,
                        message: intl
                          .get(`${promptCode}.model.serveLog.hint.email`)
                          .d('联系人邮箱格式不正确'),
                      },
                    ],
                    initialValue: rowDataSource.email,
                  })(<Input />)
                : rowDataSource.email}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.requestNumber`).d('申请日期')}
            >
              {rowDataSource.requestDate}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={48} className="inclusion-row">
          <Col span={8}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.requestNumber`).d('申请编码')}
            >
              {rowDataSource.requestNumber}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.requestUser`).d('申请人')}
            >
              {rowDataSource.requestUser}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={48} className={classnames('last-form-item', 'half-row')}>
          <Col span={12}>
            <Form.Item
              {...formLayout}
              label={intl.get(`${promptCode}.model.serveLog.remark`).d('申请说明')}
            >
              {getFieldDecorator('remark', {
                initialValue: rowDataSource.remark,
              })(
                <TextArea
                  rows={2}
                  disabled={rowDataSource.status !== 'NEW'}
                  style={{ overflowY: 'hidden' }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
