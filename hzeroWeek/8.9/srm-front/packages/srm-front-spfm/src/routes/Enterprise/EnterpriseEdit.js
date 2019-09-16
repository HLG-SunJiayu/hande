import React from 'react';
import { Form, Card, Modal, Button } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import LegalForm from './Edit/LegalForm';
import BusinessForm from './Edit/BussinessForm';
import FinanceList from './Edit/FinanceList';
import AddressInfoList from './Edit/AddressInfoList';
import BankInfoList from './Edit/BankInfoList';
import ContactPersonList from './Edit/ContactPersonList';
import AttachmentList from './Edit/AttachmentList';
import './EnterpriseEdit.less';

const { confirm } = Modal;
@formatterCollections({ code: 'spfm.approval' })
@Form.create({ fieldNameProp: null })
@connect(modals => ({
  modal: modals.enterpriseEdit,
}))
export default class EnterpriseEdit extends React.Component {
  componentDidMount() {
    const { dispatch, companyId } = this.props;
    if (companyId) {
      dispatch({
        type: 'enterpriseEdit/queryCompanyInfo',
        payload: companyId,
      });
      this.legalForm.fetchProvinceCity();
      dispatch({
        type: 'enterpriseEdit/queryCompanyBusiness',
        payload: companyId,
      }).then(res => {
        if (res.industryList) {
          this.businessForm.fetchCategories(res.industryList.map(item => item.industryId));
        }
      });
    }
  }

  legalForm;

  businessForm;

  @Bind()
  onLegalRef(form) {
    this.legalForm = form;
  }

  @Bind()
  onBusinessRef(form) {
    this.businessForm = form;
  }

  @Bind()
  handleCompanySubmit() {
    const { dispatch, companyId } = this.props;
    confirm({
      title: intl.get('spfm.approval.view.message.title.submitTitle').d('是否要提交审核'),
      content: intl
        .get('spfm.approval.view.message.title.submitContent')
        .d('您修改的信息将于审核通过后生效'),
      onOk() {
        dispatch({
          type: 'attachment/submitApproval',
          payload: { companyId },
        }).then(() => {
          dispatch({
            type: 'enterpriseEdit/queryCompanyInfo',
            payload: companyId,
          });
        });
      },
    });
  }

  buildCardTitle(title, description) {
    return (
      <React.Fragment>
        <span style={{ fontSize: '14px' }}>{title}</span>
        <span style={{ fontSize: '12px', marginLeft: '24px', color: '#999' }}>{description}</span>
      </React.Fragment>
    );
  }

  @Bind()
  renderProcessStatus(status) {
    switch (status) {
      case 'COMPLETE':
        return intl.get('spfm.approval.view.message.processStatus.complete').d('已认证');
      case 'SUBMIT':
        return intl.get('spfm.approval.view.message.processStatus.submit').d('认证中');
      case 'REJECT':
        return intl.get('spfm.approval.view.message.processStatus.reject').d('认证失败');
      default:
        return intl.get('spfm.approval.view.message.processStatus.default').d('未认证');
    }
  }

  render() {
    const {
      modal: { enterprise = {} },
      companyId,
      callback,
    } = this.props;
    const { basic = {}, business = {} } = enterprise;
    return (
      <Content
        style={{
          display: 'flex',
          padding: '0px',
          backgroundColor: '#fff',
        }}
      >
        <div
          className="enterprise-content"
          style={{ flex: 'auto', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          <Content>
            <Card
              className="enterprise-info-group"
              title={this.buildCardTitle(
                intl.get('spfm.approval.view.message.legal.title').d('登记信息'),
                intl
                  .get('spfm.approval.view.message.legal.description')
                  .d(
                    '非常重要：请参照贵司营业执照如实填写，否则会影响您的资质审核，无法进行后续正常业务操作。'
                  )
              )}
              extra={
                (basic.processStatus === 'PENDING' ||
                  basic.processStatus === 'UPDATE' ||
                  basic.processStatus === 'COMPLETE' ||
                  basic.processStatus === 'REJECT') && (
                  <Button type="primary" icon="check" onClick={() => this.handleCompanySubmit()}>
                    {intl.get('hzero.common.button.submit').d('提交')}
                  </Button>
                )
              }
            >
              <div className="enterprise-status-info">
                {this.renderProcessStatus(basic.processStatus)}
              </div>
              <LegalForm onRef={this.onLegalRef} data={basic} callback={callback} />
            </Card>
            <Card
              className="enterprise-info-group"
              title={this.buildCardTitle(
                intl.get('spfm.approval.view.message.business.title').d('业务信息'),
                intl
                  .get('spfm.approval.view.message.business.description')
                  .d(
                    '非常重要：业务信息将会出现在您的主页上，丰富的内容有助于提高您的资质，便于更多企业快速阅览，促进交易。'
                  )
              )}
            >
              <BusinessForm
                onRef={this.onBusinessRef}
                data={business}
                companyId={companyId}
                callback={callback}
              />
            </Card>
            <Card
              className="enterprise-info-group"
              title={this.buildCardTitle(
                intl.get('spfm.approval.view.message.contactPerson.title').d('联系人'),
                intl
                  .get('spfm.approval.view.message.contactPerson.description')
                  .d(
                    '非常重要：真实的联系人信息便于合作企业快速联系您，至少需要维护一条默认联系人。'
                  )
              )}
            >
              <ContactPersonList companyId={companyId} callback={callback} />
            </Card>

            <Card
              className="enterprise-info-group"
              title={this.buildCardTitle(
                intl.get('spfm.approval.view.message.address.title').d('地址信息'),
                intl
                  .get('spfm.approval.view.message.address.description')
                  .d('您的企业可能在多地有工厂/分公司，建议维护完整信息，展示贵司规模。')
              )}
            >
              <AddressInfoList companyId={companyId} callback={callback} />
            </Card>

            <Card
              className="enterprise-info-group"
              title={this.buildCardTitle(
                intl.get('spfm.approval.view.message.bank.title').d('银行信息'),
                intl
                  .get('spfm.approval.view.message.bank.description')
                  .d(
                    '维护账户信息，后续您向合作企业提供付款账号时，可快速复制。至少需要维护一个银行账户。'
                  )
              )}
            >
              <BankInfoList companyId={companyId} callback={callback} />
            </Card>

            <Card
              className="enterprise-info-group"
              title={this.buildCardTitle(
                intl.get('spfm.approval.view.message.finance.title').d('财务信息'),
                intl
                  .get('spfm.approval.view.message.finance.description')
                  .d('提供贵司的近三年财务报告，有利于展示您的经营与发展状况。')
              )}
            >
              <FinanceList companyId={companyId} callback={callback} />
            </Card>

            <Card
              className="enterprise-info-group"
              title={this.buildCardTitle(
                intl.get('spfm.approval.view.message.attachment.title').d('附件信息'),
                intl
                  .get('spfm.approval.view.message.attachment.description')
                  .d('非常重要：您可在此处上传各类经营/质量及各类许可证信息，便于贵司的资质认可。')
              )}
            >
              <AttachmentList companyId={companyId} callback={callback} />
            </Card>
          </Content>
        </div>
      </Content>
    );
  }
}
