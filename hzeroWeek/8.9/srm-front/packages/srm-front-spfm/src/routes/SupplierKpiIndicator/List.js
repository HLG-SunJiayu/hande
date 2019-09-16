/**
 * List - 供应商绩效标准指标定义 - 列表组件
 * @date: 2018-7-4
 * @author: lijun <jun.li06@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Table, Icon } from 'hzero-ui';
import { sum } from 'lodash';
import intl from 'utils/intl';
import { enableRender } from 'utils/renderer';

// 设置sinv国际化前缀 - common - message
const modelPrompt = 'spfm.supplierKpiIndicator.model.supplierKpiIndicator';
// 设置sodr国际化前缀 - common - message
// const viewMessagePrompt = 'spfm.supplierKpiIndicator.view.message';
// 设置sinv国际化前缀 - view.title
const viewTitlePrompt = 'spfm.supplierKpiIndicator.view.title';
// 设置sinv国际化前缀 - view.button
const viewButtonPrompt = 'spfm.supplierKpiIndicator.view.button';

const commonPrompt = 'hzero.common';

/**
 * List - 供应商绩效标准指标定义 - 列表组件
 * @extends {Component} - React.Component
 * @reactProps {function} [ref= (e => e)] - react ref属性
 * @reactProps {boolean} [loading=false] - 表格处理状态
 * @reactProps {function} [onChange= (e => e)] - 表格onChange事件
 * @reactProps {object} [pagination={}] - 分页数据
 * @reactProps {Array<Object>} [dataSource=[]] - 表格数据源
 * @reactProps {object} [rowSelection={}] - 表格选择框配置
 * @return React.element
 */
export default class List extends PureComponent {
  constructor(props) {
    super(props);
    // 方法注册
    ['onCell', 'operiationRender', 'formulaConfigurationRender'].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  defaultTableRowKey = 'indicatorId';

  /**
   * onCell - 设置表格单元格属性函数
   */
  onCell() {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: 180,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      onClick: e => {
        const { target } = e;
        if (target.style.whiteSpace === 'normal') {
          target.style.whiteSpace = 'nowrap';
        } else {
          target.style.whiteSpace = 'normal';
        }
      },
    };
  }

  /**
   * operiationRender - 操作记录render方法
   * @param {String} text - 显示字段
   * @param {object} record - 当前行数据
   */
  operiationRender(text, record) {
    const {
      openIndicatorDetail = e => e,
      addChildIndicator = e => e,
      enable = e => e,
      actionRowKey,
    } = this.props;
    return (
      <span className="action-link">
        {record.enabledFlag === 1 && (
          <a onClick={() => addChildIndicator(record)}>
            {intl.get(`${viewButtonPrompt}.addChildIndicator`).d('新增下级指标')}
          </a>
        )}
        <a onClick={() => openIndicatorDetail(record)}>
          {intl.get(`${commonPrompt}.button.edit`).d('编辑')}
        </a>
        <a onClick={() => enable(record)}>
          {actionRowKey === record.indicatorId ? (
            <Icon type="loading" />
          ) : (
            intl
              .get(`${commonPrompt}.status.${record.enabledFlag === 1 ? 'disable' : 'enable'}`)
              .d(`${record.enabledFlag === 1 ? '禁用' : '启用'}`)
          )}
        </a>
      </span>
    );
  }

  /**
   * formulaConfigurationRender - 公式配置抽屉render方法
   * @param {String} text - 显示字段
   * @param {object} record - 当前行数据
   */
  formulaConfigurationRender(text, record) {
    const { formulaConfig = e => e } = this.props;
    return (
      (record.isNoChildren || record.isNoEnableChildren) &&
      record.scoreType === 'SYSTEM' &&
      record.enabledFlag === 1 && (
        <a onClick={() => formulaConfig(record)}>
          {intl.get(`${viewButtonPrompt}.formulaConfig`).d('公式配置')}
        </a>
      )
    );
  }

  render() {
    const {
      loading,
      onChange,
      pagination,
      dataSource,
      expandedRowKeys = [],
      onExpand = e => e,
    } = this.props;
    const tableProps = {
      dataSource,
      columns: [
        {
          title: intl.get(`${modelPrompt}.indicatorCode`).d('指标编码'),
          dataIndex: 'indicatorCode',
          width: 150,
          onCell: this.onCell,
        },
        {
          title: intl.get(`${modelPrompt}.indicatorName`).d('指标名称'),
          dataIndex: 'indicatorName',
          width: 150,
          onCell: this.onCell,
        },
        {
          title: intl.get(`${modelPrompt}.scoreType`).d('评分方式'),
          dataIndex: 'scoreTypeMeaning',
          width: 120,
          onCell: this.onCell,
        },
        {
          title: intl.get(`${modelPrompt}.score`).d('分值'),
          width: 240,
          children: [
            {
              title: intl.get(`${modelPrompt}.scoreFrom`).d('分值从'),
              width: 100,
              dataIndex: 'scoreFrom',
            },
            {
              title: intl.get(`${modelPrompt}.scoreTo`).d('分值至'),
              width: 100,
              dataIndex: 'scoreTo',
            },
          ],
        },
        {
          title: intl.get('hzero.common.status').d('状态'),
          dataIndex: 'enabledFlag',
          width: 100,
          render: enableRender,
        },
        {
          title: intl.get(`${commonPrompt}.table.column.option`).d('操作'),
          width: 200,
          render: this.operiationRender,
        },
        {
          title: intl.get(`${viewTitlePrompt}.formulaConfiguration`).d('公式配置'),
          width: 100,
          render: this.formulaConfigurationRender,
        },
      ],
      rowKey: this.defaultTableRowKey,
      bordered: true,
      loading,
      onChange,
      pagination,
      expandedRowKeys,
      onExpand,
    };
    tableProps.scroll = { x: sum(tableProps.columns.map(n => n.width)) };
    return <Table {...tableProps} />;
  }
}
