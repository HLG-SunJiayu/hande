/**
 * PurchaseFinance - 供应商地址
 * @date: 2019-01-09
 * @author: YKK <kaikai.yang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { enableRender } from 'utils/renderer';
import { Content, Header } from 'components/Page';

const promptCode = 'spfm.importErp';

@connect(({ importErp, loading }) => ({
  importErp,
  loading: loading.effects['importErp/querySupplierAddress'],
}))
@formatterCollections({ code: 'spfm.importErp' })
export default class SupplierAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.handleSearch();
  }

  componentWillUnmount() {
    this.closeSearch();
  }

  /**
   * 供应商地址查询
   * @param {object} page - 查询参数
   */
  @Bind()
  handleSearch(page = {}) {
    const {
      dispatch,
      modalRecord: { supplierSyncId },
    } = this.props;
    dispatch({
      type: 'importErp/querySupplierAddress',
      payload: {
        page,
        supplierSyncId,
      },
    });
  }

  @Bind()
  closeSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'importErp/updateState',
      payload: {
        supplierAddressPagination: {},
        supplierAddressList: {}, // 缓存的数据要清空
      },
    });
  }

  /**
   * render查询表单
   */
  render() {
    const {
      loading,
      importErp: { supplierAddressList = {}, supplierAddressPagination = {} },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${promptCode}.model.importErp.countryId`).d('国家'),
        dataIndex: 'countryName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.model.importErp.regionName`).d('地区'),
        dataIndex: 'regionName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.model.importErp.cityName`).d('城市'),
        dataIndex: 'cityName',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.model.importErp.address`).d('详细地址'),
        dataIndex: 'address',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.model.importErp.zipCode`).d('邮编'),
        dataIndex: 'zipCode',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.model.importErp.enabledFlag`).d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
        render: enableRender,
      },
    ];
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.model.importErp.supplierAddress`).d('供应商地址')} />
        <Content>
          <Table
            loading={loading}
            dataSource={supplierAddressList.content}
            pagination={supplierAddressPagination}
            rowKey="supplierSyncAddressId"
            onChange={this.handleSearch}
            columns={columns}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
