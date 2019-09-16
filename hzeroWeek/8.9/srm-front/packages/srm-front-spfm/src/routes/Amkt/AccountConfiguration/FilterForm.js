/**
 * partnerManagement -合作伙伴管理 查询页
 * @date: 2019-7-4
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import CacheComponent from 'components/CacheComponent';
import intl from 'utils/intl';
// import Lov from 'components/Lov';

const formLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'spfm.accountConfiguration.view.message';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: '/spfm/shopping-cart/list' })
export default class FilterForm extends PureComponent {
  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  componentDidMount() {
    const { bindForm, form } = this.props;
    bindForm(form);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { handleSearch, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" className="more-fields-form">
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.serviceTypeCode`).d('账户组编码')}
              {...formLayout}
            >
              {getFieldDecorator('serviceTypeCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.serviceTypeName`).d('账户组名称')}
              {...formLayout}
            >
              {getFieldDecorator('serviceTypeName')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={intl.get(`${viewMessagePrompt}.partnerName`).d('服务提供商')}
              {...formLayout}
            >
              {getFieldDecorator('partnerName')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6} className="search-btn-more">
            <Form.Item>
              <Button onClick={this.handleFormReset}>
                {intl.get(`${commonPrompt}.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={() => handleSearch(form)}>
                {intl.get(`${commonPrompt}.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
