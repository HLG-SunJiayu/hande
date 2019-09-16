/*
 * ListTable - 企业邀约汇总数据列表信息
 * @date: 2018/08/07 14:56:50
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent, Fragment } from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { sum, isNumber } from 'lodash';

import { dateTimeRender } from 'utils/renderer';
import intl from 'utils/intl';

/**
 * 企业邀约汇总数据列表信息
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} showEditModal 显示编辑模态框
 * @reactProps {Object} form 表单
 * @return React.element
 */
const modelPrompt = 'spfm.invitationList.model.invitationList';
export default class ListTable extends PureComponent {
  /**
   * 显示编辑模态框
   * @param {obj} record 当前行数据
   */
  @Bind()
  showEditModal(record) {
    this.props.editLine(record);
  }

  /**
   * 邀约明细跳转
   * @param {number} inviteId - 邀请Id
   */
  @Bind()
  handleToDetail(inviteId) {
    if (this.props.handleToDetail) {
      this.props.handleToDetail(inviteId);
    }
  }

  render() {
    const { loading, dataSource, searchPaging, pagination } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.inviteId`).d('邀请编号'),
        dataIndex: 'inviteId',
        width: 90,
        fixed: 'left',
        render: value => <a onClick={() => this.handleToDetail(value)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.processStatus`).d('邀约状态'),
        dataIndex: 'processStatusMeaning',
        fixed: 'left',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.inviteTypeMeaning`).d('邀请类型'),
        dataIndex: 'inviteTypeMeaning',
        width: 90,
        render: value => (this.props.emit ? `邀请${value}` : `成为${value}`),
      },
      {
        title: intl.get(`${modelPrompt}.companyName`).d('发起邀请的公司'),
        dataIndex: 'companyName',
        width: 250,
      },
      {
        title: intl.get(`${modelPrompt}.inviteCompanyNum`).d('被邀请企业编码'),
        dataIndex: 'inviteCompanyNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.inviteCompanyName`).d('被邀请企业名称'),
        dataIndex: 'inviteCompanyName',
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('发出邀请时间'),
        dataIndex: 'creationDate',
        width: 150,
        render: dateTimeRender,
      },
      {
        title: intl.get(`${modelPrompt}.investigateTemplateId`).d('是否发出调查表'),
        dataIndex: 'investigateTemplateId',
        width: 130,
        render: value =>
          value
            ? intl.get(`hzero.common.status.yes`).d('是')
            : intl.get(`hzero.common.status.no`).d('否'),
      },
      this.props.emit
        ? {
            title: intl.get(`${modelPrompt}.sendUserName`).d('发起邀请人'),
            dataIndex: 'sendUserName',
            width: 150,
          }
        : {
            title: intl.get(`${modelPrompt}.handleUserName`).d('邀约处理人'),
            dataIndex: 'handleUserName',
            width: 150,
          },
      {
        title: intl.get(`${modelPrompt}.processMsg`).d('处理消息'),
        dataIndex: 'processMsg',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.processDate`).d('最后处理时间'),
        dataIndex: 'processDate',
        width: 150,
        render: dateTimeRender,
      },
    ];
    const scrollX = sum(columns.map(item => (isNumber(item.width) ? item.width : 0))) + 180;
    return (
      <Fragment>
        <Table
          bordered
          rowKey="inviteId"
          scroll={{ x: scrollX }}
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={searchPaging}
        />
      </Fragment>
    );
  }
}
