/**
 * ModuleManage - 模板管理
 * @date: 2019-07-17
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Bind, throttle, debounce } from 'lodash-decorators';
import { Button, Input, Form } from 'hzero-ui';
import { isUndefined, isEmpty } from 'lodash';

import intl from 'utils/intl';
import { filterNullValueObject, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';

import { Header, Content } from 'components/Page';
import EditTable from 'components/EditTable';
import Checkbox from 'components/Checkbox';

import FilterForm from './FilterForm';
import ServiceList from '../Components/ServiceTransfer';

const CODE_REGEXP = /^[A-Z0-9]*$/;

@connect(({ loading, moduleManage }) => ({
  loading: loading.effects['moduleManage/fetchClientModule'],
  saveLoading: loading.effects['moduleManage/saveModule'],
  moduleManage,
}))
export default class ModuleManageTable extends React.Component {
  state = {
    rowSelectedKeys: [],
    serviceVisible: false, // 服务列表visible
    moduleId: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleManage/init',
    });
    this.fetchClientModule(); // 查询数据
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.filterForm = ref.props.form;
  }

  /**
   * 查询模块
   */
  @Bind()
  fetchClientModule(params = {}) {
    const { dispatch } = this.props;
    const filterValues = isUndefined(this.filterForm)
      ? {}
      : filterNullValueObject(this.filterForm.getFieldsValue());
    dispatch({
      type: 'moduleManage/fetchClientModule',
      payload: {
        clientCode: 'HZERO',
        page: params,
        ...filterValues,
      },
    });
  }

  /**
   * 展示服务穿梭框
   */
  @Bind()
  handleShowServiceList(record) {
    this.setState(
      {
        serviceVisible: true,
        moduleId: record.moduleId,
      },
      () => {
        this.fetchExitServiceList();
        this.fetchNoExitServiceList();
      }
    );
  }

  @Bind()
  handleCloseModal() {
    this.setState({
      serviceVisible: false,
    });
  }

  @Bind()
  onRowSelectChange(_, rows) {
    this.setState({
      rowSelectedKeys: rows.map(n => n.moduleId),
    });
  }

  /**
   * 模块行编辑
   */
  @Bind()
  @throttle(500)
  handleChange(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleManage/editFlag',
      payload: record,
    });
  }

  /**
   * 模块新增行
   */
  @Bind()
  handleCreateModule() {
    const { dispatch } = this.props;
    dispatch({ type: 'moduleManage/addRow' });
  }

  /**
   * 模块删除行
   */
  @Bind()
  handleClearEdit(selectRows = []) {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleManage/deleteRow',
      payload: selectRows,
    });
    this.setState({
      rowSelectedKeys: [],
    });
  }

  /**
   * 查询已有服务列表
   */
  @Bind()
  fetchExitServiceList(params = {}) {
    const { dispatch } = this.props;
    const { moduleId } = this.state;
    dispatch({
      type: 'moduleManage/fetchExitServiceList',
      payload: { ...params, moduleId },
    });
  }

  /**
   * 查询未分配服务列表
   */
  @Bind()
  fetchNoExitServiceList(params = {}) {
    const { dispatch } = this.props;
    const { moduleId } = this.state;
    dispatch({
      type: 'moduleManage/fetchNoExitServiceList',
      payload: { ...params, moduleId },
    });
  }

  /**
   * 添加服务
   */
  @Bind()
  handleAddService(rows = []) {
    const { dispatch } = this.props;
    const { moduleId } = this.state;
    const serviceEntityIds = rows.map(item => item.serviceId);
    dispatch({
      type: 'moduleManage/addService',
      payload: {
        client: 'HZERO',
        moduleId,
        serviceEntityIds,
      },
    }).then(res => {
      if (res) {
        this.fetchExitServiceList();
        this.fetchNoExitServiceList();
      }
    });
  }

  /**
   * 删除服务
   */
  @Bind()
  handleRemoveService(rows = []) {
    const { dispatch } = this.props;
    const moduleServiceIds = rows.map(item => item.moduleServiceId);
    dispatch({
      type: 'moduleManage/removeService',
      payload: {
        client: 'HZERO',
        moduleServiceIds,
      },
    }).then(res => {
      if (res) {
        this.fetchExitServiceList();
        this.fetchNoExitServiceList();
      }
    });
  }

  /**
   * 保存
   */
  @Bind()
  @debounce(500)
  handleSaveModule() {
    const {
      dispatch,
      moduleManage: { moduleTable },
    } = this.props;
    const filterData = moduleTable.filter(item => item.editFlag === true);
    const newModuleTable = getEditTableData(filterData, ['editFlag', '_status', 'moduleId']);
    if (filterData.length === 0 || !isEmpty(newModuleTable)) {
      dispatch({
        type: 'moduleManage/saveModule',
        payload: {
          modules: {
            clientCode: 'HZERO',
            moduleList: newModuleTable,
          },
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchClientModule();
        }
      });
    }
  }

  render() {
    const {
      loading,
      saveLoading,
      fetchExitSerLoading,
      fetchNoExitSerLoading,
      serviceLoading,
      moduleManage: {
        moduleTable = [],
        modulePagination = {},
        enumMap = [],
        exitServiceList, // 模块下已分配服务
        noExitServiceList, // 模块下未分配服务
        exitPagination, // 模块下已分配服务分页
        noExitPagination, // 模块下未分配服务分页
      },
    } = this.props;
    const { rowSelectedKeys, serviceVisible, moduleId } = this.state;
    const columns = [
      {
        title: '模块编码',
        dataIndex: 'moduleCode',
        width: 200,
        render: (text, record) => {
          const returnComponent = !(record._status === 'create') ? (
            text
          ) : (
            <Form.Item>
              {record.$form.getFieldDecorator('moduleCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '模块编码',
                    }),
                  },
                  {
                    max: 12,
                    message: intl.get('hzero.common.validation.max', {
                      max: 12,
                    }),
                  },
                  {
                    pattern: CODE_REGEXP,
                    message: '模块编码只能大写字母及数字',
                  },
                ],
                initialValue: record.moduleCode,
              })(<Input trim onChange={() => this.handleChange(record)} />)}
            </Form.Item>
          );
          return returnComponent;
        },
      },
      {
        title: '模块名称',
        dataIndex: 'moduleName',
        render: (text, record) => {
          return (
            <Form.Item>
              {record.$form.getFieldDecorator('moduleName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '模块名称',
                    }),
                  },
                  {
                    max: 30,
                    message: intl.get('hzero.common.validation.max', {
                      max: 30,
                    }),
                  },
                ],
                initialValue: record.moduleName,
              })(<Input onChange={() => this.handleChange(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: '启用',
        dataIndex: 'enabledFlag',
        width: 60,
        render: (_, record) => {
          const { getFieldDecorator } = record.$form;
          return (
            <Form.Item>
              {getFieldDecorator('enabledFlag', {
                initialValue: record.enabledFlag,
              })(<Checkbox onChange={() => this.handleChange(record)} />)}
            </Form.Item>
          );
        },
      },
      {
        title: '服务配置',
        dataIndex: 'serviceConfig',
        width: 150,
        render: (_, record) => {
          if (!['create'].includes(record._status)) {
            return (
              <a
                onClick={() => {
                  this.handleShowServiceList(record);
                }}
              >
                服务列表
              </a>
            );
          } else {
            return null;
          }
        },
      },
    ];
    const filterProps = {
      enumMap,
      onSearch: this.fetchClientModule,
      onRef: this.handleBindRef,
    };
    const tableProps = {
      columns,
      loading,
      rowKey: 'moduleId',
      dataSource: moduleTable,
      bordered: true,
      pagination: modulePagination,
      onChange: this.fetchClientModule,
      rowSelection: {
        selectedRowKeys: rowSelectedKeys,
        onChange: this.onRowSelectChange,
        getCheckboxProps: record => ({
          disabled: !['create'].includes(record._status),
        }),
      },
    };
    const serviceProps = {
      serviceVisible,
      serviceLoading,
      fetchExitSerLoading,
      fetchNoExitSerLoading,
      moduleId,
      onFetchExitServiceList: this.fetchExitServiceList,
      onFetchNoExitServiceList: this.fetchNoExitServiceList,
      onHandleCloseModal: this.handleCloseModal,
      onHandleAddService: this.handleAddService,
      onHandleRemoveService: this.handleRemoveService,
      exitServiceList, // 模块下已分配服务
      noExitServiceList, // 模块下未分配服务
      exitPagination, // 模块下已分配服务分页
      noExitPagination, // 模块下未分配服务分页
    };
    return (
      <React.Fragment>
        <Header title="租户模块定义">
          <Button icon="save" type="primary" loading={saveLoading} onClick={this.handleSaveModule}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="plus" onClick={this.handleCreateModule}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            onClick={() => this.handleClearEdit(rowSelectedKeys)}
            disabled={rowSelectedKeys.length <= 0}
          >
            清除
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <FilterForm {...filterProps} />
          </div>
          <EditTable {...tableProps} />
          <ServiceList {...serviceProps} />
        </Content>
      </React.Fragment>
    );
  }
}
