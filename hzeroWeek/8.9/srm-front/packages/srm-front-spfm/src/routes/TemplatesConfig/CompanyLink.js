/**
 * CompanyLink - 企业链接
 * @date: 2019-6-21
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';

import EditTable from 'components/EditTable';
import Checkbox from 'components/Checkbox';

@Form.create({ fieldNameProp: null })
export default class CompanyLink extends PureComponent {
  state = {
    selectedRows: [],
    cancelFlag: false,
  };

  componentDidMount() {
    const { onClearRows } = this.props;
    if (onClearRows) onClearRows(this.handleClearSelectedRows);
  }

  /**
   * 保存选择行的数据
   * @param {Array} selectedRowKeys - 选中行主键
   * @param {Array} selectedRows - 选中行信息
   */
  @Bind()
  onSelectChange(_, selectedRows) {
    this.setState({
      selectedRows,
      cancelFlag: selectedRows.length > 0,
    });
  }

  @Bind()
  deleteSelectRows(selectedRows) {
    const { onDeleteSelectRows } = this.props;
    this.setState({
      cancelFlag: false,
    });
    onDeleteSelectRows(selectedRows);
  }

  render() {
    const {
      onCreateRow,
      onEditRow,
      onCancelRow,
      onDeleteRow, // 删除新建行
      companyLinkList = [],
    } = this.props;
    const { selectedRows, cancelFlag } = this.state;
    const columns = [
      {
        title: '链接名称',
        dataIndex: 'description',
        render: (text, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '链接名称',
                      }),
                    },
                  ],
                  initialValue: record.description,
                })(<Input />)}
              </Form.Item>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '二级门户域名地址',
        dataIndex: 'linkUrl',
        width: 200,
        render: (text, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('linkUrl', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '二级门户域名地址',
                      }),
                    },
                  ],
                  initialValue: record.linkUrl,
                })(<Input />)}
              </Form.Item>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        width: 80,
        dataIndex: 'enabledFlag',
        render: (_, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('enabledFlag', {
                  initialValue: record.enabledFlag,
                })(<Checkbox />)}
              </Form.Item>
            );
          } else {
            return (
              <Badge
                status={record.enabledFlag ? 'success' : 'error'}
                text={
                  record.enabledFlag
                    ? intl.get('hzero.common.status.enable').d('启用')
                    : intl.get('hzero.common.status.disable').d('禁用')
                }
              />
            );
          }
        },
      },
      {
        title: '操作',
        width: 150,
        dataIndex: 'edit',
        render: (_, record) => (
          <span className="action-link">
            {record._status === 'create' ? (
              <a
                onClick={() => {
                  onDeleteRow(record, 'companyLink');
                }}
              >
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            ) : record._status === 'update' ? (
              <a
                onClick={() => {
                  onCancelRow(record, 'companyLink');
                }}
              >
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            ) : (
              <a
                onClick={() => {
                  onEditRow(record, 'companyLink');
                }}
              >
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
          </span>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedRows.map(o => o.configItemId),
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: ['update', 'create'].includes(record._status),
      }),
    };
    return (
      <React.Fragment>
        <div style={{ margin: '8px 0 16px', textAlign: 'right' }}>
          <Button
            onClick={() => this.deleteSelectRows(selectedRows)}
            disabled={!cancelFlag}
            style={{ marginLeft: '8px' }}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
          {companyLinkList.length < 4 && (
            <Button
              type="primary"
              onClick={() => onCreateRow('companyLink')}
              style={{ marginLeft: '8px' }}
            >
              {intl.get('hzero.common.button.create').d('新增')}
            </Button>
          )}
        </div>
        <EditTable
          bordered
          rowKey="configItemId"
          pagination={false}
          dataSource={companyLinkList}
          columns={columns}
          rowSelection={rowSelection}
        />
      </React.Fragment>
    );
  }
}
