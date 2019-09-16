import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { isFunction, map } from 'lodash';
import uuid from 'uuid/v4';
import { withRouter } from 'react-router-dom';
import { Avatar, Button, Card, Icon, Modal, Tooltip, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import ContactPersonForm from './ContactPersonForm';
import styles from './ContactPersonList.less';

/**
 * @extends StatelessComponent<{title: String, value: React.Element}>
 */
function Tuple({ title, value }) {
  return (
    <div className={styles.tuple}>
      <span className={`${styles['text-overflow']} ${styles['tuple-title']}`}>{title}:</span>
      <Tooltip title={value} placement="right">
        <span className={`${styles['text-overflow']} ${styles['tuple-value']}`}>{value}</span>
      </Tooltip>
    </div>
  );
}

const { Option } = Select;

const NAME_SPACE = 'enterpriseContactPerson';

@connect(models => ({
  contactPerson: models[NAME_SPACE],
  createContactPersonsLoading:
    models.loading.effects['enterpriseContactPerson/createContactPersons'],
  updateContactPersonsLoading:
    models.loading.effects['enterpriseContactPerson/updateContactPersons'],
}))
@formatterCollections({ code: 'spfm.contactPerson' })
@withRouter
export default class ContactPersonList extends PureComponent {
  state = {
    contactList: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};
    const {
      contactPerson: { enumMap: { ID } = {} },
    } = nextProps;
    if (ID !== prevState.ID) {
      nextState.ID = ID;
      nextState.$ID_OPTIONS = map(ID, idType => (
        <Option value={idType.value} key={idType.value}>
          {idType.meaning}
        </Option>
      ));
    }
    return nextState;
  }

  componentDidMount() {
    const { onRef } = this.props;
    if (isFunction(onRef)) {
      onRef(this);
    }
    this.init();
  }

  loadContactPersonList() {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: `${NAME_SPACE}/queryContactPerson`,
      payload: companyId,
    }).then(contactList => {
      this.setState({
        contactList,
      });
    });
  }

  /**
   * 加载 证件的值集 和 公司所有的联系人
   */
  init() {
    const { dispatch } = this.props;
    dispatch({
      type: `${NAME_SPACE}/fetchBatchEnums`,
    });
    this.loadContactPersonList();
  }

  @Bind()
  saveAndNext() {
    const { callback, companyId, dispatch } = this.props;
    dispatch({
      type: `${NAME_SPACE}/verification`,
      payload: {
        companyId,
      },
    }).then(res => {
      if (res) {
        callback();
      }
    });
  }

  /**
   * 获取编辑组件 获取数据的接口
   */
  @Bind()
  getDataHook(getData) {
    this.getData = getData;
  }

  @Bind()
  openCreateForm() {
    const { dispatch } = this.props;
    dispatch({
      type: `${NAME_SPACE}/openCreateForm`,
      payload: {
        key: uuid(),
      },
    });
  }

  @Bind()
  openEditForm(contact) {
    const { dispatch } = this.props;
    dispatch({
      type: `${NAME_SPACE}/openEditForm`,
      payload: {
        key: uuid(),
        initialValue: contact,
      },
    });
  }

  @Bind()
  closeEditModal() {
    const { dispatch } = this.props;
    dispatch({
      type: `${NAME_SPACE}/closeEditModal`,
      payload: {},
    });
  }

  @Bind()
  handleEditFormSave() {
    const {
      contactPerson: {
        editFormProps: { isCreate },
      },
      companyId,
    } = this.props;
    if (isFunction(this.getData)) {
      return new Promise((resolve, reject) => {
        this.getData().then(
          contactPerson => {
            const { dispatch } = this.props;
            const saveData = Object.assign(contactPerson, { companyId });
            if (isCreate) {
              dispatch({
                type: `${NAME_SPACE}/createContactPersons`,
                payload: { companyContact: saveData, companyId },
              }).then(res => {
                if (res.success) {
                  notification.success({ message: res.message });
                  resolve();
                  this.loadContactPersonList();
                  this.closeEditModal();
                } else {
                  notification.error({ message: res.message });
                  reject();
                }
              });
            } else {
              dispatch({
                type: `${NAME_SPACE}/updateContactPersons`,
                payload: {
                  companyContact: saveData,
                  companyId,
                  companyContactId: saveData.companyContactId,
                },
              }).then(res => {
                if (res.success) {
                  notification.success({ message: res.message });
                  resolve();
                  this.loadContactPersonList();
                  this.closeEditModal();
                } else {
                  notification.error({ message: res.message });
                  reject();
                }
              });
            }
          },
          () => {
            reject();
          }
        );
      });
    } else {
      // 在编辑页面还没加载时,点击保存
      return Promise.reject();
    }
  }

  @Bind()
  handleEditFormCancel() {
    const {
      dispatch,
      contactPerson: { editModalProps },
    } = this.props;

    dispatch({
      type: `${NAME_SPACE}/closeEditModal`,
      payload: {
        title: editModalProps.title,
      },
    });
  }

  @Bind()
  handlePrevious() {
    const { previousCallback } = this.props;
    if (previousCallback) {
      previousCallback();
    }
  }

  render() {
    const { contactList = [], $ID_OPTIONS = [] } = this.state;
    const {
      createContactPersonsLoading,
      updateContactPersonsLoading,
      contactPerson: { editModalProps, editFormProps },
      buttonText,
      showButton,
      previousCallback,
      backBtnText = intl.get('hzero.common.button.previous').d('上一步'),
      contactPerson: { enumMap: { idd, gender } = {} },
    } = this.props;

    return (
      <React.Fragment>
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            flexWrap: 'wrap',
            marginRight: '-12px',
          }}
        >
          {contactList.map(n => {
            return (
              <Card
                key={n.companyContactId}
                hoverable
                className={styles['contact-card']}
                onClick={() => {
                  this.openEditForm(n);
                }}
                cover={
                  <div className={styles['avatar-wrapper']}>
                    <Avatar icon="user" className={styles['avatar-icon']} />
                    <div className={styles['user-info-wrap']}>
                      <div className={styles.name}>
                        <div style={{ fontSize: '18px' }}>{n.name}</div>
                        <div className={styles.default}>
                          {n.defaultFlag === 1
                            ? intl.get('spfm.contactPerson.model.contactPerson.default').d('默认')
                            : ''}
                        </div>
                      </div>
                      <div className="mail">{n.mail}</div>
                    </div>
                  </div>
                }
              >
                <Card.Meta
                  description={
                    <React.Fragment>
                      <Tuple
                        title={intl
                          .get('spfm.contactPerson.model.contactPerson.mobilephone')
                          .d('手机号码')}
                        value={n.mobilephone}
                      />
                      {n.idTypeMeaning && n.idNum && (
                        <Tuple title={n.idTypeMeaning} value={n.idNum} />
                      )}
                      <Tuple
                        title={intl
                          .get('spfm.contactPerson.model.contactPerson.telephone')
                          .d('固定电话')}
                        value={n.telephone}
                      />
                      <Tuple
                        title={intl
                          .get('spfm.contactPerson.model.contactPerson.department')
                          .d('部门')}
                        value={n.department}
                      />
                      <Tuple
                        title={intl
                          .get('spfm.contactPerson.model.contactPerson.position')
                          .d('职位')}
                        value={n.position}
                      />
                      <Tuple
                        title={intl.get('hzero.common.remark').d('备注')}
                        value={n.description}
                      />
                      <Tuple
                        title={intl.get('spfm.contactPerson.model.contactPerson.enabled').d('启用')}
                        value={
                          n.enabledFlag === 1
                            ? intl.get('hzero.common.status.yes').d('是')
                            : intl.get('hzero.common.status.no').d('否')
                        }
                      />
                    </React.Fragment>
                  }
                />
              </Card>
            );
          })}
          <Card
            bordered={false}
            style={{
              width: 300,
              textAlign: 'center',
              padding: 0,
              cursor: 'pointer',
              marginRight: '12px',
              marginTop: '12px',
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Button
              type="dashed"
              style={{ backgroundColor: '#fff', width: '100%', height: 303 }}
              onClick={this.openCreateForm}
            >
              <Icon type="plus" /> {intl.get('spfm.contactPerson.view.option.add').d('新增联系人')}
            </Button>
          </Card>
        </div>
        <div style={{ clear: 'both', marginTop: 40 }}>
          {previousCallback && (
            <Button type="primary" onClick={this.handlePrevious} style={{ marginRight: 16 }}>
              {backBtnText}
            </Button>
          )}
          {showButton && (
            <Button type="primary" style={{ marginBottom: '24px' }} onClick={this.saveAndNext}>
              {buttonText}
            </Button>
          )}
        </div>
        <Modal
          {...editModalProps}
          width={800}
          confirmLoading={createContactPersonsLoading || updateContactPersonsLoading}
          onOk={this.handleEditFormSave}
          onCancel={this.handleEditFormCancel}
        >
          <ContactPersonForm
            {...editFormProps}
            idd={idd}
            gender={gender}
            $ID_OPTIONS={$ID_OPTIONS}
            getDataHook={this.getDataHook}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
