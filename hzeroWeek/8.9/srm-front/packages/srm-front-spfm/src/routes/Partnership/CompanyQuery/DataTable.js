/**
 * CompanyListTable -公司查询表格
 * @date: 2018-8-8
 * @author dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Table, Form } from 'hzero-ui';
import classnames from 'classnames';
import moment from 'moment';

import { enableRender } from 'utils/renderer';
import intl from 'utils/intl';
import { getDateTimeFormat } from 'utils/utils';

import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedInfo: null,
    };
  }

  groupTableEdit(record) {
    const { onHandleEditCompany } = this.props;
    onHandleEditCompany(record);
  }

  render() {
    const {
      companyDataSource,
      onHandleStandardTableChange,
      loading,
      companyPagination,
    } = this.props;
    const { sortedInfo } = this.state;
    const columns = [
      {
        title: intl.get('entity.company.code').d('公司编码'),
        dataIndex: 'companyNum',
        width: 100,
        sorter: (a, b) => a.companyNum - b.companyNum,
        sortOrder: sortedInfo === 'companyNum' && sortedInfo.order,
      },
      {
        title: intl.get('entity.company.name').d('公司名称'),
        dataIndex: 'companyName',
      },
      {
        title: intl.get('spfm.partnership.model.company.groupName').d('所属集团'),
        dataIndex: 'groupName',
        sorter: (a, b) => a.groupName - b.groupName,
        sortOrder: sortedInfo === 'groupName' && sortedInfo.order,
      },
      {
        title: intl.get('spfm.partnership.model.company.creationDate').d('注册时间'),
        dataIndex: 'creationDate',
        sorter: (a, b) => a.creationDate - b.creationDate,
        sortOrder: sortedInfo === 'creationDate' && sortedInfo.order,
        render: text => {
          return <span>{moment(text).format(getDateTimeFormat())}</span>;
        },
      },
      {
        title: intl.get('spfm.partnership.model.company.telephone').d('默认联系人手机'),
        dataIndex: 'mobilephone',
      },
      {
        title: intl.get('spfm.partnership.model.company.mail').d('默认联系人邮箱'),
        dataIndex: 'mail',
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        width: 80,
        dataIndex: 'enabledFlag',
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 80,
        dataIndex: 'error',
        render: (val, record) => (
          <a
            onClick={() => {
              this.groupTableEdit(record);
            }}
          >
            {intl.get('hzero.common.button.edit').d('编辑')}
          </a>
        ),
      },
    ];
    return (
      <Table
        bordered
        className={classnames(styles.table)}
        columns={columns}
        dataSource={companyDataSource.content || []}
        onChange={onHandleStandardTableChange}
        loading={loading}
        pagination={companyPagination}
      />
    );
  }
}
