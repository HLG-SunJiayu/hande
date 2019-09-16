import React, { PureComponent } from 'react';
import { Button, Form, Input, Table } from 'hzero-ui';
import { connect } from 'dva';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { Content, Header } from 'components/Page';
import { enableRender } from 'utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import CompanyModal from './CompanyModal';

const FormItem = Form.Item;
@formatterCollections({ code: ['hpfm.company', 'entity.company'] })
@Form.create({ fieldNameProp: null })
@connect(({ loading, spfmCompany }) => ({
  spfmCompany,
  loading,
  saving: loading.effects['spfmCompany/fetchCompany'],
}))
export default class Company extends PureComponent {
  constructor(props) {
    super(props);
    this.queryPageSize = 10;
    this.state = {
      modalInitialData: {},
      modalVisible: false,
      tenantId: getCurrentOrganizationId(),
    };
  }

  componentDidMount() {
    this.fetchDataList();
  }

  @Bind()
  fetchDataList(params = {}) {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'spfmCompany/fetchCompany',
      payload: { tenantId: this.state.tenantId, ...form.getFieldsValue(), ...params },
    });
  }

  @Bind()
  handleSearchCompany() {
    const { form } = this.props;
    form.validateFields((err, fieldValue) => {
      if (isEmpty(err)) {
        this.fetchDataList({ ...fieldValue });
      }
    });
  }

  @Bind()
  handleResetSearch() {
    this.props.form.resetFields();
  }

  /**
   * 控制modal显示与隐藏
   * @param {boolean}} flag 是否显示modal
   */
  handleModalVisible(flag) {
    this.setState({ modalVisible: flag });
  }

  @Bind()
  showModal(record) {
    const { dispatch } = this.props;
    this.setState({
      modalInitialData: record,
      modalVisible: true,
    });
    dispatch({
      type: 'spfmCompany/saveReducers',
      payload: {
        companyFormKey: uuid(),
      },
    });
  }

  @Bind()
  handleCompanyAble(record, flag) {
    const { dispatch } = this.props;
    dispatch({
      type: `spfmCompany/${flag ? 'enableCompany' : 'disableCompany'}`,
      payload: {
        tenantId: this.state.tenantId,
        ...record,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchDataList();
      }
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <FormItem label={intl.get('hpfm.company.model.company.organizationCode').d('公司编码')}>
          {getFieldDecorator('companyNum', {
            initialValue: '',
          })(<Input trim typeCase="upper" inputChinese={false} style={{ width: 150 }} />)}
        </FormItem>
        <FormItem label={intl.get('hpfm.company.model.company.companyName').d('公司名称')}>
          {getFieldDecorator('companyName', {
            initialValue: '',
          })(<Input style={{ width: 150 }} />)}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" onClick={this.handleSearchCompany}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleResetSearch}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    const { spfmCompany = {}, loading, saving } = this.props;
    const { companyList = [], companyFormKey } = spfmCompany;
    const { modalInitialData, modalVisible } = this.state;
    const columns = [
      {
        title: intl.get('hpfm.company.model.company.organizationCode').d('公司编码'),
        width: 150,
        dataIndex: 'companyNum',
      },
      {
        title: intl.get('hpfm.company.model.company.companyName').d('公司名称'),
        dataIndex: 'companyName',
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                this.showModal(record);
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: intl.get('hpfm.company.model.company.shortName').d('公司简称'),
        width: 200,
        dataIndex: 'shortName',
      },
      {
        title: intl.get('hzero.common.status').d('启用'),
        width: 100,
        dataIndex: 'enabledFlag',
        render: enableRender,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'edit',
        width: 100,
        render: (text, record) =>
          record.enabledFlag !== null && (
            <span className="action-link">
              {record.enabledFlag === 1 ? (
                <a onClick={() => this.handleCompanyAble(record, false)}>
                  {intl.get('hzero.common.status.disable').d('禁用')}
                </a>
              ) : (
                <a onClick={() => this.handleCompanyAble(record, true)}>
                  {intl.get('hzero.common.status.enable').d('enable')}
                </a>
              )}
            </span>
          ),
      },
    ];
    return (
      <React.Fragment>
        <Header title={intl.get('entity.company.tag').d('公司')}>
          <Button icon="plus" type="primary" onClick={() => this.showModal({})}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content noCard>
          <div className="table-list-search">{this.renderForm()}</div>
          <Table
            bordered
            rowKey={record => `${record.sourceKey}${uuid()}`}
            loading={loading.effects['spfmCompany/fetchCompany']}
            dataSource={companyList || []}
            columns={columns}
            pagination={false}
          />
          <CompanyModal
            key={companyFormKey}
            width="1000px"
            bodyStyle={{ padding: 0 }}
            title={`${
              modalInitialData.sourceKey
                ? intl.get('hpfm.company.view.message.title.modal.edit').d('公司信息')
                : intl.get('hpfm.company.view.message.title.modal.create').d('新建公司')
            }`}
            onRef={ref => {
              this.CompanyModal = ref;
            }}
            sideBar
            loading={loading}
            modalInitialData={modalInitialData}
            confirmLoading={saving}
            modalVisible={modalVisible}
            hideModal={() => this.handleModalVisible(false)}
            initialList={this.fetchDataList}
            footer={null}
          />
        </Content>
      </React.Fragment>
    );
  }
}
