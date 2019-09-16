/**
 * index.js - 我的合作伙伴 - 我的客户
 * @date: 2018-10-18
 * @author: geekrainy <chao.zheng02@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2018, Hand
 */

import React from 'react';
import { connect } from 'dva';
import { Form, Input, DatePicker, Row, Col } from 'hzero-ui';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import SearchPage from 'components/SearchPage';
import { getCurrentOrganizationId } from 'utils/utils';
import { dateRender } from 'utils/renderer';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import classNames from 'classnames';
import styles from '../index.less';

const FormItem = Form.Item;

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects['customer/queryCustomer'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: ['spfm.customer', 'entity.company'],
})
export default class Customer extends SearchPage {
  @Bind()
  pageConfig() {
    const { tenantId } = this.props;
    return {
      modelName: 'customer',
      searchDispatch: 'customer/queryCustomer',
      paramsFilter: values => {
        const { startDate } = values;
        return {
          tenantId,
          startDate: startDate ? moment(startDate).format(DEFAULT_DATE_FORMAT) : '',
        };
      },
    };
  }

  renderForm(form) {
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      style: { width: '100%' },
    };
    return (
      <React.Fragment>
        <Row
          gutter={18}
          className={classNames({
            [styles['customer-row-wrap']]: true,
          })}
        >
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label={intl.get('spfm.customer.model.customer.customCompanyNum').d('平台客户编码')}
            >
              {getFieldDecorator('customCompanyNum')(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label={intl.get('spfm.customer.model.customer.customCompanyName').d('平台客户名称')}
            >
              {getFieldDecorator('customCompanyName')(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label={intl.get('spfm.customer.model.customer.startDate').d('合作开始日期')}
            >
              {getFieldDecorator('startDate')(
                <DatePicker placeholder={null} style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  contentProps() {
    return {
      style: {
        padding: 0,
        marginRight: 0,
      },
    };
  }

  tableProps() {
    const { loading } = this.props;
    const columns = [
      {
        title: intl.get('spfm.customer.model.customer.customCompanyNum').d('企业编码'),
        width: 120,
        dataIndex: 'customCompanyNum',
      },
      {
        title: intl.get('spfm.customer.model.customer.customCompanyName').d('企业名称'),
        dataIndex: 'customCompanyName',
      },
      {
        title: intl
          .get('spfm.customer.model.customer.customUnifiedSocialCode')
          .d('统一社会信用代码'),
        width: 170,
        dataIndex: 'customUnifiedSocialCode',
      },
      {
        title: intl.get('spfm.customer.model.customer.startDate').d('合作开始日期'),
        width: 120,
        dataIndex: 'startDate',
        render: dateRender,
      },
      {
        title: intl.get('entity.company.tag').d('公司'),
        dataIndex: 'supplierCompanyName',
      },
    ];
    return {
      columns,
      loading,
      rowKey: 'partnerId',
      rowSelection: null,
    };
  }
}
