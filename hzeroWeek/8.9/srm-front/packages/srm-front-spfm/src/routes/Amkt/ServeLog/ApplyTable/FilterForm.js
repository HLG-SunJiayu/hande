/**
 * index.js -服务开通记录
 * @date: 2019-07-10
 * @author WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, DatePicker, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import moment from 'moment';

import cacheComponent from 'components/CacheComponent';
import intl from 'utils/intl';
import { getDateFormat } from 'utils/utils';
import { SEARCH_FORM_ROW_LAYOUT } from 'utils/constants';

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
    this.state = {
      expandForm: false,
    };
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { onSearch } = this.props;
    if (isFunction(onSearch)) {
      onSearch();
    }
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * 重置表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      statusEnumMap,
    } = this.props;
    const { expandForm } = this.state;
    return (
      <Form className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span={8}>
                <Form.Item label={intl.get('hzero.common.status').d('状态')} {...formLayout}>
                  {getFieldDecorator('status')(
                    <Select allowClear>
                      {statusEnumMap.flag
                        ? statusEnumMap.flag.map(n => (
                          <Select.Option key={n.value} value={n.value}>
                            {n.meaning}
                          </Select.Option>
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${promptCode}.model.serveLog.requestNumber`).d('申请编码')}
                  {...formLayout}
                >
                  {getFieldDecorator('requestNumber')(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={intl.get(`${promptCode}.model.serveLog.requestUser`).d('申请人')}
                  {...formLayout}
                >
                  {getFieldDecorator('requestUser')(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? 'block' : 'none' }} {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span={8}>
                <Form.Item
                  {...formLayout}
                  label={intl.get(`${promptCode}.model.serveLog.requestDateFrom`).d('申请日期从')}
                >
                  {getFieldDecorator('requestDateFrom')(
                    <DatePicker
                      format={getDateFormat()}
                      placeholder={null}
                      disabledDate={currentDate =>
                        getFieldValue('requestDateTo') &&
                        moment(getFieldValue('requestDateTo')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...formLayout}
                  label={intl.get(`${promptCode}.model.serveLog.requestDateTo`).d('申请日期至')}
                >
                  {getFieldDecorator('requestDateTo')(
                    <DatePicker
                      format={getDateFormat()}
                      placeholder={null}
                      disabledDate={currentDate =>
                        getFieldValue('requestDateFrom') &&
                        moment(getFieldValue('requestDateFrom')).isAfter(currentDate, 'day')
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="search-btn-more">
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get('hzero.common.button.viewMore').d('更多查询')}
              </Button>
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
