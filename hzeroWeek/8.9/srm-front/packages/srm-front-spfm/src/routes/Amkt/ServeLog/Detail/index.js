/**
 * index.js - 服务开通记录明细
 * @date: 2019-07-10
 * @author: WY <yang.wang08@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Card, Row, Col, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import classnames from 'classnames';

import { Header, Content } from 'components/Page';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { filterNullValueObject, createPagination, getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import intl from 'utils/intl';

import FilterForm from './FilterForm';
import List from './List';

/**
 * 服务开通记录明细
 * @extends {Component} - Detail
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} serveLog - 数据源
 * @reactProps {Boolean} queryDetailLoading - 申请头数据加载是否完成
 * @reactProps {Boolean} serveListLoading - 服务列表数据加载是否完成
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
const organizationId = getCurrentOrganizationId();
const promptCode = 'spfm.serveLog';

@connect(({ loading = {} }) => ({
  serveListLoading: loading.effects['serveLog/serveQueryList'],
  queryDetailLoading: loading.effects['serveLog/queryDetailLoading'],
}))
@formatterCollections({ code: ['spfm.serveLog'] })
export default class detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      rowDataSource: {},
      detailDataSource: [],
      detailPagination: {},
    };
  }

  componentDidMount() {
    this.serveDetail();
    this.serveQueryList();
  }

  /**
   * 服务开通记录明细-申请头
   * @param {object} params - 采购申请头ID
   */
  @Bind()
  serveDetail() {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    dispatch({
      type: 'serveLog/serveDetail',
      payload: {
        ...params,
      },
    }).then(res => {
      if (res) {
        this.setState({
          rowDataSource: res,
        });
      }
    });
  }

  /**
   * serveQueryList - 服务开通记录明细-服务列表
   * @param {number} params - 采购申请行ID
   */
  @Bind()
  serveQueryList(page = {}) {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    dispatch({
      type: 'serveLog/serveQueryList',
      payload: {
        ...params,
        page,
      },
    }).then(res => {
      if (res) {
        this.setState({
          detailDataSource: res.content,
          detailPagination: createPagination(res),
        });
      }
    });
  }

  /**
   * 删除选中的行
   */
  @Bind()
  delSeletedRows() {
    const rowKey = 'requestLineId';
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const lineIds = selectedRows.map(item => item[rowKey]);
    dispatch({
      type: 'serveLog/serveDelete',
      payload: {
        crmTenant: organizationId,
        lineIds,
      },
    }).then(res => {
      if (res) {
        this.setState({
          selectedRows: [],
        });
        this.serveQueryList();
      }
    });
  }

  /**
   * 设置选中行
   * @param {Array} selectedRows
   */
  @Bind()
  rowSelectChange(_, selectedRows) {
    this.setState({
      selectedRows,
    });
  }

  /**
   * 保存
   */
  @Bind()
  save() {
    const { dispatch } = this.props;
    const { form } = this.formdatas.props;
    const { rowDataSource = {}, detailDataSource = [] } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          requestHeader: {
            ...rowDataSource,
            ...values,
          },
          requestLineList: detailDataSource,
          client: 'HZERO',
        };
        dispatch({
          type: 'serveLog/serveSave',
          payload: filterNullValueObject(data),
        }).then(res => {
          if (res) {
            notification.success();
            this.serveDetail();
            this.serveQueryList();
          }
        });
      }
    });
  }

  /**
   * 提交
   */
  @Bind()
  submit() {
    const { history, dispatch } = this.props;
    const { form } = this.formdatas.props;
    const { rowDataSource = {}, detailDataSource = [] } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          requestHeader: {
            ...rowDataSource,
            ...values,
          },
          requestLineList: detailDataSource,
          client: 'HZERO',
        };
        dispatch({
          type: 'serveLog/serveSubmit',
          payload: filterNullValueObject(data),
        }).then(res => {
          if (res) {
            notification.success();
            history.push('/spfm/amkt-servelog/list');
          }
        });
      }
    });
  }

  render() {
    const { serveListLoading = false, queryDetailLoading = false } = this.props;
    const {
      selectedRows = [],
      rowDataSource = {},
      detailDataSource = [],
      detailPagination = {},
    } = this.state;
    const selectedRowKeys = selectedRows.map(item => item.requestLineId);
    const fiterProps = {
      rowDataSource,
      formOnRef: node => {
        this.formdatas = node;
      },
    };
    const listProps = {
      selectedRowKeys,
      rowDataSource,
      serveListLoading,
      detailDataSource,
      detailPagination,
      fetchList: this.serveQueryList,
      onRowSelectChange: this.rowSelectChange,
      onDelSeletedRows: this.delSeletedRows,
      onHandlePageChange: this.serveQueryList,
    };
    return (
      <React.Fragment>
        <Header
          backPath="/spfm/amkt-servelog/list"
          title={intl.get(`${promptCode}.view.message.title`).d('服务开通记录')}
        >
          {rowDataSource.status === 'NEW' ? (
            <React.Fragment>
              <Button
                onClick={this.submit}
                disabled={detailDataSource.length === 0}
                type="primary"
                icon="check"
              >
                {intl.get('hzero.common.button.submit').d('提交')}
              </Button>
              <Button onClick={this.save} disabled={detailDataSource.length === 0} icon="save">
                {intl.get('hzero.common.button.save').d('保存')}
              </Button>
            </React.Fragment>
          ) : null}
        </Header>
        <Content>
          <Spin
            spinning={queryDetailLoading || serveListLoading}
            wrapperClassName={classnames('ued-detail-wrapper')}
          >
            <Row gutter={48}>
              <Col span={24}>
                <Card
                  key="zuul-rate-limit-header"
                  bordered={false}
                  className={DETAIL_CARD_CLASSNAME}
                  title={intl.get(`${promptCode}.view.message.baseInfo`).d('基本信息')}
                >
                  <FilterForm {...fiterProps} />
                </Card>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={24}>
                <Card
                  key="zuul-rate-limit-header"
                  bordered={false}
                  className={DETAIL_CARD_CLASSNAME}
                  title={intl.get(`${promptCode}.view.message.serveManage`).d('服务清单')}
                >
                  <List {...listProps} />
                </Card>
              </Col>
            </Row>
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}
