/*
 * Filename: d:\Fork\201907-B-Train\25785-孙佳钰\hzeroWeek\8.9\srm-front\packages\srm-front-sprm\src\routes\PurchaseRequisitionCreation\List.js
 * Path: d:\Fork\201907-B-Train\25785-孙佳钰\hzeroWeek\8.9\srm-front\packages\srm-front-sprm
 * Created Date: Tuesday, August 13th 2019, 9:05:57 am
 * Author: 25785
 * Copyright (c) 2019 Your Company
 */
import React, { Component } from 'react';
import { sum } from 'lodash';
import { Form } from 'hzero-ui';

import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { getUserOrganizationId } from 'utils/utils';

const FormItem = Form.Item;

export default class List extends Component {
  render() {
    const {
      onChange,
      loading,
      selectedRowKeys,
      onSearch,
      onOperationChange,
      dataSource = [],
      pagination = {},
    } = this.props;
    const columns = [
      {
        title: '状态',
        dataIndex: 'prStatusMeaning',
        width: '90',
      },
      {
        title: '采购申请编号',
        dataIndex: 'displayPrNum',
        width: '90',
      },
      {
        title: '公司',
        dataIndex: 'companyName',
        render: (value, record) =>
          ['update', 'create'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator('companyId', {
                initialValue: record.companyId,
                rules: [
                  {
                    required: true,
                    message: '公司不能为空',
                  },
                ],
              })(
                <Lov
                  code="SPRM.COMPANY"
                  textValue={value}
                  // lovOptions={{ displayField: 'companyNum', valueField: 'spfmCompanyId' }}
                />
              )}
            </FormItem>
          ) : (
            value
          ),
      },
      {
        title: '业务实体',
        dataIndex: 'ouName',
        width: '90',
        render: (value, record) =>
          ['update', 'create'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator('ouId', {
                initialValue: record.ouId,
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                ],
              })(<Lov code="SPRM.OU" textValue={value} />)}
            </FormItem>
          ) : (
            value
          ),
      },
      {
        title: '采购组织',
        dataIndex: 'purchaseOrgName',
        width: '90',
        render: (value, record) =>
          ['update', 'create'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator('purchaseOrgId', {
                initialValue: record.purchaseOrgId,
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                ],
              })(
                <Lov
                  queryParams={{ tenantId: getUserOrganizationId() }}
                  code="HPFM.PURCHASE_ORGANIZATION"
                />
              )}
            </FormItem>
          ) : (
            value
          ),
      },
      {
        title: '采购员',
        dataIndex: 'purchaseAgentName',
        width: '90',
        render: (value, record) =>
          ['update', 'create'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator('purchaseAgentId', {
                initialValue: record.purchaseOrgId,
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                ],
              })(
                <Lov
                  queryParams={{ tenantId: getUserOrganizationId() }}
                  code="SPRM.PURCHASE_AGENT"
                />
              )}
            </FormItem>
          ) : (
            value
          ),
      },
      {
        title: '操作记录',
        dataIndex: 'record',
        width: '90',
        render: (val, record) => <a onClick={() => onOperationChange(record)}>操作记录</a>,
      },
    ];
    const tableProps = {
      columns,
      loading,
      dataSource,
      pagination,
      rowSelection: {
        onChange,
        selectedRowKeys,
      },
      onChange: onSearch,
      bordered: true,
      rowKey: 'prHeaderId',
    };
    tableProps.scroll = { x: sum(tableProps.columns.map(n => n.width)) + 300 };
    return <EditTable {...tableProps} />;
  }
}
