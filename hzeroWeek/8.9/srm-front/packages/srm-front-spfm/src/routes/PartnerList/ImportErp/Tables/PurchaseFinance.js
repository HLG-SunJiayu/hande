/**
 * PurchaseFinance - 采购/财务
 * @date: 2018-11-12
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import uuidv4 from 'uuid/v4';
import { isEmpty } from 'lodash';

import { Header } from 'components/Page';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import Checkbox from 'components/Checkbox';

import intl from 'utils/intl';
import { yesOrNoRender } from 'utils/renderer';
import notification from 'utils/notification';
import {
  getUserOrganizationId,
  getEditTableData,
  addItemToPagination,
  delItemToPagination,
} from 'utils/utils';

const promptCode = 'spfm.importErp';

/**
 * 采购/财务
 * @extends {Component} - Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} CreateIndex - 数据源
 * @reactProps {Boolean} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {String} organizationId - 租户Id
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */

@connect(({ importErp, loading }) => ({
  importErp,
  loading: loading.effects['importErp/queryFinance'],
  saving: loading.effects['importErp/saveFinance'],
  deleting: loading.effects['importErp/deleteFinance'],
}))
@Form.create({ fieldNameProp: null })
export default class PurchaseFinance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      newSupplierSyncId: undefined,
    };
  }

  componentDidMount() {
    const {
      importErp: { financePagination = {} },
    } = this.props;
    this.handleSearchFinance(financePagination);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'importErp/updateState',
      payload: {
        financeList: [],
        financePagination: {},
      },
    });
  }

  /**
   * 查询采购财务
   * @param {Object} pagination 分页参数
   */
  @Bind()
  handleSearchFinance(pagination = {}) {
    const {
      dispatch,
      modalRecord: { supplierSyncId },
    } = this.props;
    const { newSupplierSyncId } = this.state;
    dispatch({
      type: 'importErp/queryFinance',
      payload: {
        supplierSyncId: newSupplierSyncId || supplierSyncId,
        page: pagination,
      },
    });
  }

  /**
   * 保存选中的行
   * @param {Array} selectedRowKeys
   */
  @Bind()
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  /**
   * 新建行
   */
  @Bind()
  handleCreateRow() {
    const {
      dispatch,
      importErp: { financeList = [], financePagination = {} },
      modalRecord: { supplierSyncId },
    } = this.props;
    const { newSupplierSyncId } = this.state;
    dispatch({
      type: 'importErp/updateState',
      payload: {
        financeList: [
          {
            supplierSyncPfId: uuidv4(),
            frozenFlag: 0,
            supplierSyncId: newSupplierSyncId || supplierSyncId,
            tenantId: getUserOrganizationId(),
            _status: 'create', // 新建标记位
          },
          ...financeList,
        ],
        financePagination: addItemToPagination(financeList.length, financePagination),
      },
    });
  }

  /**
   * 删除新建的行
   * @param {object} record
   */
  @Bind()
  handleDeleteRow(record) {
    const {
      dispatch,
      importErp: { financeList = [], financePagination = {} },
    } = this.props;
    const newFinanceList = financeList.filter(
      item => item.supplierSyncPfId !== record.supplierSyncPfId
    );
    dispatch({
      type: 'importErp/updateState',
      payload: {
        financeList: newFinanceList,
        financePagination: delItemToPagination(financeList.length, financePagination),
      },
    });
  }

  /**
   * 批量编辑行
   * @param {object} record 每行数据
   */
  @Bind()
  handleEditRow(record) {
    const {
      importErp: { financeList = [] },
      dispatch,
    } = this.props;
    const newFinanceList = financeList.map(item =>
      record.supplierSyncPfId === item.supplierSyncPfId ? { ...item, _status: 'update' } : item
    );
    dispatch({
      type: 'importErp/updateState',
      payload: { financeList: newFinanceList },
    });
  }

  /**
   * 取消编辑行
   * @param {object} record 行数据
   */
  @Bind()
  handleCancelRow(record) {
    const {
      importErp: { financeList = [] },
      dispatch,
    } = this.props;
    const newFinanceList = financeList.map(item => {
      if (item.supplierSyncPfId === record.supplierSyncPfId) {
        const { _status, ...other } = item;
        return other;
      } else {
        return item;
      }
    });
    dispatch({
      type: 'importErp/updateState',
      payload: { financeList: newFinanceList },
    });
  }

  /**
   *保存编辑或者新建的数据
   */
  @Bind()
  handleSave() {
    const {
      dispatch,
      importErp: { financeList = [], financePagination = {} },
    } = this.props;
    const payloadData = getEditTableData(financeList, ['supplierSyncPfId']);
    if (isEmpty(payloadData)) return;
    dispatch({
      type: 'importErp/saveFinance',
      payload: payloadData,
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ newSupplierSyncId: res });
        this.handleSearchFinance(financePagination);
      }
    });
  }

  /**
   * 勾选删除
   */
  @Bind()
  handleDelete() {
    const {
      dispatch,
      importErp: { financePagination = {} },
    } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'importErp/deleteFinance',
      payload: selectedRowKeys,
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ selectedRowKeys: [] });
        this.handleSearchFinance(financePagination);
      }
    });
  }

  /**
   * 计算table列宽度
   * @param {Array} columns 列
   * @param {Number} fixWidth 固定列宽度
   */
  @Bind()
  scrollWidth(columns, fixWidth) {
    const total = columns.reduce(
      (prev, current) => prev + (current.className ? 0 : current.width ? current.width : 0),
      0
    );
    return total + fixWidth + 1;
  }

  renderForm() {
    const {
      modalRecord: { supplierCompanyNum, supplierCompanyName },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Form.Item
          label={intl.get(`${promptCode}.model.importErp.supplierCompanyNum`).d('企业代码')}
        >
          {getFieldDecorator('supplierCompanyNum', { initialValue: supplierCompanyNum })(
            <Input disabled />
          )}
        </Form.Item>
        <Form.Item
          label={intl.get(`${promptCode}.model.importErp.supplierCompanyName`).d('企业名称')}
        >
          {getFieldDecorator('supplierCompanyName', { initialValue: supplierCompanyName })(
            <Input disabled />
          )}
        </Form.Item>
      </Form>
    );
  }

  render() {
    const {
      loading,
      saving,
      deleting,
      importErp: { financePagination = {}, financeList = [] },
      modalRecord: { syncStatus },
    } = this.props;
    const { selectedRowKeys } = this.state;
    const isSave = financeList.filter(o => o._status === 'create' || o._status === 'update');
    const columns = [
      {
        title: intl.get(`${promptCode}.model.importErp.organizationCode`).d('采购组织'),
        width: 150,
        dataIndex: 'organizationCode',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator, setFieldsValue } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('purchaseOrgId', {
                  initialValue: record.purchaseOrgId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl
                          .get(`${promptCode}.model.importErp.organizationCode`)
                          .d('采购组织'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="SPFM.USER_AUTH.PURORG_CODE"
                    textValue={record.organizationCode}
                    onChange={(value, lovRecord) => {
                      setFieldsValue({
                        organizationName: lovRecord.organizationName,
                      });
                    }}
                  />
                )}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${promptCode}.model.importErp.organizationName`).d('采购组织名称'),
        width: 120,
        dataIndex: 'organizationName',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('organizationName', {
                  initialValue: record.organizationName,
                })(<Input disabled />)}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${promptCode}.model.importErp.termName`).d('付款条件'),
        width: 150,
        dataIndex: 'termName',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('termId', {
                  initialValue: record.termId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${promptCode}.model.importErp.termName`).d('付款条件'),
                      }),
                    },
                  ],
                })(<Lov code="SMDM.PAYMENT.TERM" textValue={val} />)}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${promptCode}.model.importErp.currencyCode`).d('订单货币'),
        width: 150,
        dataIndex: 'currencyName',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator, setFieldsValue } = record.$form;
            getFieldDecorator('currencyCode', { initialValue: record.currencyCode });
            return (
              <Form.Item>
                {getFieldDecorator('currencyId', {
                  initialValue: record.currencyCode,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${promptCode}.model.importErp.currencyCode`).d('订单货币'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="SMDM.CURRENCY"
                    textValue={val}
                    onChange={(text, lovRecord) => {
                      setFieldsValue({ currencyCode: lovRecord.currencyCode });
                    }}
                  />
                )}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${promptCode}.model.importErp.reconciliationAccount`).d('统驭科目'),
        width: 150,
        dataIndex: 'reconciliationAccount',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('reconciliationAccount', {
                  initialValue: record.reconciliationAccount,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl
                          .get(`${promptCode}.model.importErp.reconciliationAccount`)
                          .d('统驭科目'),
                      }),
                    },
                    {
                      max: 30,
                      message: intl.get('hzero.common.validation.max', {
                        max: 30,
                      }),
                    },
                    {
                      pattern: /^\d+$/,
                      message: intl
                        .get(`${promptCode}.view.message.patternValidate`)
                        .d('请输入正整数'),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${promptCode}.model.importErp.sortNumber`).d('排序码'),
        width: 150,
        dataIndex: 'sortNumber',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('sortNumber', {
                  initialValue: record.sortNumber,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${promptCode}.model.importErp.sortNumber`).d('排序码'),
                      }),
                    },
                    {
                      max: 30,
                      message: intl.get('hzero.common.validation.max', {
                        max: 30,
                      }),
                    },
                    {
                      pattern: /^\d+$/,
                      message: intl
                        .get(`${promptCode}.view.message.patternValidate`)
                        .d('请输入正整数'),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get(`${promptCode}.model.importErp.purchase.frozenFlag`).d('采购冻结'),
        width: 100,
        dataIndex: 'frozenFlag',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('frozenFlag', {
                  initialValue: record.frozenFlag,
                })(<Checkbox />)}
              </Form.Item>
            );
          } else {
            return yesOrNoRender(val);
          }
        },
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'edit',
        width: 75,
        fixed: 'right',
        render: (_, record) => (
          <span className="action-link">
            {record._status === 'create' ? (
              <a
                onClick={() => {
                  this.handleDeleteRow(record);
                }}
              >
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            ) : record._status === 'update' ? (
              <a
                onClick={() => {
                  this.handleCancelRow(record);
                }}
              >
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            ) : (
              <a
                disabled={syncStatus === 'PENDING'}
                onClick={() => {
                  this.handleEditRow(record);
                }}
              >
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
          </span>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record._status === 'create',
      }),
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.model.importErp.purchaseFinance`).d('采购/财务')}>
          <Button type="primary" disabled={syncStatus === 'PENDING'} onClick={this.handleCreateRow}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            disabled={isEmpty(isSave) || syncStatus === 'PENDING'}
            loading={saving}
            onClick={this.handleSave}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button
            disabled={isEmpty(selectedRowKeys) || syncStatus === 'PENDING'}
            loading={deleting}
            onClick={this.handleDelete}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </Header>
        <div style={{ margin: 16 }}>
          <div className="table-list-search">{this.renderForm()}</div>
          <EditTable
            bordered
            rowKey="supplierSyncPfId"
            loading={loading}
            columns={columns}
            dataSource={financeList}
            pagination={financePagination}
            onChange={this.handleSearchFinance}
            rowSelection={rowSelection}
            scroll={{ x: this.scrollWidth(columns, 0) }}
          />
        </div>
      </React.Fragment>
    );
  }
}
