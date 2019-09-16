/**
 * notice - 公告管理
 * @date: 2018-9-20
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Button,
  Table,
  Form,
  Input,
  // Radio,
  Icon,
  Row,
  Col,
  DatePicker,
  Select,
  Popconfirm,
} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import { Header, Content } from 'components/Page';
// import Checkbox from 'components/Checkbox';
import cacheComponent from 'components/CacheComponent';

import { dateTimeRender } from 'utils/renderer';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getDateFormat, tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  DEFAULT_DATE_FORMAT,
  FORM_COL_3_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';

const FormItem = Form.Item;
// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
const { Option } = Select;

@connect(({ loading, notice }) => ({
  notice,
  organizationId: getCurrentOrganizationId(),
  publicLoading: loading.effects['notice/publicNotice'],
  fetchNoticeLoading: loading.effects['notice/fetchNotice'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'hptl.notice' })
@cacheComponent({ cacheKey: '/spfm/notices/list' })
export default class Notice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExpendSearch: false,
      actionNoticeId: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice/init',
    });
    this.fetchNotice({
      containsDeletedDataFlag: 1,
    });
  }

  /**
   * @function fetchEmail - 获取公告列表数据
   * @param {object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.size - 页数
   */
  fetchNotice(params = {}) {
    const {
      dispatch,
      form,
      organizationId,
      notice: { pagination = {} },
    } = this.props;
    // 格式化时间
    const {
      creationDateFrom,
      creationDateTo,
      publishedDateFrom,
      publishedDateTo,
    } = form.getFieldsValue();
    const dateParams = {
      creationDateFrom: creationDateFrom && moment(creationDateFrom).format(DEFAULT_DATE_FORMAT),
      creationDateTo: creationDateTo && moment(creationDateTo).format(DEFAULT_DATE_FORMAT),
      publishedDateFrom: publishedDateFrom && moment(publishedDateFrom).format(DEFAULT_DATE_FORMAT),
      publishedDateTo: publishedDateTo && moment(publishedDateTo).format(DEFAULT_DATE_FORMAT),
    };
    dispatch({
      type: 'notice/fetchNotice',
      payload: {
        organizationId,
        page: pagination,
        ...form.getFieldsValue(),
        ...dateParams,
        ...params,
      },
    });
  }

  /**
   * @function handleCreate - 新建
   */
  @Bind()
  handleCreate() {
    const { history } = this.props;
    history.push('/spfm/notices/detail/create');
  }

  /**
   * @function handlePagination - 分页操作
   */
  @Bind()
  handlePagination(pagination) {
    this.fetchNotice({
      page: pagination,
    });
  }

  /**
   * @function handleExpendSearch - 显示高级查询条件
   * @param {boolean} flag - 显示高级查询标识
   */
  @Bind()
  handleExpendSearch() {
    const { isExpendSearch } = this.state;
    this.setState({ isExpendSearch: !isExpendSearch });
  }

  /**
   * 重置查询表单
   */
  @Bind()
  handleResetSearch() {
    this.props.form.resetFields();
  }

  /**
   * @function handleSearch - 搜索公告
   */
  @Bind()
  handleSearch() {
    this.fetchNotice({ page: {} });
  }

  /**
   * @function handleNoticeTypeChange - 切换类别
   * @param {*} e - 事件对象
   */
  @Bind()
  handleNoticeTypeChange(e) {
    this.fetchNotice({ receiverTypeCode: e.target.value });
  }

  /**
   * @function handlePublicNotice - 发布公告信息
   * @param {string} organizationId - 租户ID
   * @param {object} record - 公告信息行数据
   * @param {string} record.noticeId - 公告信息ID
   */
  @Bind()
  handlePublicNotice(record) {
    const { dispatch, organizationId } = this.props;
    this.setState({ actionNoticeId: record.noticeId });
    dispatch({
      type: 'notice/publicNotice',
      payload: { organizationId, noticeId: record.noticeId },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchNotice();
      }
    });
  }

  /**
   * @function handleRevokeNotice - 撤销删除公告信息
   * @param {string} organizationId - 租户ID
   * @param {object} record - 公告信息行数据
   * @param {string} record.noticeId - 公告信息ID
   */
  @Bind()
  handleRevokeNotice(record) {
    const { dispatch, organizationId } = this.props;
    dispatch({
      type: 'notice/revokeNotice',
      payload: { organizationId, noticeId: record.noticeId, record },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchNotice({
          containsDeletedDataFlag: 1,
        });
      }
    });
  }

  /**
   * @function handleDeleteNotice - 删除公告信息
   * @param {string} organizationId - 租户ID
   * @param {object} record - 公告信息行数据
   * @param {string} record.noticeId - 公告信息ID
   */
  @Bind()
  handleDeleteNotice(record) {
    const { dispatch, organizationId } = this.props;
    dispatch({
      type: 'notice/deleteNotice',
      payload: { organizationId, ...record },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchNotice();
      }
    });
  }

  /**
   * @function renderFilterForm - 渲染筛选查询表单
   */
  @Bind()
  renderFilterForm() {
    const {
      form,
      notice: { noticeCategory = [], noticeStatus = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { isExpendSearch } = this.state;
    return (
      <Form>
        {/* <Row type="flex" justify="start">
          <Col>
            <FormItem>
              {getFieldDecorator('receiverTypeCode', {
                initialValue: '',
              })(
                <RadioGroup onChange={this.handleNoticeTypeChange}>
                  <RadioButton value="">
                    {intl.get('hptl.notice.model.notice.receiverTypeCode.All').d('全部公告')}
                  </RadioButton>
                  {noticeReceiverType.map(item => {
                    return (
                      <RadioButton value={item.value} key={item.value}>
                        {item.meaning}
                      </RadioButton>
                    );
                  })}
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              style={{ display: 'flex', justifyContent: 'start', marginLeft: 12 }}
              label={intl.get('hptl.notice.model.notice.containsDeletedDataFlag').d('显示已删除')}
            >
              {getFieldDecorator('containsDeletedDataFlag', {
                initialValue: 1,
              })(<Checkbox />)}
            </FormItem>
          </Col>
        </Row> */}
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_4_LAYOUT}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_3_LAYOUT}>
                <FormItem
                  label={intl.get('hptl.notice.model.notice.title').d('公告标题')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('title')(<Input style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <FormItem
                  label={intl.get('hptl.notice.model.notice.noticeCategoryCode').d('公告类别')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('noticeCategoryCode')(
                    <Select allowClear style={{ width: '100%' }}>
                      {noticeCategory.map(item => {
                        return (
                          <Option value={item.value} key={item.value}>
                            {item.meaning}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <FormItem
                  label={intl.get('hptl.notice.model.notice.statusCode').d('公告状态')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('statusCode')(
                    <Select allowClear style={{ width: '100%' }}>
                      {noticeStatus.map(item => {
                        return (
                          <Option value={item.value} key={item.value}>
                            {item.meaning}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: isExpendSearch ? 'block' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <FormItem
                  label={intl.get('hzero.common.date.creation.from').d('创建日期从')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('creationDateFrom')(
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder=""
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        form.getFieldValue('creationDateTo') &&
                        moment(form.getFieldValue('creationDateTo')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <FormItem
                  label={intl.get('hzero.common.date.creation.to').d('创建日期至')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('creationDateTo')(
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder=""
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        form.getFieldValue('creationDateFrom') &&
                        moment(form.getFieldValue('creationDateFrom')).isAfter(currentDate, 'day')
                      }
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: isExpendSearch ? 'block' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <FormItem
                  label={intl.get('hzero.common.date.release.from').d('发布日期从')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('publishedDateFrom')(
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder=""
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        form.getFieldValue('publishedDateTo') &&
                        moment(form.getFieldValue('publishedDateTo')).isBefore(currentDate, 'day')
                      }
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <FormItem
                  label={intl.get('hzero.common.date.release.to').d('发布日期至')}
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('publishedDateTo')(
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder=""
                      format={getDateFormat()}
                      disabledDate={currentDate =>
                        form.getFieldValue('publishedDateFrom') &&
                        moment(form.getFieldValue('publishedDateFrom')).isAfter(currentDate, 'day')
                      }
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className="search-btn-more">
            <FormItem>
              <Button onClick={this.handleExpendSearch}>
                {isExpendSearch
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get('hzero.common.button.viewMore').d('更多查询')}
              </Button>
              <Button onClick={this.handleResetSearch}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      fetchNoticeLoading,
      publicLoading,
      notice: { noticeList = [], pagination = {} },
    } = this.props;
    const { actionNoticeId } = this.state;
    const columns = [
      {
        title: intl.get('hptl.notice.model.notice.receiverType').d('发布类别'),
        width: 100,
        dataIndex: 'receiverTypeMeaning',
      },
      {
        title: intl.get('hptl.notice.model.notice.title').d('公告标题'),
        dataIndex: 'title',
      },
      {
        title: intl.get('hptl.notice.model.notice.publishedByUser').d('发布人'),
        width: 150,
        dataIndex: 'publishedByUser',
      },
      {
        title: intl.get('hptl.notice.model.notice.statusCode').d('公告状态'),
        width: 100,
        dataIndex: 'statusMeaning',
      },
      {
        title: intl.get('hptl.notice.model.notice.publishedDate').d('发布时间'),
        width: 200,
        dataIndex: 'publishedDate',
        render: dateTimeRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        render: (text, record) => {
          return (
            <span className="action-link">
              <Link to={`/spfm/notices/detail/${record.noticeId}`}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </Link>
              {record.statusCode === 'DELETED' ? (
                <a onClick={() => this.handleRevokeNotice(record)}>
                  {intl.get('hptl.common.button.revoke').d('撤销')}
                </a>
              ) : (
                <React.Fragment>
                  {publicLoading && record.noticeId === actionNoticeId ? (
                    <Icon type="loading" />
                  ) : (
                    <a onClick={() => this.handlePublicNotice(record)}>
                      {intl.get('hzero.common.button.release').d('发布')}
                    </a>
                  )}
                  <Popconfirm
                    title={intl.get('hzero.common.message.confirm.delete').d('是否删除此条记录')}
                    onConfirm={() => {
                      this.handleDeleteNotice(record);
                    }}
                  >
                    <a>{intl.get('hzero.common.button.delete').d('删除')}</a>
                  </Popconfirm>
                </React.Fragment>
              )}
            </span>
          );
        },
      },
    ];
    return (
      <React.Fragment>
        <Header title={intl.get('hptl.notice.view.message.title.list').d('公告管理')}>
          <Button icon="plus" type="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <div className="table-list-search">{this.renderFilterForm()}</div>
          <Table
            bordered
            rowKey="noticeId"
            loading={fetchNoticeLoading}
            dataSource={noticeList}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={pagination}
            onChange={this.handlePagination}
          />
        </Content>
      </React.Fragment>
    );
  }
}
