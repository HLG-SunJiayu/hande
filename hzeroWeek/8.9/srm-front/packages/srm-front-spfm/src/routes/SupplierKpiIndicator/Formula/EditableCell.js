/**
 * EditableCell - 送货单创建明细页面 - 行内编辑可编辑单元格组件
 * @date: 2018-10-26
 * @author: lijun <jun.li06@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Input, Checkbox } from 'hzero-ui';
import { isFunction } from 'lodash';
import intl from 'utils/intl';
import Lov from 'components/Lov';

// FormItem组件初始化
const FormItem = Form.Item;
// Option组件初始化
// const { Option } = Select;

// 设置通用国际化前缀
const commonPrompt = 'hzero.common';
// 设置sinv国际化前缀 - common - message
const modelPrompt = 'spfm.supplierKpiIndicator.model.supplierKpiIndicator';

/**
 * EditableCell - 送货单创建明细页面 - 行内编辑可编辑单元格组件
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {object} contextProvider - Context.Provider
 * @return React.element
 */
export default class EditableCell extends PureComponent {
  constructor(props) {
    super(props);

    // 方法注册
    ['getFormItem'].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  /**
   * getFormItem 设置formItem子组件
   */
  getFormItem() {
    const {
      dataIndex,
      title,
      record,
      contextConsumer,
      children,
      editable,
      status,
      // kpiScoreTypeCode = [],
      render,
      ...restProps
    } = this.props;
    const WrapperContextConsumer = contextConsumer;
    const defaultFormItems = {
      remark: () => (
        <WrapperContextConsumer>
          {(form = {}) => {
            const { getFieldDecorator = e => e } = form || {};
            return (
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  initialValue: record[dataIndex],
                  rules: [
                    {
                      max: 480,
                      message: intl.get('hzero.common.validation.max', {
                        max: 480,
                      }),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            );
          }}
        </WrapperContextConsumer>
      ),
      serviceCode: () => (
        <WrapperContextConsumer>
          {(form = {}) => {
            const { getFieldDecorator = e => e } = form || {};
            return (
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  initialValue: record[dataIndex],
                  rules: [
                    {
                      required: true,
                      message: intl
                        .get(`${commonPrompt}.validation.notNull`, { name: title })
                        .d(`${title}不能为空`),
                    },
                  ],
                })(<Lov code="SPFM.KPI_FORMULA_SERVICE" textValue={record.serviceName} />)}
              </FormItem>
            );
          }}
        </WrapperContextConsumer>
      ),
      formulaUrl: () => (
        <WrapperContextConsumer>
          {(form = {}) => {
            const { getFieldDecorator = e => e } = form || {};
            return (
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  initialValue: record[dataIndex],
                  rules: [
                    {
                      required: true,
                      message: intl
                        .get(`${commonPrompt}.validation.notNull`, {
                          name: intl.get(`${modelPrompt}.formulaUrl`).d('URL'),
                        })
                        .d(`${intl.get(`${modelPrompt}.formulaUrl`).d('URL')}不能为空`),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            );
          }}
        </WrapperContextConsumer>
      ),
      enabledFlag: () => (
        <WrapperContextConsumer>
          {(form = {}) => {
            const { getFieldDecorator = e => e } = form || {};
            const initialValue =
              record[dataIndex] === null || record[dataIndex] === undefined ? 1 : record[dataIndex];
            return (
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  initialValue: initialValue === 1,
                })(<Checkbox />)}
              </FormItem>
            );
          }}
        </WrapperContextConsumer>
      ),
    };

    return (
      <td {...restProps}>
        {dataIndex && defaultFormItems[dataIndex] && contextConsumer
          ? editable
            ? defaultFormItems[dataIndex]()
            : isFunction(render)
            ? render(record[dataIndex])
            : record[dataIndex]
          : children}
      </td>
    );
  }

  render() {
    return this.getFormItem();
  }
}
