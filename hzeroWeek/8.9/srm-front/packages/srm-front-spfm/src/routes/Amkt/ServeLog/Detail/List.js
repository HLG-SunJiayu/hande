/**
 * List.js - 服务开通记录明细-服务列表
 * @date: 2019-07-11
 * @author: WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */
import React from 'react';
import { Form, Button } from 'hzero-ui';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';

const promptCode = 'spfm.serveLog';

@Form.create({ fieldNameProp: null })
export default class List extends React.Component {
  render() {
    const {
      serveListLoading = false,
      detailDataSource,
      detailPagination,
      selectedRowKeys = [],
      rowDataSource,
      onRowSelectChange,
      onDelSeletedRows,
      onHandlePageChange,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${promptCode}.model.serveLog.serviceCode`).d('服务编码'),
        dataIndex: 'serviceCode',
        width: 340,
      },
      {
        title: intl.get(`${promptCode}.model.serveLog.serviceName`).d('服务名称'),
        dataIndex: 'serviceName',
        width: 340,
      },
      {
        title: intl.get(`${promptCode}.model.serveLog.partnerName`).d('服务提供商'),
        dataIndex: 'partnerName',
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: onRowSelectChange,
    };
    const tableProps = {
      loading: serveListLoading,
      columns,
      dataSource: detailDataSource,
      bordered: true,
      rowKey: 'requestLineId',
      pagination: detailPagination,
      onChange: page => onHandlePageChange(page),
      onDelSeletedRows,
    };
    if (rowDataSource.status === 'NEW') {
      tableProps.rowSelection = rowSelection;
    }
    return (
      <React.Fragment>
        {rowDataSource.status === 'NEW' ? (
          <div className="table-list-search" style={{ textAlign: 'right' }}>
            <Button
              onClick={onDelSeletedRows}
              disabled={selectedRowKeys.length === 0}
              style={{ marginRight: 8 }}
            >
              {intl.get('hzero.common.button.clean').d('清除')}
            </Button>
          </div>
        ) : null}
        <EditTable {...tableProps} />
      </React.Fragment>
    );
  }
}
