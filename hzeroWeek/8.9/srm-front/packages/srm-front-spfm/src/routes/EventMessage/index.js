/**
 * EventMessage - 事件查询
 * @date: 2019-3-22
 * @author: Wu <qizheng.wu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Table } from 'hzero-ui';

// import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { dateTimeRender } from 'utils/renderer';

import QueryForm from './QueryForm';

@connect(({ eventMessage, loading }) => ({
  eventMessage,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['eventMessage/queryMessageList'],
}))
export default class EventMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  QueryForm;

  componentDidMount() {
    this.handleQueryMessage();
  }

  /**
   * 获取查询表单组件this对象
   * @param {Object} ref - 查询表单组件this
   */
  @Bind()
  handleBindRef(ref) {
    this.QueryForm = (ref.props || {}).form;
  }

  /**
   * 重置表单查询条件
   */
  @Bind()
  handleResetSearch() {
    this.QueryForm.resetFields();
  }

  /**
   * 获取事件消息信息
   * @param {Object} params 传递的参数
   */
  @Bind()
  handleQueryMessage(params = {}) {
    const {
      dispatch,
      tenantId,
      eventMessage: { pagination = {} },
    } = this.props;
    const filterValue = this.QueryForm === undefined ? {} : this.QueryForm.getFieldsValue();
    dispatch({
      type: 'eventMessage/queryMessageList',
      payload: { tenantId, ...filterValue, page: pagination, ...params },
    });
  }

  /**
   * 重试
   */
  @Bind()
  handleResendMessage(record) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'eventMessage/resendMessage',
      payload: { tenantId, record },
    }).then(res => {
      if (res) {
        notification.success();
      }
    });
  }

  /**
   * handlePagination - 分页设置
   * @param {object} pagination - 分页对象
   */
  @Bind()
  handlePagination(pagination) {
    this.handleQueryMessage({ page: pagination });
  }

  render() {
    const {
      eventMessage: { messageData = [], pagination = {} },
      fetchLoading,
    } = this.props;
    const columns = [
      {
        title: '事件类别',
        dataIndex: 'category',
      },
      {
        title: '事件代码',
        dataIndex: 'eventCode',
        width: 150,
      },
      {
        title: '功能',
        dataIndex: 'action',
      },
      {
        title: '事件数据',
        dataIndex: 'data',
      },
      {
        title: '状态',
        dataIndex: 'sendStatus',
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        width: 150,
        render: dateTimeRender,
      },
      {
        title: '操作',
        width: 80,
        render: (_, record) => (
          <a
            onClick={() => {
              this.handleResendMessage(record);
            }}
          >
            重试
          </a>
        ),
      },
    ];
    return (
      <React.Fragment>
        <Header title="事件查询" />
        <Content>
          <div className="table-list-search">
            <QueryForm
              onSearch={this.handleQueryMessage}
              onReset={this.handleResetSearch}
              onRef={this.handleBindRef}
            />
          </div>
          <Table
            bordered
            columns={columns}
            rowKey="eventMessageId"
            dataSource={messageData || []}
            loading={fetchLoading}
            pagination={pagination}
            onChange={this.handlePagination}
          />
        </Content>
      </React.Fragment>
    );
  }
}
