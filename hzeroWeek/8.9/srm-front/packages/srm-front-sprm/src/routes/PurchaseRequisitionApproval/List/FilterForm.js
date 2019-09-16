/*
 * NonErpPurchaseRequisition - 非ERP采购申请
 * @date: 2019-01-24
 * @author: guochaochao <chaochao.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Form, Input, Row, Col, Button, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import moment from 'moment';

import cacheComponent from 'components/CacheComponent';
import intl from 'utils/intl';
import { SEARCH_FORM_ROW_LAYOUT } from 'utils/constants';
import { getDateTimeFormat } from 'utils/utils';

const commonPrompt = 'sprm.purchaseRequisitionApproval.model.purchaseRequisitionApproval';
const FormItem = Form.Item;
const { Option } = Select;
const formLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/sprm/purchase-requisition-approval' })
export default class FilterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
    };
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
   * onClick - 查询按钮事件
   */
  @Bind()
  onClick() {
    const { onFilterChange } = this.props;
    if (isFunction(onFilterChange)) {
      onFilterChange();
    }
  }

  /**
   * onReset - 重置按钮事件
   */
  @Bind()
  onReset() {
    const {
      form: { resetFields = e => e },
    } = this.props;
    resetFields();
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      prSourcePlatformList,
    } = this.props;
    const { expandForm } = this.state;
    return (
      <Form layout="inline" className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${commonPrompt}.displayPrNum`).d('采购申请编号')}
                  {...formLayout}
                >
                  {getFieldDecorator('displayPrNum', {
                    rules: [
                      {
                        max: 180,
                        message: intl.get('hzero.common.validation.max', {
                          max: 180,
                        }),
                      },
                    ],
                  })(<Input dbc2sbc={false} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${commonPrompt}.prSourcePlatform`).d('单据来源')}
                  {...formLayout}
                >
                  {getFieldDecorator('prSourcePlatform')(
                    <Select allowClear>
                      {prSourcePlatformList.map(item => (
                        <Option value={item.value} key={item.value}>
                          {item.meaning}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${commonPrompt}.prRequestedName`).d('申请人')}
                  {...formLayout}
                >
                  {getFieldDecorator('prRequestedName')(<Input dbc2sbc={false} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ display: expandForm ? 'block' : 'none' }} {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span={8}>
                <FormItem
                  {...formLayout}
                  label={intl.get(`${commonPrompt}.creationDateFrom`).d('创建时间从')}
                >
                  {getFieldDecorator('creationDateFrom')(
                    <DatePicker
                      showTime
                      format={getDateTimeFormat()}
                      placeholder={null}
                      disabledDate={currentDate =>
                        getFieldValue('creationDateTo') &&
                        moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formLayout}
                  label={intl.get(`${commonPrompt}.creationDateTo`).d('创建时间至')}
                >
                  {getFieldDecorator('creationDateTo')(
                    <DatePicker
                      showTime
                      disabledDate={currentDate =>
                        getFieldValue('creationDateFrom') &&
                        moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'day')
                      }
                      format={getDateTimeFormat()}
                      placeholder={null}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="search-btn-more">
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button data-code="reset" onClick={this.onReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button data-code="search" type="primary" htmlType="submit" onClick={this.onClick}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
