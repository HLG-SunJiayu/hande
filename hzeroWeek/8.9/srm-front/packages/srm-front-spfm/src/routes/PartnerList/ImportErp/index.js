/**
 * ImportErp - 导入Erp入口
 * @date: 2019-1-8
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Input } from 'hzero-ui';
import { Bind, Debounce } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';

import { Content, Header } from 'components/Page';
import EditTable from 'components/EditTable';
import Checkbox from 'components/Checkbox';
import Lov from 'components/Lov';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { filterNullValueObject, getEditTableData } from 'utils/utils';
import { yesOrNoRender } from 'utils/renderer';

import FilterForm from './FilterForm';
import PurchaseFinance from './Tables/PurchaseFinance';
import SupplierAddress from './Tables/SupplierAddress';
import SupplierAccount from './Tables/SupplierAccount';
import SupplierContact from './Tables/SupplierContact';

const promptCode = 'spfm.importErp';

/**
 * 导入Erp入口
 * @extends {Component} - PureComponent
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
  loading: loading.effects['importErp/queryErp'],
  saving: loading.effects['importErp/saveErp'],
  importing: loading.effects['importErp/importData'],
}))
@formatterCollections({
  code: ['entity.company', 'entity.supplier', 'spfm.importErp'],
})
export default class ImportErp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRowKeys: [],
      dispalayName: undefined,
      modalRecord: {},
      isRefresh: false,
      accountGroup: undefined,
    };
  }

  componentDidMount() {
    const {
      importErp: { erpPagination = {} },
    } = this.props;
    this.queryValueCode();
    this.handleSearchErp(erpPagination);
  }

  /**
   * 批量查询值集
   */
  @Bind()
  queryValueCode() {
    const { dispatch } = this.props;
    dispatch({
      type: 'importErp/queryValueCode',
      payload: {
        syncStatusList: 'SSLM.SYNC_STATUS',
      },
    });
  }

  /**
   * 查询导入Erp数据
   * @param {Object} payload 分页参数
   */
  @Bind()
  handleSearchErp(payload = {}) {
    const { dispatch } = this.props;
    const form = this.filterForm;
    const filterValues = isUndefined(form) ? {} : filterNullValueObject(form.getFieldsValue());
    dispatch({
      type: 'importErp/queryErp',
      payload: {
        page: payload,
        ...filterValues,
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

  /**
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.filterForm = ref.props.form;
  }

  /**
   * 控制 Modal显隐
   * @param {String} dispalayName 判断modal类型
   */
  @Bind()
  @Debounce(200)
  handleModalDisplay(dispalayName, record, refresh) {
    const {
      importErp: { erpPagination = {} },
    } = this.props;
    const { visible, isRefresh } = this.state;
    this.setState({ visible: !visible, isRefresh: refresh }, () => {
      if (dispalayName) this.setState({ dispalayName, modalRecord: record });
      // 可修改modal隐藏时刷新页面
      if (visible && isRefresh) this.handleSearchErp(erpPagination);
    });
  }

  /**
   * 批量编辑行
   * @param {object} record 每行数据
   */
  @Bind()
  handleEditRow(record) {
    const {
      importErp: { erpList = [] },
      dispatch,
    } = this.props;
    const newErpList = erpList.map(item =>
      record.supplierSyncId === item.supplierSyncId ? { ...item, _status: 'update' } : item
    );
    dispatch({
      type: 'importErp/updateState',
      payload: { erpList: newErpList },
    });
  }

  /**
   * 取消编辑行
   * @param {object} record 行数据
   */
  @Bind()
  handleCancelRow(record) {
    const {
      importErp: { erpList = [] },
      dispatch,
    } = this.props;
    const newErpList = erpList.map(item => {
      if (item.supplierSyncId === record.supplierSyncId) {
        const { _status, ...other } = item;
        return other;
      } else {
        return item;
      }
    });
    dispatch({
      type: 'importErp/updateState',
      payload: { erpList: newErpList },
    });
  }

  /**
   *保存编辑的数据
   */
  @Bind()
  handleSave() {
    const {
      dispatch,
      importErp: { erpList = [], erpPagination = {} },
    } = this.props;
    const payloadData = getEditTableData(erpList, ['supplierSyncPfId']);
    if (isEmpty(payloadData)) {
      this.handleScrollTo();
      return;
    }
    dispatch({
      type: 'importErp/saveErp',
      payload: payloadData,
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearchErp(erpPagination);
      }
    });
  }

  /**
   * 导入Erp
   */
  @Bind()
  handleImport() {
    const {
      dispatch,
      importErp: { erpPagination = {} },
    } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'importErp/importData',
      payload: selectedRowKeys,
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({ selectedRowKeys: [] });
        this.handleSearchErp(erpPagination);
      }
    });
  }

  /**
   * 修改横向滚动条位置
   */
  @Bind()
  handleScrollTo() {
    const dom = this.rowDom.querySelector('.ant-table-body');
    dom.scrollTo(0, 0);
  }

  render() {
    const {
      loading,
      saving,
      importing,
      importErp: {
        erpList = [],
        erpPagination = {},
        code: { syncStatusList = [] },
      },
    } = this.props;
    const { visible, selectedRowKeys, dispalayName, modalRecord, accountGroup } = this.state;
    const isSave = erpList.filter(o => o._status === 'create' || o._status === 'update');
    const filterProps = {
      syncStatusList,
      onSearch: this.handleSearchErp,
      onRef: this.handleBindRef,
    };
    const columns = [
      {
        title: intl.get(`${promptCode}.model.importErp.syncStatus`).d('导入状态'),
        width: 100,
        dataIndex: 'syncStatusMeaning',
      },
      {
        title: intl.get(`${promptCode}.model.importErp.errorRemark`).d('错误信息'),
        width: 150,
        dataIndex: 'errorRemark',
      },
      {
        title: intl.get(`${promptCode}.model.importErp.accountGroup`).d('账户组'),
        width: 150,
        dataIndex: 'accountGroup',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('accountGroup', {
                  initialValue: accountGroup || record.accountGroup,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${promptCode}.model.importErp.accountGroup`).d('账户组'),
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
        title: intl.get(`${promptCode}.model.importErp.ouCode`).d('ERP公司代码'),
        width: 120,
        dataIndex: 'ouCode',
        render: (val, record) => {
          if (['update', 'create'].includes(record._status)) {
            const { getFieldDecorator } = record.$form;
            return (
              <Form.Item>
                {getFieldDecorator('ouId', {
                  initialValue: record.ouId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${promptCode}.model.importErp.ouCode`).d('ERP公司代码'),
                      }),
                    },
                  ],
                })(<Lov code="SPFM.USER_AUTH.OU_CODE" textValue={val} />)}
              </Form.Item>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: intl.get('entity.company.code').d('公司编码'),
        width: 120,
        dataIndex: 'companyNum',
      },
      {
        title: intl.get('entity.company.name').d('公司名称'),
        width: 200,
        dataIndex: 'companyName',
      },
      {
        title: intl.get('entity.supplier.code').d('供应商编码'),
        width: 120,
        dataIndex: 'supplierCompanyNum',
      },
      {
        title: intl.get('entity.supplier.name').d('供应商名称'),
        width: 200,
        dataIndex: 'supplierCompanyName',
      },
      {
        title: intl.get(`${promptCode}.model.importErp.erpSupplierNum`).d('ERP供应商编码'),
        width: 150,
        dataIndex: 'erpSupplierNum',
      },
      {
        title: intl.get(`${promptCode}.model.importErp.srmKeep`).d('是否已导入'),
        width: 100,
        dataIndex: 'srmKeep',
        render: yesOrNoRender,
      },
      {
        title: intl.get(`${promptCode}.model.importErp.frozenFlag`).d('记账冻结'),
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
        title: intl.get(`${promptCode}.model.importErp.stageDescription`).d('供应商生命周期'),
        width: 130,
        dataIndex: 'stageDescription',
      },
      {
        title: intl.get(`${promptCode}.model.importErp.purchaseFinance`).d('采购/财务'),
        width: 100,
        dataIndex: 'purchaseFinance',
        render: (val, record) => (
          <a onClick={() => this.handleModalDisplay('PurchaseFinance', record, true)}>
            {intl.get(`${promptCode}.model.importErp.purchaseFinance`).d('采购/财务')}
          </a>
        ),
      },
      {
        title: intl.get(`${promptCode}.model.importErp.supplierAddress`).d('供应商地址'),
        width: 100,
        dataIndex: 'supplierAddress',
        render: (val, record) => (
          <a onClick={() => this.handleModalDisplay('SupplierAddress', record)}>
            {intl.get('hzero.common.button.view').d('查看')}
          </a>
        ),
      },
      {
        title: intl.get(`${promptCode}.model.importErp.supplierAccount`).d('供应商账户'),
        width: 100,
        dataIndex: 'supplierAccount',
        render: (val, record) => (
          <a onClick={() => this.handleModalDisplay('SupplierAccount', record, true)}>
            {intl.get('hzero.common.button.view').d('查看')}
          </a>
        ),
      },
      {
        title: intl.get(`${promptCode}.model.importErp.supplierContact`).d('供应商联系人'),
        width: 130,
        dataIndex: 'supplierContact',
        render: (val, record) => (
          <a onClick={() => this.handleModalDisplay('SupplierContact', record)}>
            {intl.get('hzero.common.button.view').d('查看')}
          </a>
        ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        className: 'table-action',
        fixed: 'right',
        width: 100,
        dataIndex: 'edit',
        render: (_, record) => (
          <span className="action-link">
            {record._status === 'update' ? (
              <a
                onClick={() => {
                  this.handleCancelRow(record);
                }}
              >
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            ) : (
              <a
                disabled={record.syncStatus === 'PENDING'}
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
        disabled: record.syncStatus !== 'NO',
      }),
    };
    return (
      <React.Fragment>
        <Header
          backPath="/spfm/partner-list"
          title={intl.get(`${promptCode}.view.button.importErp`).d('导入ERP')}
        >
          <Button
            type="primary"
            icon="to-top"
            disabled={isEmpty(selectedRowKeys)}
            loading={importing || loading}
            onClick={this.handleImport}
          >
            {intl.get('hzero.common.button.import').d('导入')}
          </Button>
          <Button
            icon="save"
            disabled={isEmpty(isSave)}
            loading={saving || loading}
            onClick={this.handleSave}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm {...filterProps} />
          </div>
          <div
            ref={ref => {
              this.rowDom = ref;
            }}
          >
            <EditTable
              bordered
              rowKey="supplierSyncId"
              loading={loading}
              columns={columns}
              dataSource={erpList}
              pagination={erpPagination}
              onChange={this.handleSearchErp}
              rowSelection={rowSelection}
              scroll={{ x: this.scrollWidth(columns, 0) }}
            />
          </div>
        </Content>
        <Modal width={1000} visible={visible} onCancel={this.handleModalDisplay} footer={null}>
          {dispalayName === 'PurchaseFinance' && <PurchaseFinance modalRecord={modalRecord} />}
          {dispalayName === 'SupplierAddress' && <SupplierAddress modalRecord={modalRecord} />}
          {dispalayName === 'SupplierAccount' && <SupplierAccount modalRecord={modalRecord} />}
          {dispalayName === 'SupplierContact' && <SupplierContact modalRecord={modalRecord} />}
        </Modal>
      </React.Fragment>
    );
  }
}
