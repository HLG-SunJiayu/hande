/**
 * DocMergeRules -对账及开票并单规则
 * @date: 2018-11-7
 * @author dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Form, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';

import EditTable from 'components/EditTable';
import Checkbox from 'components/Checkbox';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';

import styles from './index.less';

const docMergePrompt = 'sodr.docMergeRules.model.docMergeRules';
@connect(({ configServer, loading }) => ({
  configServer,
  loading: loading.effects['configServer/fetchDocMergeRulesList'],
  updateLoading: loading.effects['configServer/saveDocMergeRulesList'],
}))
@Form.create({ fieldNameProp: null })
export default class DocMergeRules extends Component {
  state = {
    pageCache: {
      page: 0,
      size: 10,
    },
    organizationId: getCurrentOrganizationId(),
  };

  componentDidMount() {
    this.fetchDocMergeRulesList();
  }

  @Bind()
  handleShowMergeRules() {
    const { onHandleShowMergeRules } = this.props;
    onHandleShowMergeRules('docMergeRulesVisible', false);
  }

  @Bind()
  fetchDocMergeRulesList() {
    const { dispatch } = this.props;
    const { pageCache, organizationId } = this.state;
    dispatch({
      type: 'configServer/fetchDocMergeRulesList',
      payload: {
        organizationId,
        ...pageCache,
      },
    });
  }

  /**
   * 触发方法时将该行更改为编辑状态
   */
  @Bind()
  handleUpdateState(record) {
    const {
      dispatch,
      configServer: { doMergeRulesList = {} },
    } = this.props;
    const newList = doMergeRulesList.map(item => {
      if (item.ruleId === record.ruleId) {
        return { ...item, isEdit: true };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'configServer/updateState',
      payload: {
        doMergeRulesList: newList,
      },
    });
  }

  @Bind()
  saveMergeRules() {
    const {
      dispatch,
      configServer: { doMergeRulesList = [] },
    } = this.props;
    const { organizationId } = this.state;
    const params = getEditTableData(doMergeRulesList);
    const editList = params.filter(item => item.isEdit);
    if (editList.length > 0) {
      dispatch({
        type: 'configServer/saveDocMergeRulesList',
        payload: {
          organizationId,
          editList,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleShowMergeRules();
        }
      });
    } else {
      this.handleShowMergeRules();
    }
  }

  render() {
    const {
      loading,
      updateLoading,
      docMergeRulesVisible,
      configServer: { doMergeRulesList = {} },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${docMergePrompt}.consignmentTypeMeaning`).d('业务类型'),
        dataIndex: 'consignmentTypeMeaning',
        width: 150,
        fixed: 'left',
      },
      {
        title: intl.get(`${docMergePrompt}.mergeCompanyFlag`).d('公司'),
        dataIndex: 'mergeCompanyFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeCompanyFlag', {
                initialValue: val,
              })(<Checkbox disabled />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeCurrencyFlag`).d('币种'),
        dataIndex: 'mergeCurrencyFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeCurrencyFlag', {
                initialValue: val,
              })(<Checkbox disabled={val === 1} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeSupplierFlag`).d('供应商'),
        dataIndex: 'mergeSupplierFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeSupplierFlag', {
                initialValue: val,
              })(<Checkbox disabled={val === 1} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeSupplierSiteFlag`).d('供应商地点'),
        dataIndex: 'mergeSupplierSiteFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeSupplierSiteFlag', {
                initialValue: val,
              })(<Checkbox disabled={val === 1} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeDrawerFlag`).d('出票方'),
        dataIndex: 'mergeDrawerFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeDrawerFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeBuFlag`).d('业务实体'),
        dataIndex: 'mergeBuFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeBuFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeInvOrgFlag`).d('库存组织'),
        dataIndex: 'mergeInvOrgFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeInvOrgFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergePurchaseOrgFlag`).d('采购组织'),
        dataIndex: 'mergePurchaseOrgFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergePurchaseOrgFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeAgentFlag`).d('采购员'),
        dataIndex: 'mergeAgentFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeAgentFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergePoTypeFlag`).d('订单类型'),
        dataIndex: 'mergePoTypeFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergePoTypeFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeItemFlag`).d('物料'),
        dataIndex: 'mergeItemFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeItemFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.mergeTaxFlag`).d('税率'),
        dataIndex: 'mergeTaxFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('mergeTaxFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: intl.get(`${docMergePrompt}.qtyPositiveFlag`).d('并单后数量必须为正'),
        dataIndex: 'qtyPositiveFlag',
        render: (val, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('qtyPositiveFlag', {
                initialValue: val,
              })(<Checkbox onChange={() => this.handleUpdateState(record)} />)}
            </Form.Item>
          );
        },
      },
    ];
    return (
      <Modal
        title={intl.get(`${docMergePrompt}.title`).d('对账及开票并单规则')}
        width={1000}
        onCancel={this.handleShowMergeRules}
        visible={docMergeRulesVisible}
        onOk={this.saveMergeRules}
        confirmLoading={updateLoading}
        className={styles['ant-modal']}
      >
        <EditTable
          dataSource={doMergeRulesList}
          rowKey="ruleId"
          columns={columns}
          bordered
          scroll={{ x: 1250 }}
          loading={loading}
          pagination={false}
        />
      </Modal>
    );
  }
}
