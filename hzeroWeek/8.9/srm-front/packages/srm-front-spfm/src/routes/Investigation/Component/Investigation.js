/**
 * 调查表填写和预览
 * @date: 2018-8-21
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty, forEach, camelCase, map, isArray, isNumber, isFunction } from 'lodash';

import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import InvestigationTab from './index';
import './index.less';
import {
  investigationTemplateHeaderQueryAll,
  fetchDataSource,
  saveData,
  submit,
  deleteData,
} from '@/services/investigationService';

/**
 * 调查表填写和预览
 * @extends {Component} - React.Component
 * 需要传的值
 * @reactProps {Boolean} isQueryData true 查询调查表数据 fasle 不查询调查表数据
 * @reactProps {Boolean} isEdit true 可编辑 fasle 不可编辑
 * @reactProps {String} tabPosition 'bottom' | 'top' | 'left' | 'right' = 'right';
 * @reactProps {Number} investigateTemplateId 模板Id
 * @reactProps {Number} investgHeaderId 模板头Id
 * @reactProps {Number} organizationId 租户Id
 * @reactProps {Function} onChangeSaveLoading 改变保存按钮的loading
 * @reactProps {Function} onChangeSubmitLoading 改变提交按钮的loading
 * @reactProps {Function} onRefresh 保存后刷新的回调函数
 *
 *返回的值
 * @reactProps {Function} onSubmitHook 提交函数
 * @reactProps {Function} onSaveValidateDataHook 保存函数
 *
 *
 * @reactProps {Object} config tab配置信息
 * @reactProps {Object} dataSource 数据源
 * @return React.element
 */
export default class Investigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      spinning: true,
      isQueryData: props.isQueryData || true,
      isEdit: props.isEdit || false,
      tabPosition: props.tabPosition || 'left',
      investigateTemplateId: props.investigateTemplateId,
      investgHeaderId: props.investgHeaderId,
      onRefresh: props.onRefresh, // 刷新的方法
      config: [], // 调查表配置
      dataSource: {}, // 数据源
      activeKey: '', // tab的activeKey
      loadTab: {}, // 保存点击的Tab的key
      // saving: false,
      // submiting: false,
      organizationId: props.organizationId, // 租户Id
      rowKeys: {
        sslmInvestgProservice: 'investgProserviceId',
        sslmInvestgFin: 'investgFinId',
        sslmInvestgFinBranch: 'investgFinBranchId',
        sslmInvestgAuth: 'investgAuthId',
        sslmInvestgContact: 'investgContactId',
        sslmInvestgAddress: 'investgAddressId',
        sslmInvestgBankAccount: 'investgBankAccountId',
        sslmInvestgCustomer: 'investgCustomerId',
        sslmInvestgSubSupplier: 'investgSubSupplierId',
        sslmInvestgEquipment: 'investgEquipmentId',
        sslmInvestgAttachment: 'investgAttachmentId',
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = { ...prevState };
    const { investigateTemplateId, isEdit, isQueryData = true, investgHeaderId } = nextProps;
    if (investigateTemplateId !== prevState.investigateTemplateId) {
      nextState.investigateTemplateId = investigateTemplateId;
    }
    if (isEdit !== prevState.isEdit) {
      nextState.isEdit = isEdit;
    }
    if (isQueryData !== prevState.isQueryData) {
      nextState.isQueryData = isQueryData;
    }
    if (investgHeaderId !== prevState.investgHeaderId) {
      nextState.investgHeaderId = investgHeaderId;
    }
    if (!isQueryData) {
      nextState.dataSource = {};
    }
    return nextState;
  }

  componentDidMount() {
    this.fetchConfig();
    const { onSubmitHook, onSaveValidateDataHook } = this.props;
    if (isFunction(onSubmitHook)) {
      onSubmitHook(this.handleSubmit);
    }
    if (isFunction(onSaveValidateDataHook)) {
      onSaveValidateDataHook(this.handleSave);
    }
  }

  /**
   * 查询config配置(调查表配置)
   */
  @Bind()
  fetchConfig() {
    const { investigateTemplateId, organizationId } = this.state;
    if (investigateTemplateId && (organizationId || organizationId === 0)) {
      investigationTemplateHeaderQueryAll({ investigateTemplateId, organizationId }).then(
        response => {
          this.setState({
            spinning: false,
          });
          const data = getResponse(response);
          if (!isEmpty(data)) {
            const activeKey =
              data.investigateConfigHeaders &&
              data.investigateConfigHeaders[0] &&
              data.investigateConfigHeaders[0].configName;
            this.setState({ config: this.dealConfigData(data), activeKey });
            if (activeKey) {
              this.handleChangeTab(activeKey);
            }
          }
        }
      );
    }
  }

  /**
   * 处理config
   */
  @Bind()
  dealConfigData(config) {
    const configHeaders = {};
    const configLines = {};
    const headers = [];
    // 处理头 处理 tab
    forEach(config.investigateConfigHeaders, header => {
      configHeaders[header.investgCfHeaderId] = header;
      configHeaders[header.investgCfHeaderId].lines = [];
      headers.push(header);
    });

    // 处理行 处理字段
    forEach(config.investigateConfigLines, line => {
      configLines[line.investgCfLineId] = line;
      configLines[line.investgCfLineId].fieldCode = camelCase(line.fieldCode);
      const lines =
        configHeaders[line.investgCfHeaderId] && configHeaders[line.investgCfHeaderId].lines;
      if (lines) {
        lines.push(line);
        configLines[line.investgCfLineId].props = [];
      }
    });

    // 处理属性
    forEach(config.investigateConfigComponents, componentProp => {
      const props =
        configLines[componentProp.investgCfLineId] &&
        configLines[componentProp.investgCfLineId].props;
      if (props) {
        props.push(componentProp);
      }
    });
    return headers;
  }

  /**
   * 切换Tab时执行/查询数据
   */
  @Bind()
  handleChangeTab(configName) {
    const { loadTab, isQueryData } = this.state;
    if (!loadTab[configName] && isQueryData) {
      this.loadData(configName);
    }
    loadTab[configName] = true;
    this.setState({ activeKey: configName, loadTab });
  }

  /**
   * 查询数据
   * @param {*} configName - tab页的key, 后台接口名
   */
  @Bind()
  loadData(configName) {
    const { investgHeaderId, organizationId } = this.state;
    if (isNumber(investgHeaderId) && !isEmpty(configName)) {
      this.setState({ loading: true });
      fetchDataSource({ configName, organizationId, investgHeaderId }).then(response => {
        const data = getResponse(response);
        // 更新dataSource
        this.setState(prevState => {
          const { dataSource } = prevState;
          const newDataSource = this.updateDataSource(dataSource, data, configName);
          return {
            dataSource: newDataSource,
          };
        });
        this.setState({ loading: false });
      });
    }
  }

  /**
   * 更新dataSource
   * @param {Object} dataSource 数据源
   * @param {Object} data 查询某页的信息
   * @param {String} configName tab的key
   */
  @Bind()
  updateDataSource(dataSource, data, configName) {
    return {
      ...dataSource,
      [configName]: data,
    };
  }

  /**
   * 获取和验证表单信息
   */
  onGetValidateDataSourceHooks = {
    sslmInvestgBasic: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgBasic = getBaseValidateDataSource;
    },
    sslmInvestgBusiness: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgBusiness = getBaseValidateDataSource;
    },
    sslmInvestgProservice: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgProservice = getBaseValidateDataSource;
    },
    sslmInvestgFin: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgFin = getBaseValidateDataSource;
    },
    sslmInvestgFinBranch: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgFinBranch = getBaseValidateDataSource;
    },
    sslmInvestgAuth: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgAuth = getBaseValidateDataSource;
    },
    sslmInvestgContact: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgContact = getBaseValidateDataSource;
    },
    sslmInvestgAddress: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgAddress = getBaseValidateDataSource;
    },
    sslmInvestgBankAccount: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgBankAccount = getBaseValidateDataSource;
    },
    sslmInvestgCustomer: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgCustomer = getBaseValidateDataSource;
    },
    sslmInvestgSubSupplier: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgSubSupplier = getBaseValidateDataSource;
    },
    sslmInvestgEquipment: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgEquipment = getBaseValidateDataSource;
    },
    sslmInvestgRd: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgRd = getBaseValidateDataSource;
    },
    sslmInvestgProduce: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgProduce = getBaseValidateDataSource;
    },
    sslmInvestgQa: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgQa = getBaseValidateDataSource;
    },
    sslmInvestgCustservice: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgCustservice = getBaseValidateDataSource;
    },
    sslmInvestgAttachment: getBaseValidateDataSource => {
      this.getValidateDataSources.sslmInvestgAttachment = getBaseValidateDataSource;
    },
  };

  getValidateDataSources = {};

  /**
   *保存数据
   *
   * @param {Object} headerInfo 调查表头信息，可不传
   */
  @Bind()
  async handleSave(headerInfo) {
    try {
      const { organizationId, investgHeaderId, loadTab } = this.state;
      const getAllData = [];
      const getAllDataSeq = [];
      forEach(Object.keys(loadTab), configName => {
        getAllDataSeq.push(configName);
        getAllData.push(this.getValidateDataSources[configName]());
      });
      const params = {}; // 保存的数据
      const data = await Promise.all(getAllData);
      forEach(getAllDataSeq, (configName, index) => {
        if (isArray(data[index])) {
          params[configName] = map(data[index], record => {
            return { ...record, tenantId: organizationId, investgHeaderId };
          });
        } else {
          params[configName] = { ...data[index], tenantId: organizationId, investgHeaderId };
        }
      });
      if (!isEmpty(headerInfo)) {
        params.headerInfo = headerInfo;
      }
      this.saveData(params);
    } catch (errObj) {
      const { tabTitle, err, parentTabTitle } = errObj;
      // 数据校验失败
      const messageElement = [];
      forEach(err, (value, index) => {
        messageElement.push(<div key={index}>{value.errors[0].message}</div>);
      });
      notification.warning({
        message: parentTabTitle ? `${parentTabTitle} - ${tabTitle}` : tabTitle,
        description: messageElement,
      });
    }
  }

  /**
   * 保存数据调用接口
   * @param {Object} payload 保存的数据
   */
  @Bind()
  saveData(payload) {
    const { investgHeaderId, organizationId, activeKey, onRefresh } = this.state;
    const { onChangeSaveLoading = e => e } = this.props;
    onChangeSaveLoading(true);
    saveData(payload, investgHeaderId, organizationId).then(response => {
      if (isEmpty(response)) {
        this.setState({ loadTab: { [activeKey]: true }, dataSource: {} }, () => {
          this.loadData(activeKey);
        });
        onChangeSaveLoading(false);
        notification.success();
        if (isFunction(onRefresh)) {
          onRefresh();
        }
      } else {
        onChangeSaveLoading(false);
        return getResponse(response);
      }
    });
  }

  /**
   * 提交调查表
   * @param {Function} handleToList 提交成功后的回调函数(跳转页面)
   * @param {Object} headerInfo 调查表头
   */
  @Bind()
  async handleSubmit(handleToList, headerInfo) {
    const { investgHeaderId, organizationId, activeKey, onRefresh, loadTab } = this.state;
    const { onChangeSubmitLoading = e => e } = this.props;
    try {
      const getAllData = [];
      const getAllDataSeq = [];
      forEach(Object.keys(loadTab), configName => {
        getAllDataSeq.push(configName);
        getAllData.push(this.getValidateDataSources[configName]());
      });
      const params = {};
      const data = await Promise.all(getAllData);
      forEach(getAllDataSeq, (configName, index) => {
        if (isArray(data[index])) {
          params[configName] = map(data[index], record => {
            return { ...record, tenantId: organizationId, investgHeaderId };
          });
        } else {
          params[configName] = { ...data[index], tenantId: organizationId, investgHeaderId };
        }
      });
      if (!isEmpty(headerInfo)) {
        params.headerInfo = headerInfo;
      }
      onChangeSubmitLoading(true);
      submit(investgHeaderId, organizationId, params).then(response => {
        if (response && response.failed === true) {
          onChangeSubmitLoading(false);
          return getResponse(response);
        } else {
          onChangeSubmitLoading(false);
          notification.success();
          if (isFunction(onRefresh)) {
            onRefresh();
          }
          if (isFunction(handleToList)) {
            handleToList();
          }
        }
        this.loadData(activeKey);
      });
    } catch (errObj) {
      // 数据校验失败
      const messageElement = [];
      forEach(errObj, (value, index) => {
        messageElement.push(<div key={index}>{value.errors[0].message}</div>);
      });
      notification.warning({
        message: messageElement,
      });
    }
  }

  /**
   * 获取需要删除的rowKeys
   */
  onRemoves = {
    sslmInvestgProservice: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgProservice', rowKeys, { onOk });
    },
    sslmInvestgFin: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgFin', rowKeys, { onOk });
    },
    sslmInvestgFinBranch: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgFinBranch', rowKeys, { onOk });
    },
    sslmInvestgAuth: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgAuth', rowKeys, { onOk });
    },
    sslmInvestgContact: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgContact', rowKeys, { onOk });
    },
    sslmInvestgAddress: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgAddress', rowKeys, { onOk });
    },
    sslmInvestgBankAccount: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgBankAccount', rowKeys, { onOk });
    },
    sslmInvestgCustomer: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgCustomer', rowKeys, { onOk });
    },
    sslmInvestgSubSupplier: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgSubSupplier', rowKeys, { onOk });
    },
    sslmInvestgEquipment: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgEquipment', rowKeys, { onOk });
    },
    sslmInvestgAttachment: (rowKeys, rows, { onOk }) => {
      this.deleteData('sslmInvestgAttachment', rowKeys, { onOk });
    },
  };

  /**
   * 删除数据
   * @param {String} configName tab的key
   * @param {Object} rowKeys 勾选中的行
   * @param {Function} onOk 删除成功的函数
   */
  @Bind()
  deleteData(configName, rowKeys, { onOk }) {
    const { organizationId } = this.state;
    deleteData(configName, rowKeys, organizationId).then(response => {
      if (isEmpty(response)) {
        notification.success();
        onOk();
      } else {
        return getResponse(response);
      }
    });
  }

  render() {
    const {
      isEdit,
      config,
      dataSource,
      rowKeys,
      tabPosition,
      organizationId,
      loading,
      spinning,
    } = this.state;
    return (
      <Spin spinning={spinning}>
        <InvestigationTab
          edit={isEdit}
          tabPosition={tabPosition}
          organizationId={organizationId}
          // 当前页面的属性
          config={config}
          dataSource={dataSource}
          rowKeys={rowKeys}
          loading={loading}
          onTabChange={this.handleChangeTab}
          onGetValidateDataSourceHooks={this.onGetValidateDataSourceHooks}
          onRemoves={this.onRemoves}
        />
      </Spin>
    );
  }
}
