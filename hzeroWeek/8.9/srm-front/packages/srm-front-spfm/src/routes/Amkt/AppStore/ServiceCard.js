/**
 * ServiceCard - 服务卡片
 * @date: 2019-07-09
 * @author: zjx <jingxi.zhang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Col, Button, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import style from './index.less';

export default class ServiceCard extends PureComponent {
  constructor(props) {
    super(props);
    const { serviceData = {} } = this.props;
    const { servicePartnerDTOList = [] } = serviceData;
    this.state = {
      servicePartnerList: servicePartnerDTOList,
      servicePartner: {},
    };
  }

  @Bind()
  handlePartner(partnerList) {
    const { serviceData = {} } = this.props;
    if (isEmpty(partnerList)) {
      return (
        <Button className={style['service-list-button']} disabled>
          敬请期待
        </Button>
      );
    }
    return partnerList.map(item => {
      return (
        <Button
          disabled={!!serviceData.flag}
          className={classNames(
            style['service-list-button'],
            { [style['service-opened-button']]: !!item.flag },
            { [style['service-button-activated']]: item.activated }
          )}
          onClick={() => this.handleSelectPartner(item)}
        >
          {item.partnerName}
        </Button>
      );
    });
  }

  @Bind()
  handleSelectPartner(params) {
    const { servicePartnerList = [] } = this.state;
    const newServicePartnerList = servicePartnerList.map(n => {
      const m = {
        ...n,
      };
      if (m.partnerId === params.partnerId) {
        m.activated = true;
      } else {
        delete m.activated;
      }
      return m;
    });
    this.setState({
      servicePartner: params,
      servicePartnerList: newServicePartnerList,
    });
  }

  render() {
    const { servicePartner = {}, servicePartnerList = [] } = this.state;
    const { serviceData = {}, onHandleAddCart } = this.props;
    return (
      <React.Fragment>
        <Col span={6}>
          <div className={style['service-card-box']}>
            <div
              className={classNames(style['service-card-des'], {
                [style['service-card-buy']]: !!serviceData.flag,
              })}
            >
              {!!serviceData.flag && (
                <Icon type="check" className={style['service-card-buy-check']} />
              )}
              <p className={style['service-title']}>{serviceData.serviceName}</p>
              <p className={style['service-des']}>{serviceData.serviceDesc}</p>
            </div>
            <div className={style['service-list']}>
              <p className={style['service-providers']}>选择服务商</p>
              <div>{this.handlePartner(servicePartnerList)}</div>
            </div>
            <div className={style['button-box']}>
              {serviceData.flag ? (
                <Button disabled className={style['buyed-button']}>
                  已开通
                </Button>
              ) : (
                <Button
                  disabled={isEmpty(servicePartner)}
                  className={style['add-button']}
                  onClick={() => onHandleAddCart(servicePartner)}
                >
                  加入购物车
                </Button>
              )}
            </div>
          </div>
        </Col>
      </React.Fragment>
    );
  }
}
