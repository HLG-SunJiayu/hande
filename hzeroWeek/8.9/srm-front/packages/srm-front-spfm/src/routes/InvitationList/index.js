/*
 * InvitationList - 企业邀约汇总页面
 * @date: 2018/08/07 14:54:51
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'hzero-ui';
import querystring from 'querystring';
import PropTypes from 'prop-types';
import { isEmpty, isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import pathToRegex from 'path-to-regexp';

import { filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { openTab, menuTabEventManager } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
import { DATETIME_MIN } from 'utils/constants';
import { Content } from 'components/Page';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

/**
 * 企业邀约汇总页面
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} invitationList - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
const messagePrompt = 'spfm.invitationList.view.message';
const { TabPane } = Tabs;
@connect(({ loading, invitationList }) => ({
  loading: loading.effects['invitationList/fetchInviteList'],
  invitationList,
}))
@formatterCollections({ code: ['spfm.invitationList', 'entity.company'] })
export default class InvitationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'send',
    };
  }

  static propTypes = {
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    dispatch: e => e,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'invitationList/init',
    });
    this.handleSearchEmit();
    // 监听该页面关闭tab是否刷新
    menuTabEventManager.on('close', this.handleMenuTabClose);
  }

  componentWillUnmount() {
    menuTabEventManager.off('close', this.handleMenuTabClose);
  }

  /**
   * 刷新页面
   * @param {Object} param0
   */
  @Bind()
  handleMenuTabClose({ tabKey }) {
    if (pathToRegex('/spfm/dispose-invite/:inviteId').test(tabKey)) {
      this.handleTabsChange(this.state.activeKey);
    }
  }

  /**
   * 查询发出的邀约汇总列表
   * @param {Object} page - 查询字段
   */
  @Bind()
  handleSearchEmit(page = {}) {
    const { dispatch } = this.props;
    const { startDate, endDate, ...otherFields } = isUndefined(this.emitForm)
      ? {}
      : filterNullValueObject(this.emitForm.getFieldsValue());
    dispatch({
      type: 'invitationList/fetchInviteList',
      payload: {
        page,
        ...otherFields,
        startDate: startDate ? startDate.format(DATETIME_MIN) : undefined,
        endDate: endDate ? endDate.format(DATETIME_MIN) : undefined,
        searchType: 'send',
      },
    });
  }

  /**
   * 查询收到的邀约汇总列表
   * @param {Object} fields - 查询字段
   */
  @Bind()
  handleSearchReceive(fields) {
    const { dispatch } = this.props;
    const { startDate, endDate, ...otherFields } = isUndefined(this.receiveForm)
      ? {}
      : filterNullValueObject(this.receiveForm.getFieldsValue());
    dispatch({
      type: 'invitationList/fetchInviteList',
      payload: {
        page: isEmpty(fields) ? {} : fields,
        ...otherFields,
        startDate: startDate ? startDate.format(DATETIME_MIN) : undefined,
        endDate: endDate ? endDate.format(DATETIME_MIN) : undefined,
        searchType: 'receive',
      },
    });
  }

  /**
   * 标签页切换的回调
   * @param {String} activeKey - TabKey
   */
  @Bind()
  handleTabsChange(activeKey) {
    const {
      invitationList: { sendPagination, receivePagination },
    } = this.props;
    const action = {
      send: () => {
        this.handleSearchEmit({ page: sendPagination });
      },
      receive: () => {
        this.handleSearchReceive({ page: receivePagination });
      },
    };
    this.setState({
      activeKey,
    });
    if (action[activeKey]) {
      action[activeKey]();
    }
  }

  /**
   * 跳转到详情页
   * @param {Number} inviteId - 邀约Id
   */
  @Bind()
  onHandleToSendDetail(inviteId) {
    const search = querystring.stringify({
      status: 'send',
      back: 'invitation',
    });
    openTab({
      title: 'hzero.common.title.disposeInvite',
      key: `/spfm/dispose-invite/${inviteId}`,
      path: `/spfm/dispose-invite/${inviteId}`,
      icon: 'preview',
      closable: true,
      search,
    });
  }

  /**
   * 跳转到详情页
   * @param {Number} inviteId - 邀约Id
   */
  @Bind()
  onHandleToReceivedDetail(inviteId) {
    const search = querystring.stringify({
      status: 'received',
      back: 'invitation',
    });
    openTab({
      search,
      title: 'hzero.common.title.disposeInvite',
      key: `/spfm/dispose-invite/${inviteId}`,
      path: `/spfm/dispose-invite/${inviteId}`,
      icon: 'preview',
      closable: true,
    });
  }

  /**
   * 分页改变时的回调查询方法
   * @param {object} pagination - 分页参数
   */
  @Bind()
  handleStandardTableChange(page) {
    const { activeKey } = this.state;
    if (activeKey === 'send') {
      this.handleSearchEmit(page);
    } else {
      this.handleSearchReceive(page);
    }
  }

  render() {
    const { activeKey } = this.state;
    const {
      loading,
      invitationList: {
        sendPagination,
        receivePagination,
        emitList,
        receiveList,
        inviteType,
        processStatus,
      },
    } = this.props;
    const filterPropsEmit = {
      loading,
      inviteType,
      processStatus,
      emit: true,
      onFilterChange: this.handleSearchEmit,
      onRef: node => {
        this.emitForm = node.props.form;
      },
    };
    const filterPropsReceive = {
      loading,
      inviteType,
      processStatus,
      onFilterChange: this.handleSearchReceive,
      onRef: node => {
        this.receiveForm = node.props.form;
      },
    };
    const listPropsEmit = {
      loading,
      pagination: sendPagination,
      dataSource: emitList,
      emit: true,
      editLine: this.editLine,
      searchPaging: this.handleStandardTableChange,
      handleToDetail: this.onHandleToSendDetail,
    };
    const listPropsReceive = {
      loading,
      pagination: receivePagination,
      dataSource: receiveList,
      editLine: this.editLine,
      searchPaging: this.handleStandardTableChange,
      handleToDetail: this.onHandleToReceivedDetail,
    };
    return (
      <React.Fragment>
        <Content style={{ paddingTop: 0 }}>
          <Tabs defaultActiveKey={activeKey} onChange={this.handleTabsChange} animated={false}>
            <TabPane tab={intl.get(`${messagePrompt}.title.send`).d('我发出的邀约')} key="send">
              <FilterForm {...filterPropsEmit} />
              <ListTable {...listPropsEmit} />
            </TabPane>
            <TabPane
              tab={intl.get(`${messagePrompt}.title.receive`).d('我收到的邀约')}
              key="receive"
            >
              <FilterForm {...filterPropsReceive} />
              <ListTable {...listPropsReceive} />
            </TabPane>
          </Tabs>
        </Content>
      </React.Fragment>
    );
  }
}
