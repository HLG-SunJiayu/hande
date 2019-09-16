/**
 * ServiceList - 分配接口
 * @date: 2019-07-04
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Modal, Table, Button, Row, Col } from 'hzero-ui';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { filterNullValueObject } from 'utils/utils';

import TransferSearch from './TransferSearch';
import style from './index.less';

/**
 * ServiceList - 分配接口
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
export default class ServiceList extends PureComponent {
  state = {
    leftSelectedRows: [],
    rightSelectedRows: [],
  };

  /**
   * 勾选table
   * @param {Array} selectedRows table数组
   */
  @Bind()
  onLeftSelectChange(keys, selectedRows) {
    const { leftSelectedRows = [] } = this.state;
    const leftSelectedRowsKey = leftSelectedRows.map(n => n.serviceId);
    // 新增勾选
    const addRows = selectedRows.filter(n => !leftSelectedRowsKey.includes(n.serviceId));
    const newRows = [...leftSelectedRows, ...addRows];
    // 取消勾选
    const newLeftSelectedRows = newRows.filter(n => keys.includes(n.serviceId));
    this.setState({ leftSelectedRows: newLeftSelectedRows });
  }

  /**
   * 勾选table
   * @param {Array} selectedRows table数组
   */
  @Bind()
  onRightSelectChange(keys, selectedRows) {
    const { rightSelectedRows = [] } = this.state;
    const rightSelectedRowsKey = rightSelectedRows.map(n => n.serviceId);
    // 新增勾选
    const addRows = selectedRows.filter(n => !rightSelectedRowsKey.includes(n.serviceId));
    const newRows = [...rightSelectedRows, ...addRows];
    // 取消勾选
    const newRightSelectedRows = newRows.filter(n => keys.includes(n.serviceId));
    this.setState({ rightSelectedRows: newRightSelectedRows });
  }

  /**
   * 绑定form
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.filterForm = ref.props.form;
  }

  /**
   * 查询已经分配的服务
   */
  @Bind()
  fetchExitServiceList(params = {}) {
    const { onFetchExitServiceList } = this.props;
    const filterValues = isUndefined(this.filterForm)
      ? {}
      : filterNullValueObject(this.filterForm.getFieldsValue());
    onFetchExitServiceList({ page: params, ...filterValues });
  }

  /**
   * 查询未分配的服务
   */
  @Bind()
  fetchNoExitServiceList(params = {}) {
    const { onFetchNoExitServiceList } = this.props;
    const filterValues = isUndefined(this.filterForm)
      ? {}
      : filterNullValueObject(this.filterForm.getFieldsValue());
    onFetchNoExitServiceList({ page: params, ...filterValues });
  }

  /**
   * 条件查询未分配和已分配
   */
  @Bind()
  fetchServiceList(params = {}) {
    const { onFetchNoExitServiceList, onFetchExitServiceList } = this.props;
    const filterValues = isUndefined(this.filterForm)
      ? {}
      : filterNullValueObject(this.filterForm.getFieldsValue());
    onFetchNoExitServiceList({ page: params, ...filterValues });
    onFetchExitServiceList({ page: params, ...filterValues });
  }

  /**
   * 加入服务
   */
  @Bind()
  handleAddService() {
    const { onHandleAddService } = this.props;
    const { leftSelectedRows } = this.state;
    onHandleAddService(leftSelectedRows);
    this.setState({
      leftSelectedRows: [],
    });
  }

  /**
   * 删除服务
   */
  @Bind()
  handleRemoveService() {
    const { onHandleRemoveService } = this.props;
    const { rightSelectedRows } = this.state;
    onHandleRemoveService(rightSelectedRows);
    this.setState({
      rightSelectedRows: [],
    });
  }

  render() {
    const { leftSelectedRows = [], rightSelectedRows = [] } = this.state;
    const {
      disabledFlg = false,
      fetchExitSerLoading,
      fetchNoExitSerLoading,
      serviceVisible,
      onHandleCloseModal,
      exitServiceList = [], // 模块下已分配服务
      noExitServiceList = [], // 模块下未分配服务
      exitPagination = {}, // 模块下已分配服务分页
      noExitPagination = {}, // 模块下未分配服务分页
    } = this.props;
    const fileterProps = {
      onSearch: this.fetchServiceList,
      onRef: this.handleBindRef,
    };
    const leftRowSelection = {
      selectedRowKeys: leftSelectedRows.map(o => o.serviceId),
      onChange: this.onLeftSelectChange,
      getCheckboxProps: () => ({
        disabled: disabledFlg,
      }),
    };
    const rightRowSelection = {
      selectedRowKeys: rightSelectedRows.map(o => o.serviceId),
      onChange: this.onRightSelectChange,
      getCheckboxProps: () => ({
        disabled: disabledFlg,
      }),
    };
    const columns = [
      {
        title: '服务编码',
        dataIndex: 'serviceCode',
        width: 150,
      },
      {
        title: '服务名称',
        dataIndex: 'serviceName',
      },
    ];
    return (
      <Modal
        title={intl.get('sitf.externalSystems.view.menu.interfaceAllocation').d('分配接口')}
        visible={serviceVisible}
        onCancel={onHandleCloseModal}
        footer={false}
        width={1000}
        wrapClassName={style['transfer-modal']}
        destroyOnClose
      >
        <Row>
          <div className="table-list-search">
            <TransferSearch {...fileterProps} />
          </div>
        </Row>
        <Row gutter={12}>
          <Col span={11}>
            <Table
              bordered
              rowKey="serviceId"
              loading={fetchNoExitSerLoading}
              columns={columns}
              dataSource={noExitServiceList}
              rowSelection={leftRowSelection}
              onChange={this.fetchNoExitServiceList}
              pagination={noExitPagination}
            />
          </Col>
          <Col span={2} className={style['transfer-button']}>
            <Button
              style={{ marginBottom: '15px' }}
              onClick={this.handleAddService}
              disabled={leftSelectedRows.length <= 0}
            >
              {'加入>'}
            </Button>
            <Button onClick={this.handleRemoveService} disabled={rightSelectedRows.length <= 0}>
              {'<删除'}
            </Button>
          </Col>
          <Col span={11}>
            <Table
              bordered
              rowKey="serviceId"
              loading={fetchExitSerLoading}
              columns={columns}
              dataSource={exitServiceList}
              rowSelection={rightRowSelection}
              onChange={this.fetchExitServiceList}
              pagination={exitPagination}
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}
