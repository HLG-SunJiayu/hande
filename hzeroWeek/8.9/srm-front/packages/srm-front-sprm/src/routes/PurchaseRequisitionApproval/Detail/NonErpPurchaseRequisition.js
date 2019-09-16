/*
 * NonErpPurchaseRequisition - 非ERP采购申请
 * @date: 2019-01-24
 * @author: guochaochao <chaochao.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Spin, Modal, Collapse, Icon, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isNumber, isEmpty } from 'lodash';
import classnames from 'classnames';

import UploadModal from 'components/Upload/index';
import { Content, Header } from 'components/Page';
import intl from 'utils/intl';
import { createPagination } from 'utils/utils';
import notification from 'utils/notification';

// import OperationRecord from '../../components/OperationRecord/OperationRecord';
import NonErpDeliveryInformationHeader from './NonErpDeliveryInformationHeader';
import NonHeaderInfo from './NonErpHeaderInfo';
import NonErpList from './NonErpList';
import NonErpBillingInformation from './NonErpBillingInformation';
import styles from './index.less';

const { Panel } = Collapse;

const viewMessagePrompt = 'sprm.purchaseRequisitionApproval.view.message';
@Form.create({ fieldNameProp: null })
@connect(({ loading, purchaseRequisitionApproval }) => ({
  detailApproveLoading: loading.effects['purchaseRequisitionApproval/detailApprove'],
  detailRejectLoading: loading.effects['purchaseRequisitionApproval/detailReject'],
  queryDetailHeaderLoading: loading.effects['purchaseRequisitionApproval/queryDetailHeader'],
  queryDetailListLoading: loading.effects['purchaseRequisitionApproval/queryDetailList'],
  fetchOperationRecordListLoading:
    loading.effects['purchaseRequisitionApproval/fetchOperationRecordList'],
  purchaseRequisitionApproval,
}))
export default class NonErpPurchaseRequisition extends PureComponent {
  constructor(props) {
    super(props);
    const {
      match: { params = {} },
    } = this.props;
    const prHeaderId = params.id;
    this.state = {
      prHeaderId,
      operationRecordList: [],
      operationRecordPagination: {},
      headerInfo: {}, // 头form数据源
      collapseKeys: {}, // 打开的折叠面板key
      listDataSource: [], // 表格数据源
      listPagination: {}, // 表格分页
      isClearListCacheDataSource: true, // 是否清除表格缓存数据源
      operationRecordModalVisible: false,
    };
  }

  componentDidMount() {
    const { prHeaderId } = this.state;
    if (isNumber(+prHeaderId)) {
      this.fetchDetailHeader();
      this.fetchDetailList();
    }
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
   * @param {object} params - 查询条件
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
   * onCollapseChange - 折叠面板onChange
   * @param {Array<string>} collapseKeys - Panels key
   */
  @Bind()
  onCollapseChange(arr, key) {
    const { collapseKeys } = this.state;
    this.setState({
      collapseKeys: {
        ...collapseKeys,
        [key]: arr,
      },
    });
  }

  /**
   * 查询操作记录列表
   * @param {Object} page 查询字段
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
  handleModalVisible(modalVisible, flag) {
    this.setState({ [modalVisible]: !!flag });
  }

  /**
   * 审批通过
   * @memberof Detail
   */
  @Bind()
  approvalApprovalList() {
    const { dispatch } = this.props;
    const { headerInfo, listDataSource } = this.state;
    const { validateFields = e => e } = this.headerInfo.props.form;
    this.setState({ approvedRemarkRequired: false }, () => {
      validateFields({ force: true }, (err, values) => {
        if (isEmpty(err)) {
          const { approvedRemark } = values;
          Modal.confirm({
            title: intl.get(`${viewMessagePrompt}.confirmApprove`).d('是否确认审批通过需求'),
            onOk: () => {
              dispatch({
                type: 'purchaseRequisitionApproval/approvalApprovalList',
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
   * 订单审批拒绝
   */
  @Bind()
  rejectApprovalList() {
    const { dispatch } = this.props;
    const { headerInfo, listDataSource } = this.state;
    const { validateFields = e => e } = this.headerInfo.props.form;
    this.setState({ approvedRemarkRequired: true });
    Modal.confirm({
      title: intl.get(`${viewMessagePrompt}.confirmReject`).d('是否确认审批拒绝需求'),
      onOk: () => {
        validateFields({ force: true }, (err, values) => {
          if (isEmpty(err)) {
            const { approvedRemark } = values;
            dispatch({
              type: 'purchaseRequisitionApproval/rejectApprovalList',
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
      form,
      dispatch,
      detailRejectLoading,
      detailApproveLoading,
      queryDetailListLoading,
      queryDetailHeaderLoading,
      fetchOperationRecordListLoading,
    } = this.props;
    const {
      headerInfo,
      collapseKeys,
      listDataSource,
      listPagination,
      operationRecordList,
      approvedRemarkRequired,
      operationRecordPagination,
      operationRecordModalVisible,
      isClearListCacheDataSource,
    } = this.state;
    const headerInfoFormProps = {
      form,
      headerInfo,
      approvedRemarkRequired,
      loading: queryDetailHeaderLoading,
      onRef: node => {
        this.headerInfo = node;
      },
    };
    const { prStatusCode, prSourcePlatform } = headerInfo;
    const operationRecordProps = {
      dataSource: operationRecordList,
      visible: operationRecordModalVisible,
      pagination: operationRecordPagination,
      loading: fetchOperationRecordListLoading,
      handleOperationRecordSearch: this.handleOperationRecordSearch,
      hideModal: () => this.handleModalVisible('operationRecordModalVisible', false),
    };
    const listProps = {
      dispatch,
      prSourcePlatform,
      isClearListCacheDataSource,
      onRef: node => {
        this.list = node;
      },
      dataSource: listDataSource,
      pagination: listPagination,
      onSearch: this.fetchDetailList,
      loading: queryDetailListLoading,
    };
    const uploadProps = {
      bucketName: 'sprm-pr',
      btnText: intl.get(`${viewMessagePrompt}.attachment`).d('附件查看'),
      attachmentUUID: headerInfo.attachmentUuid,
      viewOnly: true,
      showFilesNumber: false,
      btnProps: {
        icon: 'paper-clip',
      },
    };
    return (
      <div className={styles['order-detail']}>
        <Header
          title={intl.get(`${viewMessagePrompt}.deliveryDetail`).d('需求明细')}
          backPath="/sprm/purchase-requisition-approval/list"
        >
          <Button
            icon="check"
            type="primary"
            onClick={this.approvalApprovalList}
            loading={detailApproveLoading}
            disabled={prStatusCode !== 'SUBMITTED'}
          >
            {intl.get(`s${viewMessagePrompt}.approval`).d('审批通过')}
          </Button>
          <Button
            icon="close"
            className="label-btn"
            onClick={this.rejectApprovalList}
            loading={detailRejectLoading}
            disabled={prStatusCode !== 'SUBMITTED'}
          >
            {intl.get(`${viewMessagePrompt}.reject`).d('审批拒绝')}
          </Button>
          <Button
            icon="clock-circle-o"
            className="label-btn"
            onClick={() => this.handleModalVisible('operationRecordModalVisible', true)}
          >
            {intl.get(`hzero.common.button.operating`).d('操作记录')}
          </Button>
          <UploadModal {...uploadProps} />
        </Header>
        <Content>
          <Spin spinning={false}>
            <NonHeaderInfo {...headerInfoFormProps} />
            {!prSourcePlatform || ['CATALOGUE', 'SRM'].includes(prSourcePlatform) ? (
              ''
            ) : (
              <Collapse
                className="form-collapse"
                // defaultActiveKey={['deliveryInformationHeader']}
                onChange={arr => this.onCollapseChange(arr, 'deliveryInformationHeader')}
              >
                <Panel
                  showArrow={false}
                  header={
                    <Fragment>
                      <h3>
                        {intl
                          .get(`${viewMessagePrompt}.deliveryInformationHeader`)
                          .d('收货/收单信息')}
                      </h3>
                      <a>
                        {collapseKeys.deliveryInformationHeader
                          ? collapseKeys.deliveryInformationHeader.some(
                              o => o === 'deliveryInformationHeader'
                            )
                            ? intl.get(`hzero.common.button.up`).d('收起')
                            : intl.get(`hzero.common.button.expand`).d('展开')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon
                        type={
                          collapseKeys.deliveryInformationHeader
                            ? collapseKeys.deliveryInformationHeader.some(
                                o => o === 'deliveryInformationHeader'
                              )
                              ? 'up'
                              : 'down'
                            : 'down'
                        }
                      />
                    </Fragment>
                  }
                  key="deliveryInformationHeader"
                >
                  <NonErpDeliveryInformationHeader {...headerInfoFormProps} />
                </Panel>
              </Collapse>
            )}
            {!prSourcePlatform || ['CATALOGUE', 'SRM'].includes(prSourcePlatform) ? (
              ''
            ) : (
              <Collapse
                className="form-collapse"
                // defaultActiveKey={['billingInformation']}
                onChange={arr => this.onCollapseChange(arr, 'billingInformation')}
              >
                <Panel
                  showArrow={false}
                  header={
                    <Fragment>
                      <h3>{intl.get(`${viewMessagePrompt}.billingInformation`).d('开票信息')}</h3>
                      <a>
                        {collapseKeys.billingInformation
                          ? collapseKeys.billingInformation.some(o => o === 'billingInformation')
                            ? intl.get(`hzero.common.button.up`).d('收起')
                            : intl.get(`hzero.common.button.expand`).d('展开')
                          : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon
                        type={
                          collapseKeys.billingInformation
                            ? collapseKeys.billingInformation.some(o => o === 'billingInformation')
                              ? 'up'
                              : 'down'
                            : 'down'
                        }
                      />
                    </Fragment>
                  }
                  key="billingInformation"
                >
                  <NonErpBillingInformation {...headerInfoFormProps} />
                </Panel>
              </Collapse>
            )}
            <Collapse
              className={classnames('form-collapse', 'line-wrapper')}
              defaultActiveKey={['purchaseLineInfo']}
              onChange={arr => this.onCollapseChange(arr, 'purchaseLineInfo')}
            >
              <Panel
                showArrow={false}
                header={
                  <Fragment>
                    <h3>{intl.get(`${viewMessagePrompt}.purchaseLineInfo`).d('采购申请行信息')}</h3>
                    <a>
                      {collapseKeys.purchaseLineInfo
                        ? collapseKeys.purchaseLineInfo.some(o => o === 'purchaseLineInfo')
                          ? intl.get(`hzero.common.button.up`).d('收起')
                          : intl.get(`hzero.common.button.expand`).d('展开')
                        : intl.get(`hzero.common.button.up`).d('收起')}
                    </a>
                    <Icon
                      type={
                        collapseKeys.purchaseLineInfo
                          ? collapseKeys.purchaseLineInfo.some(o => o === 'purchaseLineInfo')
                            ? 'up'
                            : 'down'
                          : 'up'
                      }
                    />
                  </Fragment>
                }
                key="purchaseLineInfo"
              >
                <NonErpList {...listProps} />
              </Panel>
            </Collapse>
          </Spin>
          {/* <OperationRecord {...operationRecordProps} /> */}
        </Content>
      </div>
    );
  }
}
