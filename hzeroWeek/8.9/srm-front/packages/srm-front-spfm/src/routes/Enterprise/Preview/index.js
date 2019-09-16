/**
 * preview - 企业认证预览
 * @date: 2018-12-18
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { getAttachmentUrl, getCurrentOrganizationId } from 'utils/utils';

import LegalInfo from './LegalInfo';
import BusinessInfo from './BusinessInfo';
import ContactPersonInfo from './ContactPersonInfo';
import AddressInfo from './AddressInfo';
import BankInfo from './BankInfo';
import InvoiceInfo from './InvoiceInfo';
import FinanceInfo from './FinanceInfo';
import AttachmentInfo from './AttachmentInfo';
import styles from './index.less';

const DEFAULT_BUCKET_NAME = 'spfm-comp';

@connect(({ loading, approvalPreview }) => ({
  approvalPreview,
  fetchLoading: loading.effects['approvalPreview/fetchPreviewDetail'],
}))
export default class ApprovalDetail extends React.PureComponent {
  componentDidMount() {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'approvalPreview/fetchPreviewDetail',
      payload: companyId,
    });
  }

  /**
   * 下载公司logo或者营业执照图片url
   * @param {string} url 公司logo或者营业执照图片url
   */
  @Bind()
  showUrlImgFun(url) {
    const imgUrl = getAttachmentUrl(url, DEFAULT_BUCKET_NAME, getCurrentOrganizationId());
    window.open(imgUrl);
  }

  render() {
    const {
      fetchLoading = false,
      approvalPreview: {
        previewDetail: {
          basic = {},
          business = {},
          contactList = [],
          addressList = [],
          bankAccountList = [],
          invoice = {},
          financeList = [],
          attachmentList = [],
        },
      },
    } = this.props;
    return (
      <Spin spinning={fetchLoading} wrapperClassName={styles['approval-detail']}>
        <LegalInfo
          basic={basic}
          showLegaInfoUrlImg={url => {
            this.showUrlImgFun(url);
          }}
        />
        <BusinessInfo
          business={business}
          showBusinessUrlImg={url => {
            this.showUrlImgFun(url);
          }}
        />
        <ContactPersonInfo contactList={contactList} />
        <AddressInfo addressList={addressList} />
        <BankInfo bankAccountList={bankAccountList} />
        <InvoiceInfo invoice={invoice} />
        <FinanceInfo financeList={financeList} />
        <AttachmentInfo attachmentList={attachmentList} />
      </Spin>
    );
  }
}
