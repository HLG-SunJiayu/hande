/**
 * FinanceInfo - 企业注册-财务信息
 * @date: 2018-7-6
 * @author: lokya <kan.li01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Modal, Input, InputNumber, Icon } from 'hzero-ui';
import { connect } from 'dva';
import uuidv4 from 'uuid/v4';
import Debounce from 'lodash-decorators/debounce';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getEditTableData } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import EditTable from 'components/EditTable';
import notification from 'utils/notification';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 企业注册财务信息列表
 * @extends {Component} - React.Component
 * @reactProps {Object} financeInfo - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@formatterCollections({
  code: ['spfm.finance'],
})
@connect(({ financeInfo, loading }) => ({
  financeInfo,
  fetchLoading: loading.effects['financeInfo/fetchFinanceInfo'],
}))
@withRouter
export default class FinanceList extends PureComponent {
  /**
   * @param {object} props 属性
   */
  constructor(props) {
    super(props);
    this.state = {
      addRows: [],
      selectedRows: [],
      saving: false,
    };
  }

  /**
   * 挂载后执行方法
   */
  componentDidMount() {
    const { dispatch, companyId, onRef } = this.props;
    if (onRef) onRef(this);
    const data = {
      companyId,
    };
    dispatch({
      type: 'financeInfo/fetchFinanceInfo',
      payload: data,
    });
  }

  /**
   * 点击取消按钮
   * @param {Object} record 当前行记录
   */
  @Bind()
  cancel(record = {}) {
    const {
      dispatch,
      financeInfo: { data = [] },
    } = this.props;
    if (record._status === 'create') {
      const listData = data.filter(item => item.companyFinanceId !== record.companyFinanceId);
      dispatch({
        type: 'financeInfo/removeNewAdd',
        payload: listData,
      });
    } else {
      this.editFinance(record, false);
    }
  }

  /**
   * 刷新数据
   */
  @Bind()
  refresh() {
    const { dispatch, companyId } = this.props;
    const data = {
      companyId,
    };
    this.setState({
      selectedRows: [],
    });
    dispatch({
      type: 'financeInfo/fetchFinanceInfo',
      payload: data,
    });
  }

  /**
   * 表格选择事件
   * @param {null} _ 占位
   * @param {object} selectedRows 选中行
   */
  @Bind()
  onSelectChange(_, selectedRows) {
    this.setState({ selectedRows });
  }

  /**
   * 删除
   */
  @Bind()
  remove() {
    const {
      dispatch,
      companyId,
      financeInfo: { data = [] },
    } = this.props;
    const { selectedRows } = this.state;
    const deleteRows = selectedRows.filter(row => row._status !== 'create');
    const createFlag = data.find(d => d._status === 'create');
    const onOk = () => {
      if (deleteRows.length > 0) {
        dispatch({
          type: 'financeInfo/deleteFinanceInfo',
          payload: {
            deleteRows,
            companyId,
          },
        }).then(response => {
          if (response) {
            this.refresh();
            notification.success();
          }
        });
      } else {
        this.refresh();
        notification.success();
      }
    };
    Modal.confirm({
      title: createFlag
        ? intl
            .get('spfm.attachment.view.message.error.remove')
            .d('有新建数据未保存，确定删除选中数据?')
        : intl.get('hzero.common.message.confirm.remove').d('确定删除选中数据?'),
      onOk,
    });
  }

  /**
   * 批量保存数据
   */
  @Debounce(500)
  saveAllData() {
    const {
      dispatch,
      financeInfo: { data = [] },
      companyId,
      callback,
    } = this.props;
    const params = getEditTableData(data, ['companyFinanceId']);
    const isEditing = !!data.find(d => d._status === 'create' || d._status === 'update');
    if (Array.isArray(params) && params.length !== 0 && isEditing) {
      dispatch({
        type: 'financeInfo/addFinanceInfo',
        payload: {
          companyId,
          arr: params,
        },
      }).then(res => {
        if (res) {
          this.refresh();
          if (res.length > 0 && callback) {
            callback();
          }
        }
      });
    } else if (params.length === 0 && !isEditing) {
      if (callback) {
        callback();
      }
    }
  }

  /**
   * 新增一条数据
   */
  @Bind()
  addData() {
    const { dispatch } = this.props;
    const companyFinanceId = uuidv4();
    this.setState({
      addRows: [...this.state.addRows, companyFinanceId],
    });
    const data = {
      companyFinanceId,
      totalAssets: 0,
      totalLiabilities: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      revenue: 0,
      netProfit: 0,
      currentRatio: 0,
      assetLiabilityRatio: 0,
      totalAssetsEarningsRatio: 0,
      year: '',
      _status: 'create', // 新建标记位
    };
    dispatch({
      type: 'financeInfo/addNewData',
      payload: data,
    });
  }

  /**
   * 使当前行变成可编辑状态
   * @param {object} record 当前行记录
   * @param {boolean} flag 编辑状态
   */
  @Bind()
  editFinance(record, flag) {
    const {
      dispatch,
      financeInfo: { data },
    } = this.props;
    const index = data.findIndex(item => item.companyFinanceId === record.companyFinanceId);
    dispatch({
      type: 'financeInfo/editRow',
      payload: {
        data: [
          ...data.slice(0, index),
          {
            ...record,
            _status: flag ? 'update' : null,
          },
          ...data.slice(index + 1),
        ],
      },
    });
  }

  @Bind()
  handlePrevious() {
    const { previousCallback } = this.props;
    if (previousCallback) {
      previousCallback();
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      fetchLoading,
      financeInfo: { data = [] },
      buttonText = intl.get('hzero.common.button.save').d('保存'),
      showButton = true,
      previousCallback,
      backBtnText = intl.get('hzero.common.button.previous').d('上一步'),
    } = this.props;
    const { selectedRows, saving } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(n => n.companyFinanceId),
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record._status === 'create',
      }),
    };
    const columns = [
      {
        title: intl.get('spfm.finance.model.financeInfo.year').d('年份'),
        dataIndex: 'year',
        width: 120,
        align: 'center',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator('year', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get('spfm.finance.model.financeInfo.year').d('年份'),
                      }),
                    },
                    {
                      pattern: /([1-9])([0-9]{3})/,
                      message: intl.get('spfm.finance.view.message.warning').d('年份格式不正确'),
                    },
                  ],
                  initialValue: record.year,
                })(
                  <Input
                    inputChinese={false}
                    maxLength={4}
                    placeholder={intl.get('hzero.common.validation.requireInput', {
                      name: intl.get('spfm.finance.model.financeInfo.year').d('年份'),
                    })}
                  />
                )}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.finance.model.financeInfo.totalAssets').d('企业总资产(万元)'),
        dataIndex: 'totalAssets',
        align: 'right',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator('totalAssets', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl
                          .get('spfm.finance.model.financeInfo.totalAssets')
                          .d('企业总资产(万元)'),
                      }),
                    },
                  ],
                  initialValue: record.totalAssets,
                })(<InputNumber />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.finance.model.financeInfo.totalLiabilities').d('总负债(万元)'),
        dataIndex: 'totalLiabilities',
        width: 180,
        align: 'right',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator('totalLiabilities', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl
                          .get('spfm.finance.model.financeInfo.totalLiabilities')
                          .d('总负债(万元)'),
                      }),
                    },
                  ],
                  initialValue: record.totalLiabilities,
                })(<InputNumber />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.finance.model.financeInfo.currentAssets').d('流动资产(万元)'),
        dataIndex: 'currentAssets',
        width: 180,
        align: 'right',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator('currentAssets', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl
                          .get('spfm.finance.model.financeInfo.currentAssets')
                          .d('流动资产(万元)'),
                      }),
                    },
                  ],
                  initialValue: record.currentAssets,
                })(<InputNumber />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.finance.model.financeInfo.currentLiabilities').d('流动负债(万元)'),
        dataIndex: 'currentLiabilities',
        width: 180,
        align: 'right',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator('currentLiabilities', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl
                          .get('spfm.finance.model.financeInfo.currentLiabilities')
                          .d('流动负债(万元)'),
                      }),
                    },
                  ],
                  initialValue: record.currentLiabilities,
                })(<InputNumber />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.finance.model.financeInfo.revenue').d('营业收入(万元)'),
        dataIndex: 'revenue',
        width: 180,
        align: 'right',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator('revenue', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl
                          .get('spfm.finance.model.financeInfo.revenue')
                          .d('营业收入(万元)'),
                      }),
                    },
                  ],
                  initialValue: record.revenue,
                })(<InputNumber />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.finance.model.financeInfo.netProfit').d('净利润(万元)'),
        dataIndex: 'netProfit',
        width: 180,
        align: 'right',
        render: (text, record) => {
          if (record._status === 'update' || record._status === 'create') {
            return (
              <FormItem>
                {record.$form.getFieldDecorator('netProfit', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl
                          .get('spfm.finance.model.financeInfo.netProfit')
                          .d('净利润(万元)'),
                      }),
                    },
                  ],
                  initialValue: record.netProfit,
                })(<InputNumber />)}
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: intl.get('spfm.finance.model.financeInfo.assetLiabilityRatio').d('资产负债率'),
        dataIndex: 'assetLiabilityRatio',
        width: 180,
        align: 'right',
        render: (text, record) =>
          record.assetLiabilityRatio ? (
            <span>{`${(record.assetLiabilityRatio * 100).toFixed(2)}%`}</span>
          ) : (
            <span>--</span>
          ),
      },
      {
        title: intl.get('spfm.finance.model.financeInfo.currentRatio').d('流动比率'),
        dataIndex: 'currentRatio',
        align: 'right',
        width: 180,
        render: (text, record) => {
          return record.currentRatio > 0 ? (
            <div>{`${(record.currentRatio * 100).toFixed(2)}%`}</div>
          ) : (
            <div>--</div>
          );
        },
      },
      {
        title: intl
          .get('spfm.finance.model.financeInfo.totalAssetsEarningsRatio')
          .d('总资产收益率'),
        dataIndex: 'totalAssetsEarningsRatio',
        align: 'right',
        width: 180,
        render: (text, record) => {
          return record.totalAssetsEarningsRatio > 0 ? (
            <div>{`${(record.totalAssetsEarningsRatio * 100).toFixed(2)}%`}</div>
          ) : (
            <div>--</div>
          );
        },
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        align: 'center',
        fixed: 'right',
        width: 80,
        render: (_, record) => {
          if (record._status === 'update') {
            return (
              <a onClick={() => this.cancel(record)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            );
          } else if (record._status === 'create') {
            return (
              <a onClick={() => this.cancel(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            );
          } else {
            return (
              <a onClick={() => this.editFinance(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            );
          }
        },
      },
    ];
    return (
      <React.Fragment>
        <React.Fragment>
          <Button icon="plus" style={{ margin: '0 10px 10px 0' }} onClick={() => this.addData()}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {selectedRows.length > 0 && (
            <Button icon="minus" onClick={() => this.remove()}>
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          )}
        </React.Fragment>
        <EditTable
          loading={fetchLoading}
          rowKey="companyFinanceId"
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ x: '1821px' }}
          bordered
        />
        <div style={{ marginTop: 40 }}>
          {previousCallback && (
            <Button type="primary" onClick={this.handlePrevious} style={{ marginRight: 16 }}>
              {backBtnText}
            </Button>
          )}
          {showButton && (
            <Button type="primary" onClick={this.saveAllData.bind(this)}>
              {saving && <Icon type="loading" />}
              {buttonText}
            </Button>
          )}
        </div>
      </React.Fragment>
    );
  }
}
