import React, { PureComponent } from 'react';
import { Form, Button, Select, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import Lov from 'components/Lov';
import intl from 'utils/intl';

const { Option } = Select;
const promptCode = 'spfm.importErp';

/**
 * 导入Erp表单
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onSearch - 表单查询
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
// @CacheComponent({ cacheKey: '/spfm/importErp' })
export default class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {};
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
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
   * render
   * @returns React.element
   */
  render() {
    const {
      syncStatusList = [],
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      style: { width: '100%' },
    };
    return (
      <Form layout="inline">
        <Row gutter={24}>
          <Col span={18}>
            <Row>
              <Col span={8}>
                <Form.Item
                  {...formItemLayout}
                  label={intl.get(`${promptCode}.model.importErp.syncStatus`).d('导入状态')}
                >
                  {getFieldDecorator('syncStatus')(
                    <Select allowClear>
                      {syncStatusList.map(item => (
                        <Option value={item.value} key={item.value}>
                          {item.meaning}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...formItemLayout}
                  label={intl.get('entity.supplier.name').d('供应商名称')}
                >
                  {getFieldDecorator('supplierCompanyId')(<Lov code="SPFM.USER_AUTH.SUPPLIER" />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...formItemLayout}
                  label={intl
                    .get(`${promptCode}.model.importErp.stageDescription`)
                    .d('供应商生命周期')}
                >
                  {getFieldDecorator('stageDescription')(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="search-btn-more">
            <Form.Item>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
