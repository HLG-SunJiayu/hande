/**
 * PortalAssign 域名模板
 * @date: 2018-8-14
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Col, Form, Input, Row, Table } from 'hzero-ui';
import uuid from 'uuid/v4';
import { Bind } from 'lodash-decorators';

import { Header, Content } from 'components/Page';
import cacheComponent from 'components/CacheComponent';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { enableRender } from 'utils/renderer';
import { tableScrollWidth } from 'utils/utils';
import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

import PortalAssignForm from './PortalAssignForm';

@connect(({ loading, portalAssign, portalTemplate }) => ({
  portalAssign,
  portalTemplate,
  initLoading: loading.effects['portalAssign/fetchPortalAssign'],
  save: loading.effects['portalAssign/updatePortalAssign'],
  create: loading.effects['portalAssign/createPortalAssign'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: ['hptl.common', 'hptl.portalAssign', 'entity.group', 'entity.company'],
})
@cacheComponent({ cacheKey: '/spfm/portal-assign/list' })
export default class PortalAssign extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      portalAssignData: {},
      templateEnabledData: [],
      formKey: '',
    };
  }

  componentDidMount() {
    this.fetchPortalAssign();
    this.fetchTemplatesEnabled();
  }

  /**
   * 启用模板查询
   */
  fetchTemplatesEnabled() {
    const { dispatch } = this.props;
    dispatch({
      type: 'portalTemplate/fetchTemplatesEnabled',
    }).then(res => {
      if (res) {
        this.setState({
          templateEnabledData: res,
        });
      }
    });
  }

  /**
   * @function fetchPortalAssign - 获取门户分配列表数据
   * @param {object} params - 查询参数
   */
  fetchPortalAssign(params = {}) {
    const {
      dispatch,
      form,
      portalAssign: { pagination = {} },
    } = this.props;
    dispatch({
      type: 'portalAssign/fetchPortalAssign',
      payload: { page: pagination, ...params, ...form.getFieldsValue() },
    });
  }

  /**
   * @function showModal - 新增显示模态框
   */
  @Bind()
  showModal() {
    this.setState({ portalAssignData: {}, formKey: uuid() });
    this.handleModalVisible(true);
  }

  /**
   * @function handleModalVisible - 控制modal显示与隐藏
   * @param {boolean} flag 是否显示modal
   */
  @Bind()
  handleModalVisible(flag) {
    const { dispatch } = this.props;
    if (flag === false && this.PortalAssignForm) {
      this.PortalAssignForm.resetForm();
    }
    dispatch({
      type: 'portalAssign/updateState',
      payload: {
        modalVisible: !!flag,
      },
    });
  }

  /**
   * @function handleAdd - 新增或编辑门户分配数据
   * @param {Object} fieldsValue - 编辑的数据
   *  @param {String} fieldsValue.groupNum - 集团编码
   *  @param {String} fieldsValue.groupName - 集团名称
   *  @param {String} fieldsValue.companyNum - 公司编码
   *  @param {String} fieldsValue.companyName - 公司名称
   *  @param {String} fieldsValue.webUrl - 二级页面域名
   *  @param {String} fieldsValue.enabledFlag - 启用标识
   */
  @Bind()
  handleAdd(fieldsValue) {
    const { dispatch } = this.props;
    const { templateEnabledData = [] } = this.state;
    const { companyQuery = {} } = this.PortalAssignForm.state;
    dispatch({
      type: `portalAssign/${
        this.state.portalAssignData.assignId ? 'updatePortalAssign' : 'createPortalAssign'
      }`,
      payload: {
        ...this.state.portalAssignData,
        ...fieldsValue,
        companyId: fieldsValue.companyId ? fieldsValue.companyId : 0,
        tenantId: companyQuery.tenantId,
        templateId: templateEnabledData[0] && templateEnabledData[0].templateId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleModalVisible(false);
        this.fetchPortalAssign();
      }
    });
  }

  /**
   * @function handleSearch - 搜索门户分配
   */
  @Bind()
  handleSearch() {
    this.fetchPortalAssign({ page: {} });
  }

  @Bind()
  handleResetSearch() {
    this.props.form.resetFields();
  }

  /**
   * @function renderForm - 渲染搜索表单
   */
  renderFilterForm() {
    const { form } = this.props;
    return (
      <Form className="more-fields-search-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get('entity.group.name').d('集团名称')}
            >
              {form.getFieldDecorator('groupName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get('hptl.portalAssign.model.portalAssign.webUrl').d('二级页面域名')}
            >
              {form.getFieldDecorator('webUrl')(<Input />)}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT} className="search-btn-more">
            <Form.Item>
              <Button onClick={this.handleResetSearch}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * @function handlePagination - 分页操作
   * @param {Object} pagination - 分页参数
   */
  @Bind()
  handlePagination(pagination) {
    this.fetchPortalAssign({
      page: pagination,
    });
  }

  /**
   * @function handleUpdateEmail - 编辑门户分配行数据
   * @param {object} record - 行数据
   */
  @Bind()
  handleUpdatePortalAssign(record) {
    this.setState({ portalAssignData: record, formKey: uuid() });
    this.handleModalVisible(true);
  }

  render() {
    const {
      initLoading,
      save,
      create,
      portalAssign: { portalAssignList = [], pagination = {}, modalVisible },
    } = this.props;
    const {
      portalAssignData: { assignId },
      templateEnabledData = [],
    } = this.state;
    const columns = [
      {
        title: intl.get('entity.group.code').d('集团编码'),
        width: 120,
        dataIndex: 'groupNum',
      },
      {
        title: intl.get('entity.group.name').d('集团名称'),
        dataIndex: 'groupName',
        width: 250,
      },
      {
        title: intl.get('hptl.portalAssign.model.portalAssign.companyNum').d('公司编码'),
        width: 120,
        dataIndex: 'companyNum',
      },
      {
        title: intl.get('hptl.portalAssign.model.portalAssign.companyName').d('公司名称'),
        dataIndex: 'companyName',
        width: 250,
      },
      {
        title: intl.get('hptl.portalAssign.model.portalAssign.webUrl').d('二级页面域名'),
        width: 150,
        dataIndex: 'webUrl',
      },
      {
        title: intl.get('hzero.common.status.enable').d('启用'),
        width: 100,
        dataIndex: 'enabledFlag',
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        render: (text, record) => {
          // const { companyId = -1 } = record;
          return (
            <span className="action-link">
              <Link to={`/spfm/portal-assign/template/edit/${record.configId}`}>
                {intl.get('hptl.portalAssign.view.message.title.detail').d('门户模板定义')}
              </Link>
              <a onClick={() => this.handleUpdatePortalAssign(record)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            </span>
          );
        },
      },
    ];
    return (
      <React.Fragment>
        <Header title={intl.get('hptl.portalAssign.view.message.title.list').d('门户分配')}>
          <Button icon="plus" type="primary" onClick={this.showModal}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">{this.renderFilterForm()}</div>
          <Table
            bordered
            rowKey="assignId"
            loading={initLoading}
            dataSource={portalAssignList}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={pagination}
            onChange={this.handlePagination}
          />
          <PortalAssignForm
            key={this.state.formKey}
            title={
              assignId
                ? intl.get('hptl.portalAssign.view.message.modal.edit').d('编辑门户分配')
                : intl.get('hptl.portalAssign.view.message.modal.create').d('新建门户分配')
            }
            onRef={ref => {
              this.PortalAssignForm = ref;
            }}
            sideBar
            templateData={templateEnabledData}
            confirmLoading={assignId ? save : create}
            modalVisible={modalVisible}
            hideModal={() => this.handleModalVisible(false)}
            handleAdd={this.handleAdd}
            initData={this.state.portalAssignData}
          />
        </Content>
      </React.Fragment>
    );
  }
}
