/*
 * ErpList - ERP采购审批列表
 * @date: 2019-01-23
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';
import { sum, isNumber } from 'lodash';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
// import { createPagination } from 'utils/utils';
import { dateTimeRender } from 'utils/renderer';
import UploadModal from 'components/Upload';
// import UploadModal from 'components/Upload/index';

const modelPrompt = 'sprm.purchaseRequisitionApproval.model.purchaseRequisitionApproval';

/**
 * LogisticInfoList - 送货单审批明细物流信息
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Function} onChange - 分页查询
 * @reactProps {Boolean} loading - 数据加载完成标记
 * @reactProps {Array} dataSource - Table数据源
 * @reactProps {object} pagination - 分页器
 * @reactProps {Number} pagination.current - 当前页码
 * @reactProps {Number} pagination.pageSize - 分页大小
 * @reactProps {Number} pagination.total - 数据总量
 * @return React.element
 */
export default class ErpList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  defaultTableRowKey = 'prLineId';

  @Bind()
  hideModal() {
    const { hideModal } = this.props;
    hideModal();
  }

  /**
   * handleAttachmentView - 查看附件
   * attachmentUuid - 附件的uuid
   * @memberof ErpList
   */
  @Bind()
  handleAttachmentView(attachmentUuid) {
    const { handleAttachmentModal } = this.props;
    if (handleAttachmentModal) {
      handleAttachmentModal(attachmentUuid);
    }
  }

  render() {
    const { dataSource, pagination, onSearchList, loading } = this.props;
    const columns = [
      {
        title: intl.get(`hzero.common.status`).d('状态'),
        dataIndex: 'prLineStatusMeaning',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.displayLineNum`).d('行号'),
        dataIndex: 'displayLineNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.itemCode`).d('物料编码'),
        dataIndex: 'itemCode',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.itemName`).d('物料名称'),
        dataIndex: 'itemName',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.categoryId`).d('自主品类'),
        dataIndex: 'categoryId',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.quantity`).d('数量'),
        dataIndex: 'quantity',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.uomId`).d('单位'),
        dataIndex: 'uomCode',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.taxIncludedUnitPrice`).d('建议单价'),
        dataIndex: 'taxIncludedUnitPrice',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.neededDate`).d('需求日期'),
        dataIndex: 'neededDate',
        align: 'center',
        width: 150,
        render: dateTimeRender,
      },
      {
        title: intl.get(`entity.company.tag`).d('公司'),
        dataIndex: 'companyName',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`entity.business.tag`).d('业务实体'),
        dataIndex: 'ouName',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`entity.organization.class.purchase`).d('采购组织'),
        dataIndex: 'purchaseOrgName',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.purchaseAgentName`).d('采购员'),
        dataIndex: 'purchaseAgentName',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.needDepartment`).d('需求部门'),
        dataIndex: 'needDepartment',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`entity.roles.creator`).d('创建人'),
        dataIndex: 'creatorName',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.prRequestedName`).d('申请人'),
        dataIndex: 'prRequestedName',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.erpStatus`).d('ERP状态'),
        dataIndex: 'erpStatus',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.executionStatusMeaning`).d('执行状态'),
        dataIndex: 'executionStatusMeaning',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.executedBy`).d('需求执行人'),
        dataIndex: 'executedBy',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.assignedDate`).d('分配日期'),
        dataIndex: 'assignedDate',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`entity.attachment.tag`).d('附件'),
        dataIndex: 'attachmentUuid',
        align: 'center',
        width: 150,
        render: (value, record) => {
          return (
            <UploadModal attachmentUUID={record.attachmentUuid} viewOnly bucketName="sodr-order" />
          );
        },
      },
      {
        title: intl.get(`hzero.common.button.operating`).d('操作记录'),
        dataIndex: 'operationRecord',
        align: 'center',
        width: 150,
        render: () => {
          return (
            <a onClick={() => this.hideModal()}>
              {intl.get(`hzero.common.button.operating`).d('操作记录')}
            </a>
          );
        },
      },
    ];
    const scrollX = sum(columns.map(n => (isNumber(n.width) ? n.width : 0))) + 300;
    const tableProps = {
      columns,
      dataSource,
      pagination,
      loading,
      bordered: true,
      onChange: onSearchList,
      rowKey: this.defaultTableRowKey,
      scroll: { x: scrollX >= 1200 ? scrollX : false },
    };
    return (
      <React.Fragment>
        <Table {...tableProps} />
      </React.Fragment>
    );
  }
}
