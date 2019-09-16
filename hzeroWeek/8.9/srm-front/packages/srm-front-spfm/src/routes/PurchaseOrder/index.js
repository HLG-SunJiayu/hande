/*
 * index - 采购订单类型定义
 * @date: 2018/09/17 15:40:00
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Button } from 'hzero-ui';
import { Content, Header } from 'components/Page';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import { connect } from 'dva';
import intl from 'utils/intl';
import Search from './Search';
import List from './List';
import Drawer from './Drawer';

const promptCode = 'spfm.purchaseOrder';

@connect(({ loading, purchaseOrder }) => ({
  fetchListLoading: loading.effects['purchaseOrder/fetchList'],
  addOrderTypeLoading: loading.effects['purchaseOrder/addOrderType'],
  purchaseOrder,
}))
@formatterCollections({ code: ['spfm.purchaseOrder'] })
export default class PurchaseOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  purchaseOrderForm;

  @Bind()
  handleSearch(payload = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseOrder/fetchList',
      payload,
    });
  }

  /**
   * 新建模态框
   */
  @Bind()
  showModal() {
    this.setState({ modalVisible: true });
  }

  /**
   * 隐藏模态框
   */
  @Bind()
  hideModal() {
    const { saving = false } = this.props;
    if (!saving) {
      this.setState({ data: {}, modalVisible: false });
    }
  }

  /**
   * 新增
   * @param {object} fields 新增的熔断规则表单内的内容
   */
  @Bind()
  handleAdd(fields) {
    const { dispatch } = this.props;
    const { data } = this.state;
    const item = {
      ...data,
      ...fields,
    };
    let dataFlag = false; // 判断表单的值有没有改变
    for (const key in fields) {
      if (fields[key] !== data[key]) {
        dataFlag = true;
        break;
      }
    }
    if (dataFlag) {
      dispatch({
        type: 'purchaseOrder/addOrderType',
        payload: [item],
      }).then(res => {
        if (!isEmpty(res)) {
          if (res.failed) {
            notification.error(res.message);
          } else {
            const {
              purchaseOrder: { query },
            } = this.props;
            this.hideModal();
            this.handleSearch(query);
            this.setState({ data: {} });
            notification.success();
          }
        }
      });
    } else {
      notification.warning({
        message: intl.get(`${promptCode}.view.message.noChange`).d('未修改数据'),
      });
    }
  }

  /**
   * 修改当前行信息
   */
  @Bind()
  editLine(record) {
    this.setState({ data: { ...record }, modalVisible: true });
  }

  render() {
    const {
      dispatch,
      form,
      fetchListLoading,
      purchaseOrder: { dataList },
    } = this.props;
    const { data, modalVisible } = this.state;
    const purchaseOrderTableProps = {
      dispatch,
      form,
      fetchListLoading,
      dataList,
      editLine: this.editLine,
    };
    const drawerProps = {
      data,
      dataList,
      onOk: this.handleAdd,
      visible: modalVisible,
      onCancel: this.hideModal,
      title: data.orderTypeId
        ? intl.get(`${promptCode}.view.title.editForm`).d('编辑值')
        : intl.get(`${promptCode}.view.title.createForm`).d('创建值'),
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${promptCode}.view.message.title`).d('采购订单类型定义')}>
          <Button icon="plus" type="primary" onClick={this.showModal}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">
            <Search onFilterChange={this.handleSearch} />
          </div>
          <List {...purchaseOrderTableProps} />
          <Drawer {...drawerProps} />
        </Content>
      </React.Fragment>
    );
  }
}
