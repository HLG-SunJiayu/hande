/**
 * LeadershipReport -采购方领导报表
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
  name: 'x',
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
  name: 'y',
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
  loading: loading.effects['srmCards/queryLeadership'],
}))
@formatterCollections({ code: 'dashboard.srmCards' })
export default class LeadershipReport extends React.Component {
  state = {
    time: 'month',
    height: '',
  };

  componentDidMount() {
    this.handleSearch(this.state.time);
    window.onresize = this.handleHeight();
  }

  /**
   * 查询采购方领导报表
   */
  @Bind()
  handleSearch(time) {
    const { dispatch } = this.props;
    if (time === 'month') {
      dispatch({
        type: 'srmCards/queryLeadership',
        payload: {
          sectionDate: time,
          code: 'SRM_LeadershipReport',
        },
      });
    } else if (time === 'year') {
      dispatch({
        type: 'srmCards/queryLeadershipYear',
        payload: {
          sectionDate: time,
          code: 'SRM_LeadershipReport',
        },
      });
    }
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
    const height = document.getElementById('leadership').scrollHeight - 180;
    this.setState({ height });
  }

  render() {
    const {
      srmCards: { leadershipAmounts, leadershipReports = [], leadershipYear = [] } = {},
    } = this.props;
    const { time, height } = this.state;
    return (
      <div className={styles.report} id="leadership">
        <Col span={16} className={styles['report-title']}>
          采购总额
          <span className={styles['report-number']}>{leadershipAmounts}</span>
          万元(含税)
        </Col>
        <Col span={8} style={{ textAlign: 'right', marginTop: '10px' }}>
          <Radio.Group value={time} onChange={this.handleTimeChange}>
            <Radio.Button value="month">月度</Radio.Button>
            <Radio.Button value="year">年度</Radio.Button>
          </Radio.Group>
        </Col>
        {time === 'month' && leadershipAmounts !== 0 && !isEmpty(leadershipReports) && (
          <Col span={24} className={styles['report-y']}>
            采购额（万元）
          </Col>
        )}
        {time === 'year' && leadershipAmounts !== 0 && !isEmpty(leadershipYear) && (
          <Col span={24} className={styles['report-y']}>
            采购额（万元）
          </Col>
        )}
        {!isEmpty(leadershipReports) && leadershipAmounts !== 0 && time === 'month' && (
          <div style={{ marginTop: '135px' }}>
            <MiniArea
              tooltip={tooltip}
              height={height}
              data={leadershipReports}
              xAxis={x}
              yAxis={y}
            />
          </div>
        )}
        {!isEmpty(leadershipYear) && leadershipAmounts !== 0 && time === 'year' && (
          <div style={{ marginTop: '135px' }}>
            <MiniArea tooltip={tooltip} height={height} data={leadershipYear} xAxis={x} yAxis={y} />
          </div>
        )}
        {time === 'month' && (leadershipAmounts === 0 || isEmpty(leadershipReports)) && (
          <div style={{ textAlign: 'center' }}>
            <img src={chartImg} alt="" style={{ marginTop: '35px' }} />
          </div>
        )}
        {time === 'year' && (leadershipAmounts === 0 || isEmpty(leadershipYear)) && (
          <div style={{ textAlign: 'center' }}>
            <img src={chartImg} alt="" style={{ marginTop: '35px' }} />
          </div>
        )}
      </div>
    );
  }
}
