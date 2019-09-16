/**
 * AddressInfo - 企业认证预览-地址信息
 * @date: 2018-12-19
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Table } from 'hzero-ui';

import { enableRender } from 'utils/renderer';

import ItemWrapper from './ItemWrapper';

export default class AddressInfo extends React.PureComponent {
  render() {
    const { addressList = [] } = this.props;
    const columns = [
      {
        title: '国家',
        dataIndex: 'countryName',
      },
      {
        title: '省/市',
        align: 'center',
        dataIndex: 'regionPathName',
      },
      {
        title: '详细地址',
        align: 'center',
        dataIndex: 'addressDetail',
      },
      {
        title: '邮政编码',
        align: 'center',
        dataIndex: 'postCode',
      },
      {
        title: '地址备注',
        align: 'center',
        dataIndex: 'description',
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
      <ItemWrapper title="地址信息">
        <Table
          bordered
          rowKey="companyAddressId"
          dataSource={addressList}
          columns={columns}
          pagination={false}
        />
      </ItemWrapper>
    );
  }
}
