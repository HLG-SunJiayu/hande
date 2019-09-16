/**
 * NonErpPurchaseRequisition - 非ERP采购申请
 * @date: 2019-01-24
 * @author: guochaochao <chaochao.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Table, Modal } from 'hzero-ui';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isEmpty, isArray, isUndefined } from 'lodash';

import { Content, Header } from 'components/Page';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import { dateTimeRender } from 'utils/renderer';
import { createPagination, filterNullValueObject, tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

// import OperationRecord from '../components/OperationRecord/OperationRecord';
import FilterForm from './List/FilterForm';

const commonPrompt = 'sprm.purchaseRequisitionApproval.model.purchaseRequisitionApproval';
const viewMessagePrompt = 'sprm.purchaseRequisitionApproval.view.message';
@connect(({ purchaseRequisitionApproval, loading }) => ({
  purchaseRequisitionApproval,
  queryListLoading: loading.effects['purchaseRequisitionApproval/queryList'],
  fetchOperationRecordListLoading:
    loading.effects['purchaseRequisitionApproval/fetchOperationRecordList'],
  approving: loading.effects['purchaseRequisitionApproval/passApprovalList'],
  rejecting: loading.effects['purchaseRequisitionApproval/rejectApprovalList'],
}))
export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operationRecordList: [],
      operationRecordPagination: {},
      // fieldsValue: {},
      operationRecordModalVisible: false,
      selectedListRowKeys: [], // 选中行
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { state: { _back } = {} },
      purchaseRequisitionApproval: { listPagination = {} },
    } = this.props;
    dispatch({ type: 'purchaseRequisitionApproval/init' });
    if (_back === -1) {
      this.handleListSearch(listPagination);
    } else {
      this.props.dispatch({
        type: 'purchaseRequisitionApproval/fetchEnum',
      });
      this.handleListSearch();
    }
  }

  /**
   * 处理表单中的查询条件
   * @param {Object} filterValues
   * @param {String} radioTab
   */
  handleFormQuery(filterValues) {
    const dealTime = {};
    const timeArray = ['creationDateFrom', 'creationDateTo'];
    timeArray.forEach(item => {
      dealTime[item] = filterValues[item]
        ? filterValues[item].format(DEFAULT_DATETIME_FORMAT)
        : undefined;
    });
    return {
      ...filterValues,
      ...dealTime,
    };
  }

  /**
   * 查询表格数据
   * @param {Object} params
   */
  @Bind()
  handleListSearch(page = {}) {
    const { dispatch } = this.props;
    const filterValues = isUndefined(this.filterForm)
      ? {}
      : filterNullValueObject(this.filterForm.getFieldsValue());
    const handleFormValues = this.handleFormQuery(filterValues);
    dispatch({
      type: 'purchaseRequisitionApproval/queryList',
      payload: {
        ...handleFormValues,
        page,
      },
    }).then(result => {
      if (result) {
        this.setState({
          approvalList: result.content,
          listPagination: createPagination(result),
        });
      }
    });
    this.setState({ selectedListRowKeys: [] });
  }

  /**
   * 查询操作记录列表
   */
  @Bind()
  handleOperationRecordSearch(page = {}) {
    const { dispatch } = this.props;
    const { prHeaderId } = this.state;
    dispatch({
      type: 'purchaseRequisitionApproval/fetchOperationRecordList',
      payload: {
        prHeaderId,
        page,
      },
    }).then(result => {
      if (result) {
        this.setState({
          operationRecordList: result.content,
          operationRecordPagination: createPagination(result),
        });
      }
    });
  }

  /**
   * openOperationRecord - 打开操作记录弹窗
   * @param {*} record
   */
  @Bind()
  openOperationRecord(record) {
    this.setState({
      operationRecordModalVisible: true,
      prHeaderId: record.prHeaderId,
    });
  }

  /**
   * 控制弹窗的显示和隐藏
   * @param {String} modalVisible
   * @param {Boolean} flag
   * @memberof Detail
   */
  @Bind()
  handleModalVisible(modalVisible, flag) {
    this.setState({ [modalVisible]: !!flag });
  }

  /**
   * 订单审批通过
   */
  @Bind()
  approvalApprovalList() {
    const { dispatch } = this.props;
    const { selectedListRowKeys, approvalList, listPagination } = this.state;
    if (selectedListRowKeys.length > 0) {
      const approvalOrders = approvalList
        .filter(item => selectedListRowKeys.indexOf(item.prHeaderId) >= 0)
        .map(item => {
          const {
            prStatusCode,
            _token,
            prHeaderId,
            objectVersionNumber,
            prSourcePlatform,
            displayPrNum,
            tenantId,
          } = item;
          return {
            _token,
            prHeaderId,
            prStatusCode,
            objectVersionNumber,
            prSourcePlatform,
            displayPrNum,
            tenantId,
          };
        });
      Modal.confirm({
        title: intl.get(`${viewMessagePrompt}.confirmApprove`).d('是否确认审批通过需求'),
        onOk: () => {
          dispatch({
            type: 'purchaseRequisitionApproval/approvalApprovalList',
            payload: {
              prHeaderList: approvalOrders,
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.handleListSearch(listPagination);
              this.setState({ selectedListRowKeys: [] });
            }
          });
        },
      });
    } else {
      notification.warning({
        message: intl.get(`hzero.common.message.confirm.selected.atLeast`).d('请至少选择一行数据'),
      });
    }
  }

  /**
   * 订单审批拒绝
   */
  @Bind()
  rejectApprovalList() {
    const { dispatch } = this.props;
    const { selectedListRowKeys, approvalList, listPagination } = this.state;
    if (selectedListRowKeys.length > 0) {
      const rejectOrders = approvalList
        .filter(item => selectedListRowKeys.indexOf(item.prHeaderId) >= 0)
        .map(item => {
          const {
            prStatusCode,
            _token,
            prHeaderId,
            objectVersionNumber,
            prSourcePlatform,
            displayPrNum,
            tenantId,
          } = item;
          return {
            prStatusCode,
            _token,
            prHeaderId,
            objectVersionNumber,
            prSourcePlatform,
            displayPrNum,
            tenantId,
          };
        });
      Modal.confirm({
        title: intl.get(`${viewMessagePrompt}.confirmReject`).d('是否确认审批拒绝需求'),
        onOk: () => {
          dispatch({
            type: 'purchaseRequisitionApproval/rejectApprovalList',
            payload: {
              prHeaderList: rejectOrders,
            },
          }).then(res => {
            if (res) {
              this.handleListSearch(listPagination);
              this.setState({ selectedListRowKeys: [] });
              notification.success();
            }
          });
        },
      });
    } else {
      notification.warning({
        message: intl.get(`hzero.common.message.confirm.selected.atLeast`).d('请至少选择一行数据'),
      });
    }
  }

  /**
   * 跳转详情
   * @params
   */
  @Bind()
  onHandleToDetail({ prHeaderId, prSourcePlatform }) {
    const { dispatch } = this.props;
    if (prSourcePlatform !== 'ERP') {
      dispatch(
        routerRedux.push({
          pathname: `/sprm/purchase-requisition-approval/detail-non-erp/${prHeaderId}`,
        })
      );
    } else {
      dispatch(
        routerRedux.push({
          pathname: `/sprm/purchase-requisition-approval/detail-erp/${prHeaderId}`,
        })
      );
    }
  }

  /**
   * 选中行改变回调
   * @param {Array} newSelectedRowKeys
   * @param {Object} newSelectedRows
   */
  @Bind()
  handleRowSelectedChange(selectedRowKeys) {
    this.setState({ selectedListRowKeys: selectedRowKeys });
  }

  /**
   * onCell - 设置表格单元格属性函数
   */
  @Bind()
  onCell() {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: 300,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      onClick: e => {
        const { target } = e;
        if (target.style.whiteSpace === 'normal') {
          target.style.whiteSpace = 'nowrap';
        } else {
          target.style.whiteSpace = 'normal';
        }
      },
    };
  }

  render() {
    const {
      operationRecordList,
      selectedListRowKeys,
      operationRecordPagination,
      operationRecordModalVisible,
      approvalList,
      listPagination,
    } = this.state;
    const {
      approving,
      rejecting,
      queryListLoading,
      fetchOperationRecordListLoading,
      purchaseRequisitionApproval: { prSourcePlatformList },
    } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedListRowKeys,
      onChange: this.handleRowSelectedChange,
    };
    const filterProps = {
      prSourcePlatformList,
      onFilterChange: this.handleListSearch,
      onRef: node => {
        this.filterForm = node.props.form;
      },
    };
    const operationRecordProps = {
      dataSource: operationRecordList,
      visible: operationRecordModalVisible,
      pagination: operationRecordPagination,
      loading: fetchOperationRecordListLoading,
      handleOperationRecordSearch: this.handleOperationRecordSearch,
      hideModal: () => this.handleModalVisible('operationRecordModalVisible', false),
    };
    const columns = [
      {
        title: intl.get(`${commonPrompt}.displayPrNum`).d('采购申请编号'),
        width: 150,
        // fixed: 'left',
        align: 'left',
        dataIndex: 'displayPrNum',
        render: (text, record) => <a onClick={() => this.onHandleToDetail(record)}>{text}</a>,
      },
      {
        title: intl.get(`${commonPrompt}.prRequestedName`).d('申请人'),
        align: 'left',
        onCell: this.onCell,
        dataIndex: 'prRequestedName',
        width: 150,
      },
      {
        title: intl.get(`${commonPrompt}.creationDate`).d('创建时间'),
        width: 120,
        align: 'left',
        dataIndex: 'creationDate',
        render: dateTimeRender,
      },
      {
        title: intl.get(`${commonPrompt}.remark`).d('申请说明'),
        align: 'left',
        onCell: this.onCell,
        dataIndex: 'remark',
        width: 250,
      },
      {
        title: intl.get(`${commonPrompt}.prSourcePlatformMeaning`).d('单据来源'),
        align: 'left',
        dataIndex: 'prSourcePlatformMeaning',
        width: 120,
      },
      {
        title: intl.get(`hzero.common.button.operating`).d('操作记录'),
        align: 'left',
        width: 120,
        render: (_, record) => {
          return <a onClick={() => this.openOperationRecord(record)}>操作记录</a>;
        },
      },
    ];
    // const scrollX = sum(columns.map(n => n.width)) + 600;
    return (
      <React.Fragment>
        <Header title={intl.get(`${viewMessagePrompt}.purchaseRequisitionApproval`).d('需求审批')}>
          <Button
            type="primary"
            icon="check"
            loading={approving}
            onClick={this.approvalApprovalList}
            disabled={isArray(selectedListRowKeys) && isEmpty(selectedListRowKeys)}
          >
            {intl.get(`${viewMessagePrompt}.approval`).d('审批通过')}
          </Button>
          <Button
            icon="exclamation-circle-o"
            loading={rejecting}
            onClick={this.rejectApprovalList}
            disabled={isArray(selectedListRowKeys) && isEmpty(selectedListRowKeys)}
          >
            {intl.get(`${viewMessagePrompt}.reject`).d('审批拒绝')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <Table
            resizable
            bordered
            rowKey="prHeaderId"
            scroll={{ x: tableScrollWidth(columns) }}
            columns={columns}
            dataSource={approvalList}
            loading={queryListLoading}
            pagination={listPagination}
            rowSelection={rowSelection}
            onChange={this.handleListSearch}
          />
          {/* <OperationRecord {...operationRecordProps} /> */}
        </Content>
      </React.Fragment>
    );
  }
}
