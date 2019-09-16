/**
 * ContactPersonInfo - 企业认证预览-联系人信息
 * @date: 2018-12-18
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Table } from 'hzero-ui';

import { enableRender } from 'utils/renderer';

import ItemWrapper from './ItemWrapper';

export default class ContactPersonInfo extends React.PureComponent {
  render() {
    const { contactList = [] } = this.props;
    const columns = [
      {
        title: '姓名',
        width: 100,
        align: 'center',
        dataIndex: 'name',
      },
      {
        title: '性别',
        align: 'center',
        dataIndex: 'gender',
        render: val => {
          return val === 1 ? '男' : '女';
        },
      },
      {
        title: '邮箱',
        align: 'center',
        dataIndex: 'mail',
      },
      {
        title: '手机号码',
        align: 'center',
        dataIndex: 'mobilephone',
      },
      {
        title: '固定电话',
        align: 'center',
        dataIndex: 'telephone',
      },
      {
        title: '部门',
        align: 'center',
        dataIndex: 'department',
      },
      {
        title: '职位',
        align: 'center',
        dataIndex: 'position',
      },
      {
        title: '备注',
        align: 'center',
        dataIndex: 'description',
      },
      {
        title: '默认联系人',
        align: 'center',
        dataIndex: 'defaultFlag',
        render: enableRender,
      },
      {
        title: '启用',
        width: 80,
        align: 'center',
        dataIndex: 'enabledFlag',
        render: enableRender,
      },
    ];
    return (
      <ItemWrapper title="联系人信息">
        <Table
          bordered
          rowKey="companyContactId"
          dataSource={contactList}
          columns={columns}
          pagination={false}
        />
      </ItemWrapper>
    );
  }
}
