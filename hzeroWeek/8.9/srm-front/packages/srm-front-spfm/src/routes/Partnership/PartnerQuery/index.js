/*
 * Partnership - 合作关系查询
 * @date: 2018-8-7
 * @author: dengtingmin <tingmin.deng@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */
import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  Row,
  Col,
  Icon,
  Table,
  Checkbox,
  Modal,
} from 'hzero-ui';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import SearchPage from 'components/SearchPage';
import { createPagination, getDateFormat } from 'utils/utils';
import intl from 'utils/intl';
import { DATETIME_MIN } from 'utils/constants';
import { dateRender } from 'utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';

const FormItem = Form.Item;

@formatterCollections({
  code: ['spfm.partnership', 'entity.company'],
})
export default class Customer extends SearchPage {
  constructor(props) {
    super(props);
    this.state = {
      dateFormat: getDateFormat(),
      display: true, // 查询条件的显示、隐藏控制
      currentLine: {}, // 当前查看的行
    };
  }

  // customConstructor(props){
  //   props.onRef(this);
  // }

  componentDidMount() {
    const {
      partnership: { pagination },
    } = this.props;
    this.props.onRef(this);
    this.queryIdpValue();
    this.handleSearch(pagination);
  }

  @Bind()
  pageConfig() {
    return {
      modelName: 'partnership',
      searchDispatch: 'partnership/queryPartnership',
      customSearch: true,
      paramsFilter: values => {
        const { tenantId } = this.props;
        const { inviteDateFrom, inviteDateTo } = values;
        return {
          tenantId,
          inviteDateFrom: inviteDateFrom ? moment(inviteDateFrom).format(DATETIME_MIN) : undefined,
          inviteDateTo: inviteDateTo ? moment(inviteDateTo).format(DATETIME_MIN) : undefined,
        };
      },
    };
  }

  /**
   * 查询编码
   */
  @Bind()
  queryIdpValue() {
    const { dispatch } = this.props;
    dispatch({
      type: 'partnership/queryIdpValue',
    });
  }

  /**
   * 展开、收起更多查询条件
   */
  @Bind()
  toggleForm() {
    const { display } = this.state;
    this.setState({
      display: !display,
    });
  }

  /**
   * 查询详情数据
   * @param {*object} pagination
   */
  @Bind()
  fetchActionList(pagination = {}) {
    const { dispatch } = this.props;
    const { currentLine } = this.state;
    const params = {
      ...currentLine,
      page: pagination ? pagination.current - 1 : 0,
      size: pagination ? pagination.pageSize : 10,
    };

    dispatch({
      type: 'partnership/queryActionDetail',
      payload: params,
    });
  }

  /**
   * 显示详情弹框
   * @param {object} record
   */
  @Bind()
  showDetailModal(record = {}) {
    const { purchaserCompanyId, supplierCompanyId } = record;
    this.setState(
      {
        actionListVisible: true,
        currentLine: {
          purchaserCompanyId,
          supplierCompanyId,
        },
      },
      () => {
        this.fetchActionList();
      }
    );
  }

  /**
   * 隐藏详情弹框
   */
  @Bind()
  hiddenDetailModal() {
    this.setState({
      actionListVisible: false,
      currentLine: {},
    });
  }

  /**
   * 渲染查询表单
   */
  @Bind()
  renderForm(form) {
    const { getFieldDecorator, getFieldValue } = form;
    const {
      partnership: { inviteCompleteStatus = [] },
    } = this.props;
    const { display, dateFormat } = this.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const prefix = 'spfm.partnership.model.partnership';
    return (
      <Form layout="inline" className="more-fields-form">
        <Row>
          <Col span={18}>
            <Row>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${prefix}.purchaserCompanyName`).d('采购公司名称')}
                  {...formItemLayout}
                >
                  {getFieldDecorator('purchaserCompanyName')(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${prefix}.purchaserTenantName`).d('采购集团名称')}
                  {...formItemLayout}
                >
                  {getFieldDecorator('purchaserGroupName')(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${prefix}.inviteStatus`).d('邀约状态')}
                  {...formItemLayout}
                >
                  {getFieldDecorator('inviteStatus')(
                    <Select allowClear>
                      {inviteCompleteStatus.map(m => {
                        return (
                          <Select.Option key={m.value} value={m.value}>
                            {m.meaning}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ display: display ? 'none' : 'block' }}>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${prefix}.supplierCompanyName`).d('销售公司名称')}
                  {...formItemLayout}
                >
                  {getFieldDecorator('supplierCompanyName')(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${prefix}.supplierTenantName`).d('销售集团名称')}
                  {...formItemLayout}
                >
                  {getFieldDecorator('supplierGroupName')(<Input />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${prefix}.inviteDateFrom`).d('邀约时间从')}
                  {...formItemLayout}
                >
                  {getFieldDecorator('inviteDateFrom')(
                    <DatePicker
                      disabledDate={currentDate =>
                        getFieldValue('inviteDateTo') &&
                        moment(getFieldValue('inviteDateTo')).isBefore(currentDate, 'day')
                      }
                      placeholder=""
                      format={dateFormat}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={intl.get(`${prefix}.inviteDateTo`).d('邀约时间至')}
                  {...formItemLayout}
                >
                  {getFieldDecorator('inviteDateTo', {})(
                    <DatePicker
                      disabledDate={currentDate =>
                        getFieldValue('inviteDateFrom') &&
                        moment(getFieldValue('inviteDateFrom')).isAfter(currentDate, 'day')
                      }
                      placeholder=""
                      format={dateFormat}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="search-btn-more">
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.filterForm.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <a
                style={{ marginLeft: 8, display: display ? 'inline-block' : 'none' }}
                onClick={this.toggleForm}
              >
                {intl.get(`hzero.common.button.expand`).d('展开')} <Icon type="down" />
              </a>
              <a
                style={{ marginLeft: 8, display: display ? 'none' : 'inline-block' }}
                onClick={this.toggleForm}
              >
                {intl.get(`hzero.common.button.up`).d('收起')} <Icon type="up" />
              </a>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      loadingDetail,
      partnership: {
        inviteCompleteStatus = [],
        list = {},
        actionList = {},
        inviteStatus = [],
        pagination = {},
      },
    } = this.props;
    const prefix = `spfm.partnership.model.partnership`;
    const columns = [
      {
        title: intl.get(`${prefix}.purchaser`).d('采购'),
        children: [
          {
            title: intl.get('entity.company.code').d('公司编码'),
            width: 150,
            dataIndex: 'purchaserCompanyCode',
          },
          {
            title: intl.get('entity.company.name').d('公司名称'),
            dataIndex: 'purchaserCompanyName',
          },
          {
            title: intl.get(`${prefix}.tenantName`).d('所属集团'),
            dataIndex: 'purchaserGroupName',
          },
        ],
      },
      {
        title: intl.get(`${prefix}.supplier`).d('销售'),
        children: [
          {
            title: intl.get('entity.company.code').d('公司编码'),
            width: 150,
            dataIndex: 'supplierCompanyCode',
          },
          {
            title: intl.get('entity.company.name').d('公司名称'),
            dataIndex: 'supplierCompanyName',
          },
          {
            title: intl.get(`${prefix}.tenantName`).d('所属集团'),
            dataIndex: 'supplierGroupName',
          },
        ],
      },
      {
        title: intl.get(`${prefix}.inviteStatus`).d('邀约状态'),
        width: 100,
        dataIndex: 'inviteStatus',
        render: value => {
          const result = inviteCompleteStatus.find(item => item.value === value);
          return result ? result.meaning : value;
        },
      },
      {
        title: intl.get(`${prefix}.purchaserInvite`).d('采购方发起'),
        width: 100,
        dataIndex: 'purchaserInvite',
        render: value => <Checkbox disabled defaultChecked={!!value} />,
      },
      {
        title: intl.get(`${prefix}.supplierInvite`).d('供应商发起'),
        width: 100,
        dataIndex: 'supplierInvite',
        render: value => <Checkbox disabled defaultChecked={!!value} />,
      },
      {
        title: intl.get(`hzero.common.date.creation`).d('创建日期'),
        width: 100,
        dataIndex: 'inviteDate',
        render: dateRender,
      },
      {
        title: intl.get(`${prefix}.actionHistory`).d('操作记录'),
        dataIndex: 'actionHistory',
        width: 100,
        render: (_, record) => {
          return (
            <a onClick={() => this.showDetailModal(record)}>
              {intl.get(`${prefix}.actionHistory`).d('操作记录')}
            </a>
          );
        },
      },
    ];

    const actionColumns = [
      {
        title: intl.get('spfm.partnership.model.actionDetail.companyName').d('邀请方'),
        dataIndex: 'companyName',
      },
      {
        title: intl.get('spfm.partnership.model.actionDetail.inviteCompanyName').d('被邀请方'),
        dataIndex: 'inviteCompanyName',
      },
      {
        title: intl.get('spfm.partnership.model.actionDetail.inviteDate').d('邀请时间'),
        width: 120,
        dataIndex: 'inviteDate',
      },
      {
        title: intl.get('spfm.partnership.model.actionDetail.processDate').d('处理时间'),
        width: 120,
        dataIndex: 'processDate',
      },
      {
        title: intl.get('spfm.partnership.model.actionDetail.processStatus').d('处理状态'),
        width: 100,
        dataIndex: 'processStatus',
        render: value => {
          const result = inviteStatus.find(item => item.value === value);
          return result ? result.meaning : value;
        },
      },
    ];
    const filterProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const { FilterForm } = this;
    return (
      <React.Fragment>
        <div className="table-list-search">
          <FilterForm {...filterProps}>{form => this.renderForm(form)}</FilterForm>
        </div>
        <Table
          ref={node => {
            this.tableList = node;
          }}
          loading={loading}
          dataSource={list.content}
          pagination={pagination}
          rowKey="inviteId"
          columns={columns}
          bordered
          scroll={{ x: 1800 }}
          resizable={false}
          onChange={this.handleSearch}
        />
        <Modal
          destroyOnClose
          title={intl.get('spfm.partnership.view.message.actionDetail.title').d('操作记录')}
          visible={this.state.actionListVisible}
          width={800}
          onCancel={this.hiddenDetailModal}
          footer={null}
        >
          <Table
            bordered
            rowKey="inviteId"
            loading={loadingDetail}
            dataSource={actionList.content}
            columns={actionColumns}
            onChange={this.fetchActionList}
            pagination={createPagination(actionList)}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
