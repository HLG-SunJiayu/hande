/*
 * Filename: d:\Fork\201907-B-Train\25785-孙佳钰\hzeroWeek\8.9\srm-front\packages\srm-front-sprm\src\routes\PurchaseRequisitionCreation\index.js
 * Path: d:\Fork\201907-B-Train\25785-孙佳钰\hzeroWeek\8.9\srm-front\packages\srm-front-sprm
 * Created Date: Monday, August 12th 2019, 7:55:00 pm
 * Author: 25785
 *
 * Copyright (c) 2019 Your Company
 */
import React, { Component, Fragment } from 'react';
import { Button, notification } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';

import { Header, Content } from 'components/Page';
import { getEditTableData } from 'utils/utils';

import Search from './Search';
import List from './List';
import OperationRecord from '../components/OperationRecord';

@connect(({ purchaseRequisitionCreation, loading }) => ({
  purchaseRequisitionCreation,
  fetchListLoading: loading.effects['purchaseRequisitionCreation/fetchList'],
}))
export default class PurchaseRequisitionCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      prHeaderId: undefined,
    };
  }

  searchForm;

  componentDidMount() {
    this.handleSearch();
    this.handleSearchEnum();
  }

  //     @Bind()
  //     handleSearch(page={}) {
  //       const { dispatch } = this.props;
  //       const fieldsValue=this.searchForm ? this.searchForm.getFieldsValue() :{},
  //       dispatch({
  //         type: ''
  //       })
  //       //   dispatch({
  //       //      type: 'purchaseRequisitionCreation/fetchList',
  //       //      payload: {
  //       //          page,
  //       //          ...fieldsValue.
  //       //      }
  //       //  });
  // }
  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const filesValue = this.searchForm ? this.searchForm.getFieldsValue() : {};
    dispatch({
      type: 'purchaseRequisitionCreation/fetchList',
      payload: {
        page,
        ...filesValue,
      },
    });
  }

  @Bind()
  handleSearchEnum() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseRequisitionCreation/handleSearchEnum',
    });
  }

  @Bind()
  handleChangeTable(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  @Bind()
  handleAdd() {
    const {
      dispatch,
      purchaseRequisitionCreation: { dataSource = [] },
    } = this.props;
    dispatch({
      type: 'purchaseRequisitionCreation/updateState',
      payload: {
        dataSource: [{ _status: 'create', prHeaderId: uuid() }, ...dataSource],
      },
    });
  }

  @Bind()
  handleDel() {
    const { selectedRowKeys } = this.state;
    const {
      dispatch,
      purchaseRequisitionCreation: { dataSource = [] },
    } = this.props;
    // 拿到前端想要保留的数据
    const frontDeleteRows = dataSource.filter(
      item => !(item._status === 'create' && selectedRowKeys.includes(item.prHeaderId))
    );
    dispatch({
      type: 'purchaseRequisitionCreation/updateState',
      payload: {
        dataSource: frontDeleteRows,
      },
    });
    // 拿到后端

    const deleteRows = dataSource.filter(
      item => item._status === 'update' && selectedRowKeys.includes(item.prHeaderId)
    );
    dispatch({
      type: 'purchaseRequisitionCreation/delete',
      payload: {
        dataSource: deleteRows,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }

  @Bind()
  handleUpdate() {
    const {
      dispatch,
      purchaseRequisitionCreation: { dataSource = [] },
    } = this.props;
    const newDataSource = getEditTableData(dataSource, ['prHeaderId']); // 有一行校验没通过就会返回空数组
    if (newDataSource.length) {
      dispatch({
        type: 'purchaseRequisitionCreation/handleAddHeader',
        payload: {
          prHeaderCreateDTO: newDataSource[0],
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  @Bind()
  handleOperationChange(record) {
    this.setState({ visible: true, prHeaderId: record.prHeaderId });
  }

  @Bind()
  handleSearchRecord(page = {}) {
    const { prHeaderId } = this.props;
    const { dispatch } = this.props;
    return dispatch({
      type: 'purchaseRequisitionCreation/handleSearchRecord',
      payload: {
        page,
        prHeaderId,
      },
    });
  }

  render() {
    const { selectedRowKeys, visible, prHeaderId } = this.state;
    const {
      fetchListLoading,
      purchaseRequisitionCreation: { dataSource = [], pagination = {}, enumMap = {} },
    } = this.props;

    const searchProps = {
      enumMap,
      onSearch: this.handleSearch,
      onRef: node => {
        this.searchForm = node.props.form;
      },
    };
    const listProps = {
      dataSource,
      pagination,
      selectedRowKeys,
      onOperationChange: this.handleOperationChange,
      onSearch: this.handleSearch,
      loading: fetchListLoading,
      onChange: this.handleChangeTable,
    };
    const operationRecordProps = {
      visible,
      prHeaderId,
      onSearchRecord: this.handleSearchRecord,
      onCancel: () => this.setState({ visible: false }),
    };
    return (
      <Fragment>
        <Header title="需求创建">
          <Button onClick={this.handleDel}>删除</Button>
          <Button icon="save" onClick={this.handleUpdate}>
            保存
          </Button>
          <Button onClick={this.handleAdd} type="primary" icon="plus">
            新建
          </Button>
        </Header>
        <Content>
          <Search {...searchProps} />
          <List {...listProps} />
          {visible && <OperationRecord {...operationRecordProps} />}
        </Content>
      </Fragment>
    );
  }
}
