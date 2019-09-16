import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

export default class ListTable extends PureComponent {
  @Bind()
  onChange(pagination) {
    const { handleOnChange = e => e } = this.props;
    handleOnChange(pagination);
  }

  @Bind()
  setSelectedRows(selectedRowKeys, selectedRows) {
    const { handleSetSelectedRows = e => e } = this.props;
    handleSetSelectedRows(selectedRows);
  }

  render() {
    const {
      dataSource = [],
      pagination = {},
      loading = false,
      handleRedirectDetail = e => e,
      selectedRows = [],
    } = this.props;
    const columns = [
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.companyNum')
          .d('企业编码'),
        dataIndex: 'companyNum',
      },
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.companyName')
          .d('企业名称'),
        dataIndex: 'companyName',
        render: (text, record) => (
          <a onClick={() => handleRedirectDetail(record.companyId, record.processUser || 1)}>
            {text}
          </a>
        ),
      },
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.groupName')
          .d('集团'),
        dataIndex: 'groupName',
      },
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.domesticForeignRelation')
          .d('境内外关系'),
        dataIndex: 'domesticForeignRelation',
        render: text =>
          text === 1
            ? intl.get('hzero.common.status.yes').d('是')
            : intl.get('hzero.common.status.no').d('否'),
      },
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.unifiedSocialCode')
          .d('统一社会信用代码'),
        dataIndex: 'unifiedSocialCode',
      },
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.legalRepName')
          .d('法定代表人'),
        dataIndex: 'legalRepName',
      },
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.contactName')
          .d('默认联系人'),
        dataIndex: 'contactName',
      },
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.contactMail')
          .d('邮箱'),
        dataIndex: 'contactMail',
      },
      {
        title: intl
          .get('spfm.certificationApproval.model.certificationApproval.processDate')
          .d('申请时间'),
        dataIndex: 'processDate',
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedRows.map(n => n.companyActionId),
      onChange: this.setSelectedRows,
    };
    return (
      <Table
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={this.onChange}
        columns={columns}
        rowSelection={rowSelection}
        rowKey="companyActionId"
        bordered
      />
    );
  }
}
