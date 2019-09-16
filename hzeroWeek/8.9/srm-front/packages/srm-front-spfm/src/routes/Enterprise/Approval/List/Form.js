import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, Button } from 'hzero-ui';
import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
export default class QueryForm extends PureComponent {
  constructor(props) {
    super(props);
    // 方法注册
    ['setDisabledDateFrom', 'setDisabledDateTo', 'onClick', 'onReset'].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  onClick() {
    const {
      handleQueryList = e => e,
      form: { getFieldsValue = e => e },
    } = this.props;
    const data = getFieldsValue() || {};
    handleQueryList(data);
  }

  onReset() {
    const {
      handleQueryList = e => e,
      form: { resetFields = e => e },
    } = this.props;
    const params = { page: 0, size: 10 };
    resetFields();
    handleQueryList(params);
  }

  setDisabledDateFrom(currentDate) {
    const {
      form: { getFieldValue = e => e },
    } = this.props;
    const processDateTo = getFieldValue('processDateTo');
    return (
      currentDate &&
      processDateTo &&
      moment(currentDate.format(`${DEFAULT_DATE_FORMAT} 00:00:00`)).valueOf() >
        moment(processDateTo.format(`${DEFAULT_DATE_FORMAT} 00:00:00`)).valueOf()
    );
  }

  setDisabledDateTo(currentDate) {
    const {
      form: { getFieldValue = e => e },
    } = this.props;
    const processDateFrom = getFieldValue('processDateFrom');
    return (
      currentDate &&
      processDateFrom &&
      moment(currentDate.format(`${DEFAULT_DATE_FORMAT} 00:00:00`)).valueOf() <
        moment(processDateFrom.format(`${DEFAULT_DATE_FORMAT} 00:00:00`)).valueOf()
    );
  }

  render() {
    const {
      form: { getFieldDecorator = e => e },
      processing = {},
    } = this.props;
    return (
      <Form layout="inline">
        <FormItem
          label={intl
            .get('spfm.certificationApproval.model.certificationApproval.companyName')
            .d('企业名称')}
        >
          {getFieldDecorator('companyName')(<Input />)}
        </FormItem>
        <FormItem
          label={intl
            .get('spfm.certificationApproval.model.certificationApproval.processDateFrom')
            .d('提交时间从')}
        >
          {getFieldDecorator('processDateFrom')(
            <DatePicker placeholder={null} disabledDate={this.setDisabledDateFrom} />
          )}
        </FormItem>
        <FormItem
          label={intl
            .get('spfm.certificationApproval.model.certificationApproval.processDateTo')
            .d('提交时间至')}
        >
          {getFieldDecorator('processDateTo')(
            <DatePicker placeholder={null} disabledDate={this.setDisabledDateTo} />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            disabled={processing.approval}
            onClick={this.onClick}
            htmlType="submit"
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.onReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
        </FormItem>
      </Form>
    );
  }
}
