/**
 * SalesOrder -销售订单
 * @date: 2019-02-26
 * @author YKK <kaikai.yang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Row, Col, Modal, message, Icon, Card } from 'hzero-ui';
import { getUserOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Link } from 'dva/router';
import intl from 'utils/intl';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import styles from './Cards.less';

const promptCode = 'dashboard.srmCards';
@connect(({ srmCards, loading }) => ({
  srmCards,
  addLoading: loading.effects['srmCards/addPurchases'],
}))
@formatterCollections({ code: 'dashboard.srmCards' })
export default class SalesOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false,
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  /**
   * 查询销售订单
   */
  @Bind()
  handleSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'srmCards/querySalesOrder',
      payload: {
        type: 'SupplierChangeCustomer',
        code: 'SRM_SalesOrder',
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'srmCards/updateState',
          payload: { salesOrderLoading: false },
        });
      }
    });
  }

  /**
   * 保存选中的行
   * @param {Array} salesOrderKeys
   */
  @Bind()
  onSelectChange(salesOrderKeys) {
    const { dispatch } = this.props;
    dispatch({
      type: 'srmCards/updateState',
      payload: {
        salesOrderKeys,
      },
    });
  }

  // 确定添加需要显示的销售订单条目
  @Bind()
  onOk() {
    const { dispatch, srmCards: { allSalesOrder = [], salesOrderKeys = [] } = {} } = this.props;
    if (!isEmpty(salesOrderKeys)) {
      const notPurchase = [];
      for (let i = 0; i < allSalesOrder.length; i++) {
        if (salesOrderKeys.indexOf(allSalesOrder[i].clauseId) === -1) {
          notPurchase.push({
            code: 'SRM_SalesOrder',
            tenantId: getUserOrganizationId(),
            ...allSalesOrder[i],
          });
        }
      }
      if (isEmpty(notPurchase)) {
        notPurchase.push({ code: 'SRM_SalesOrder', tenantId: getUserOrganizationId() });
      }
      dispatch({
        type: 'srmCards/addPurchases',
        payload: notPurchase,
      }).then(res => {
        if (res) {
          dispatch({
            type: 'srmCards/updateState',
            payload: { salesOrderLoading: true },
          });
          this.handleSearch();
          notification.success();
          this.hideModal();
        }
      });
    } else {
      message.warning(
        intl
          .get(`${promptCode}.view.message.confirm.selected.field`)
          .d('请选择要显示的销售订单条目！')
      );
    }
  }

  // 打开Modal框
  @Bind()
  openModal() {
    this.setState({
      drawerVisible: true,
    });
  }

  // 关闭Modal框
  @Bind()
  hideModal() {
    this.setState({
      drawerVisible: false,
    });
  }

  render() {
    const { drawerVisible } = this.state;
    const {
      addLoading,
      srmCards: {
        salesOrderLoading,
        allSalesOrder = [],
        salesOrder = [],
        salesOrderKeys = [],
      } = {},
    } = this.props;
    const rowSelection = {
      selectedRowKeys: salesOrderKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: intl.get(`${promptCode}.model.invoiceBill.processUser`).d('销售订单条目'),
        dataIndex: 'clauseName',
        width: 100,
      },
    ];
    return (
      <div className={styles.salesOrder}>
        <Row className={styles['card-row']}>
          <div className={styles['card-img']}>
            <span className={styles['card-title']}>销售订单</span>
            <a onClick={this.openModal} className={styles['card-icon']}>
              <Icon type="ellipsis" />
            </a>
          </div>
          {salesOrderLoading === true ? (
            <Card loading={salesOrderLoading} bordered={false} bodyStyle={{ padding: '0 20px' }} />
          ) : (
            salesOrder.map(item => (
              <Row className={styles['card-content']} key={`members-item-${item.clauseId}`}>
                <Col span={20}>
                  <Link to={`${item.menuCode}`} className={styles['card-entry']}>
                    {item.clauseName}
                  </Link>
                </Col>
                <Col span={4} className={styles['card-number']}>
                  {item.number}
                </Col>
              </Row>
            ))
          )}
        </Row>
        <Modal
          title={intl.get('hzero.common.button.operating').d('选择需要展示的销售订单条目')}
          visible={drawerVisible}
          onOk={this.onOk}
          onCancel={this.hideModal}
          confirmLoading={addLoading}
          width="400px"
          okText={intl.get('hzero.common.button.sure').d('确定')}
          cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        >
          <EditTable
            // loading={loading}
            dataSource={allSalesOrder}
            // pagination={operationRecordPagination}
            rowKey="clauseId"
            onChange={this.handleSearch}
            columns={columns}
            rowSelection={rowSelection}
            bordered
          />
        </Modal>
      </div>
    );
  }
}
