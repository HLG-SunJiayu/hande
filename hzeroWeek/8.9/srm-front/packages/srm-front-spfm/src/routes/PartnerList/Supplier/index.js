/**
 * index.js - 我的合作伙伴-我的供应商
 * @date: 2018-10-18
 * @author: geekrainy <chao.zheng02@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */

import React, { PureComponent, Fragment } from 'react';
import { Form, Row, Table, Button, Modal, Tabs } from 'hzero-ui';
import { connect } from 'dva';
import { isEmpty, cloneDeep } from 'lodash';
import { Bind } from 'lodash-decorators';
import cacheComponent from 'components/CacheComponent';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';
import PlatformFilterForm from './PlatformFilterForm';
import PlatformListTable from './PlatformListTable';
import ErpFilterForm from './ErpFilterForm';
import ErpListTable from './ErpListTable';
import styles from '../index.less';

const { TabPane } = Tabs;

@Form.create({ fieldNameProp: null })
@connect(({ loading, supplier }) => ({
  supplier,
  erpList: supplier.erpList || {},
  platformList: supplier.platformList || {},
  platformLoading: loading.effects['supplier/queryPlatformSupplier'],
  erpLoading: loading.effects['supplier/queryErpSupplier'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['spfm.supplier', 'entity.company'],
})
@cacheComponent({ cacheKey: 'hpfm.ErpSupplier' })
export default class ErpSupplier extends PureComponent {
  constructor(props) {
    super(props);
    this.erpFilter = {};
    this.platformFilter = {};
    this.rowKey = 'supplierId';
    this.queryPageSize = 10;
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    const {
      supplier: { platformPagination = {}, erpPagination = {} },
    } = this.props;
    this.handleErpSearch(erpPagination);
    this.handlePlatformSearch(platformPagination);
    this.handleEnable();
  }

  /**
   * 查询 ERP 供应商列表
   * @param {Object} params
   */
  @Bind()
  handleErpSearch(page) {
    const { dispatch, tenantId } = this.props;
    const values = (this.erpFilter.props && this.erpFilter.props.form.getFieldsValue()) || {};
    const { erpCreationDate } = values;
    dispatch({
      type: 'supplier/queryErpSupplier',
      payload: {
        page,
        tenantId,
        ...values,
        erpCreationDate: erpCreationDate ? moment(erpCreationDate).format(DEFAULT_DATE_FORMAT) : '',
      },
    }).then(res => {
      if (!isEmpty(res)) {
        this.setState(
          {
            selectedRowKeys: [],
          },
          () => {
            dispatch({
              type: 'supplier/updateState',
              payload: { editContent: [] },
            });
          }
        );
      }
    });
  }

  /**
   * 查询平台供应商列表
   * @param {Object} params
   */
  @Bind()
  handlePlatformSearch(page = {}) {
    const { dispatch, tenantId } = this.props;
    const values =
      (this.platformFilter.props && this.platformFilter.props.form.getFieldsValue()) || {};
    dispatch({
      type: 'supplier/queryPlatformSupplier',
      payload: {
        tenantId,
        page,
        ...values,
      },
    });
  }

  /**
   * 过滤，生成可提交数据
   * @param {Array} data 编辑或新增的数组列表
   * @param {Object} values 修改过的表单项
   */
  @Bind()
  filterData(data, values = {}) {
    const formValues = Object.keys(values) || [];
    const newData = cloneDeep(data);

    formValues.forEach(key => {
      const idx = key.match(/[#]/g) && key.match(/[#]/).index;
      if (idx || idx === 0) {
        const editKey = key.substr(idx + 1); // 去掉 # 的 key
        const findIndex = newData.findIndex(item => {
          return `${item[this.rowKey]}` === key.substr(0, idx);
        });
        if (findIndex !== -1) {
          const findLine = newData[findIndex];
          findLine[editKey] = values[key];
          newData.splice(findIndex, 1, findLine);
        }
      }
    });

    return newData.map(item => (item.isCreate ? { ...item, [this.rowKey]: null } : item));
  }

  /**
   * 校验成功按名称匹配关联供应商
   */
  @Bind()
  handleLink() {
    const {
      dispatch,
      supplier: { editContent = [], erpPagination = {} },
      form,
      tenantId,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const list = this.filterData(editContent, values).filter(item => !item.linkId); // 过滤已关联供应商
        dispatch({
          type: 'supplier/linkErpSupplier',
          payload: {
            tenantId,
            list,
          },
        }).then(res => {
          if (res.failedCounts === 0) {
            notification.success();
            this.handleErpSearch(erpPagination);
          } else {
            const { failedCounts, failedErpList: content } = res;
            const columns = [
              {
                title: intl.get('spfm.supplier.model.supplier.erp.supplierNum').d('供应商编码'),
                width: 80,
                align: 'left',
                dataIndex: 'supplierNum',
              },
              {
                title: intl.get('spfm.supplier.model.supplier.erp.supplierName').d('供应商名称'),
                width: 100,
                align: 'left',
                dataIndex: 'supplierName',
              },
            ];
            Modal.warning({
              title: intl
                .get('spfm.supplier.view.message.title', { failedCounts })
                .d(`匹配失败 ${failedCounts} 条`),
              content: <Table dataSource={content} columns={columns} size="small" />,
              onOk: () => {
                this.handleErpSearch(erpPagination);
              },
            });
          }
        });
      }
    });
  }

  /**
   * 取消关联供应商
   */
  @Bind()
  handleUnlink() {
    const {
      dispatch,
      supplier: { editContent = [], erpPagination = {} },
      tenantId,
    } = this.props;
    const list = editContent.filter(item => !!item.linkId); // 过滤未关联供应商
    dispatch({
      type: 'supplier/unlinkErpSupplier',
      payload: {
        tenantId,
        list,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleErpSearch(erpPagination);
      }
    });
  }

  /**
   * 启用禁用平台供应商
   * @param {Object} record
   */
  @Bind()
  toggleEnable(record) {
    const {
      dispatch,
      tenantId,
      supplier: { platformPagination = {} },
    } = this.props;
    const action = {
      type: `supplier/${record.enabledFlag ? 'disablePartner' : 'enablePartner'}`,
      payload: {
        ...record,
        tenantId,
        enabledFlag: !record.enabledFlag,
      },
    };

    dispatch(action).then(response => {
      if (response) {
        this.handlePlatformSearch(platformPagination);
      }
    });
  }

  /**
   * 跳转界面到导入Erp
   */
  @Bind()
  handleJumpPage() {
    openTab({
      title: intl.get('hzero.common.title.importErp').d('导入 ERP'),
      key: '/spfm/import-erp',
      path: '/spfm/import-erp',
      icon: 'to-top',
      closable: true,
    });
  }

  /**
   * 斯瑞德风险扫描内嵌页
   */
  @Bind()
  handleEmbedPage(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/riskEmbedPage',
      payload: {
        enterpriseName: record.supplierCompanyName,
      },
    }).then(url => {
      if (url) {
        window.open(url);
      }
    });
  }

  /**
   * 配置中心“我的合作伙伴”是否启用加入监控、风险扫描
   */
  @Bind()
  handleEnable() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/queryConfigEnable',
    });
  }

  render() {
    const {
      form,
      erpLoading,
      platformLoading,
      tenantId,
      dispatch,
      erpList,
      platformList,
      history,
      supplier: { erpPagination, platformPagination, addMonitor, riskScan },
    } = this.props;
    const { selectedRowKeys = [] } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (keys, selectedRows) => {
        this.setState({
          selectedRowKeys: keys,
        });
        dispatch({
          type: 'supplier/updateState',
          payload: {
            editContent: selectedRows.map(item => ({
              ...item,
              isEdit: true,
            })),
          },
        });
      },
    };
    const erpListProps = {
      loading: erpLoading,
      pagination: erpPagination,
      form,
      tenantId,
      rowSelection,
      rowKey: this.rowKey,
      dataSource: erpList.content,
      handleTableChange: this.handleErpSearch,
    };

    const platformListProps = {
      tenantId,
      addMonitor,
      riskScan,
      rowKey: 'partnerId',
      loading: platformLoading,
      pagination: platformPagination,
      dataSource: platformList.content,
      toggleEnable: this.toggleEnable,
      handleTableChange: this.handlePlatformSearch,
      handleEmbedPage: this.handleEmbedPage,
    };

    const erpFilterProps = {
      onSearch: this.handleErpSearch,
    };

    const platformFilterProps = {
      onSearch: this.handlePlatformSearch,
    };

    // ERP 供应商
    const erpComponent = (
      <React.Fragment>
        <div className="table-list-search">
          <ErpFilterForm
            onRef={ref => {
              this.erpFilter = ref;
            }}
            {...erpFilterProps}
          />
        </div>
        <Row style={{ marginBottom: 20, textAlign: 'right' }}>
          <Button
            icon="link"
            onClick={this.handleLink}
            style={{ marginRight: 8 }}
            disabled={isEmpty(selectedRowKeys)}
          >
            {intl.get('spfm.supplier.view.button.link').d('匹配关联')}
          </Button>
          <Button icon="disconnect" onClick={this.handleUnlink} disabled={isEmpty(selectedRowKeys)}>
            {intl.get('spfm.supplier.view.button.unlink').d('取消关联')}
          </Button>
        </Row>
        <ErpListTable {...erpListProps} />
      </React.Fragment>
    );

    // 平台供应商
    const platformComponent = (
      <React.Fragment>
        <div className="table-list-search">
          <PlatformFilterForm
            onRef={ref => {
              this.platformFilter = ref;
            }}
            {...platformFilterProps}
          />
        </div>
        <Row style={{ marginBottom: 20, textAlign: 'right' }}>
          <Button
            icon="eye"
            onClick={() => history.push('/spfm/company-search/supplier')}
            style={{ marginRight: 8 }}
          >
            {intl.get('spfm.supplier.view.button.findSupplier').d('发现供应商')}
          </Button>
          {/* <Button icon="usergroup-add" onClick={this.handleDeleteLov} style={{ marginRight: 8 }}>
            {intl.get('spfm.supplier.view.button.extendSupplier').d('扩展供应商')}
          </Button> */}
          <Button icon="to-top" type="primary" onClick={this.handleJumpPage}>
            {intl.get('spfm.supplier.view.button.importErp').d('导入 ERP')}
          </Button>
        </Row>
        <PlatformListTable {...platformListProps} />
      </React.Fragment>
    );

    return (
      <Fragment>
        <Tabs
          defaultActiveKey="platform"
          animated={false}
          tabPosition="left"
          className={styles['supplier-wrap']}
        >
          <TabPane
            tab={intl.get('spfm.supplier.view.router.supplier.platform').d('平台供应商')}
            key="platform"
          >
            {platformComponent}
          </TabPane>
          <TabPane
            tab={intl.get('spfm.supplier.view.router.supplier.erp').d('ERP 供应商')}
            key="erp"
          >
            {erpComponent}
          </TabPane>
        </Tabs>
      </Fragment>
    );
  }
}
