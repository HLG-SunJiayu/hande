/**
 * Goods -收货
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
export default class Goods extends React.Component {
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
   * 查询收货信息
   */
  @Bind()
  handleSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'srmCards/queryGoods',
      payload: {
        type: 'Customer',
        code: 'SRM_Goods',
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'srmCards/updateState',
          payload: { goodsLoading: false },
        });
      }
    });
  }

  /**
   * 保存选中的行
   * @param {Array} goodsKeys
   */
  @Bind()
  onSelectChange(goodsKeys) {
    const { dispatch } = this.props;
    dispatch({
      type: 'srmCards/updateState',
      payload: {
        goodsKeys,
      },
    });
  }

  // 确定添加需要显示的收货条目
  @Bind()
  onOk() {
    const { dispatch, srmCards: { allGoods = [], goodsKeys = [] } = {} } = this.props;
    if (!isEmpty(goodsKeys)) {
      const notPurchase = [];
      for (let i = 0; i < allGoods.length; i++) {
        if (goodsKeys.indexOf(allGoods[i].clauseId) === -1) {
          notPurchase.push({
            code: 'SRM_Goods',
            tenantId: getUserOrganizationId(),
            ...allGoods[i],
          });
        }
      }
      if (isEmpty(notPurchase)) {
        notPurchase.push({ code: 'SRM_Goods', tenantId: getUserOrganizationId() });
      }
      dispatch({
        type: 'srmCards/addPurchases',
        payload: notPurchase,
      }).then(res => {
        if (res) {
          dispatch({
            type: 'srmCards/updateState',
            payload: { goodsLoading: true },
          });
          this.handleSearch();
          notification.success();
          this.hideModal();
        }
      });
    } else {
      message.warning(
        intl.get(`${promptCode}.view.message.confirm.selected.field`).d('请选择要显示的收货条目！')
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
      srmCards: { goodsLoading, allGoods = [], goodsList = [], goodsKeys = [] } = {},
    } = this.props;
    const rowSelection = {
      selectedRowKeys: goodsKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: intl.get(`${promptCode}.model.invoiceBill.processUser`).d('收货条目'),
        dataIndex: 'clauseName',
        width: 100,
      },
    ];
    return (
      <div className={styles.goods}>
        <Row className={styles['card-row']}>
          <div className={styles['card-img']}>
            <span className={styles['card-title']}>收货</span>
            <a onClick={this.openModal} className={styles['card-icon']}>
              <Icon type="ellipsis" />
            </a>
          </div>
          {goodsLoading === true ? (
            <Card loading={goodsLoading} bordered={false} bodyStyle={{ padding: '0 20px' }} />
          ) : (
            goodsList.map(item => (
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
          title={intl.get('hzero.common.button.operating').d('选择需要展示的收货条目')}
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
            dataSource={allGoods}
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
