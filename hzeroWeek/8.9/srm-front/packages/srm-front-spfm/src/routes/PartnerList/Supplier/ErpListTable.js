import React, { PureComponent, Fragment } from 'react';
import { Table, Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import ErpSupplierDetailDrawer from './ErpSupplierDetailDrawer';

const FormItem = Form.Item;

@formatterCollections({
  code: 'spfm.supplier',
})
export default class ErpListTable extends PureComponent {
  state = {
    modalData: {},
  };

  @Bind()
  showErpDetailDrawer(data) {
    // showDialog(ErpSupplierDetailDrawer, {
    //   title: 'ERP供应商信息',
    //   width: 800,
    // }, e);
    this.setState({
      modalVisible: true,
      modalData: data,
    });
  }

  @Bind()
  closeModal() {
    this.setState({
      modalVisible: false,
    });
  }

  // /**
  //  * 计算table列宽度
  //  * @param {Array} columns 列
  //  * @param {Number} fixWidth 固定列宽度
  //  */
  // @Bind()
  // scrollWidth(columns, fixWidth) {
  //   const total = columns.reduce(
  //     (prev, current) => prev + (current.className ? 0 : current.width ? current.width : 0),
  //     0
  //   );
  //   return total + fixWidth + 1;
  // }
  render() {
    const {
      rowKey,
      rowSelection,
      handleTableChange,
      dataSource,
      loading,
      pagination,
      form: { getFieldDecorator },
    } = this.props;

    const columns = [
      {
        title: intl.get('spfm.supplier.model.supplier.erp.supplierNum').d('供应商编码'),
        width: 100,
        dataIndex: 'supplierNum',
        render: (v, record) => <a onClick={() => this.showErpDetailDrawer(record)}>{v}</a>,
      },
      {
        title: intl.get('spfm.supplier.model.supplier.erp.supplierName').d('供应商名称'),
        width: 100,
        dataIndex: 'supplierName',
      },
      {
        title: intl.get('hzero.common.date.creation').d('创建日期'),
        width: 100,
        dataIndex: 'erpCreationDate',
      },
      {
        title: intl.get('spfm.common.model.common.externalSystemCode').d('来源系统'),
        width: 100,
        dataIndex: 'externalSystemCode',
      },
      {
        title: intl
          .get('spfm.supplier.model.supplier.erp.supplierUnifiedSocialCode')
          .d('统一社会信用代码'),
        width: 190,
        dataIndex: 'supplierUnifiedSocialCode',
        render: (value, record) =>
          !record.linkId ? (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(`${record[rowKey]}#supplierUnifiedSocialCode`, {
                rules: [
                  {
                    pattern: /^[A-Z0-9]{18}$/,
                    message: intl
                      .get('spfm.enterprise.model.legal.unifiedSocialCodeRule')
                      .d('由18位大写字母和数字混合组成'),
                  },
                ],
              })(<Input typeCase="upper" inputChinese={false} trimAll />)}
            </FormItem>
          ) : (
            value
          ),
      },
      {
        title: intl
          .get('spfm.supplier.model.supplier.erp.organizingInstitutionCode')
          .d('组织机构代码'),
        width: 150,
        dataIndex: 'supplierOrganizingInstitutionCode',
        render: (value, record) =>
          !record.linkId ? (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(`${record[rowKey]}#supplierOrganizingInstitutionCode`, {
                rules: [
                  { max: 30, message: intl.get('hzero.common.validation.max', { max: 30 }) },
                  {
                    pattern: /^[A-Z0-9]+$/,
                    message: intl
                      .get(`pfm.supplier.view.message.organizingInstitutionCode`)
                      .d('由大写字母及数字组成'),
                  },
                ],
              })(<Input typeCase="upper" inputChinese={false} trimAll />)}
            </FormItem>
          ) : (
            value
          ),
      },
      {
        title: intl.get('spfm.supplier.model.supplier.erp.supplierDunsCode').d('邓白氏编码'),
        width: 120,
        dataIndex: 'supplierDunsCode',
        render: (value, record) =>
          !record.linkId ? (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(`${record[rowKey]}#supplierDunsCode`)(<Input />)}
            </FormItem>
          ) : (
            value
          ),
      },
      {
        title: intl.get('spfm.supplier.model.supplier.erp.companyNum').d('平台供应商编码'),
        width: 150,
        dataIndex: 'companyNum',
      },
      {
        title: intl.get('spfm.supplier.model.supplier.erp.companyName').d('平台供应商名称'),
        width: 150,
        dataIndex: 'companyName',
      },
    ];

    return (
      <Fragment>
        <Table
          bordered
          rowSelection={rowSelection}
          loading={loading}
          rowKey={rowKey}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1160 }}
        />
        {this.state.modalVisible && (
          <ErpSupplierDetailDrawer
            visible={this.state.modalVisible}
            data={this.state.modalData}
            onOk={this.closeModal}
            onCancel={this.closeModal}
          />
        )}
      </Fragment>
    );
  }
}
