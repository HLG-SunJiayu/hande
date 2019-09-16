/*
 * ErpPurchaseRequisition - ERP采购申请
 * @date: 2019-01-23
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Spin, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { routerRedux } from 'dva/router';

import { Content, Header } from 'components/Page';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { createPagination } from 'utils/utils';
import notification from 'utils/notification';

// import OperationRecord from '../../components/OperationRecord/OperationRecord';
import HeaderInfo from './ErpHeaderInfo';
import ErpList from './ErpList';

const viewPrompt = 'sprm.purchaseRequisitionApproval.view.message';
const modelPrompt = 'sprm.purchaseRequisitionApproval.model.purchaseRequisitionApproval';
const viewButtonPrompt = 'sprm.purchaseRequisitionApproval.view.button';

/**
 * ErpPurchaseRequisition - Erp采购申请
 * @extends {Component} - React.Component
 * @reactProps {Object} [location={}] - 当前路由信息
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {!Object} [deliveryOrder={}] - model中的数据源
 * @reactProps {!Object} [loading={}] - 送货单明细加载是否完成
 * @reactProps {!Object} [loading.effect={}] - 送货单明细加载是否完成
 * @reactProps {!boolean} queryDetailHeaderLoading - 查询头明细
 * @reactProps {!boolean} queryDetailListLoading - 查询行明细
 * @reactProps {!boolean} fetchOperationRecordListLoading -查询操作记录
 * @reactProps {!boolean} rejectDeliveryOrderLoading - 送货单审批拒绝
 * @reactProps {!boolean} approveDeliveryOrderLoading - 送货单审批通过
 * @reactProps {Function} [dispatch= e => e] - redux dispatch方法
 * @return React.element
 */

@formatterCollections({
  code: [
    'sprm.purchaseRequisitionApproval',
    'entity.business',
    'entity.company',
    'entity.roles',
    'entity.attachment',
  ],
})
@connect(({ loading, purchaseRequisitionApproval }) => ({
  queryDetailHeaderLoading: loading.effects['purchaseRequisitionApproval/queryDetailHeader'],
  queryDetailListLoading: loading.effects['purchaseRequisitionApproval/queryDetailList'],
  rejectDeliveryOrderLoading: loading.effects['purchaseRequisitionApproval/reject'],
  approveDeliveryOrderLoading: loading.effects['purchaseRequisitionApproval/approve'],
  fetchOperationRecordListLoading:
    loading.effects['purchaseRequisitionApproval/fetchOperationRecordList'],

  purchaseRequisitionApproval,
}))
export default class ErpPurchaseRequisition extends Component {
  constructor(props) {
    super(props);
    const {
      match: { params = {} },
    } = this.props;
    const prHeaderId = params.id;
    this.state = {
      prHeaderId,
      headerInfo: {},
      operationRecordList: [],
      operationRecordPagination: {},
      operationRecordModalVisible: false,
    };
  }

  componentDidMount() {
    this.fetchDetailHeader();
    this.fetchDetailList();
  }

  /**
   * fetchDetailHeader - 查询头明细数据
   */
  @Bind()
  fetchDetailHeader() {
    const { dispatch } = this.props;
    const { prHeaderId } = this.state;
    dispatch({
      type: 'purchaseRequisitionApproval/queryDetailHeader',
      prHeaderId,
    }).then(res => {
      if (res) {
        this.setState({
          headerInfo: res,
        });
      }
    });
  }

  /**
   * fetchDetailList - 查询行明细数据
   */
  @Bind()
  fetchDetailList(page = {}) {
    const { dispatch } = this.props;
    const { prHeaderId } = this.state;
    dispatch({
      type: 'purchaseRequisitionApproval/queryDetailList',
      payload: {
        prHeaderId,
        page,
      },
    }).then(res => {
      if (res) {
        this.setState({
          listDataSource: [...res.content.map(n => ({ ...n, _status: 'update' }))],
          listPagination: createPagination(res),
        });
      }
    });
  }

  /**
   * 查询操作记录列表
   * @param {Object} fields 查询字段
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
   */
  @Bind()
  openOperationRecord(record) {
    this.setState({
      operationRecordModalVisible: true,
      prHeaderId: record.prHeaderId,
    });
  }

  @Bind()
  handleModalVisible(modalVisible, flag) {
    this.setState({ [modalVisible]: !!flag });
  }

  /**
   * 审批通过
   * @memberof Detail
   */
  @Bind()
  approve() {
    const { dispatch } = this.props;
    const { headerInfo, listDataSource } = this.state;
    const { validateFields = e => e } = this.headerInfo.props.form;
    this.setState({ approvedRemarkRequired: false }, () => {
      validateFields({ force: true }, (err, values) => {
        if (isEmpty(err)) {
          const { approvedRemark } = values;
          Modal.confirm({
            title: intl.get(`${viewPrompt}.confirmApprove`).d('是否确认审批通过需求'),
            onOk: () => {
              dispatch({
                type: 'purchaseRequisitionApproval/approval',
                payload: {
                  prHeaderList: [
                    {
                      ...headerInfo,
                      approvedRemark,
                      lines: listDataSource,
                    },
                  ],
                },
              }).then(res => {
                if (res) {
                  notification.success();
                  dispatch(
                    routerRedux.push({
                      pathname: `/sprm/purchase-requisition-approval/list`,
                    })
                  );
                }
              });
            },
          });
        }
      });
    });
  }

  /**
   * 审批拒绝
   * @memberof Detail
   */
  @Bind()
  reject() {
    const { dispatch } = this.props;
    const { headerInfo, listDataSource } = this.state;
    const { validateFields = e => e } = this.headerInfo.props.form;
    this.setState({ approvedRemarkRequired: true });
    Modal.confirm({
      title: intl.get(`${viewPrompt}.confirmReject`).d('是否确认审批拒绝需求'),
      onOk: () => {
        validateFields({ force: true }, (err, values) => {
          if (isEmpty(err)) {
            const { approvedRemark } = values;
            dispatch({
              type: 'purchaseRequisitionApproval/reject',
              payload: {
                ...headerInfo,
                approvedRemark,
                lines: listDataSource,
              },
            }).then(res => {
              if (res) {
                notification.success();
                dispatch(
                  routerRedux.push({
                    pathname: `/sprm/purchase-requisition-approval/list`,
                  })
                );
              }
            });
          }
        });
      },
      onCancel: () => {
        this.setState({ approvedRemarkRequired: false }, () => validateFields({ force: true }));
      },
    });
  }

  render() {
    const {
      queryDetailHeaderLoading,
      fetchOperationRecordListLoading,
      approveDeliveryOrderLoading,
      rejectDeliveryOrderLoading,
      queryDetailListLoading,
    } = this.props;
    const {
      operationRecordList,
      operationRecordPagination,
      operationRecordModalVisible,
      headerInfo,
      listDataSource,
      listPagination,
      approvedRemarkRequired,
    } = this.state;
    const { prStatusCode } = headerInfo;
    const operationRecordProps = {
      pagination: operationRecordPagination,
      dataSource: operationRecordList,
      visible: operationRecordModalVisible,
      loading: fetchOperationRecordListLoading,
      handleOperationRecordSearch: this.handleOperationRecordSearch,
      hideModal: () => this.handleModalVisible('operationRecordModalVisible', false),
    };
    const headerInfoProps = {
      headerInfo,
      approvedRemarkRequired,
      loading: queryDetailHeaderLoading,
      onRef: node => {
        this.headerInfo = node;
      },
    };
    const LogisticInfoProps = {
      headerInfo,
      loading: queryDetailListLoading,
      onSearchList: this.fetchDetailList,
      hideModal: () => this.handleModalVisible('operationRecordModalVisible', true),
      handleOperationRecordSearch: this.handleOperationRecordSearch,
      dataSource: listDataSource,
      pagination: listPagination,
    };

    return (
      <Fragment>
        <Header
          title={intl.get(`${viewPrompt}.deliveryDetail`).d('需求明细')}
          backPath="/sprm/purchase-requisition-approval/list"
        >
          <Button
            icon="check"
            type="primary"
            onClick={this.approve}
            loading={approveDeliveryOrderLoading}
            disabled={prStatusCode !== 'SUBMITTED'}
          >
            {intl.get(`${viewButtonPrompt}.approval`).d('审批通过')}
          </Button>
          <Button
            icon="close"
            onClick={this.reject}
            loading={rejectDeliveryOrderLoading}
            disabled={prStatusCode !== 'SUBMITTED'}
          >
            {intl.get(`${viewButtonPrompt}.reject`).d('审批拒绝')}
          </Button>
          <Button
            icon="clock-circle-o"
            onClick={() => this.handleModalVisible('operationRecordModalVisible', true)}
          >
            {intl.get(`${modelPrompt}.operationRecord`).d('操作记录')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={queryDetailHeaderLoading || queryDetailListLoading}>
            <HeaderInfo {...headerInfoProps} />
          </Spin>
          <ErpList {...LogisticInfoProps} />
          {/* <OperationRecord {...operationRecordProps} /> */}
        </Content>
      </Fragment>
    );
  }
}
