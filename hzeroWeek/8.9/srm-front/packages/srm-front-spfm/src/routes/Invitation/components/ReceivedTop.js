/**
 * 我收到的邀约上面的部分
 * @date: 2018-8-4
 * @author: YB <bo.yang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Button, Modal, Input, Tag, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import picture from '@/assets/illustrate-cooperation.png';
import styles from '../index.less';

const promptCode = 'spfm.disposeInvite';
const { TextArea } = Input;
/**
 * 我收到的邀约上面的部分
 * @extends {Component} - React.Component
 * @reactProps {String} companyName公司名
 * @reactProps {Boolean} isSupplier true-我是客户
 * @reactProps {Date} invitingTime邀请时间
 * @reactProps {String} inviteRemark邀请备注
 * @reactProps {String} status send 我发出 received 我收到
 * @return React.element
 */
export default class ReceivedTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rejectModalVisible: false,
      remark: '',
    };
  }

  /**
   * 同意邀约
   */
  @Bind()
  handleAgree() {
    this.props.onAgree();
  }

  /**
   * 打开公司信息侧滑
   */
  @Bind()
  showModal() {
    this.props.onShowDrawer();
  }

  /**
   * 打开拒绝modal
   */
  @Bind()
  showRefuseModal() {
    this.props.onShowRefuseModal();
  }

  /**
   * 打开同意合作modal
   */
  @Bind()
  showSuppleModal() {
    this.props.onShowSuppleModal();
  }

  // 显示拒绝弹窗
  @Bind()
  displayRejectModal() {
    this.setState({
      rejectModalVisible: true,
    });
  }

  // 隐藏拒绝弹窗
  @Bind()
  hideRejectModal() {
    this.setState({ rejectModalVisible: false });
  }

  // 同意
  @Bind()
  handleApprovalAgree() {
    this.props.onHandleApprovalAgree();
  }

  // 改变拒绝说明
  @Bind()
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 审批拒绝
  @Bind()
  handleApprovalReject() {
    this.hideRejectModal();
    this.props.onHandleApprovalReject(this.state.remark);
  }

  render() {
    const {
      isSupplier,
      invitingInfo = {},
      loading,
      agree,
      reject,
      refuseLoading,
      approvalLoading,
    } = this.props;
    return (
      <div className={styles['agree-top']}>
        <div className={styles['agree-word']}>
          {/* 判断是供应商还是客户 */}
          {isSupplier ? (
            <p style={{ fontSize: 16 }}>
              <span style={{ paddingRight: 5 }}>{invitingInfo.companyName}</span>
              {intl
                .get(`${promptCode}.view.message.agreeTopTitle.supplie`)
                .d('向您发出了合作邀约，邀请您成为它的【客户】')}
            </p>
          ) : (
            <p style={{ fontSize: 16 }}>
              <span style={{ paddingRight: 5 }} onClick={this.showModal} className={styles.company}>
                {invitingInfo.companyName}
              </span>
              {intl
                .get(`${promptCode}.view.message.agreeTopTitle.purchaser`)
                .d('向您发出了合作邀约，邀请您成为它的【供应商】')}
            </p>
          )}
          <p style={{ color: '#999', marginBottom: 20 }}>
            <span style={{ paddingRight: 15 }}>
              {intl.get(`${promptCode}.model.purchaserCooperation.processDate`).d('邀请时间')}：
              {invitingInfo.creationDate}
            </span>
            {intl.get(`${promptCode}.model.purchaserCooperation.inviteRemark`).d('邀请备注')}：
            {invitingInfo.inviteRemark ||
              intl.get(`${promptCode}.view.message.noRemark`).d('暂无备注')}
          </p>
          {isSupplier ? (
            invitingInfo.processStatus === 'APPROVED' ||
            invitingInfo.processStatus === 'REJECT' ||
            invitingInfo.processStatus === 'INVESTIGATE' ? (
              <React.Fragment>
                {invitingInfo.processStatus === 'APPROVED' && (
                  <Tag color="green">
                    <Icon type="check-circle" theme="filled" className={styles.tag} />
                    {intl.get(`${promptCode}.view.message.tag.approved`).d('该邀约已同意')}
                  </Tag>
                )}
                {invitingInfo.processStatus === 'REJECT' && (
                  <Tag color="red">
                    <Icon type="close-circle" theme="filled" className={styles.tag} />
                    {intl.get(`${promptCode}.view.message.tag.reject`).d('该邀约已拒绝')}
                  </Tag>
                )}
                {invitingInfo.processStatus === 'INVESTIGATE' && (
                  <Tag color="blue">
                    <Icon type="minus-circle" theme="filled" className={styles.tag} />
                    {intl.get(`${promptCode}.view.message.tag.processing`).d('正在处理')}
                  </Tag>
                )}
              </React.Fragment>
            ) : (
              // invitingInfo.processStatus === 'INVESTIGATE' && (
              //   <span className={styles['agree-info']}>
              //     {intl.get(`${promptCode}.view.message.tag.investigate`).d('调查表填写中')}
              //   </span>)
              <div>
                {invitingInfo.processStatus === 'SUBMIT' ? (
                  <React.Fragment>
                    <Button
                      type="primary"
                      onClick={() => this.handleApprovalAgree()}
                      loading={agree}
                    >
                      {intl.get(`${promptCode}.view.message.sendQuestionnaire`).d('审批')}
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => this.displayRejectModal()}
                      loading={reject}
                    >
                      {intl.get(`${promptCode}.view.option.refuse`).d('拒绝')}
                    </Button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button type="primary" onClick={this.showSuppleModal}>
                      {intl.get(`${promptCode}.view.message.agree`).d('同意合作')}
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      loading={refuseLoading || loading}
                      onClick={this.showRefuseModal}
                    >
                      {intl.get(`${promptCode}.view.option.refuse`).d('拒绝')}
                    </Button>
                  </React.Fragment>
                )}
              </div>
            )
          ) : invitingInfo.processStatus === 'APPROVED' ||
            invitingInfo.processStatus === 'REJECT' ||
            invitingInfo.processStatus === 'SUBMIT' ||
            invitingInfo.processStatus === 'INVESTIGATE' ? (
              <React.Fragment>
                {invitingInfo.processStatus === 'APPROVED' && (
                <Tag color="green">
                  <Icon type="check-circle" theme="filled" className={styles.tag} />
                  {intl.get(`${promptCode}.view.message.tag.approved`).d('该邀约已同意')}
                </Tag>
              )}
                {invitingInfo.processStatus === 'REJECT' && (
                <Tag color="red">
                  <Icon type="close-circle" theme="filled" className={styles.tag} />
                  {intl.get(`${promptCode}.view.message.tag.reject`).d('该邀约已拒绝')}
                </Tag>
              )}
                {invitingInfo.processStatus === 'SUBMIT' && (
                <Tag color="blue">
                  <Icon type="minus-circle" theme="filled" className={styles.tag} />
                  {intl.get(`${promptCode}.view.message.tag.processing`).d('正在处理')}
                </Tag>
              )}
              </React.Fragment>
          ) : (
            <div>
              <Button
                type="primary"
                loading={approvalLoading || loading}
                onClick={this.handleAgree}
              >
                {intl.get(`${promptCode}.view.option.agree`).d('同意合作')}
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                loading={refuseLoading || loading}
                onClick={this.showRefuseModal}
              >
                {intl.get(`${promptCode}.view.option.refuse`).d('拒绝')}
              </Button>
            </div>
          )}
        </div>
        <div>
          <img src={picture} alt="" />
        </div>
        <Modal
          title={intl.get(`${promptCode}.view.modal.reject.title`).d('拒绝原因')}
          visible={this.state.rejectModalVisible}
          onCancel={this.hideRejectModal}
          onOk={this.handleApprovalReject}
          okText={intl.get(`${promptCode}.view.button.reject`).d('拒绝')}
        >
          <TextArea
            autosize={{ minRows: 6, maxRows: 12 }}
            value={this.state.remark}
            onChange={this.handleChangeRemark}
          />
        </Modal>
      </div>
    );
  }
}
