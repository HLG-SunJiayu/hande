import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Row, Input, Col, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

// import { Header } from 'components/Page';
import Switch from 'components/Switch';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';

import styles from './index.less';

const FormItem = Form.Item;
const modelPrompt = 'spfm.configServer.model.configServer';
const messagePrompt = 'spfm.configServer.view.message';
@Form.create({ fieldNameProp: null })
// @formatterCollections({ code: 'smdm.uomType' })
export default class OuterControl extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      includeAllFlag: 0,
      tenantId: getCurrentOrganizationId(),
    };
  }

  componentDidMount() {
    const { handleSearchHeader, linesSearch } = this.props;
    if (handleSearchHeader) {
      handleSearchHeader().then(res => {
        if (res) {
          this.setState({
            includeAllFlag: res.includeAllFlag,
          });
          linesSearch({}, { shieldId: res.shieldId });
        }
      });
    }
  }

  /**
   * 供应商改变时联动其他表单字段
   * @param {String} value
   * @param {Object} lovRecord
   * @param {Object} record
   */
  @Bind()
  handleLovOnChange(value, lovRecord, record) {
    const {
      $form: { setFieldsValue },
    } = record;
    setFieldsValue({
      [`supNum`]: lovRecord.supplierNum,
    });
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields(['companyName', 'companyNum']);
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch() {
    const { linesSearch } = this.props;
    linesSearch();
  }

  /**
   * 新建外部控制
   * @param {Number} shieldSupId
   */
  @Bind()
  handleCreate() {
    const { handleCreate } = this.props;
    if (handleCreate) {
      handleCreate();
    }
  }

  /**
   * 删除外部控制
   */
  @Bind()
  handleDelete() {
    const { handleDeleteOuter } = this.props;
    if (handleDeleteOuter) {
      handleDeleteOuter();
    }
  }

  /**
   * 保存
   */
  @Bind()
  handleSave() {
    const { includeAllFlag = 0 } = this.state;
    const {
      handleSaveLines,
      form: { validateFields },
    } = this.props;
    if (handleSaveLines) {
      validateFields(errs => {
        if (!errs) {
          handleSaveLines(includeAllFlag);
        }
      });
    }
  }

  /**
   * 全部Switch改变时的回调
   * @param {*} e
   */
  @Bind()
  handleChangeSwt(e) {
    const that = this;
    const { headerSave, linesSearch } = this.props;
    if (e) {
      Modal.confirm({
        title: intl.get(`hzero.common.message.confirm.title`).d('提示框?'),
        content: intl
          .get(`${messagePrompt}.title.content`)
          .d('加入全部则无需手工添加，所有供应商无法在订单确认、查询界面查看价格信息，是否确认？'),
        onOk() {
          if (headerSave) {
            headerSave(e).then(res => {
              if (res) {
                notification.success();
                that.setState({ includeAllFlag: e });
                linesSearch({}, { shieldId: res.shieldId });
              }
            });
          }
        },
        onCancel() {
          setTimeout(() => that.setState({ includeAllFlag: 0 }), 0);
        },
      });
    } else if (headerSave) {
      headerSave(e).then(res => {
        if (res) {
          notification.success();
          that.setState({ includeAllFlag: e });
          linesSearch({}, { shieldId: res.shieldId });
        }
      });
    }
  }

  render() {
    const {
      loading,
      savingOuter,
      deletingOuter,
      linesSearch,
      rowSelection,
      dataSource,
      outerControlListPagination: pagination,
      // orgRowSelection,
      // organizationList,
      form: { getFieldDecorator },
    } = this.props;
    const { includeAllFlag, tenantId } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.supName`).d('供应商名称'),
        dataIndex: 'companyName',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`supplierCompanyId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.supName`).d('供应商名称'),
                    }),
                  },
                ],
                initialValue: record.supName,
              })(
                <Lov
                  code="SODR.ERP_SUPPLIER"
                  queryParams={{ tenantId }}
                  onChange={(value, lovRecord) => this.handleLovOnChange(value, lovRecord, record)}
                  lovOptions={{ valueField: 'supplierCompanyId' }}
                />
              )}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.supNum`).d('供应商编码'),
        dataIndex: 'companyNum',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`supNum`, {
                initialValue: record.companyNum,
              })(<Input disabled />)}
            </FormItem>
          ) : (
            val
          ),
      },
    ];
    const editTableProps = {
      loading,
      columns,
      dataSource,
      rowSelection,
      pagination,
      bordered: true,
      rowKey: 'shieldSupId',
      onChange: linesSearch,
      scroll: { y: 300 },
    };
    return (
      <Fragment>
        <div className={styles['outer-header']}>
          {/* <Header> */}
          <Row>
            <Col>
              <Button
                style={{ float: 'right' }}
                // icon="plus"
                type="primary"
                onClick={this.handleCreate}
                disabled={includeAllFlag}
              >
                {intl.get('hzero.common.button.create').d('新建')}
              </Button>
              <Button
                style={{ marginRight: 8, float: 'right' }}
                // icon="save"
                onClick={this.handleSave}
                loading={savingOuter || loading}
              >
                {intl.get('hzero.common.button.save').d('保存')}
              </Button>
              <Button
                style={{ marginRight: 8, float: 'right' }}
                // icon="delete"
                onClick={this.handleDelete}
                loading={deletingOuter}
              >
                {intl.get('hzero.common.button.delete').d('删除')}
              </Button>
              <span style={{ marginRight: 8, marginTop: 2, float: 'right' }}>
                {intl
                  .get('spfm.configServer.view.shield.message.title.outer.allFlag')
                  .d('加入全部')}
                <Switch
                  style={{ marginLeft: '12px' }}
                  checked={!!includeAllFlag}
                  onChange={this.handleChangeSwt}
                />
              </span>
            </Col>
          </Row>

          {/* </Header> */}
        </div>
        <Row>
          <Col span={24} className={styles['input-table']}>
            <Form layout="inline">
              <FormItem label={intl.get(`${modelPrompt}.supName`).d('供应商名称')}>
                {getFieldDecorator('companyName')(<Input />)}
              </FormItem>
              <FormItem label={intl.get(`${modelPrompt}.supNum`).d('供应商编码')}>
                {getFieldDecorator('companyNum')(<Input inputChinese={false} />)}
              </FormItem>
              <FormItem>
                <Button data-code="reset" onClick={this.handleFormReset}>
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button
                  data-code="search"
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleSearch}
                  disabled={includeAllFlag}
                  style={{ marginLeft: 8 }}
                >
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </FormItem>
            </Form>
            {/* <Table
              loading={loading}
              rowKey="shieldSupId"
              bordered
              columns={columns}
              dataSource={dataSource}
              pagination={outerControlListPagination}
              onChange={linesSearch}
              rowSelection={rowSelection}
              scroll={{ y: 300 }}
            /> */}
            <EditTable {...editTableProps} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
