/**
 * 购物车-服务申请
 * @since 2019-7-10
 * @author guozhiqiang <zhiqiang.guo@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent } from 'react';
import { Button, Form, Spin, Card } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import classnames from 'classnames';

import { Content, Header } from 'components/Page';
import notification from 'utils/notification';
// import notification from 'utils/notification';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';

import ApplicationList from './ApplicationList';
import HeaderForm from './HeaderForm';

const commonPrompt = 'hzero.common';
const viewMessagePrompt = 'spfm.shoppingCart.view.message';

/**
 * 购物车-服务申请
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ shoppingCart, loading }) => ({
  applicationList: shoppingCart.applicationList,
  currenTenantId: shoppingCart.currenTenantId,
  saveLoading: loading.effects['shoppingCart/fetchSave'],
  fetchLoading: loading.effects['shoppingCart/fetchServeInfo'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'spfm.shoppingCart' })
export default class Application extends PureComponent {
  form;

  state = {
    tenantId: getCurrentOrganizationId(),
    selectedRowKeys: [],
    serveInfo: {},
    editFlag: false,
  };

  componentDidMount() {
    this.getServeInfo();
  }

  /**
   * 服务开通申请-联系人信息
   */
  @Bind()
  getServeInfo() {
    const { dispatch } = this.props;
    const { tenantId } = this.state;
    dispatch({
      type: 'shoppingCart/fetchServeInfo',
      payload: {
        tenantId,
      },
    }).then(res => {
      if (res) {
        this.setState({
          serveInfo: res,
        });
      }
    });
  }

  /**
   * 绑定HeaderForm
   */
  @Bind()
  bindForm(form) {
    this.form = form;
  }

  /**
   * 选择栏的数组
   * @param {array} selectedRowKeys
   */
  @Bind()
  onRowSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shoppingCart/updateState',
      payload: {
        detail: {},
        applicationList: {},
        serviceList: {},
      },
    });
  }

  /**
   * 服务申请-申请头
   * @param {object} id - 采购申请头ID
   */
  @Bind()
  serveDetail(id) {
    const { dispatch } = this.props;
    const { tenantId } = this.state;
    dispatch({
      type: 'shoppingCart/serveDetail',
      payload: {
        tenantId,
        requestHeaderId: id,
      },
    }).then(res => {
      if (res) {
        this.setState({
          serveInfo: res,
        });
      }
    });
  }

  /**
   * 服务申请-服务列表
   * @param {number} id - 采购申请行ID
   */
  @Bind()
  serveQueryList(id) {
    const { dispatch } = this.props;
    const { tenantId } = this.state;
    dispatch({
      type: 'shoppingCart/serveQueryList',
      payload: {
        tenantId,
        requestHeaderId: id,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'shoppingCart/updateState',
          payload: {
            applicationList: { list: { content: res.content } },
          },
        });
      }
    });
  }

  /**
   * 保存，验证头数据和sheet行数据
   */
  @Bind()
  save() {
    const { tenantId, serveInfo } = this.state;
    const { dispatch, applicationList } = this.props;
    const { list = {} } = applicationList;
    const { content = [] } = list;
    this.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'shoppingCart/fetchSave',
          payload: {
            cartIds: content.map(item => item.cartId),
            requestHeader: {
              ...serveInfo,
              ...values,
              crmTenant: tenantId,
            },
            requestLineList: content,
            client: 'HZERO',
            tenantId,
            crmTenant: tenantId,
          },
        }).then(res => {
          if (typeof res === 'number') {
            notification.success();
            this.serveDetail(res);
            this.serveQueryList(res);
          }
        });
      }
    });
  }

  /**
   * 提交cartIds
   */
  @Bind()
  submit() {
    const { tenantId, serveInfo } = this.state;
    const { dispatch, history, applicationList } = this.props;
    const { list = {} } = applicationList;
    const { content = [] } = list;
    this.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'shoppingCart/fetchSubmit',
          payload: {
            cartIds: content.map(item => item.cartId),
            requestHeader: {
              ...serveInfo,
              ...values,
              crmTenant: tenantId,
            },
            requestLineList: content,
            client: 'HZERO',
          },
        }).then(res => {
          if (res) {
            notification.success();
            history.push('/spfm/amkt-appstore/shopping-cart');
          }
          // history.push('/spfm/amkt-servelog/list');
        });
      }
    });
  }

  /**
   * setEditFlag
   */
  @Bind()
  handleSetEditFlag(flag) {
    this.setState({ editFlag: flag });
  }

  /**
   * handleSetState
   */
  @Bind()
  handleSetState(opt) {
    this.setState(opt);
  }

  render() {
    const { selectedRowKeys, serveInfo, editFlag } = this.state;
    const { saveLoading, applicationList, dispatch, fetchLoading } = this.props;
    const {
      list: { content = [] },
    } = applicationList;
    const headerFormProps = {
      bindForm: this.bindForm,
      serveInfo,
      handleSetEditFlag: this.handleSetEditFlag,
    };
    const applicationProps = {
      applicationList,
      dispatch,
      onRowSelectChange: this.onRowSelectChange,
      selectedRowKeys,
      editFlag,
      handleSetState: this.handleSetState,
    };

    return (
      <React.Fragment>
        <Header
          title={intl.get(`${viewMessagePrompt}.serviceApplication`).d('服务申请')}
          backPath="/spfm/amkt-appstore/shopping-cart"
        >
          <Button
            onClick={this.submit}
            type="primary"
            icon="check"
            disabled={!(content.length > 0)}
          >
            {intl.get(`${commonPrompt}.button.submit`).d('提交')}
          </Button>
          <Button onClick={this.save} icon="save" loading={saveLoading}>
            {intl.get(`${commonPrompt}.button.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Spin
            spinning={saveLoading || fetchLoading || false}
            wrapperClassName={classnames('ued-detail-wrapper')}
          >
            <Card
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              title={intl.get(`${viewMessagePrompt}.baseInfo`).d('基本信息')}
            >
              <HeaderForm {...headerFormProps} />
            </Card>
            <Card
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              title={intl.get(`${viewMessagePrompt}.serviceList`).d('服务清单')}
            >
              <ApplicationList {...applicationProps} />
            </Card>
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}
