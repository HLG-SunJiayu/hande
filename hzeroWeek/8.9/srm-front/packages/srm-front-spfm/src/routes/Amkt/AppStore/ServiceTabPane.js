/**
 * ServiceTabPane - 应用商店服务pane
 * @date: 2019-07-09
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Pagination, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';

import ServiceCard from './ServiceCard';
import style from './index.less';

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};
@Form.create({ fieldNameProp: null })
export default class AppStore extends PureComponent {
  @Bind()
  handleFetch(page = 1, size = 10) {
    const { form, onHandleFetch } = this.props;
    const serviceName = form.getFieldValue('serviceName');
    onHandleFetch({
      serviceName,
      page: page - 1,
      size,
    });
  }

  render() {
    const {
      serviceLoading = false,
      form: { getFieldDecorator },
      serviceList = [],
      servicePagination = {},
      onAddCart,
    } = this.props;
    const pageProps = {
      ...servicePagination,
      onChange: this.handleFetch,
      onShowSizeChange: this.handleFetch,
    };
    return (
      <React.Fragment>
        <Form className="more-fields-search-form">
          <Row gutter={48}>
            <Col span={6}>
              <Form.Item {...formItemLayout} label="服务名称">
                {getFieldDecorator('serviceName')(<Input />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Button type="primary" onClick={() => this.handleFetch()}>
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Spin spinning={serviceLoading} wrapperClassName="ued-detail-wrapper">
          <Row>
            {serviceList.map(item => {
              return (
                <ServiceCard key={item.serviceId} onHandleAddCart={onAddCart} serviceData={item} />
              );
            })}
          </Row>
          {servicePagination.total > 0 && (
            <Row>
              <Col span={24}>
                <Pagination className={style['card-pagination']} {...pageProps} />
              </Col>
            </Row>
          )}
        </Spin>
      </React.Fragment>
    );
  }
}
