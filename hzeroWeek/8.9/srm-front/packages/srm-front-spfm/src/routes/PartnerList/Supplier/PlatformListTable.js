import React, { PureComponent, Fragment } from 'react';
import { Table, Modal } from 'hzero-ui';
import intl from 'utils/intl';
import { enableRender, dateRender } from 'utils/renderer';
import { Bind } from 'lodash-decorators';

import SelectGroupDrawer from './SelectGroupDrawer';

export default class PlatformListTable extends PureComponent {
  state = {
    selectGroupVisible: false, // 选择分组
    selectedRows: {}, // 当前行
  };

  /**
   * 加入监控
   */
  @Bind()
  handleAddMonitor(record) {
    const { selectGroupVisible } = this.state;
    this.setState({
      selectGroupVisible: !selectGroupVisible,
      selectedRows: record,
    });
  }

  /**
   * 风险扫描
   */
  @Bind()
  handleRiskScan(record) {
    const { handleEmbedPage } = this.props;
    if (record.isMonitor) {
      handleEmbedPage(record);
    } else {
      const onOk = () => {
        handleEmbedPage(record);
      };
      Modal.confirm({
        title: intl
          .get(`spfm.supplier.model.supplier.platform.confirmMessage`)
          .d('该企业未加入监控，扫描将扣除扫描额度，确认扫描吗？'),
        onOk,
      });
    }
  }

  render() {
    const { selectGroupVisible, selectedRows } = this.state;
    const {
      rowKey,
      handleTableChange,
      dataSource,
      loading,
      pagination,
      toggleEnable,
      addMonitor = {},
      riskScan = {},
    } = this.props;
    const selectGroupProps = {
      selectGroupVisible,
      selectedRows,
      handleTableChange,
      handleClose: this.handleAddMonitor,
    };
    const columns = [
      {
        title: intl.get('spfm.supplier.model.supplier.platform.supplierCompanyNum').d('供应商编码'),
        width: 120,
        dataIndex: 'supplierCompanyNum',
      },
      {
        title: intl
          .get('spfm.supplier.model.supplier.platform.supplierCompanyName')
          .d('供应商名称'),
        width: 120,
        dataIndex: 'supplierCompanyName',
      },
      {
        title: intl
          .get('spfm.supplier.model.supplier.platform.supplierUnifiedSocialCode')
          .d('统一社会信用代码'),
        width: 130,
        dataIndex: 'supplierUnifiedSocialCode',
      },
      {
        title: intl.get('spfm.supplier.model.supplier.platform.startDate').d('合作开始日期'),
        width: 110,
        dataIndex: 'startDate',
        render: dateRender,
      },
      {
        title: intl.get('entity.company.tag').d('公司'),
        width: 200,
        dataIndex: 'customCompanyName',
      },
      {
        title: intl.get('spfm.supplier.model.supplier.platform.isErp').d('是否 ERP'),
        width: 100,
        dataIndex: 'isErp',
        render: value =>
          value
            ? intl.get('hzero.common.status.yes').d('是')
            : intl.get('hzero.common.status.no').d('否'),
      },
      {
        title: intl.get('spfm.supplier.model.supplier.platform.isMonitor').d('是否已加入监控'),
        width: 120,
        dataIndex: 'isMonitor',
        render: value =>
          value
            ? intl.get('hzero.common.status.yes').d('是')
            : intl.get('hzero.common.status.no').d('否'),
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        width: 100,
        dataIndex: 'enabledFlag',
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        render: (_, record) => {
          return (
            <a onClick={() => toggleEnable(record)}>
              {record.enabledFlag
                ? intl.get('hzero.common.status.disable').d('禁用')
                : intl.get('hzero.common.status.enable').d('启用')}
            </a>
          );
        },
      },
    ];

    // 配置中心启用就显示
    if (addMonitor.enabledFlag) {
      columns.splice(7, 0, {
        title: intl.get('spfm.supplier.model.supplier.platform.addMonitor').d('加入监控'),
        width: 100,
        dataIndex: 'isShowMonitor',
        render: (value, record) =>
          value ? (
            <a onClick={() => this.handleAddMonitor(record)}>
              {intl.get('spfm.supplier.model.supplier.platform.addMonitor').d('加入监控')}
            </a>
          ) : null,
      });
    }
    if (riskScan.enabledFlag) {
      columns.splice(7, 0, {
        title: intl.get('spfm.supplier.model.supplier.platform.riskScan').d('风险扫描'),
        width: 100,
        dataIndex: 'isShowScan',
        render: (value, record) =>
          value ? (
            <a onClick={() => this.handleRiskScan(record)}>
              {intl.get('spfm.supplier.model.supplier.platform.riskScan').d('风险扫描')}
            </a>
          ) : null,
      });
    }
    return (
      <Fragment>
        <Table
          bordered
          loading={loading}
          rowKey={rowKey}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={handleTableChange}
        />
        {selectGroupVisible && <SelectGroupDrawer {...selectGroupProps} />}
      </Fragment>
    );
  }
}
