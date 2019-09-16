/**
 * accountConfiguration -合作伙伴管理 查询页
 * @date: 2019-7-4
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
// import { isEmpty, isUndefined } from 'lodash';
import { connect } from 'dva';
import { Table } from 'hzero-ui';

import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Header, Content } from 'components/Page';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';

import FilterForm from './FilterForm';
import AccountConfigurationModal from './AccountConfigurationModal';
import styles from './index.less';

// const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'spfm.accountConfiguration.view.message';

@connect(({ accountConfiguration, loading }) => ({
  accountConfiguration,
  modalData: accountConfiguration.modalData,
  fetchLoading: loading.effects['accountConfiguration/fetchList'],
  modalSaveLoading: loading.effects['accountConfiguration/saveModalData'],
  modalFetchLoading: loading.effects['accountConfiguration/fetchModalData'],
}))
@formatterCollections({ code: ['spfm.accountConfiguration'] })
export default class accountConfiguration extends React.Component {
  form;

  state = {
    tenantId: getCurrentOrganizationId(),
    modalVisible: false,
  };

  componentDidMount() {
    this.fetchList();
  }

  // 绑定FilterForm
  @Bind()
  bindForm(form) {
    this.form = form;
  }

  // fetchList
  @Bind()
  fetchList(params = {}) {
    const { dispatch, accountConfiguration: { pagination = {} } = {} } = this.props;
    const { tenantId } = this.state;
    const searchCondition = filterNullValueObject(this.form.getFieldsValue());
    dispatch({
      type: 'accountConfiguration/fetchList',
      payload: { page: pagination, ...searchCondition, ...params, crmTenant: tenantId },
    });
  }

  // 搜索
  @Bind()
  handleSearch() {
    this.fetchList();
  }

  // 服务列表Lov展示
  @Bind()
  serviceListShow(lov) {
    lov.onSearchBtnClick();
  }

  // 展示关闭Modal
  @Bind()
  showChangeModal(flag, record) {
    const { dispatch } = this.props;
    if (flag) {
      const { serviceTypeId, serviceTypeName, partnerId } = record;
      dispatch({
        type: 'accountConfiguration/fetchModalData',
        payload: { serviceTypeId, serviceTypeName, partnerId },
      });
    }
    this.setState({ modalVisible: flag });
  }

  // 保存Modal数据
  @Bind()
  saveModalData(params) {
    const { dispatch, modalData } = this.props;
    dispatch({
      type: 'accountConfiguration/fetchSaveModalData',
      payload: { ...modalData, ...params },
    }).then(res => {
      if (res.failed) {
        notification.warning({ message: res.message || '' });
      } else {
        notification.success();
      }
    });
    this.showChangeModal(false);
  }

  render() {
    const {
      accountConfiguration: { list = {}, pagination = {} },
      fetchLoading,
      fetchSaveing,
      modalData,
      modalSaveLoading,
      modalFetchLoading,
      dispatch,
    } = this.props;
    const { totalPages } = list;
    const { tenantId, modalVisible } = this.state;
    const columns = [
      {
        title: intl.get(`${viewMessagePrompt}.serviceTypeCode`).d('账户组编码'),
        dataIndex: 'serviceTypeCode',
        key: 'serviceTypeCode',
        // width: 200,
        render: text => {
          return text || 0;
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.serviceTypeName`).d('账户组名称'),
        // width: 200,
        dataIndex: 'serviceTypeName',
        key: 'serviceTypeName',
        render: text => {
          return text || '默认分组';
        },
      },
      {
        title: intl.get(`${viewMessagePrompt}.partnerName`).d('服务提供商'),
        dataIndex: 'partnerName',
        key: 'partnerName',
      },
      {
        title: intl.get(`${viewMessagePrompt}.accountConfiguration`).d('账户配置'),
        dataIndex: 'accountConfiguration',
        key: 'accountConfiguration',
        width: 120,
        render: (text, record) => (
          <a onClick={() => this.showChangeModal(true, record)}>
            {intl.get(`${viewMessagePrompt}.accountConfiguration`).d('账户配置')}
          </a>
        ),
      },
      {
        title: intl.get(`${viewMessagePrompt}.serviceList`).d('服务列表'),
        width: 120,
        dataIndex: 'serviceList',
        key: 'serviceList',
        render: (text, record) => {
          const { partnerId } = record;
          let lov;
          return (
            <React.Fragment>
              <Lov
                ref={z => {
                  lov = z;
                }}
                className={styles.hide}
                code="AMKT.OPENED_SERVICE"
                queryParams={{
                  organizationId: tenantId,
                  crmTenant: tenantId,
                  serviceTypeId: record.serviceTypeId,
                  partnerId,
                }}
              />
              <a onClick={() => this.serviceListShow(lov)}>
                {intl.get(`${viewMessagePrompt}.serviceList`).d('服务列表')}
              </a>
            </React.Fragment>
          );
        },
      },
    ];
    const fiterProps = {
      bindForm: this.bindForm,
      handleSearch: this.handleSearch,
    };
    const tableProps = {
      columns,
      dataSource: list.content,
      bordered: true,
      loading: fetchLoading || fetchSaveing,
      rowKey: 'serviceTypeId',
      pagination: {
        ...pagination,
        onChange: (current, pageSize) => {
          const newCurrent = current >= totalPages ? totalPages : current;
          this.fetchList({ page: { current: newCurrent, pageSize } });
        },
        onShowSizeChange: (current, pageSize) => {
          this.fetchList({ page: { current, pageSize } });
        },
      },
    };
    const modalProps = {
      showChangeModal: this.showChangeModal,
      modalVisible,
      modalSaveLoading,
      modalFetchLoading,
      modalData,
      saveModalData: this.saveModalData,
      dispatch,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get(`${viewMessagePrompt}.serviceAccountConfiguration`).d('服务账户配置')}
        />
        <Content>
          <div className="table-list-search">
            <FilterForm {...fiterProps} />
          </div>
          <Table {...tableProps} />
          {modalVisible && <AccountConfigurationModal {...modalProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
