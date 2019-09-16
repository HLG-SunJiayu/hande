/**
 * PurchasingReport -采购报表
 * @date: 2019-02-21
 * @author YKK <kaikai.yang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Radio, Col } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import MiniArea from './MiniArea';
import styles from './Cards.less';
import chartImg from '../../assets/dashboard/no-chart.svg';

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: `采购额：${y}(万元)`,
  }),
];

const x = {
  name: 'amountStatisticsDate',
  line: {
    lineWidth: 3,
  },
  label: {
    textStyle: {
      textAlign: 'center', // 文本对齐方向，可取值为： left center right
      fill: '#8C8C8C', // 文本的颜色
      fontSize: '12', // 文本大小
    },
  },
  tickLine: {
    lineWidth: 1, // 刻度线宽
    stroke: '#ccc', // 刻度线的颜色
    length: 5, // 刻度线的长度, **原来的属性为 line**,可以通过将值设置为负数来改变其在轴上的方向
  },
};

const y = {
  name: 'taxIncludedAmount',
  line: {
    lineWidth: 3,
  },
  grid: {
    lineStyle: {
      stroke: '#d9d9d9',
      lineWidth: 1,
      lineDash: [2, 2],
    },
  },
  label: {
    textStyle: {
      textAlign: 'center', // 文本对齐方向，可取值为： left center right
      fill: '#8C8C8C', // 文本的颜色
      fontSize: '12', // 文本大小
    },
  },
};

@connect(({ srmCards, loading }) => ({
  srmCards,
  loading: loading.effects['srmCards/queryPurchasingReport'],
}))
@formatterCollections({ code: 'dashboard.srmCards' })
export default class PurchasingReport extends React.Component {
  state = {
    time: 'seven',
    height: '',
  };

  componentDidMount() {
    this.handleSearch(this.state.time);
    window.onresize = this.handleHeight();
  }

  /**
   * 查询采购方报表
   */
  @Bind()
  handleSearch(time) {
    const { dispatch } = this.props;
    dispatch({
      type: 'srmCards/queryPurchasingReport',
      payload: {
        sectionDate: time,
        code: 'SRM_PurchasingReport',
      },
    });
  }

  @Bind()
  handleTimeChange(e) {
    this.setState({ time: e.target.value });
    this.handleSearch(e.target.value);
  }

  /**
   * 获取页面高度，使报表高度自适应
   */
  @Bind()
  handleHeight() {
    const height = document.getElementById('purchasing').scrollHeight - 180;
    this.setState({ height });
  }

  render() {
    const { srmCards: { purchaseAmount, purchasingReport = [] } = {} } = this.props;
    const { time, height } = this.state;
    return (
      <div className={styles.report} id="purchasing">
        <Col span={16} className={styles['report-title']}>
          采购总额
          <span className={styles['report-number']}>{purchaseAmount}</span>
          万元(含税)
        </Col>
        <Col span={8} style={{ textAlign: 'right', marginTop: '10px' }}>
          <Radio.Group value={time} onChange={this.handleTimeChange}>
            <Radio.Button value="seven">7天</Radio.Button>
            <Radio.Button value="thirty">30天</Radio.Button>
            <Radio.Button value="month">本月</Radio.Button>
          </Radio.Group>
        </Col>
        {!isEmpty(purchasingReport) && purchaseAmount !== 0 && (
          <Col span={24} className={styles['report-y']}>
            采购额（万元）
          </Col>
        )}
        {!isEmpty(purchasingReport) && purchaseAmount !== 0 && (
          <div style={{ marginTop: '135px' }}>
            <MiniArea
              tooltip={tooltip}
              height={height}
              data={purchasingReport}
              xAxis={x}
              yAxis={y}
            />
          </div>
        )}
        {(isEmpty(purchasingReport) || purchaseAmount === 0) && (
          <div style={{ textAlign: 'center' }}>
            <img src={chartImg} alt="" style={{ marginTop: '35px' }} />
          </div>
        )}
      </div>
    );
  }
}
