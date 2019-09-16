/*
 * OrderConfigModal - 订单配置表弹窗
 * @date: 2018/10/09 14:56:50
 * @author: LZH<zhaohui-liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Table, Input, Row, Col } from 'hzero-ui';
import uuid from 'uuid/v4';
import { isEmpty, cloneDeep } from 'lodash';
import { Bind } from 'lodash-decorators';

import Checkbox from 'components/Checkbox';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { createPagination } from 'utils/utils';

import styles from './index.less';

const promptCode = 'spfm.configServer';

const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
@connect(({ loading, configServer }) => ({
  saveOrderConfigListLoading: loading.effects['configServer/saveOrderConfigList'],
  fetchOrderConfigListLoading: loading.effects['configServer/fetchOrderConfigList'],
  configServer,
}))
export default class OrderConfig extends Component {
  state = {
    dataSource: [], // 没有id的创建uuid数组
    dataContent: [], // 原始数据，没有做任何修改
  };

  componentDidMount() {
    this.handleSearch();
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch, form } = this.props;
    const fieldName = form.getFieldValue('fieldName');
    dispatch({
      type: 'configServer/fetchOrderConfigList',
      payload: {
        page,
        fieldName,
      },
    }).then(res => {
      if (res) {
        const dataList = cloneDeep(res.content);
        dataList.forEach(e => {
          if (!e.poChangeConfigId) {
            e.poChangeConfigId = uuid();
          }
        });
        this.setState({ dataSource: dataList, dataContent: res.content });
        dispatch({
          type: 'configServer/updateState',
          payload: { orderConfigPagination: createPagination(res) },
        });
      }
    });
  }

  @Bind()
  saveList() {
    const { dataSource, dataContent } = this.state;
    const {
      form,
      dispatch,
      configServer: { orderConfigPagination },
    } = this.props;
    const value = form.getFieldsValue();
    const dataList = cloneDeep(dataSource);
    dataList.forEach((e, index) => {
      e.recordFlag = value[`recordFlag#${e.poChangeConfigId}`] === 1 ? 1 : 0;
      e.upgradeFlag = value[`upgradeFlag#${e.poChangeConfigId}`] === 1 ? 1 : 0;
      e.poChangeConfigId = dataContent[index].poChangeConfigId;
    });
    const changedDataList = dataList.filter(
      (a, index) =>
        a.recordFlag !== dataSource[index].recordFlag ||
        a.upgradeFlag !== dataSource[index].upgradeFlag
    );
    if (!isEmpty(changedDataList)) {
      dispatch({
        type: 'configServer/saveOrderConfigList',
        payload: dataList,
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch(orderConfigPagination);
        }
      });
    } else {
      notification.warning({
        message: intl.get(`${promptCode}.view.message.warning.noContent`).d(`未修改任何数据`),
      });
    }
  }

  @Bind()
  hideModal() {
    const { onOrderConfig } = this.props;
    if (onOrderConfig) {
      onOrderConfig('orderConfigVisible', false);
    }
  }

  @Bind()
  selectedUpgradeFlagAll(e) {
    const { form } = this.props;
    const { dataSource } = this.state;
    if (e.target.checked) {
      dataSource.forEach(a => {
        form.setFieldsValue({ [`upgradeFlag#${a.poChangeConfigId}`]: 1 });
      });
    } else {
      dataSource.forEach(a => {
        form.setFieldsValue({ [`upgradeFlag#${a.poChangeConfigId}`]: 0 });
      });
    }
  }

  @Bind()
  selectedRecordFlagAll(e) {
    const { form } = this.props;
    const { dataSource } = this.state;
    if (e.target.checked) {
      dataSource.forEach(a => {
        form.setFieldsValue({ [`recordFlag#${a.poChangeConfigId}`]: 1 });
      });
    } else {
      dataSource.forEach(a => {
        form.setFieldsValue({ [`recordFlag#${a.poChangeConfigId}`]: 0 });
      });
    }
  }

  /**
   * 重置表单
   */
  @Bind()
  handleFormReset() {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['fieldName']);
  }

  render() {
    const {
      form,
      visible,
      fetchOrderConfigListLoading,
      saveOrderConfigListLoading,
      configServer: { orderConfigPagination },
    } = this.props;
    const { dataSource, dataContent } = this.state;
    const value = form.getFieldsValue();
    const dataList = cloneDeep(dataSource);
    dataList.forEach((e, index) => {
      e.recordFlag = value[`recordFlag#${e.poChangeConfigId}`] === 1 ? 1 : 0;
      e.upgradeFlag = value[`upgradeFlag#${e.poChangeConfigId}`] === 1 ? 1 : 0;
      e.poChangeConfigId = dataContent[index].poChangeConfigId;
    });
    const dataUpgradeChangedList = dataList.filter(a => a.upgradeFlag === 0);
    const dataRecordChangedList = dataList.filter(a => a.recordFlag === 0);
    const columns = [
      {
        title: intl.get(`${promptCode}.model.order.tableName`).d('字段位置'),
        dataIndex: 'tableNameMeaning',
        width: 100,
      },
      {
        title: intl.get(`${promptCode}.model.order.fieldName`).d('字段名'),
        dataIndex: 'fieldNameMeaning',
        width: 250,
      },
      {
        title: (
          <div>
            <Checkbox
              onChange={this.selectedUpgradeFlagAll}
              checked={isEmpty(dataUpgradeChangedList)}
            />
            <span style={{ marginRight: '10px' }}>
              {intl.get(`${promptCode}.model.order.upgradeFlag`).d('版本升级')}
            </span>
          </div>
        ),
        dataIndex: 'upgradeFlag',
        width: 80,
        align: 'left',
        render: (text, record) => {
          return (
            <Form.Item style={{ margin: 0, height: 16 }}>
              {form.getFieldDecorator(`upgradeFlag#${record.poChangeConfigId}`, {
                initialValue: record.upgradeFlag,
              })(<Checkbox />)}
            </Form.Item>
          );
        },
      },
      {
        title: (
          <div>
            <Checkbox
              onChange={this.selectedRecordFlagAll}
              checked={isEmpty(dataRecordChangedList)}
            />
            <span style={{ marginRight: '10px' }}>
              {intl.get(`${promptCode}.model.order.recordFlag`).d('变更记录')}
            </span>
          </div>
        ),
        dataIndex: 'recordFlag',
        width: 80,
        align: 'left',
        className: 'order-checkbox',
        render: (text, record) => {
          return (
            <Form.Item style={{ margin: 0, height: 16 }}>
              {form.getFieldDecorator(`recordFlag#${record.poChangeConfigId}`, {
                initialValue: record.recordFlag,
              })(<Checkbox />)}
            </Form.Item>
          );
        },
      },
    ];
    return (
      <Modal
        title={intl.get(`${promptCode}.view.message.title`).d('订单配置表')}
        visible={visible}
        footer={null}
        width={1000}
        onCancel={this.hideModal}
      >
        {/* <Content style={{ paddingLeft: 0, paddingRight: 0 }}> */}
        <div className="table-list-search">
          <Form layout="inline">
            <FormItem label={intl.get(`${promptCode}.model.configServer.fieldName`).d('字段名')}>
              {form.getFieldDecorator('fieldName')(<Input />)}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                data-code="search"
                onClick={this.handleSearch}
                style={{ marginLeft: 8 }}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
              <Button data-code="reset" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
            </FormItem>
          </Form>
        </div>
        <Row>
          <Col>
            <Button
              type="primary"
              style={{ float: 'right' }}
              onClick={this.saveList}
              loading={saveOrderConfigListLoading || fetchOrderConfigListLoading}
            >
              {intl.get('hzero.common.button.save').d('保存')}
            </Button>
          </Col>
        </Row>
        <div className={styles['order-config-table']}>
          <Table
            bordered
            loading={fetchOrderConfigListLoading}
            rowKey="poChangeConfigId"
            dataSource={dataSource}
            pagination={orderConfigPagination}
            onChange={this.handleSearch}
            columns={columns}
          />
        </div>
        {/* </Content> */}
      </Modal>
    );
  }
}
