/**
 * index.js - 已开通服务
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

import intl from 'utils/intl';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

import FilterForm from './FilterForm';

/**
 * 已开通服务
 * @extends {Component} - DredgeTable
 * @reactProps {Object} serveLog - 数据源
 * @reactProps {Boolean} loading - 数据加载是否完成
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
const organizationId = getCurrentOrganizationId();
const promptCode = 'spfm.serveLog';

@connect(({ loading = {}, serveLog = {} }) => ({
  loading: loading.effects['serveLog/dredgeQueryList'],
  serveLog,
}))
@formatterCollections({ code: ['spfm.serveLog'] })
export default class dredgeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchList(); // 查询数据
  }

  /**
   * 查询数据
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
    dispatch({
      type: 'serveLog/dredgeQueryList',
      payload: {
        ...filterValues,
        ...params,
        page,
      },
    });
  }

  render() {
    const { loading = false, serveLog } = this.props;
    const { DredgePagination = {}, DredgeDataSource = [] } = serveLog;
    const fiterProps = {
      onRef: node => {
        this.filterForm = node.props.form;
      },
      onSearch: this.fetchList,
    };
    const columns = [
      {
        title: intl.get(`${promptCode}.model.serveLog.serviceCode`).d('服务编码'),
        dataIndex: 'serviceCode',
        width: 400,
      },
      {
        title: intl.get(`${promptCode}.model.serveLog.serviceName`).d('服务名称'),
        dataIndex: 'serviceName',
      },
      {
        title: intl.get(`${promptCode}.model.serveLog.partnerName`).d('服务提供商'),
        dataIndex: 'partnerName',
      },
      {
        title: intl.get(`${promptCode}.model.serveLog.creationDate`).d('开通时间'),
        dataIndex: 'creationDate',
        width: 180,
      },
    ];
    return (
      <React.Fragment>
        <div className="table-list-search">
          <FilterForm {...fiterProps} />
        </div>
        <Table
          bordered
          rowKey="requestLineId"
          loading={loading}
          dataSource={DredgeDataSource}
          columns={columns}
          pagination={DredgePagination}
          onChange={this.fetchList}
        />
      </React.Fragment>
    );
  }
}
