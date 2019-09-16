/**
 * FilterForm -公司查询页面(查询部分)
 * @date: 2018-8-8
 * @author dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Fragment } from 'react';
import { Button, Form, Input, DatePicker, Row, Col, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      display: true,
    };
  }

  /**
   *  查询公司列表(带条件查询)
   */
  @Bind()
  handleSearch() {
    const { onFeacthCompanyDate, form } = this.props;
    form.validateFields((err, filedValues) => {
      if (!err) {
        onFeacthCompanyDate({
          ...filedValues,
        });
      }
    });
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  /**
   * 多查询条件展示
   */
  @Bind()
  toggleForm() {
    const { display } = this.state;
    this.setState({
      display: !display,
    });
  }

  renderForm() {
    const {
      form: { getFieldDecorator, getFieldValue },
      format,
    } = this.props;
    const { display } = this.state;
    const formlayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className="table-list-search">
        <Fragment>
          <Form layout="inline" className="more-fields-form">
            <Row>
              <Col span={18}>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label={intl.get('entity.company.name').d('公司名称')}
                      {...formlayout}
                    >
                      {getFieldDecorator('companyName')(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={intl
                        .get('spfm.partnership.model.company.registerTimeFrom')
                        .d('注册时间从')}
                      {...formlayout}
                    >
                      {getFieldDecorator('registerTimeFrom')(
                        <DatePicker
                          disabledDate={currentDate =>
                            getFieldValue('registerTimeTo') &&
                            moment(getFieldValue('registerTimeTo')).isBefore(currentDate, 'day')
                          }
                          format={format}
                          placeholder=""
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={intl
                        .get('spfm.partnership.model.company.registerTimeTo')
                        .d('注册时间至')}
                      {...formlayout}
                    >
                      {getFieldDecorator('registerTimeTo')(
                        <DatePicker
                          disabledDate={currentDate =>
                            getFieldValue('registerTimeFrom') &&
                            moment(getFieldValue('registerTimeFrom')).isAfter(currentDate, 'day')
                          }
                          format={format}
                          placeholder=""
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ display: display ? 'none' : 'block' }}>
                  <Col span={8}>
                    <Form.Item
                      label={intl.get('spfm.partnership.model.company.groupName').d('所属集团')}
                      {...formlayout}
                    >
                      {getFieldDecorator('groupName')(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={6} className="search-btn-more">
                <Form.Item>
                  <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                    {intl.get('hzero.common.button.search').d('查询')}
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    {intl.get('hzero.common.button.reset').d('重置')}
                  </Button>
                  <a
                    style={{ marginLeft: 8, display: display ? 'inline-block' : 'none' }}
                    onClick={this.toggleForm}
                  >
                    {intl.get(`hzero.common.button.expand`).d('展开')} <Icon type="down" />
                  </a>
                  <a
                    style={{ marginLeft: 8, display: display ? 'none' : 'inline-block' }}
                    onClick={this.toggleForm}
                  >
                    {intl.get(`hzero.common.button.up`).d('收起')} <Icon type="up" />
                  </a>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Fragment>
      </div>
    );
  }

  render() {
    return <div className="operation-btn">{this.renderForm()}</div>;
  }
}
