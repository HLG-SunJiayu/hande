/**
 * index.js - 产品线管理
 * @date: 2019-07-02
 * @author: wangyang <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { SEARCH_FORM_ROW_LAYOUT } from 'utils/constants';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import cacheComponent from 'components/CacheComponent';

const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/spcm/spcm/product-control/list' })
export default class Search extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * query - 查询按钮事件
   */
  @Bind()
  query() {
    const { onSearch } = this.props;
    if (isFunction(onSearch)) {
      onSearch();
    }
  }

  /**
   * onReset - 重置按钮事件
   */
  @Bind()
  onReset() {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
  }

  render() {
    const {
      form: { getFieldDecorator },
      enumMap = [],
    } = this.props;
    return (
      <Form className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="模块编码">
                  {getFieldDecorator('queryModuleCode')(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="模块名称">
                  {getFieldDecorator('moduleName')(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="是否启用">
                  {getFieldDecorator('enabledFlag')(
                    <Select style={{ width: '100%' }} allowClear>
                      {enumMap.map(n => (
                        <Option key={n.value} value={n.value}>
                          {n.meaning}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="search-btn-more">
            <Form.Item>
              <Button data-code="reset" onClick={this.onReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button data-code="search" type="primary" htmlType="submit" onClick={this.query}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
