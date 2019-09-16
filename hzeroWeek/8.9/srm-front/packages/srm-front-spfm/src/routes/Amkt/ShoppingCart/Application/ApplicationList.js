/**
 * ClientManagement -客户端管理 查询页
 * @date: 2019-7-2
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import { Button, Table } from 'hzero-ui';

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';

const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'spfm.shoppingCart.view.message';

export default class ApplicationList extends React.Component {
  @Bind()
  handleDelete() {
    const { dispatch, selectedRowKeys, applicationList, handleSetState } = this.props;
    const {
      list: { content = [] },
    } = applicationList;
    dispatch({ type: 'shoppingCart/deleteApplicationList', payload: { selectedRowKeys } });
    if (content[0].requestLineId) {
      dispatch({
        type: 'shoppingCart/deleteApplicationListAsync',
        payload: {
          crmTenant: getCurrentOrganizationId(),
          lineIds: content
            .filter(item => selectedRowKeys.includes(item.partnerServiceId))
            .map(item => item.requestLineId),
        },
      });
      handleSetState({ selectedRowKeys: [] });
    }
  }

  render() {
    const { applicationList, selectedRowKeys, onRowSelectChange } = this.props;
    const { list = {} } = applicationList;
    const { content = [] } = list;
    const columns = [
      {
        title: intl.get(`${viewMessagePrompt}.serviceCode`).d('服务编码'),
        dataIndex: 'serviceCode',
        key: 'serviceCode',
        width: 240,
      },
      {
        title: intl.get(`${viewMessagePrompt}.serviceName`).d('服务名称'),
        dataIndex: 'serviceName',
        key: 'serviceName',
      },
      {
        title: intl.get(`${viewMessagePrompt}.partnerName`).d('服务提供商'),
        dataIndex: 'partnerName',
        key: 'partnerName',
      },
    ];
    const tableProps = {
      columns,
      dataSource: content,
      bordered: true,
      pagination: {
        // current: 1,
        // pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true,
        showTotal: (total, range) => {
          return `显示 ${range[0]} - ${range[1]} 共 ${total} 条`;
        },
        // total: content.length,
      },
      rowKey: 'partnerServiceId',
      rowSelection: {
        selectedRowKeys,
        onChange: onRowSelectChange,
      },
    };
    return (
      <React.Fragment>
        <div className="table-list-search" style={{ 'text-align': 'right' }}>
          <Button
            onClick={this.handleDelete}
            disabled={!(selectedRowKeys.length > 0)}
            type="primary"
          >
            {intl.get(`${commonPrompt}.button.clean`).d('清除')}
          </Button>
        </div>
        <Table {...tableProps} />
      </React.Fragment>
    );
  }
}
