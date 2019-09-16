/*
 * BankInfoList - 企业注册-银行信息编辑
 * @date: 2018/08/07 15:11:33
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Input } from 'hzero-ui';
import { unionWith, isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';
import classnames from 'classnames';
import intl from 'utils/intl';
import Checkbox from 'components/Checkbox';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { enableRender } from 'utils/renderer';
import { getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import styles from './index.less';

const modelPrompt = 'spfm.bank.model.bank';
const viewPrompt = 'spfm.bank.view.message';
const FormItem = Form.Item;
/**
 * 企业注册-银行信息编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} bank - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(modal => ({
  saving: modal.loading.effects['enterpriseBank/saveBankAccount'],
  loading: modal.loading.effects['enterpriseBank/queryBankAccount'],
  bank: modal.enterpriseBank,
}))
@withRouter
// @formatterCollections({ code: 'spfm.bank' })
export default class BankInfoList extends Component {
  componentDidMount() {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'enterpriseBank/queryBankAccount',
      payload: { companyId },
    });
  }

  /**
   * 选中Lov时设置银行名称
   * @param {string} value
   * @param {obj} record 选中行的值
   * @memberof BankInfo
   */
  @Bind()
  handleLovOnChange(value, lovRecord, record) {
    const { $form } = record;
    $form.setFieldsValue({
      [`bankName`]: lovRecord.bankName,
      [`bankId`]: lovRecord.bankId,
    });
  }

  /**
   *数据刷新
   *
   * @memberof BankInfoList
   */
  @Bind()
  refresh() {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'enterpriseBank/queryBankAccount',
      payload: { companyId },
    });
  }

  @Bind()
  editRow(record, flag) {
    const {
      bank: { bankList },
      dispatch,
    } = this.props;
    const newBankList = bankList.map(item =>
      record.companyBankAccountId === item.companyBankAccountId
        ? { ...item, _status: flag ? 'update' : '' }
        : item
    );
    dispatch({
      type: 'enterpriseBank/updateState',
      payload: { bankList: newBankList },
    });
  }

  @Bind()
  deleteRow(record) {
    const {
      dispatch,
      bank: { bankList },
    } = this.props;
    const newBankList = bankList.filter(
      item => item.companyBankAccountId !== record.companyBankAccountId
    );
    dispatch({
      type: 'enterpriseBank/updateState',
      payload: { bankList: newBankList },
    });
  }

  /**
   * 添加银行信息
   * @memberof BankInfo
   */
  @Bind()
  onHandleAdd() {
    const {
      dispatch,
      bank: { bankList },
    } = this.props;
    dispatch({
      type: 'enterpriseBank/updateState',
      payload: {
        bankList: [
          { _status: 'create', companyBankAccountId: uuid(), enabledFlag: 1, masterFlag: 1 },
          ...bankList,
        ],
      },
    });
  }

  @Bind()
  saveAndNext() {
    const {
      dispatch,
      bank: { bankList },
      callback,
      companyId,
    } = this.props;
    let arrListData = getEditTableData(bankList);
    const companyBankList = unionWith(arrListData, bankList, (value1, value2) => {
      return value1.bankAccountNum === value2.bankAccountNum;
    });
    if (companyBankList.length >= 2) {
      for (let i = 0; i < companyBankList.length; i++) {
        for (let j = i + 1; j < companyBankList.length; j++) {
          if (companyBankList[i].companyBankAccountId === companyBankList[j].companyBankAccountId) {
            companyBankList.splice(j, 1);
            j--;
          }
        }
      }
    }
    arrListData = arrListData.map(item => {
      const { ...newItem } = item;
      if (newItem._status === 'create') {
        delete newItem.companyBankAccountId;
      }
      return newItem;
    });
    // const masterAccount = companyBankList.map(
    //   item => (item.masterFlag === 1 ? item.masterFlag : 0)
    // );
    // const countOccurrences = (arr, value) => arr.reduce((a, v) => (v === value ? a + 1 : a + 0), 0);
    const isOnlyMasterFlag = !isEmpty(bankList.filter(b => b.masterFlag));
    if (companyBankList.length > 0) {
      if (companyBankList.find(item => item.enabledFlag)) {
        if (isOnlyMasterFlag) {
          if (
            !(
              arrListData.length === 0 &&
              companyBankList.find(item => item._status === ('create' || 'update'))
            )
          ) {
            dispatch({
              type: 'enterpriseBank/saveBankAccount',
              payload: { companyId, companyBankAccountList: arrListData },
            }).then(data => {
              if (data) {
                this.refresh();
                if (callback) {
                  callback(data);
                }
              }
            });
          }
        } else {
          notification.warning({
            message: intl
              .get(`${viewPrompt}.warn.onlyMasterFlag`)
              .d('必须有且仅有一条银行主账户信息'),
          });
        }
      } else {
        notification.warning({
          message: intl.get(`${viewPrompt}.warn.mustEnabledAddressInfo`).d('至少启用一条银行信息'),
        });
      }
    } else {
      notification.error({
        message: intl.get(`${viewPrompt}.mustEnterOne`).d('请至少输入一条银行信息'),
      });
    }
  }

  @Bind()
  handlePrevious() {
    const { previousCallback } = this.props;
    if (previousCallback) {
      previousCallback();
    }
  }

  /**
   * 是否为主账号checkBox change
   * @param {*} e
   * @param {*} record
   */
  @Bind()
  handleChangeCheckbox(e, record) {
    const {
      dispatch,
      bank: { bankList },
    } = this.props;
    const checkboxValue = e.target.value === 1 ? 0 : 1;
    const newBankList = bankList.map(item =>
      item.companyBankAccountId === record.companyBankAccountId
        ? { ...item, masterFlag: checkboxValue }
        : item
    );
    dispatch({
      type: 'enterpriseBank/updateState',
      payload: {
        bankList: newBankList,
      },
    });
  }

  /**
   * 校验唯一性
   */
  // onBlur={(evt) => this.handleUniqueness(evt, record)}
  // @Bind()
  // handleUniqueness(evt, { $form }) {
  //   const { bank: { bankList } } = this.props;
  //   const fIndex = findIndex(bankList, { bankAccountNum: evt.target.value});
  //   if(fIndex >= 0) $form.validateFields(['bankAccountNum']);
  // }

  render() {
    const {
      showButton = true,
      buttonText = intl.get('hzero.common.button.save').d('保存'),
      loading,
      saving,
      bank: { bankList },
      previousCallback,
      backBtnText = intl.get('hzero.common.button.previous').d('上一步'),
    } = this.props;
    const isOnlyMasterFlag = !isEmpty(bankList.filter(b => b.masterFlag));
    const columns = [
      {
        title: intl.get(`${modelPrompt}.bankTypeCode`).d('银行代码'),
        dataIndex: 'bankCode',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`bankId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.bankTypeCode`).d('银行代码'),
                    }),
                  },
                ],
                initialValue: record.bankId,
              })(
                <Lov
                  code="SPFM.COMPANY.BANK"
                  onChange={(value, lovRecord) => this.handleLovOnChange(value, lovRecord, record)}
                  textValue={record.bankCode}
                />
              )}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.bankName`).d('银行名称'),
        dataIndex: 'bankName',
        width: 180,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`bankName`, {
                initialValue: record.bankName,
              })(<Input disabled />)}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.bankBranchName`).d('开户行名称'),
        dataIndex: 'bankBranchName',
        width: 300,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`bankBranchName`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.bankBranchName`).d('开户行名称'),
                    }),
                  },
                ],
                initialValue: record.bankBranchName,
              })(<Input />)}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.bankAccountName`).d('账户名称'),
        dataIndex: 'bankAccountName',
        width: 300,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`bankAccountName`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.bankAccountName`).d('账户名称'),
                    }),
                  },
                ],
                initialValue: record.bankAccountName,
              })(<Input />)}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.bankAccountNum`).d('银行账号'),
        dataIndex: 'bankAccountNum',
        width: 250,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`bankAccountNum`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.bankAccountNum`).d('银行账号'),
                    }),
                  },
                  {
                    pattern: /^[0-9]{1,30}$/,
                    message: intl
                      .get('spfm.bank.view.validatioin.bankAccountNumFormatName')
                      .d('银行账号应为小于30位纯数字'),
                  },
                ],
                initialValue: record.bankAccountNum,
              })(<Input />)}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'enabledFlag',
        align: 'center',
        width: 80,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`enabledFlag`, {
                initialValue: record.enabledFlag === 0 ? record.enabledFlag : 1,
              })(<Checkbox />)}
            </FormItem>
          ) : (
            enableRender(val)
          ),
      },
      {
        title: intl.get(`${modelPrompt}.masterFlag`).d('是否主账户'),
        dataIndex: 'masterFlag',
        align: 'center',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`masterFlag`, {
                initialValue: record.masterFlag === 0 ? record.masterFlag : 1,
              })(
                <Checkbox
                  disabled={!record.masterFlag && isOnlyMasterFlag}
                  onChange={e => this.handleChangeCheckbox(e, record)}
                />
              )}
            </FormItem>
          ) : (
            enableRender(val)
          ),
      },
      {
        title: intl.get(`hzero.common.table.column.option`).d('操作'),
        align: 'center',
        width: 80,
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <a onClick={() => this.editRow(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.editRow(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <a onClick={() => this.deleteRow(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            )}
          </span>
        ),
      },
    ];
    const editTableProps = {
      columns,
      loading,
      className: classnames(styles.table),
      rowKey: 'companyBankAccountId',
      dataSource: bankList,
      pagination: false,
      bordered: true,
      scroll: { x: 1300 },
    };
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Button icon="plus" onClick={this.onHandleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </div>
        <EditTable {...editTableProps} />
        <div style={{ clear: 'both', marginTop: 40 }}>
          {previousCallback && (
            <Button type="primary" onClick={this.handlePrevious} style={{ marginRight: 16 }}>
              {backBtnText}
            </Button>
          )}
          {showButton && (
            <Button
              type="primary"
              onClick={this.saveAndNext}
              style={{ margin: '24px 0' }}
              loading={saving}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    );
  }
}
