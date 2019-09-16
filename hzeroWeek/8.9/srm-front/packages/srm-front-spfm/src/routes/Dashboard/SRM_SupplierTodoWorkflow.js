/**
 * SupplierTodoWorkflow -供应商待办工作流
 * @date: 2019-02-26
 * @author YKK <kaikai.yang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Row, Col, Tabs } from 'hzero-ui';
import InfiniteScroll from 'react-infinite-scroller';
import formatterCollections from 'utils/intl/formatterCollections';
import { Link } from 'dva/router';
import styles from './Cards.less';
import temporarily from '../../assets/dashboard/temporarily-no-data.svg';

@connect(({ srmCards, loading }) => ({
  srmCards,
  loading: loading.effects['srmCards/querySupplierTodo'],
}))
@formatterCollections({ code: 'dashboard.srmCards' })
export default class SupplierTodoWorkflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaserTodo: [],
      isPurchaserTodo: true,
    };
  }

  componentDidMount() {
    this.handleTodoSearch();
    this.handleWorkflowSearch();
  }

  /**
   * 查询工作流
   */
  @Bind()
  handleWorkflowSearch() {
    const { dispatch } = this.props;
    const payload = { page: 0, size: 999999 };
    dispatch({
      type: 'srmCards/queryWorkflow',
      payload,
    });
  }

  /**
   * 查询待办事项
   */
  @Bind()
  handleTodoSearch(currentPage = 0) {
    const { dispatch } = this.props;
    dispatch({
      type: 'srmCards/querySupplierTodo',
      payload: {
        type: 0,
        code: 'SRM_SupplierTodoWorkflow',
        page: currentPage,
        size: 10,
      },
    }).then((res = {}) => {
      if (!res.empty) {
        const { purchaserTodo = [] } = this.state;
        const data = purchaserTodo.concat(res.content);
        this.setState({
          purchaserTodo: data,
          isPurchaserTodo: true,
        });
      } else {
        this.setState({
          isPurchaserTodo: false,
        });
      }
    });
  }

  render() {
    const { srmCards: { workflowList = [] } = {} } = this.props;
    const { purchaserTodo, isPurchaserTodo } = this.state;
    return (
      <Tabs
        size="large"
        tabBarGutter={0}
        style={{ marginBottom: 0 }}
        className={styles.height}
        defaultActiveKey="todo"
      >
        <Tabs.TabPane tab="待办事项" key="todo" className={styles.todo}>
          {!isEmpty(purchaserTodo) && (
            <div className={styles['todo-overflow']}>
              <InfiniteScroll
                hasMore={isPurchaserTodo}
                pageStart={0}
                initialLoad={false}
                useWindow={false}
                loadMore={this.handleTodoSearch}
              >
                {purchaserTodo.map((item, index) => {
                  return (
                    <Row
                      key={`todoList-item-${item.docStatisticsId}`}
                      type="flex"
                      justify="space-around"
                      align="middle"
                      className={styles['todo-row']}
                    >
                      <Col
                        className={
                          index % 4 === 0
                            ? styles['todo-background-0']
                            : index % 4 === 1
                            ? styles['todo-background-1']
                            : index % 4 === 2
                            ? styles['todo-background-2']
                            : styles['todo-background-3']
                        }
                      >
                        {item.docSubmitName && item.docSubmitName.length > 3 && (
                          <span
                            className={
                              index % 4 === 0
                                ? styles['todo-name-0']
                                : index % 4 === 1
                                ? styles['todo-name-1']
                                : index % 4 === 2
                                ? styles['todo-name-2']
                                : styles['todo-name-3']
                            }
                          >
                            {item.docSubmitName.substr(item.docSubmitName.length - 2, 3)}
                          </span>
                        )}
                        {item.docSubmitName && item.docSubmitName.length <= 3 && (
                          <span
                            className={
                              index % 4 === 0
                                ? styles['todo-name-0']
                                : index % 4 === 1
                                ? styles['todo-name-1']
                                : index % 4 === 2
                                ? styles['todo-name-2']
                                : styles['todo-name-3']
                            }
                          >
                            {item.docSubmitName}
                          </span>
                        )}
                      </Col>
                      <Col span={20}>
                        <Row style={{ marginBottom: '4px' }}>
                          <Col span={16}>
                            {(item.route === '/sslm/investigation-approval/list' ||
                              item.route === '/sslm/investigation-write/list') && (
                              <Link to={`${item.route}`} className={styles['todo-list']}>
                                {item.docRemark}
                              </Link>
                            )}
                            {item.route !== '/sslm/investigation-approval/list' &&
                              item.route !== '/sslm/investigation-write/list' && (
                                <Link
                                  to={`${item.route}/${item.docId}`}
                                  className={styles['todo-list']}
                                >
                                  {item.docRemark}
                                </Link>
                              )}
                          </Col>
                          <Col span={8} className={styles['todo-time']}>
                            {item.docSubmitDate}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  );
                })}
              </InfiniteScroll>
            </div>
          )}
          {isEmpty(purchaserTodo) && (
            <div style={{ textAlign: 'center' }}>
              <img src={temporarily} alt="" style={{ marginTop: '35px' }} />
            </div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="工作流"
          key="workflow"
          style={{ marginBottom: 0 }}
          className={styles.workflow}
        >
          {!isEmpty(workflowList) && (
            <div className={styles['workflow-overflow']}>
              {workflowList.map((item, index) => {
                return (
                  <Row
                    key={`todoList-item-${item.id}`}
                    type="flex"
                    justify="space-around"
                    align="middle"
                    className={styles['workflow-row']}
                  >
                    <Col
                      className={
                        index % 4 === 0
                          ? styles['workflow-background-0']
                          : index % 4 === 1
                          ? styles['workflow-background-1']
                          : index % 4 === 2
                          ? styles['workflow-background-2']
                          : styles['workflow-background-3']
                      }
                    >
                      <span
                        className={
                          index % 4 === 0
                            ? styles['workflow-name-0']
                            : index % 4 === 1
                            ? styles['workflow-name-1']
                            : index % 4 === 2
                            ? styles['workflow-name-2']
                            : styles['workflow-name-3']
                        }
                      >
                        {item.assigneeName}
                      </span>
                    </Col>
                    <Col span={20}>
                      <Row style={{ marginBottom: '4px' }}>
                        <Col span={16} className={styles['workflow-title']}>
                          {item.name}
                        </Col>
                        <Col span={8} className={styles['workflow-time']}>
                          {item.createTime}
                        </Col>
                      </Row>
                      <Link
                        to={`/hwfl/workflow/task/detail/${item.id}`}
                        className={styles['workflow-list']}
                      >
                        {item.description}
                      </Link>
                    </Col>
                  </Row>
                );
              })}
            </div>
          )}
          {isEmpty(workflowList) && (
            <div style={{ textAlign: 'center' }}>
              <img src={temporarily} alt="" style={{ marginTop: '35px' }} />
            </div>
          )}
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
