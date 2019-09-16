/**
 * BankInfo - 企业认证预览-银行信息
 * @date: 2018-12-19
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Table } from 'hzero-ui';

import { enableRender } from 'utils/renderer';

import ItemWrapper from './ItemWrapper';

export default class BankInfo extends React.PureComponent {
  render() {
    const { bankAccountList = [] } = this.props;
    const columns = [
      {
        title: '银行代码',
        dataIndex: 'bankCode',
      },
      {
        title: '银行名称',
        dataIndex: 'bankName',
      },
      {
        title: '开户行名称',
        dataIndex: 'bankBranchName',
      },
      {
        title: '账户名称',
        align: 'center',
        dataIndex: 'bankAccountName',
      },
      {
        title: '银行账户',
        dataIndex: 'bankAccountNum',
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
      <ItemWrapper title="银行信息">
        <Table
          bordered
          rowKey="companyBankAccountId"
          dataSource={bankAccountList}
          columns={columns}
          pagination={false}
        />
      </ItemWrapper>
    );
  }
}
