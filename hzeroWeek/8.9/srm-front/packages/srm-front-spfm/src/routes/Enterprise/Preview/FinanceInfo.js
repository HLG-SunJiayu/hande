/**
 * FinanceInfo - 企业认证预览-财务信息
 * @date: 2018-12-19
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Table } from 'hzero-ui';

import ItemWrapper from './ItemWrapper';

export default class FinanceInfo extends React.PureComponent {
  render() {
    const { financeList = [] } = this.props;
    const columns = [
      {
        title: '年份',
        width: 120,
        dataIndex: 'year',
      },
      {
        title: '企业总资产(万元)',
        align: 'right',
        dataIndex: 'totalAssets',
      },
      {
        title: '总负债(万元)',
        align: 'right',
        dataIndex: 'totalLiabilities',
      },
      {
        title: '流动资产(万元)',
        align: 'right',
        dataIndex: 'currentAssets',
      },
      {
        title: '流动负债(万元)',
        align: 'right',
        dataIndex: 'currentLiabilities',
      },
      {
        title: '营业收入(万元)',
        align: 'right',
        dataIndex: 'revenue',
      },
      {
        title: '净利润(万元)',
        align: 'right',
        dataIndex: 'netProfit',
      },
      {
        title: '资产负载率',
        align: 'right',
        dataIndex: 'assetLiabilityRatio',
      },
      {
        title: '流动比率',
        align: 'right',
        dataIndex: 'currentRatio',
      },
      {
        title: '总资产收益率',
        align: 'right',
        dataIndex: 'totalAssetsEarningsRatio',
      },
    ];
    return (
      <ItemWrapper title="财务信息">
        <Table
          bordered
          rowKey="companyFinanceId"
          dataSource={financeList}
          columns={columns}
          pagination={false}
        />
      </ItemWrapper>
    );
  }
}
