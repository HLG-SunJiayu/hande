/*
 * NonErpPurchaseRequisition - 非ERP采购申请
 * @date: 2019-01-24
 * @author: guochaochao <chaochao.guo@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { isNumber, sum } from 'lodash';
import { Bind } from 'lodash-decorators';

import { dateRender } from 'utils/renderer';
import intl from 'utils/intl';

import UploadModal from 'components/Upload';

const commonPrompt = 'sprm.purchaseRequisitionApproval.model.purchaseRequisitionApproval';

export default class NonErpList extends PureComponent {
  @Bind()
  getColumns() {
    const { prSourcePlatform } = this.props;
    const columns = {
      base: [
        {
          title: intl.get(`${commonPrompt}.displayLineNum`).d('行号'),
          dataIndex: 'displayLineNum',
          fixed: 'left',
          align: 'left',
          width: 80,
        },
        {
          title: intl.get(`${commonPrompt}.invOrganizationName`).d('库存组织'),
          dataIndex: 'invOrganizationName',
          fixed: 'left',
          align: 'left',
          width: 120,
        },
      ],
      mall: [
        {
          title: intl.get(`${commonPrompt}.productNum`).d('商品编码'),
          dataIndex: 'productNum',
          fixed: 'left',
          align: 'left',
          width: 120,
        },
        {
          title: intl.get(`${commonPrompt}.productName`).d('商品名称'),
          dataIndex: 'productName',
          align: 'left',
          width: 214,
        },
        {
          title: intl.get(`${commonPrompt}.catalogName`).d('商品目录'),
          dataIndex: 'catalogName',
          align: 'left',
          width: 120,
        },
      ],
      other: [
        {
          title: intl.get(`${commonPrompt}.itemCode`).d('物料编码'),
          dataIndex: 'itemCode',
          align: 'left',
          width: 120,
        },
        {
          title: intl.get(`${commonPrompt}.itemName`).d('物料名称'),
          dataIndex: 'itemName',
          align: 'left',
          width: 214,
        },
        {
          title: intl.get(`${commonPrompt}.materialClassification`).d('物料分类'),
          dataIndex: 'categoryName',
          align: 'left',
          width: 120,
        },
        {
          title: intl.get(`${commonPrompt}.uomName`).d('单位'),
          dataIndex: 'uomName',
          align: 'left',
          width: 120,
          render: (val, record) => <span>{`${record.uomCode}/${record.uomName}`}</span>,
        },
        {
          title: intl.get(`${commonPrompt}.quantity`).d('数量'),
          dataIndex: 'quantity',
          align: 'left',
          width: 120,
        },
        {
          title: intl.get(`${commonPrompt}.taxCode`).d('税种'),
          dataIndex: 'taxCode',
          align: 'left',
          width: 120,
        },
        {
          title: intl.get(`${commonPrompt}.taxRate`).d('税率'),
          dataIndex: 'taxRate',
          align: 'left',
          width: 120,
        },
        {
          title: intl.get(`${commonPrompt}.currencyCode`).d('币种'),
          dataIndex: 'currencyCode',
          align: 'left',
          width: 120,
        },
        {
          title: intl.get(`${commonPrompt}.taxIncludedUnitPrice`).d('预估单价（含税）'),
          dataIndex: 'taxIncludedUnitPrice',
          align: 'right',
          width: 140,
        },
        {
          title: intl.get(`${commonPrompt}.taxIncludedLineAmount`).d('行金额'),
          dataIndex: 'taxIncludedLineAmount',
          align: 'right',
          width: 120,
        },
      ],
      lineFreight: [
        {
          title: intl.get(`${commonPrompt}.lineFreight`).d('行运费'),
          dataIndex: 'lineFreight',
          align: 'right',
          width: 120,
        },
      ],
      another: [
        {
          title: intl.get(`${commonPrompt}.neededDate`).d('需求日期'),
          dataIndex: 'neededDate',
          align: 'left',
          width: 150,
          render: dateRender,
        },
        {
          title: intl.get(`${commonPrompt}.supplierName`).d('供应商'),
          dataIndex: 'supplierName',
          width: 150,
          align: 'left',
          render: (val, record) => <span>{record.supplierName || record.supplierCompanyName}</span>,
        },
        {
          title: intl.get(`${commonPrompt}.remark`).d('备注'),
          dataIndex: 'remark',
          align: 'left',
        },
        {
          title: intl.get(`${commonPrompt}.attachmentUuid`).d('附件'),
          dataIndex: 'attachmentUuid;',
          align: 'left',
          width: 120,
          render: (_, { attachmentUuid }) => {
            const uploadProps = {
              icon: false,
              bucketName: 'sprm-pr',
              btnText: intl.get(`${commonPrompt}.attachment`).d('附件查看'),
              attachmentUUID: attachmentUuid,
              viewOnly: true,
              showFilesNumber: false,
            };
            return <UploadModal {...uploadProps} />;
          },
        },
      ],
    };
    if (prSourcePlatform === 'CATALOGUE') {
      return columns.base.concat(columns.mall, columns.other, columns.another);
    }
    if (prSourcePlatform === 'E-COMMERCE') {
      return columns.base.concat(columns.mall, columns.other, columns.lineFreight, columns.another);
    }
    if (prSourcePlatform === 'SRM') {
      return columns.base.concat(columns.other, columns.another);
    }
    return columns.base.concat(columns.other, columns.lineFreight, columns.another);
  }

  render() {
    const columns = this.getColumns();
    const { loading, onSearch, pagination = {}, dataSource = [] } = this.props;
    const scrollX = sum(columns.map(n => (isNumber(n.width) ? n.width : 0))) + 300;
    const tableProps = {
      loading,
      columns,
      dataSource,
      pagination,
      bordered: true,
      rowKey: 'prHeaderId',
      onChange: page => onSearch(page),
      scroll: { x: scrollX },
    };
    return <Table {...tableProps} />;
  }
}
