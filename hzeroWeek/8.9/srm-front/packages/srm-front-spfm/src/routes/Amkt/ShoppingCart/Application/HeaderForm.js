/**
 * Application - 头部表单
 * @since 2019-7-10
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Col, Form, Input, Row } from 'hzero-ui';
import classnames from 'classnames';

import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import {
  EDIT_FORM_ROW_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_2_LAYOUT,
} from 'utils/constants';
import { PHONE, EMAIL } from 'utils/regExp';

/**
 * Form.Item 组件label、wrapper长度比例划分
 */
const { TextArea } = Input;
const CODE_UPPER = /^[A-Z0-9_]*$/;
// const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'spfm.shoppingCart.view.message';

/**
 * Application头部表单
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
export default class HeaderForm extends PureComponent {
  componentDidMount() {
    const { bindForm, form } = this.props;
    bindForm(form);
  }

  render() {
    const { form, serveInfo = {}, handleSetEditFlag } = this.props;
    const { requestNumber = '', requestUser = '', requestDate = '' } = serveInfo;
    const { getFieldDecorator } = form;
    const { groupName, groupNum } = getCurrentUser();
    return (
      <Form>
        <Row {...EDIT_FORM_ROW_LAYOUT} className="inclusion-row">
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.crmTenantNum`).d('集团编码')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('crmTenantNum', {
                rules: [
                  {
                    pattern: CODE_UPPER,
                    message: `${intl
                      .get(`${viewMessagePrompt}.crmTenantNum`)
                      .d('集团编码')}只能由大写字母、数字及下划线组成`,
                  },
                  {
                    max: 30,
                    message: intl.get(`hzero.common.validation.max`, {
                      max: 30,
                    }),
                  },
                ],
                initialValue: groupNum,
              })(<span>{groupNum}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.crmTenantName`).d('集团名称')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('crmTenantName', {
                rules: [
                  {
                    max: 60,
                    message: intl.get(`hzero.common.validation.max`, {
                      max: 60,
                    }),
                  },
                ],
                initialValue: groupName,
              })(<span>{groupName}</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.contactUser`).d('联系人')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('contactUser', {
                rules: [
                  {
                    required: true,
                    message: `${intl.get(`${viewMessagePrompt}.contactUser`).d('联系人')}不能为空`,
                  },
                  {
                    max: 30,
                    message: intl.get(`hzero.common.validation.max`, {
                      max: 30,
                    }),
                  },
                ],
                initialValue: serveInfo.contactUser || '',
              })(<Input onChange={() => handleSetEditFlag(true)} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...EDIT_FORM_ROW_LAYOUT} className="inclusion-row">
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.phone`).d('联系人电话')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: `${intl.get(`${viewMessagePrompt}.phone`).d('联系人电话')}不能为空`,
                  },
                  {
                    pattern: PHONE,
                    message: `${intl.get(`${viewMessagePrompt}.phone`).d('联系人电话')}格式不正确`,
                  },
                ],
                initialValue: serveInfo.phone || '',
              })(<Input onChange={() => handleSetEditFlag(true)} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.email`).d('联系人邮箱')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: `${intl.get(`${viewMessagePrompt}.email`).d('联系人邮箱')}不能为空`,
                  },
                  {
                    pattern: EMAIL,
                    message: `${intl.get(`${viewMessagePrompt}.email`).d('联系人邮箱')}格式不正确`,
                  },
                ],
                initialValue: serveInfo.email || '',
              })(<Input onChange={() => handleSetEditFlag(true)} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.requestDate`).d('申请日期')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {requestDate}
            </Form.Item>
          </Col>
        </Row>
        <Row {...EDIT_FORM_ROW_LAYOUT} className="inclusion-row">
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.requestNumber`).d('申请编码')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {requestNumber}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.requestUser`).d('申请人')}
              {...EDIT_FORM_ITEM_LAYOUT}
            >
              {requestUser}
            </Form.Item>
          </Col>
        </Row>
        <Row {...EDIT_FORM_ROW_LAYOUT} className={classnames('last-form-item', 'half-row')}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item label={intl.get(`${viewMessagePrompt}.remark`).d('申请说明')}>
              {getFieldDecorator('remark', {})(
                <TextArea
                  onChange={() => handleSetEditFlag(true)}
                  rows={2}
                  style={{ overflow: 'hidden' }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
