import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Spin } from 'hzero-ui';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import { Bind, debounce } from 'lodash-decorators';

import { Content, Header } from 'components/Page';
import Checkbox from 'components/Checkbox';

import intl from 'utils/intl';
import { getEditTableData } from 'utils/utils';
import notification from 'utils/notification';

import TemplateForm from './TemplateForm';
import CompanyLink from './CompanyLink';
import ContactCompany from './ContactCompany';
import style from './index.less';

const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
@connect(({ templatesConfig, loading }) => ({
  templatesConfig,
  fetchLoading: loading.effects['templatesConfig/fetchTemplateDetail'],
  savingLoading: loading.effects['templatesConfig/saveTemplateDetailNoTenantId'],
}))
export default class Template extends React.PureComponent {
  componentDidMount() {
    this.fetchTemplateDeatil();
  }

  /**
   * 查询门户模版配置详细
   */
  @Bind()
  fetchTemplateDeatil() {
    const {
      dispatch,
      match: {
        params: { configId },
      },
    } = this.props;
    dispatch({
      type: 'templatesConfig/fetchTemplateDetail',
      payload: { configId },
    });
  }

  /**
   * 新建行
   */
  @Bind()
  handleCreateRow(type) {
    const {
      dispatch,
      templatesConfig: { templateDetail },
      match: {
        params: { configId },
      },
    } = this.props;
    const { link = [], contact = [] } = templateDetail;
    const companyLinkRow = {
      configId,
      configItemId: uuid(),
      configCode: 'link',
      description: '',
      linkUrl: '',
      enabledFlag: 1,
      _status: 'create',
    };
    const contactCompanyRow = {
      configId,
      configItemId: uuid(),
      configCode: 'contact',
      description: '',
      enabledFlag: 1,
      _status: 'create',
    };
    const payload =
      type === 'companyLink'
        ? { templateDetail: { ...templateDetail, link: [companyLinkRow, ...link] } }
        : { templateDetail: { ...templateDetail, contact: [contactCompanyRow, ...contact] } };
    dispatch({
      type: 'templatesConfig/updateState',
      payload,
    });
  }

  /**
   * 编辑行
   */
  @Bind()
  handleEditRow(record, type) {
    const {
      dispatch,
      templatesConfig: { templateDetail },
    } = this.props;
    const { link = [], contact = [] } = templateDetail;
    const newCompanyLink = link.map(item =>
      record.configItemId === item.configItemId ? { ...item, _status: 'update' } : item
    );
    const newContactCompany = contact.map(item =>
      record.configItemId === item.configItemId ? { ...item, _status: 'update' } : item
    );
    const payload =
      type === 'companyLink'
        ? { templateDetail: { ...templateDetail, link: newCompanyLink } }
        : { templateDetail: { ...templateDetail, contact: newContactCompany } };
    dispatch({
      type: 'templatesConfig/updateState',
      payload,
    });
  }

  /**
   * 取消编辑行
   */
  @Bind()
  handleCancelRow(record, type) {
    const {
      dispatch,
      templatesConfig: { templateDetail },
    } = this.props;
    const { link = [], contact = [] } = templateDetail;
    const newCompanyLink = link.map(item => {
      if (item.configItemId === record.configItemId) {
        const { _status, ...other } = item;
        return other;
      } else {
        return item;
      }
    });
    const newContactCompany = contact.map(item => {
      if (item.configItemId === record.configItemId) {
        const { _status, ...other } = item;
        return other;
      } else {
        return item;
      }
    });
    const payload =
      type === 'companyLink'
        ? { templateDetail: { ...templateDetail, link: newCompanyLink } }
        : { templateDetail: { ...templateDetail, contact: newContactCompany } };
    dispatch({
      type: 'templatesConfig/updateState',
      payload,
    });
  }

  /**
   * 删除新建行
   */
  @Bind()
  handleDeleteRow(record, type) {
    const {
      dispatch,
      templatesConfig: { templateDetail },
    } = this.props;
    const { link = [], contact = [] } = templateDetail;
    const newCompanyLink = link.filter(item => item.configItemId !== record.configItemId);
    const newContactCompany = contact.filter(item => item.configItemId !== record.configItemId);
    const payload =
      type === 'companyLink'
        ? { templateDetail: { ...templateDetail, link: newCompanyLink } }
        : { templateDetail: { ...templateDetail, contact: newContactCompany } };
    dispatch({
      type: 'templatesConfig/updateState',
      payload,
    });
  }

  @Bind()
  handleDeleteSeleteRows(seleteRows) {
    const { dispatch } = this.props;
    dispatch({
      type: 'templatesConfig/deleteSeleteRows',
      payload: seleteRows,
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchTemplateDeatil();
      }
    });
  }

  /**
   * 不带租户id保存
   */
  @Bind()
  @debounce(500)
  handleSaveNoTenantId() {
    const {
      dispatch,
      form,
      templatesConfig: { templateDetail = {} },
      match: {
        params: { configId },
      },
    } = this.props;
    const {
      logo = [],
      carousel = [],
      introduction = [],
      link = [],
      contact = [],
      footer = [{}],
    } = templateDetail;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (!isEmpty(logo) && typeof logo[0].configItemId === 'string') {
          delete logo[0].configItemId;
        }
        if (!isEmpty(carousel) && typeof carousel[0].configItemId === 'string') {
          delete carousel[0].configItemId;
        }
        const filterLink = link.filter(n => ['create', 'update'].includes(n._status));
        const filterContact = contact.filter(n => ['create', 'update'].includes(n._status));
        const newLink = getEditTableData(filterLink).map(item => {
          const { ...newItem } = item;
          if (newItem._status === 'create') {
            delete newItem.configItemId;
          }
          return newItem;
        });
        const newContact = getEditTableData(filterContact).map(item => {
          const { ...newItem } = item;
          if (newItem._status === 'create') {
            delete newItem.configItemId;
          }
          return newItem;
        });
        if (
          (filterLink.length === 0 || !isEmpty(newLink)) &&
          (filterContact.length === 0 || !isEmpty(newContact))
        ) {
          dispatch({
            type: 'templatesConfig/saveTemplateDetailNoTenantId',
            payload: {
              logo,
              carousel,
              link: newLink,
              contact: newContact,
              introduction: fieldsValue.description
                ? [
                    {
                      ...introduction[0],
                      configId,
                      configCode: 'introduction',
                      description: fieldsValue.description,
                      enabledFlag: 1,
                    },
                  ]
                : [],
              footer: [
                {
                  ...footer[0],
                  configId,
                  configCode: 'footer',
                  enabledFlag: fieldsValue.enabledFlag,
                },
              ],
            },
          }).then(res => {
            if (res) {
              notification.success();
              this.fetchTemplateDeatil();
            }
          });
        }
      }
    });
  }

  render() {
    const {
      fetchLoading = false,
      savingLoading = false,
      match: {
        params: { configId },
      },
      templatesConfig: { templateDetail = {} },
      form: { getFieldDecorator },
    } = this.props;
    const {
      logo = [
        {
          configItemId: uuid(),
          configCode: 'logo',
          description: '',
          imageUrl: '',
          orderSeq: 0,
          isCreate: true,
        },
      ],
      carousel = [
        {
          configId,
          configItemId: uuid(),
          configCode: 'carousel',
          imageUrl: '',
          description: '',
          content: '',
          orderSeq: 0,
          isCreate: true,
        },
      ],
      introduction = [],
      link = [],
      contact = [],
      footer = [],
    } = templateDetail;
    const tableProps = {
      onCreateRow: this.handleCreateRow,
      onEditRow: this.handleEditRow,
      onCancelRow: this.handleCancelRow,
      onDeleteRow: this.handleDeleteRow,
      onDeleteSelectRows: this.handleDeleteSeleteRows,
    };
    return (
      <React.Fragment>
        <Header
          title={`${intl.get('hzero.common.button.edit').d('编辑')}`}
          backPath="/spfm/portal-assign/list"
        >
          <Button
            type="primary"
            icon="save"
            loading={savingLoading}
            onClick={this.handleSaveNoTenantId}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={fetchLoading || savingLoading}>
            <Row>
              <Col span={12}>
                <div>
                  <p className={style['template-title']}>
                    {intl
                      .get('spfm.common.view.message.title.logo1')
                      .d('上传Logo，图片格式为JPEG/PNG，像素1200*320')}
                  </p>
                  <Row>
                    <Col key={logo[0].configId}>
                      <TemplateForm
                        initData={logo[0]}
                        type="logo"
                        configId={configId}
                        key={logo[0].configItemId}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <React.Fragment>
                    <p className={style['template-title']} style={{ fontSize: '14px!important' }}>
                      {intl
                        .get('hptl.common.view.message.title.banner1')
                        .d('门户图片，登录栏背景图片设置，图片格式为JPEG/PNG')}
                    </p>
                    <Row>
                      <Col key={carousel[0].configItemId}>
                        <TemplateForm
                          initData={carousel[0]}
                          type="carousel"
                          configId={configId}
                          key={carousel[0].configItemId}
                        />
                      </Col>
                    </Row>
                  </React.Fragment>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <p className={style['template-title']}>企业介绍</p>
                <Row className={style['template-content']}>
                  <Col>
                    <FormItem>
                      {getFieldDecorator('description', {
                        initialValue: introduction[0] && introduction[0].description,
                      })(<TextArea className={style['template-comdes']} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginBottom: '15px' }}>
              <Col span={24}>
                <p className={style['template-title']}>
                  企业链接(仅限4个企业链接，链接地址示例格式: https://www.baidu.com/)
                </p>
                <Row className={style['template-content']}>
                  <Col>
                    <CompanyLink {...tableProps} companyLinkList={link} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginBottom: '15px' }}>
              <Col span={24}>
                <p className={style['template-title']}>
                  联系企业(仅限4条记录，联系方式示例格式，客服: 400-900-9298)
                </p>
                <Row className={style['template-content']}>
                  <Col>
                    <ContactCompany {...tableProps} contactCompanyList={contact} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <FormItem>
                {getFieldDecorator('enabledFlag', {
                  initialValue: footer[0] && footer[0].enabledFlag,
                })(
                  <Checkbox className={style['template-footer']}>展示 甄云信息 底层信息栏</Checkbox>
                )}
              </FormItem>
            </Row>
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}
