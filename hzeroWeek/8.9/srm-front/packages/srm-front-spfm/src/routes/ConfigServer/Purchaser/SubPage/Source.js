/*
 * Source - 配置中心-采购方-寻源
 * @date: 2018/09/12 14:51:47
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Row, Col, Button, Radio } from 'hzero-ui';
import Checkbox from 'components/Checkbox';
import { Bind } from 'lodash-decorators';
// import intl from 'utils/intl';

const RadioGroup = Radio.Group;
/**
 * 配置中心-采购方-订单
 * @extends {Component} - React.Component
 * @reactProps {Object} companyInfo - 数据源
 * @reactProps {Object} loading - 数据加载是否完成
 * @return React.element    onChange={onChange}
 */
export default class Source extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderPrintFlag: false,
    };
  }

  @Bind()
  handleOrderPrint() {
    const { orderPrintFlag } = this.state;
    this.setState({
      orderPrintFlag: !orderPrintFlag,
    });
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { orderPrintFlag } = this.state;
    return (
      <Row>
        <Col span={3}>寻源：</Col>
        <Col span={21}>
          {getFieldDecorator('purchaser#source-result-import')(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={24}>寻源结果导入</Col>
                <Col span={6}>
                  <Checkbox value="A">询价结果生成信息记录</Checkbox>
                </Col>
                <Col span={18}>
                  <Checkbox
                    value="B"
                    disabled={
                      !(
                        getFieldValue('purchaser#source-result-import') &&
                        getFieldValue('purchaser#source-result-import').indexOf('A') >= 0
                      )
                    }
                  >
                    自动导入
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="C">中标结果生成信息记录</Checkbox>
                </Col>
                <Col span={18}>
                  <Checkbox
                    value="D"
                    disabled={
                      !(
                        getFieldValue('purchaser#source-result-import') &&
                        getFieldValue('purchaser#source-result-import').indexOf('C') >= 0
                      )
                    }
                  >
                    自动导入
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="E">回写采购申请</Checkbox>
                </Col>
                <Col span={18}>
                  <Checkbox
                    value="F"
                    disabled={
                      !(
                        getFieldValue('purchaser#source-result-import') &&
                        getFieldValue('purchaser#source-result-import').indexOf('E') >= 0
                      )
                    }
                  >
                    自动导入
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )}
          {getFieldDecorator('purchaser#order-relation-sup-auth')(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={24}>关联供应商权限</Col>
                <Col span={24}>
                  <Checkbox value="deliver-create">送货单创建</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="account-statement-create">对账单创建</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="D">发票创建</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="E">送货单查询</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="E">对账单查询</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="E">发票查询</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )}
          <Row>
            <Col span={24}>采购订单发布规则</Col>
            <Col span={24}>
              <Button size="small" onClick={() => console.log(1)}>
                规则明细定义
              </Button>
            </Col>
            <Col span={24}>采购订单类型定义</Col>
            <Col span={24}>
              <Button size="small" onClick={() => console.log(1)}>
                类型明细定义
              </Button>
            </Col>
          </Row>
          {getFieldDecorator('purchaser#order-detail-define')(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={24}>
                  <Checkbox value="order-print" onClick={this.handleOrderPrint}>
                    启用采购订单打印
                  </Checkbox>
                </Col>
                {orderPrintFlag &&
                  getFieldDecorator('order-print-radio')(
                    <Col span={24}>
                      <RadioGroup>
                        <Row>
                          <Col span={24}>
                            <Radio value="use-group-template">使用本集团模板</Radio>
                          </Col>
                          <Col span={24}>
                            <Radio value="use-default-template">使用默认模板</Radio>
                          </Col>
                        </Row>
                      </RadioGroup>
                    </Col>
                  )}
                <Col span={24}>
                  <Checkbox value="account-statement-create">引用物料价格信息记录</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="D">自动更新物料价格信息记录</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="E">承诺交货日期是否必输</Checkbox>
                </Col>
                <Col span={24}>
                  <Checkbox value="E">规格型号置于物料名称后</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )}
        </Col>
      </Row>
    );
  }
}
