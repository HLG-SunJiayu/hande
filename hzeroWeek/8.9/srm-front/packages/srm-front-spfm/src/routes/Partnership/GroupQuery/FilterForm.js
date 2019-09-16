/**
 * FilterForm -集团查询页面(查询部分)
 * @date: 2018-8-8
 * @author dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Button, Form, Input, Checkbox, DatePicker } from 'hzero-ui';
import moment from 'moment';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';

const FormItem = Form.Item;
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      selectCoreFlag: false,
    };
  }

  // 带参数的查询数据
  @Bind()
  queryByConditon() {
    const { onFecthGroupDate, form } = this.props;
    form.validateFields((err, filedValues) => {
      if (!err) {
        onFecthGroupDate({
          ...filedValues,
        });
      }
    });
  }

  /**
   * 表单重置
   */
  @Bind()
  queryReset() {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      selectCoreFlag: false,
    });
  }

  /**
   * 核心企业
   * @param {object} e 当所域
   */
  @Bind()
  checkCoreFlag(e) {
    this.setState({
      selectCoreFlag: e.target.checked,
    });
  }

  renderForm() {
    const {
      form: { getFieldDecorator, getFieldValue },
      format,
    } = this.props;
    return (
      <Form layout="inline" style={{ marginBottom: 10 }}>
        <FormItem label={intl.get('entity.group.name').d('集团名称')}>
          {getFieldDecorator('groupName', {})(<Input />)}
        </FormItem>
        <FormItem
          label={intl.get('spfm.partnership.model.company.registerTimeFrom').d('注册时间从')}
        >
          {getFieldDecorator('registerTimeFrom')(
            <DatePicker
              disabledDate={currentDate =>
                getFieldValue('registerTimeTo') &&
                moment(getFieldValue('registerTimeTo')).isBefore(currentDate, 'day')
              }
              placeholder=""
              format={format}
            />
          )}
        </FormItem>
        <FormItem label={intl.get('spfm.partnership.model.company.registerTimeTo').d('注册时间至')}>
          {getFieldDecorator('registerTimeTo')(
            <DatePicker
              disabledDate={currentDate =>
                getFieldValue('registerTimeFrom') &&
                moment(getFieldValue('registerTimeFrom')).isAfter(currentDate, 'day')
              }
              placeholder=""
              format={format}
            />
          )}
        </FormItem>
        <FormItem label={intl.get('spfm.partnership.model.company.coreFlag').d('核心企业')}>
          {getFieldDecorator('coreFlag')(
            <Checkbox onChange={this.checkCoreFlag} checked={this.state.selectCoreFlag} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" onClick={this.queryByConditon}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.queryReset}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    return <div className="operation-btn">{this.renderForm()}</div>;
  }
}
