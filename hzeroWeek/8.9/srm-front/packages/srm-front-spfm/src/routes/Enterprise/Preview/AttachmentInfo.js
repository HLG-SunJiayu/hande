/**
 * AttachmentInfo - 企业认证预览-附件信息
 * @date: 2018-12-19
 * @author: wangjiacheng <jiacheng.wang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React from 'react';
import { Table } from 'hzero-ui';

import UploadModal from 'components/Upload/index';

import ItemWrapper from './ItemWrapper';

export default class AttachmentInfo extends React.PureComponent {
  render() {
    const { attachmentList = [] } = this.props;
    const columns = [
      {
        title: '附件类型',
        dataIndex: 'attachmentFileType',
        render: (text, record) => {
          return `${record.attachmentTypeMeaning}/${record.subAttachmentMeaning}`;
        },
      },
      {
        title: '附件描述',
        dataIndex: 'description',
      },
      {
        title: '文件到期日',
        width: 150,
        align: 'center',
        dataIndex: 'endDate',
      },
      {
        title: '最后更新时间',
        width: 150,
        align: 'center',
        dataIndex: 'uploadDate',
      },
      {
        title: '附件内容',
        width: 120,
        align: 'center',
        render: (_, record) => {
          return (
            <div>
              <UploadModal
                viewOnly
                attachmentUUID={record.attachmentUuid}
                filesNumber={record.attachmentCount}
              />
            </div>
          );
        },
      },
    ];
    return (
      <ItemWrapper title="附件信息">
        <Table
          bordered
          rowKey="companyAttachmentId"
          dataSource={attachmentList}
          columns={columns}
          pagination={false}
        />
      </ItemWrapper>
    );
  }
}
