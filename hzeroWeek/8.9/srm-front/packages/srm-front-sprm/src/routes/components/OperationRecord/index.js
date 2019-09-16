/*
 * Filename: d:\Fork\201907-B-Train\25785-孙佳钰\hzeroWeek\8.9\srm-front\packages\srm-front-sprm\src\routes\components\OperationRecord\index.js
 * Path: d:\Fork\201907-B-Train\25785-孙佳钰\hzeroWeek\8.9\srm-front\packages\srm-front-sprm
 * Created Date: Wednesday, August 14th 2019, 9:49:47 am
 * Author: 25785
 *
 * Copyright (c) 2019 Your Company
 */
import React, { Component } from 'react';
import { Modal, Table } from 'hzero-ui';

import { createPagination } from 'utils/utils';

export default class OperationRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      dataSource: [],
    };
  }

  componentDidMount() {
    const { onSearchRecord } = this.props;
    onSearchRecord().then(res => {
      if (res) {
        this.setState({
          dataSource: res.content,
          pagination: createPagination(res),
        });
        console.log('渲染了');
      }
    });
  }

  render() {
    const { pagination, dataSource } = this.state;
    const { visible, onCancel, onSearchRecord } = this.props;
    const columns = [
      {
        title: '操作人',
        dataIndex: 'processUserName',
        width: 90,
      },
      {
        title: '操作时间',
        dataIndex: 'processDate',
        width: 90,
      },
    ];
    const tableProps = {
      columns,
      // loading,
      dataSource,
      pagination,
      // onChange: onSearch,
      bordered: true,
    };
    const modalProps = {
      visible,
      onCancel,
      title: '操作记录',
    };
    return (
      <Modal {...modalProps}>
        <Table {...tableProps} />
      </Modal>
    );
  }
}
