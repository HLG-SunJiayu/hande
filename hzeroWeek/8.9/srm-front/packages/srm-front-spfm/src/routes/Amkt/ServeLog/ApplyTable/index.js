/**
 * index.js - 服务申请单
 * @date: 2019-07-10
 * @author: WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';

import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { DATETIME_MIN, DATETIME_MAX } from 'utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

import FilterForm from './FilterForm';

/**
 * 服务申请单
 * @extends {Component} - ApplyTable
 * @reactProps {Object} serveLog - 数据源
 * @reactProps {Boolean} loading - 数据加载是否完成
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
const organizationId = getCurrentOrganizationId();
const promptCode = 'spfm.serveLog';

@connect(({ loading = {}, serveLog = {} }) => ({
  loading: loading.effects['serveLog/applyQueryList'],
  serveLog,
}))
@formatterCollections({ code: ['spfm.serveLog'] })
export default class ApplyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchList(); // 查询数据
    this.getStatusEnumMa(); // 获取状态值集
  }

  /**
   * fetchList - 查询数据
   * @param {object} params - 查询条件
   * @param {object} page - 分页参数
   */
  @Bind()
  fetchList(page = {}) {
    const { dispatch } = this.props;
    const params = {
      crmTenant: organizationId,
    };
    const filterValues = isUndefined(this.filterForm)
      ? {}
      : filterNullValueObject(this.filterForm.getFieldsValue());
    const { requestDateFrom, requestDateTo, ...otherFilter } = filterValues;
    dispatch({
      type: 'serveLog/applyQueryList',
      payload: {
        ...otherFilter,
        ...params,
        requestDateFrom: requestDateFrom ? requestDateFrom.format(DATETIME_MIN) : undefined,
        requestDateTo: requestDateTo ? requestDateTo.format(DATETIME_MAX) : undefined,
        page,
      },
    });
  }

  /**
   * 获取状态值集
   */
  @Bind()
  getStatusEnumMa() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serveLog/statusEnumMap',
    });
  }

  /**
   * 编辑
   */
  @Bind()
  handleEdit(record) {
    const { onGoDetail } = this.props;
    onGoDetail(record);
  }

  render() {
    const { loading = false, serveLog } = this.props;
    const { applyPagination = {}, applyDataSource = [], statusEnumMap = {} } = serveLog;
    const fiterProps = {
      onRef: node => {
        this.filterForm = node.props.form;
      },
      onSearch: this.fetchList,
      statusEnumMap,
    };
    const columns = [
      {
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'statusMeaning',
      },
      {
        title: intl.get(`${promptCode}.model.serveLog.requestNumber`).d('申请编码'),
        dataIndex: 'requestNumber',
        render: (text, record) => {
          return <a onClick={() => this.handleEdit(record)}>{record.requestNumber}</a>;
        },
      },
      {
        title: intl.get(`${promptCode}.model.serveLog.requestUser`).d('申请人'),
        dataIndex: 'requestUser',
      },
      {
        title: intl.get(`${promptCode}.model.serveLog.requestDate`).d('申请日期'),
        dataIndex: 'requestDate',
      },
    ];
    return (
      <React.Fragment>
        <div className="table-list-search">
          <FilterForm {...fiterProps} />
        </div>
        <Table
          bordered
          rowKey="requestHeaderId"
          loading={loading}
          dataSource={applyDataSource}
          columns={columns}
          pagination={applyPagination}
          onChange={this.fetchList}
        />
      </React.Fragment>
    );
  }
}
