/**
 * 租户切换
 */
import React, { PureComponent } from 'react';
import { Modal, Spin, Table, Tabs } from 'hzero-ui';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';

import { getCurrentOrganizationId, getSession, setSession } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { cleanMenuTabs } from 'utils/menuTab';

import RecordCheckbox from './RecordCheckbox';

import style from './index.less';

/**
 * 使用Tabs.TabPane组件
 */
const { TabPane } = Tabs;

/**
 * 租户切换 Tenant
 *
 * @author wangjiacheng <jiacheng.wang@hand-china.com>
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {!boolean} [modalVisible=false] - 是否显示选择租户的模态框
 * @reactProps {!string} [selectTenant=''] - 用户选择的租户名称
 * @reactProps {!array} [historyTenantList=[]] - 缓存用户选择的租户数据
 * @reactProps {!array} [tenantList=[]] - 租户列表数据
 * @reactProps {!number} [organizationId] - 当前登录用户的租户ID
 * @reactProps {!string} [tenantName] - 当前登录用户的租户名称
 * @returns React.element
 */
class DefaultTenantSelect extends PureComponent {
  /**
   * constructor - constructor方法
   * 组件构造函数
   */
  constructor(props) {
    super(props);
    this.state = {
      // modalVisible: true,
      tenantId: getCurrentOrganizationId(),
      // selectTenant: getSession('currentTenant').tenantName || '',
      historyTenantList: getSession('historyTenantList') || [],
    };
  }

  /**
   * @function showModal - 显示和隐藏租户切换模态框
   * @param {boolean} flag - 显示或隐藏标识
   */
  @Bind()
  showModal(flag) {
    const { onShowModal } = this.props;
    onShowModal(flag);
  }

  /**
   * @function handleSelectTenant - 选择租户
   * @param {object} record - 选择的租户行数据
   * @param {string} record.tenantId - 租户ID
   * @param {string} record.tenantName - 租户名称
   * @param {string} record.tenantNum - 租户编码
   */
  @Bind()
  handleSelectTenant(record) {
    const { dispatch } = this.props;
    const { historyTenantList } = this.state;
    let isHave = false;
    this.setState({
      // modalVisible: false,
      // 设置 loading
      updateTenantLoading: true,
      // selectTenant: record.tenantName,
    });
    // 处理用户选择租户数据，避免添加重复数据
    if (historyTenantList.length > 0) {
      historyTenantList.some(item => {
        if (item.tenantId === record.tenantId) {
          isHave = true;
          return true;
        }
        return false;
      });
      if (!isHave) {
        historyTenantList.push(record);
      }
    } else {
      historyTenantList.push(record);
    }
    // 设置当前租户ID缓存
    const saveTenant = setSession('currentTenant', record);
    // 重新设置租户历史数据缓存
    const isSave = setSession('historyTenantList', historyTenantList);
    if (isSave && saveTenant) {
      // 设置sessionStorage成功后更新租户状态数据
      this.setState({
        historyTenantList: getSession('historyTenantList'),
        // selectTenant: getSession('currentTenant').tenantName,
      });
      // warn 清空 tabs 信息
      cleanMenuTabs();
      // 切换租户成功后跳转首页，刷新页面
      dispatch(routerRedux.push({ pathname: '/' }));
      // 缓存当前用户的租户
      dispatch({
        type: 'user/updateCurrentTenant',
        payload: { tenantId: record.tenantId },
      }).then(res => {
        if (res) {
          dispatch(routerRedux.push({ pathname: '/workplace' }));
          // 成功 刷新页面
          window.location.reload();
        } else {
          // 失败 不关闭模态框
          this.setState({
            updateTenantLoading: false,
          });
        }
      });
    } else {
      // 失败 不关闭模态框
      this.setState({
        updateTenantLoading: false,
      });
    }
  }

  /**
   * 修改默认租户
   */
  @Bind()
  handleChangeDefaultTenant(record) {
    // 如果已经设置了 默认租户 则 不能切换
    const payload = {};
    if (isUndefined(record.defaultTenantId)) {
      payload.tenantId = record.tenantId;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'user/updateDefaultTenant',
      payload,
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: 'user/fetchTenantList',
        });
      }
    });
  }

  render() {
    const { tenantList = [], allLoading = false, modalVisible = false } = this.props;
    const { tenantId, updateTenantLoading = false } = this.state;
    const columns = [
      {
        title: intl.get('hpfm.tenantSelect.model.tenantSelect.tenantName').d('租户名称'),
        dataIndex: 'tenantName',
        render: (text, record) => {
          return (
            <div className={style.tenant}>
              {record.tenantId === tenantId && <div className={style['tenant-select-wrapper']} />}
              <a onClick={() => this.handleSelectTenant(record)}>
                {text}
                {record.tenantId === tenantId &&
                  `(${intl.get('hpfm.tenantSelect.view.message.me').d('当前')})`}
              </a>
            </div>
          );
        },
      },
      {
        title: intl.get('hpfm.tenantSelect.model.tenantSelect.tenantNum').d('租户编码'),
        width: 100,
        dataIndex: 'tenantNum',
      },
      {
        title: intl.get('hpfm.tenantSelect.model.tenantSelect.defaultTenant').d('默认租户'),
        width: 90,
        dataIndex: 'defaultTenantId',
        render: (defaultTenantId, record) => {
          return (
            <RecordCheckbox
              record={record}
              onClick={this.handleChangeDefaultTenant}
              checked={!isUndefined(defaultTenantId)}
            />
          );
        },
      },
    ];
    return (
      <React.Fragment>
        <Modal
          title={intl.get('hpfm.tenantSelect.view.message.title').d('选择租户')}
          width="620px"
          bodyStyle={{ paddingTop: 0, height: '460px' }}
          visible={modalVisible}
          onCancel={() => this.showModal(false)}
          footer={null}
        >
          <Spin spinning={updateTenantLoading}>
            <Tabs defaultActiveKey="all" animated={false}>
              <TabPane
                tab={intl.get('hpfm.tenantSelect.view.message.modal.all').d('全部')}
                key="all"
                style={{ height: 380, overflowY: 'auto' }}
              >
                <Table
                  bordered
                  rowKey="tenantId"
                  pagination={false}
                  loading={allLoading}
                  dataSource={tenantList}
                  columns={columns}
                />
              </TabPane>
              <TabPane
                tab={intl.get('hpfm.tenantSelect.view.message.modal.history').d('最近')}
                key="history"
                style={{ height: 380, overflowY: 'auto' }}
              >
                <Table
                  bordered
                  rowKey="tenantId"
                  dataSource={this.state.historyTenantList}
                  columns={columns}
                  pagination={false}
                />
              </TabPane>
            </Tabs>
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}

export default formatterCollections({ code: 'hpfm.tenantSelect' })(
  connect(({ user: { tenantList = [], currentUser: { tenantName } } = {}, loading }) => ({
    tenantList,
    tenantName,
    allLoading:
      loading.effects['user/updateDefaultTenant'] || loading.effects['user/fetchTenantList'],
  }))(DefaultTenantSelect)
);
