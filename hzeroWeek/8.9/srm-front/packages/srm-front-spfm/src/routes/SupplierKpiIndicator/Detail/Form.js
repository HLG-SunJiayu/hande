/**
 * Search - 我发出的订单 - 明细页面表格
 * @date: 2019-01-21
 * @author: lijun <jun.li06@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Select } from 'hzero-ui';
import { isNumber, isNaN } from 'lodash';
import intl from 'utils/intl';
import Lov from 'components/Lov';

// Option组件初始化
const { Option } = Select;

// // 设置sinv国际化前缀 - view.title
// const viewTitlePrompt = 'spfm.supplierKpiIndicator.view.title';
// // 设置sinv国际化前缀 - view.button
// const viewButtonPrompt = 'spfm.supplierKpiIndicator.view.button';
// 设置sinv国际化前缀 - common - message
const modelPrompt = 'spfm.supplierKpiIndicator.model.supplierKpiIndicator';

// 设置通用国际化前缀
const commonPrompt = 'hzero.common';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
export default class Search extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator = e => e },
      dataSource: {
        indicatorId,
        indicatorCode,
        indicatorName,
        scoreType,
        scoreFrom,
        scoreTo,
        parentIndicatorId,
        parentIndicatorName,
        isNoEnableChildren = true,
      },
      status,
      scoreTypeCode = [],
    } = this.props;
    const editable = isNumber(indicatorId) && !isNaN(indicatorId) && status === 'edit';
    return (
      <Form>
        <FormItem
          label={intl.get(`${modelPrompt}.parentIndicatorName`).d('父级指标')}
          {...formLayout}
        >
          {getFieldDecorator('parentIndicatorId', {
            initialValue: parentIndicatorId || -1,
          })(
            <Lov
              code="SPFM.KPI_INDICATOR"
              disabled={status !== 'edit'}
              textValue={
                parentIndicatorName || intl.get(`${modelPrompt}.parentIndicatorRoot`).d('根节点')
              }
              queryParams={{ limitNodeId: indicatorId }}
            />
          )}
        </FormItem>
        <FormItem label={intl.get(`${modelPrompt}.indicatorCode`).d('指标编码')} {...formLayout}>
          {getFieldDecorator('indicatorCode', {
            initialValue: indicatorCode,
            rules: [
              {
                required: true,
                message: intl
                  .get(`${commonPrompt}.validation.notNull`, {
                    name: intl.get(`${modelPrompt}.indicatorCode`).d('指标编码'),
                  })
                  .d(`${intl.get(`${modelPrompt}.indicatorCode`).d('指标编码')}不能为空`),
              },
              {
                max: 29,
                message: intl.get('hzero.common.validation.max', {
                  max: 30,
                }),
              },
            ],
          })(<Input inputChinese={false} disabled={editable} />)}
        </FormItem>
        <FormItem label={intl.get(`${modelPrompt}.indicatorName`).d('指标名称')} {...formLayout}>
          {getFieldDecorator('indicatorName', {
            initialValue: indicatorName,
            rules: [
              {
                required: true,
                message: intl
                  .get(`${commonPrompt}.validation.notNull`, {
                    name: intl.get(`${modelPrompt}.indicatorName`).d('指标名称'),
                  })
                  .d(`${intl.get(`${modelPrompt}.indicatorName`).d('指标名称')}不能为空`),
              },
              {
                max: 240,
                message: intl.get('hzero.common.validation.max', {
                  max: 240,
                }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label={intl.get(`${modelPrompt}.scoreType`).d('评分方式')} {...formLayout}>
          {getFieldDecorator('scoreType', {
            initialValue: scoreType,
            rules: [
              {
                required: true,
                message: intl
                  .get(`${commonPrompt}.validation.notNull`, {
                    name: intl.get(`${modelPrompt}.scoreType`).d('评分方式'),
                  })
                  .d(`${intl.get(`${modelPrompt}.scoreType`).d('评分方式')}不能为空`),
              },
            ],
          })(
            <Select disabled={!isNoEnableChildren} allowClear>
              {scoreTypeCode.map(n => (
                <Option key={n.value} value={n.value}>
                  {n.meaning}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label={intl.get(`${modelPrompt}.scoreFrom`).d('分值从')} {...formLayout}>
          {getFieldDecorator('scoreFrom', {
            initialValue: scoreFrom,
            rules: [
              {
                required: true,
                message: intl
                  .get(`${commonPrompt}.validation.notNull`, {
                    name: intl.get(`${modelPrompt}.scoreFrom`).d('分值从'),
                  })
                  .d(`${intl.get(`${modelPrompt}.scoreFrom`).d('分值从')}不能为空`),
              },
            ],
          })(<InputNumber disabled={!isNoEnableChildren} precision={2} min={0} step={0.01} />)}
        </FormItem>
        <FormItem label={intl.get(`${modelPrompt}.scoreFrom`).d('分值至')} {...formLayout}>
          {getFieldDecorator('scoreTo', {
            initialValue: scoreTo,
            rules: [
              {
                required: true,
                message: intl
                  .get(`${commonPrompt}.validation.notNull`, {
                    name: intl.get(`${modelPrompt}.scoreTo`).d('分值至'),
                  })
                  .d(`${intl.get(`${modelPrompt}.scoreTo`).d('分值至')}不能为空`),
              },
            ],
          })(<InputNumber disabled={!isNoEnableChildren} precision={2} min={0} step={0.01} />)}
        </FormItem>
      </Form>
    );
  }
}
