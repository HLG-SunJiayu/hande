import React, { PureComponent } from 'react';
import { Form, Button, Input, Select, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create({ fieldNameProp: null })
export default class PlatformFilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expand: true,
    };
  }

  /**
   * 展开/收起方法
   */
  @Bind()
  toggle() {
    this.setState({
      expand: !this.state.expand,
    });
  }

  /**
   * 查询平台供应商
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          onSearch();
        }
      });
    }
  }

  /**
   * 平台供应商查询条件表单重置
   */
  @Bind()
  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const { expand } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form layout="inline" className="more-fields-form">
        <Row gutter={24}>
          <Col span={18}>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={intl
                    .get('spfm.supplier.model.supplier.platform.supplierCompanyNum')
                    .d('平台供应商编码')}
                >
                  {getFieldDecorator('supplierCompanyNum')(<Input inputChinese={false} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={intl
                    .get('spfm.supplier.model.supplier.platform.supplierCompanyName')
                    .d('平台供应商名称')}
                >
                  {getFieldDecorator('supplierCompanyName')(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label={intl.get('entity.company.tag').d('公司')}>
                  {getFieldDecorator('customCompanyName')(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ display: expand ? 'none' : 'block' }}>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={intl.get('spfm.supplier.model.supplier.platform.isErp').d('是否 ERP')}
                >
                  {getFieldDecorator('isErp')(
                    <Select allowClear>
                      <Option value="1">{intl.get('hzero.common.status.yes').d('是')}</Option>
                      <Option value="0">{intl.get('hzero.common.status.no').d('否')}</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={intl
                    .get('spfm.supplier.model.supplier.platform.isMonitor')
                    .d('是否加入监控')}
                >
                  {getFieldDecorator('isMonitor')(
                    <Select allowClear>
                      <Option value="1">{intl.get('hzero.common.status.yes').d('是')}</Option>
                      <Option value="0">{intl.get('hzero.common.status.no').d('否')}</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="search-btn-more">
            <Form.Item>
              <Button onClick={this.toggle}>
                {expand
                  ? intl.get(`hzero.common.button.collected`).d('更多查询')
                  : intl.get(`hzero.common.button.viewMore`).d('收起查询')}
              </Button>
              <Button onClick={this.handleReset}>
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
