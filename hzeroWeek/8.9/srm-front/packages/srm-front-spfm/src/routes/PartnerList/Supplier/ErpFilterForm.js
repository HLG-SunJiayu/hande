import React, { PureComponent } from 'react';
import { Form, Button, Input, DatePicker, Select, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const FormItem = Form.Item;
const { Option } = Select;

@formatterCollections({
  code: 'spfm.supplier',
})
@Form.create({ fieldNameProp: null })
export default class ErpFilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expand: true,
    };
  }

  /**
   * 查询条件收起／展开
   */
  @Bind()
  toggle() {
    this.setState({
      expand: !this.state.expand,
    });
  }

  /**
   * 查询 ERP 供应商
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
   * ERP 供应商表单查询条件重置
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
                  label={intl.get('spfm.supplier.model.supplier.erp.supplierNum').d('供应商编码')}
                >
                  {getFieldDecorator('supplierNum')(
                    <Input typeCase="upper" trim inputChinese={false} />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={intl.get('spfm.supplier.model.supplier.erp.supplierName').d('供应商名称')}
                >
                  {getFieldDecorator('supplierName')(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={intl.get('hzero.common.date.creation').d('创建日期')}
                >
                  {getFieldDecorator('erpCreationDate')(<DatePicker placeholder={null} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ display: expand ? 'none' : 'block' }}>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={intl.get('spfm.supplier.model.supplier.erp.isLinked').d('是否已关联')}
                >
                  {getFieldDecorator('isLinked')(
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
            <FormItem>
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
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
