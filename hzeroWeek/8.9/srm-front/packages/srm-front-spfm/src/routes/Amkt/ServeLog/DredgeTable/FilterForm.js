/**
 * index.js -服务开通记录
 * @date: 2019-07-10
 * @author WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import cacheComponent from 'components/CacheComponent';
import intl from 'utils/intl';

const formLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const promptCode = 'spfm.serveLog';

@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/spfm/amkt-servelog' })
export default class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  /**
   * query - 查询按钮事件
   */
  @Bind()
  handleSearch() {
    const { onSearch } = this.props;
    if (isFunction(onSearch)) {
      onSearch();
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline" className="more-fields-form">
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item
              label={intl.get(`${promptCode}.model.serveLog.serviceCode`).d('服务编码')}
              {...formLayout}
            >
              {getFieldDecorator('serviceCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={intl.get(`${promptCode}.model.serveLog.serviceName`).d('服务名称')}
              {...formLayout}
            >
              {getFieldDecorator('serviceName')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={intl.get(`${promptCode}.model.serveLog.partnerName`).d('服务提供商')}
              {...formLayout}
            >
              {getFieldDecorator('partnerName')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6} className="search-btn-more">
            <Form.Item>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
