import React from 'react';
import { Card } from 'hzero-ui';

import { DETAIL_CARD_CLASSNAME } from 'utils/constants';

const PanelHeader = props => {
  const { title } = props;
  return (
    <Card
      key="zuul-rate-limit-header"
      bordered={false}
      className={DETAIL_CARD_CLASSNAME}
      title={title}
    >
      {props.children}
    </Card>
  );
};

export default PanelHeader;
