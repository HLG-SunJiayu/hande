/**
 * shoppingCart -合作伙伴管理 查询页
 * @date: 2019-7-4
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
// import { isEmpty, isUndefined } from 'lodash';
import { connect } from 'dva';
import { Button, Table } from 'hzero-ui';

import intl from 'utils/intl';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';

import FilterForm from './FilterForm';

const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'spfm.shoppingCart.view.message';

@connect(({ shoppingCart, loading }) => ({
  shoppingCart,
  loading,
  fetchSaveing: loading.effects['shoppingCart/fetchAddClientsRecord'],
  fetchLoading: loading.effects['shoppingCart/fetchList'],
}))
@formatterCollections({ code: ['spfm.shoppingCart'] })
export default class shoppingCart extends React.Component {
  form;

  selectedRowData = {};

  state = {
    tenantId: getCurrentOrganizationId(),
    selectedRowKeys: [],
  };

  componentDidMount() {
    this.fetchList({}, true);
  }

  /**
   * 绑定FilterForm
   */
  @Bind()
  bindForm(form) {
    this.form = form;
  }

  /**
   * fetchList
   */
  @Bind()
  fetchList(params = {}, search) {
    const { dispatch, shoppingCart: { pagination = {} } = {} } = this.props;
    const { tenantId } = this.state;
    const searchCondition = this.form ? filterNullValueObject(this.form.getFieldsValue()) : {};
    let current = {};
    if (search) {
      current = { current: 1 };
    }
    dispatch({
      type: 'shoppingCart/fetchList',
      payload: {
        page: { ...pagination, ...current },
        tenantId,
        ...searchCondition,
        ...params,
        crmTenant: tenantId,
      },
    });
  }

  /**
   * 删除
   */
  @Bind()
  handleDelete() {
    const { dispatch } = this.props;
    const { selectedRowKeys, tenantId } = this.state;
    dispatch({
      type: 'shoppingCart/deleteShoppingCart',
      payload: { selectedRowKeys, tenantId },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchList();
      }
    });
  }

  /**
   * 搜索
   */
  @Bind()
  handleSearch() {
    this.fetchList({}, true);
  }

  /**
   * 进入内页
   */
  @Bind()
  handleOpen() {
    const { history, dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const temData = Object.values(this.selectedRowData).filter(item =>
      selectedRowKeys.includes(item.cartId)
    );
    const selectedRowDataIdList = temData.map(n => n.serviceCode);
    const newList = new Set(selectedRowDataIdList);
    if (newList.size < selectedRowDataIdList.length) {
      notification.warning({ message: '服务重复' });
    } else {
      dispatch({
        type: 'shoppingCart/updateState',
        payload: { applicationList: { list: { content: temData } } },
      });
      history.push(`/spfm/amkt-appstore/application`);
    }
  }

  /**
   * 选择框
   * @param {*} selectedRowKeys
   */
  @Bind()
  onRowSelectChange(selectedRowKeys) {
    const {
      shoppingCart: {
        list: { content = [] },
      },
    } = this.props;
    content.forEach(item => {
      const { cartId } = item;
      if (selectedRowKeys.includes(cartId)) {
        this.selectedRowData[cartId] = item;
      }
    });
    // this.selectedRowData = content.filter(item => selectedRowKeys.includes(item.cartId));
    this.setState({ selectedRowKeys });
  }

  render() {
    const {
      fetchLoading,
      fetchSaveing,
      shoppingCart: { list = {}, pagination = {} },
    } = this.props;
    const { totalPages } = list;
    const { selectedRowKeys } = this.state;
    const columns = [
      {
        title: intl.get(`${viewMessagePrompt}.serviceTypeCode`).d('服务编码'),
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
    const fiterProps = {
      bindForm: this.bindForm,
      handleSearch: this.handleSearch,
    };
    const tableProps = {
      columns,
      dataSource: list.content,
      bordered: true,
      loading: fetchLoading || fetchSaveing,
      rowKey: 'cartId',
      pagination: {
        ...pagination,
        onChange: (current, pageSize) => {
          const newCurrent = current >= totalPages ? totalPages : current;
          this.fetchList({ page: { current: newCurrent, pageSize } });
        },
        onShowSizeChange: (current, pageSize) => {
          this.fetchList({ page: { current, pageSize } });
        },
      },
      rowSelection: {
        selectedRowKeys,
        onChange: this.onRowSelectChange,
      },
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`${viewMessagePrompt}.shoppingCart`).d('购物车')}
          backPath="/spfm/amkt-appstore/home"
        >
          <Button
            icon="plus"
            type="primary"
            onClick={this.handleOpen}
            disabled={!selectedRowKeys.length > 0}
          >
            {intl.get(`${viewMessagePrompt}.open`).d('开通')}
          </Button>
          <Button icon="delete" onClick={this.handleDelete} disabled={!selectedRowKeys.length > 0}>
            {intl.get(`${commonPrompt}.button.delete`).d('删除')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm {...fiterProps} />
          </div>
          <Table {...tableProps} />
        </Content>
      </React.Fragment>
    );
  }
}
