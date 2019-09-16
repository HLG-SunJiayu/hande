/**
 * Tabs - 预览的 tabs
 * @date Mon Aug 13 2018
 * @author WY  yang.wang06@hand-china.com
 * @copyright Copyright(c) 2018 Hand
 */

import React from 'react';
import { Tabs } from 'hzero-ui';
import { map, isEmpty, isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';

import ComposeForm from 'components/Compose/ComposeForm';
import ComposeTable from 'components/Compose/ComposeTable';
import styles from './index.less';
import AddressWrapperComponent from './AddressWrapperComponent';

const { TabPane } = Tabs;

const promptCode = 'spfm.investigationDefinition';

const ComponentContext = React.createContext();

/**
 *
 * @param {Object} header - 头
 * @param {Number} organizationId
 * @param {Boolean} edit
 * @param {{[string]: Function}} onRemoves
 * @param {{[string]: String}} rowKeys
 * @param {{[string]: Function}} onRefs
 * @param {{[string]: Function}} onGetValidateDataSourceHooks
 * @param {String} disableStyle
 * @param {String} bucketName
 * @param {String} parentTabTitle
 */
function getTabPane(
  header,
  {
    organizationId,
    edit,
    onRemoves = {},
    rowKeys = {},
    onRefs = {},
    onGetValidateDataSourceHooks = {},
    disableStyle,
  },
  parentTabTitle = ''
) {
  switch (header.configName) {
    case 'sslmInvestgBasic': // 基本信息
    case 'sslmInvestgBusiness': // 业务信息
    case 'sslmInvestgRd': // 研发能力 // 研发与生产能力
    case 'sslmInvestgProduce': // 生产能力 // 研发与生产能力
    case 'sslmInvestgQa': // 质保能力 // 质保与售后服务
    case 'sslmInvestgCustservice': // 售后服务 // 质保与售后服务
      return (
        <TabPane tab={header.configDescription} key={header.configName}>
          <ComponentContext.Consumer>
            {({ dataSource, loading }) => {
              return (
                <ComposeForm
                  editable={edit}
                  fields={header.lines}
                  dataSource={dataSource[header.configName] || {}}
                  organizationId={organizationId}
                  onRef={onRefs[header.configName]}
                  onGetValidateDataSourceHook={onGetValidateDataSourceHooks[header.configName]}
                  fieldLabelWidth={150}
                  disableStyle={disableStyle}
                  loading={loading}
                  tabTitle={header.configDescription}
                  tabName={header.configName}
                  parentTabName={parentTabTitle}
                />
              );
            }}
          </ComponentContext.Consumer>
        </TabPane>
      );
    // case 'sslmInvestgFinBranch': // 分支机构 // 财务状况
    // case 'sslmInvestgAddress': // 地址信息 // 联系人及地址信息
    case 'sslmInvestgProservice': // 产品及服务
    case 'sslmInvestgFin': // 近三年财务状况 // 财务状况
    case 'sslmInvestgAuth': // 资质信息
    case 'sslmInvestgContact': // 联系人信息 // 联系人及地址信息
    case 'sslmInvestgBankAccount': // 开户行信息
    case 'sslmInvestgCustomer': // 主要客户情况 // 合作伙伴
    case 'sslmInvestgSubSupplier': // 分供方情况 // 合作伙伴
    case 'sslmInvestgEquipment': // 设备信息
    case 'sslmInvestgAttachment': // 附件信息
      return (
        <TabPane tab={header.configDescription} key={header.configName}>
          <ComponentContext.Consumer>
            {({ dataSource, loading }) => {
              return (
                <ComposeTable
                  editModalTitle={header.configDescription}
                  fields={header.lines}
                  dataSource={dataSource[header.configName] || []}
                  addable={edit}
                  editable={edit}
                  removable={edit}
                  rowKey={rowKeys[header.configName] || 'id'}
                  organizationId={organizationId}
                  onRemove={onRemoves[header.configName]}
                  onRef={onRefs[header.configName]}
                  onGetValidateDataSourceHook={onGetValidateDataSourceHooks[header.configName]}
                  fieldLabelWidth={150}
                  loading={loading}
                />
              );
            }}
          </ComponentContext.Consumer>
        </TabPane>
      );
    case 'sslmInvestgFinBranch': // 分支机构 // 财务状况
    case 'sslmInvestgAddress': // 地址信息 // 联系人及地址信息
      return (
        <TabPane tab={header.configDescription} key={header.configName}>
          <ComponentContext.Consumer>
            {({ dataSource, loading }) => {
              return (
                <AddressWrapperComponent>
                  <ComposeTable
                    editModalTitle={header.configDescription}
                    fields={header.lines}
                    dataSource={dataSource[header.configName] || []}
                    addable={edit}
                    editable={edit}
                    removable={edit}
                    rowKey={rowKeys[header.configName] || 'id'}
                    organizationId={organizationId}
                    onRemove={onRemoves[header.configName]}
                    onRef={onRefs[header.configName]}
                    onGetValidateDataSourceHook={onGetValidateDataSourceHooks[header.configName]}
                    fieldLabelWidth={150}
                    loading={loading}
                  />
                </AddressWrapperComponent>
              );
            }}
          </ComponentContext.Consumer>
        </TabPane>
      );
    default:
      return null;
  }
}

@formatterCollections({ code: 'spfm.investigationDefinition' })
export default class InvestigationTab extends React.Component {
  state = {
    // 为了在静态生命周期时,将实例方法绑定到子组件的事件
    handleChildTabKeyChange: this.handleChildTabKeyChange,
    // 为了设置 子标签页的初始 activeKey
    setChildTabKeys: this.setChildTabKeys,
  };

  tabKeys = {
    // 基础信息
    sslmInvestgBasic: 'sslmInvestgBasic',
    // 业务信息
    sslmInvestgBusiness: 'sslmInvestgBusiness',
    // 产品及服务
    sslmInvestgProservice: 'sslmInvestgProservice',
    // 财务状况
    // sslmInvestgFin: 'sslmInvestgFin',
    // sslmInvestgFin: 'sslmInvestgFin', // 近三年财务状况 // 财务状况
    // sslmInvestgFinBranch: 'sslmInvestgFinBranch', // 分支机构 // 财务状况
    // 资质信息
    sslmInvestgAuth: 'sslmInvestgAuth',
    // 联系人及地址信息
    // sslmInvestgContactAddress: 'sslmInvestgContactAddress',
    // sslmInvestgContact: 'sslmInvestgContact', // 联系人信息 // 联系人及地址信息
    // sslmInvestgAddress: 'sslmInvestgAddress', // 地址信息 // 联系人及地址信息
    // 开户行信息
    sslmInvestgBankAccount: 'sslmInvestgBankAccount',
    // 合作伙伴信息
    // sslmInvestgCustomerSupplier: 'sslmInvestgCustomerSupplier',
    // sslmInvestgCustomer: 'sslmInvestgCustomer', // 主要客户情况 // 合作伙伴
    // sslmInvestgSubSupplier: 'sslmInvestgSubSupplier', // 分供方情况 // 合作伙伴
    // 设备信息
    sslmInvestgEquipment: 'sslmInvestgEquipment',
    // 研发与生产能力
    // sslmInvestgRdProduce: 'sslmInvestgRdProduce',
    // sslmInvestgRd: 'sslmInvestgRd', // 研发能力 // 研发与生产能力
    // sslmInvestgProduce: 'sslmInvestgProduce', // 生产能力 // 研发与生产能力
    // 质保与售后服务
    // sslmInvestgQaCustService: 'sslmInvestgQaCustService',
    // sslmInvestgQa: 'sslmInvestgQa', // 质保能力 // 质保与售后服务
    // sslmInvestgCustservice: 'sslmInvestgCustservice', // 售后服务 // 质保与售后服务
    // 附件信息
    sslmInvestgAttachment: 'sslmInvestgAttachment',
  };

  static defaultProps = {
    edit: false,
    onRemoves: {},
    dataSource: {},
    config: [],
    rowKeys: {},
    // 获取 ComposeTable 或者 ComposeForm 的 方法
    // onRefs: {},
    // 获取 获取校验数据的方法
    // onGetValidateDataSourceHooks: {},
    // tab 切换
    // onTabChange: function(configName),
    disableStyle: 'value',
    tabPosition: 'top',
    loading: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { config, edit } = nextProps;
    const { handleChildTabKeyChange = () => {}, setChildTabKeys = () => {} } = prevState;
    const nextState = {};
    if (config !== prevState.config || prevState.edit !== edit) {
      const configHeader = {};
      map(config, h => {
        configHeader[h.configName] = h;
      });
      // nextState.configHeader = configHeader;
      nextState.config = config;
      nextState.edit = edit;
      const tabs = [];
      if (configHeader.sslmInvestgBasic) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.basic`).d('基础信息')}
            key="sslmInvestgBasic"
          >
            <Tabs animated={false}>{getTabPane(configHeader.sslmInvestgBasic, nextProps)}</Tabs>
          </TabPane>
        );
        // tabs.push(getTabPane(configHeader.sslmInvestgBasic, nextProps));
      }
      if (configHeader.sslmInvestgBusiness) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.business`).d('业务信息')}
            key="sslmInvestgBusiness"
          >
            <Tabs animated={false}>{getTabPane(configHeader.sslmInvestgBusiness, nextProps)}</Tabs>
          </TabPane>
        );
        // tabs.push(getTabPane(configHeader.sslmInvestgBusiness, nextProps));
      }
      if (configHeader.sslmInvestgProservice) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.proservice`).d('产品及服务')}
            key="sslmInvestgProservice"
          >
            <Tabs animated={false}>
              {getTabPane(configHeader.sslmInvestgProservice, nextProps)}
            </Tabs>
          </TabPane>
        );
        // tabs.push(getTabPane(configHeader.sslmInvestgProservice, nextProps));
      }
      const finTabs = [];
      let finTabFirstTab = '';
      if (configHeader.sslmInvestgFin) {
        finTabs.push(getTabPane(configHeader.sslmInvestgFin, nextProps));
        finTabFirstTab = 'sslmInvestgFin';
      }
      if (configHeader.sslmInvestgFinBranch) {
        finTabs.push(getTabPane(configHeader.sslmInvestgFinBranch, nextProps));
        // 将第一个 子tabKey 放入对应的父 tabKey
        if (!finTabFirstTab) {
          finTabFirstTab = 'sslmInvestgFinBranch';
        }
      }
      setChildTabKeys('sslmInvestgFin', finTabFirstTab);
      if (finTabs.length > 0) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.finAndBranch`).d('财务状况')}
            key="sslmInvestgFin"
          >
            <Tabs
              animated={false}
              onChange={activeKey => {
                handleChildTabKeyChange('sslmInvestgFin', activeKey);
              }}
            >
              {finTabs}
            </Tabs>
          </TabPane>
        );
      }
      // } else if (finTabs.length === 1) {
      //   tabs.push(finTabs);
      // }
      if (configHeader.sslmInvestgAuth) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.auth`).d('资质信息')}
            key="sslmInvestgAuth"
          >
            <Tabs animated={false}>{getTabPane(configHeader.sslmInvestgAuth, nextProps)}</Tabs>
          </TabPane>
        );
        // tabs.push(getTabPane(configHeader.sslmInvestgAuth, nextProps));
      }
      const contactAndAddressTabs = [];
      let contactAndAddressFirstTab = '';
      if (configHeader.sslmInvestgContact) {
        contactAndAddressTabs.push(getTabPane(configHeader.sslmInvestgContact, nextProps));
        contactAndAddressFirstTab = 'sslmInvestgContact';
      }
      if (configHeader.sslmInvestgAddress) {
        contactAndAddressTabs.push(getTabPane(configHeader.sslmInvestgAddress, nextProps));
        if (!contactAndAddressFirstTab) {
          contactAndAddressFirstTab = 'sslmInvestgAddress';
        }
      }
      setChildTabKeys('sslmInvestgContactAddress', contactAndAddressFirstTab);
      if (contactAndAddressTabs.length > 0) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.contactAddress`).d('联系人及地址')}
            key="sslmInvestgContactAddress"
          >
            <Tabs
              animated={false}
              onChange={activeKey => {
                handleChildTabKeyChange('sslmInvestgContactAddress', activeKey);
              }}
            >
              {contactAndAddressTabs}
            </Tabs>
          </TabPane>
        );
      }
      // } else if (contactAndAddressTabs.length === 1) {
      //   tabs.push(contactAndAddressTabs);
      // }
      if (configHeader.sslmInvestgBankAccount) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.bankAccount`).d('开户行信息')}
            key="sslmInvestgBankAccount"
          >
            <Tabs animated={false}>
              {getTabPane(configHeader.sslmInvestgBankAccount, nextProps)}
            </Tabs>
          </TabPane>
        );
        // tabs.push(getTabPane(configHeader.sslmInvestgBankAccount, nextProps));
      }
      const customerAndSupplierTabs = [];
      let customerAndSupplierFirstTab = '';
      if (configHeader.sslmInvestgCustomer) {
        customerAndSupplierTabs.push(getTabPane(configHeader.sslmInvestgCustomer, nextProps));
        customerAndSupplierFirstTab = 'sslmInvestgCustomer';
      }
      if (configHeader.sslmInvestgSubSupplier) {
        customerAndSupplierTabs.push(getTabPane(configHeader.sslmInvestgSubSupplier, nextProps));
        if (!customerAndSupplierFirstTab) {
          customerAndSupplierFirstTab = 'sslmInvestgSubSupplier';
        }
      }
      setChildTabKeys('sslmInvestgCustomerSupplier', customerAndSupplierFirstTab);
      if (customerAndSupplierTabs.length > 0) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.partner`).d('合作伙伴')}
            key="sslmInvestgCustomerSupplier"
          >
            <Tabs
              animated={false}
              onChange={activeKey => {
                handleChildTabKeyChange('sslmInvestgCustomerSupplier', activeKey);
              }}
            >
              {customerAndSupplierTabs}
            </Tabs>
          </TabPane>
        );
      }
      // } else if (customerAndSupplierTabs.length === 1) {
      //   tabs.push(customerAndSupplierTabs);
      // }
      if (configHeader.sslmInvestgEquipment) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.equipment`).d('设备信息')}
            key="sslmInvestgEquipment"
          >
            <Tabs animated={false}>{getTabPane(configHeader.sslmInvestgEquipment, nextProps)}</Tabs>
          </TabPane>
        );
        // tabs.push(getTabPane(configHeader.sslmInvestgEquipment, nextProps));
      }
      const rdAndProduceTabs = [];
      let rdAndProduceFirstTab = '';
      if (configHeader.sslmInvestgRd) {
        rdAndProduceTabs.push(
          getTabPane(
            configHeader.sslmInvestgRd,
            nextProps,
            intl.get(`${promptCode}.view.message.tab.rdProduce`).d('研发与生产')
          )
        );
        rdAndProduceFirstTab = 'sslmInvestgRd';
      }
      if (configHeader.sslmInvestgProduce) {
        rdAndProduceTabs.push(
          getTabPane(
            configHeader.sslmInvestgProduce,
            nextProps,
            intl.get(`${promptCode}.view.message.tab.rdProduce`).d('研发与生产')
          )
        );
        if (!rdAndProduceFirstTab) {
          rdAndProduceFirstTab = 'sslmInvestgProduce';
        }
      }
      setChildTabKeys('sslmInvestgRdProduce', rdAndProduceFirstTab);
      if (rdAndProduceTabs.length > 0) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.rdProduce`).d('研发与生产')}
            key="sslmInvestgRdProduce"
          >
            <Tabs
              animated={false}
              onChange={activeKey => {
                handleChildTabKeyChange('sslmInvestgRdProduce', activeKey);
              }}
            >
              {rdAndProduceTabs}
            </Tabs>
          </TabPane>
        );
      }
      // } else if (rdAndProduceTabs.length === 1) {
      //   tabs.push(rdAndProduceTabs);
      // }
      const qaAndCustServiceTabs = [];
      let qaAndCustServiceFirstTab = '';
      if (configHeader.sslmInvestgQa) {
        qaAndCustServiceTabs.push(
          getTabPane(
            configHeader.sslmInvestgQa,
            nextProps,
            intl.get(`${promptCode}.view.message.tab.qaCustservice`).d('质保与售后')
          )
        );
        qaAndCustServiceFirstTab = 'sslmInvestgQa';
      }
      if (configHeader.sslmInvestgCustservice) {
        qaAndCustServiceTabs.push(
          getTabPane(
            configHeader.sslmInvestgCustservice,
            nextProps,
            intl.get(`${promptCode}.view.message.tab.qaCustservice`).d('质保与售后')
          )
        );
        if (!qaAndCustServiceFirstTab) {
          qaAndCustServiceFirstTab = 'sslmInvestgCustservice';
        }
      }
      setChildTabKeys('sslmInvestgQaCustService', qaAndCustServiceFirstTab);
      if (qaAndCustServiceTabs.length > 0) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.qaCustservice`).d('质保与售后')}
            key="sslmInvestgQaCustService"
          >
            <Tabs
              animated={false}
              onChange={activeKey => {
                handleChildTabKeyChange('sslmInvestgQaCustService', activeKey);
              }}
            >
              {qaAndCustServiceTabs}
            </Tabs>
          </TabPane>
        );
      }
      // } else if (qaAndCustServiceTabs.length === 1) {
      //   tabs.push(qaAndCustServiceTabs);
      // }
      if (configHeader.sslmInvestgAttachment) {
        tabs.push(
          <TabPane
            tab={intl.get(`${promptCode}.view.message.tab.attachment`).d('附件信息')}
            key="sslmInvestgAttachment"
          >
            <Tabs animated={false}>
              {getTabPane(configHeader.sslmInvestgAttachment, nextProps)}
            </Tabs>
          </TabPane>
        );
        // tabs.push(getTabPane(configHeader.sslmInvestgAttachment, nextProps));
      }
      nextState.tabs = tabs;
    }
    return nextState;
  }

  @Bind()
  handleParentTabKeyChange(activeKey) {
    if (!isEmpty(this.tabKeys[activeKey])) {
      const { onTabChange } = this.props;
      if (isFunction(onTabChange)) {
        onTabChange(this.tabKeys[activeKey]);
      }
    }
  }

  @Bind()
  handleChildTabKeyChange(pActiveKey, activeKey) {
    this.tabKeys[pActiveKey] = activeKey;
    const { onTabChange } = this.props;
    if (isFunction(onTabChange)) {
      onTabChange(activeKey);
    }
  }

  @Bind()
  setChildTabKeys(pTabKey, cTabKey) {
    if (isEmpty(this.tabKeys[pTabKey])) {
      this.tabKeys[pTabKey] = cTabKey;
    }
  }

  render() {
    const { tabs } = this.state;
    const { dataSource = {}, tabPosition = 'left', loading } = this.props;
    return (
      <ComponentContext.Provider value={{ dataSource, loading }}>
        <Tabs
          animated={false}
          tabPosition={tabPosition}
          onChange={this.handleParentTabKeyChange}
          className={styles['component-wrapper']}
        >
          {tabs}
        </Tabs>
      </ComponentContext.Provider>
    );
  }
}
