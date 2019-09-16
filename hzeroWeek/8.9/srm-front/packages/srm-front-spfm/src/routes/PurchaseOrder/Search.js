/*
 * Search - 采购订单查询表单
 * @date: 2018/09/17 15:40:00
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { Form, Select, Input, Button } from 'hzero-ui';
import { map } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

const promptCode = 'spfm.purchaseOrder';
const { Option } = Select;
const FormItem = Form.Item;
@Form.create({ fieldNameProp: null })
export default class Search extends PureComponent {
  @Bind()
  handleSearch() {
    const { onFilterChange, form } = this.props;
    const values = form.getFieldsValue();
    if (onFilterChange) {
      onFilterChange(values);
    }
  }

  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const enabledFlagArr = [
      { value: 0, meaning: intl.get('hzero.common.status.disable').d('禁用') },
      { value: 1, meaning: intl.get('hzero.common.status.enable').d('启用') },
    ];
    return (
      <Fragment>
        <Form layout="inline">
          <FormItem
            label={intl
              .get(`${promptCode}.model.purchaseOrder.orderTypeCode`)
              .d('采购订单类型编码')}
          >
            {getFieldDecorator('orderTypeCode')(
              <Input typeCase="upper" trim inputChinese={false} />
            )}
          </FormItem>
          <FormItem
            label={intl
              .get(`${promptCode}.model.purchaseOrder.orderTypeName`)
              .d('采购订单类型名称')}
          >
            {getFieldDecorator('orderTypeName')(<Input />)}
          </FormItem>
          <FormItem label={intl.get(`${promptCode}.model.purchaseOrder.enabledFlag`).d('是否启用')}>
            {getFieldDecorator('enabledFlag')(
              <Select style={{ width: 150 }} allowClear>
                {map(enabledFlagArr, e => {
                  return (
                    <Option value={e.value} key={e.value}>
                      {e.meaning}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button data-code="search" type="primary" htmlType="submit" onClick={this.handleSearch}>
              {intl.get(`hzero.common.button.search`).d('查询')}
            </Button>
            <Button data-code="reset" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {intl.get(`hzero.common.button.reset`).d('重置')}
            </Button>
          </FormItem>
        </Form>
      </Fragment>
    );
  }
}
