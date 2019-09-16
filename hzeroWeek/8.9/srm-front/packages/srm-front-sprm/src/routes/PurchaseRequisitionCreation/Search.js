/*
 * Filename: d:\Fork\201907-B-Train\25785-孙佳钰\hzeroWeek\8.9\srm-front\packages\srm-front-sprm\src\routes\PurchaseRequisitionCreation\Search.js
 * Path: d:\Fork\201907-B-Train\25785-孙佳钰\hzeroWeek\8.9\srm-front\packages\srm-front-sprm
 * Created Date: Tuesday, August 13th 2019, 9:03:31 am
 * Author: 25785
 *
 * Copyright (c) 2019 Your Company
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button } from 'hzero-ui';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

@Form.create()
export default class Search extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
  };

  render() {
    const {
      onSearch,
      enumMap = {},
      form: { getFieldDecorator },
    } = this.props;
    const { status = [] } = enumMap;
    return (
      <Form Layout="inline" className="more-fields-search-form">
        <Row gutter={12}>
          <Col span={18}>
            <Row gutter={12}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="采购申请编号">
                  {getFieldDecorator('displayPrNum')(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="状态">
                  {getFieldDecorator('prStatusCode')(
                    <Select>
                      {status.map(item => (
                        <Option value={item.value}>{item.meaning}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="search-btn-more">
            <FormItem>
              <Button onClick={this.handleReset}>重置</Button>
              <Button type="primary" onClick={onSearch}>
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
