/*
 * Menu - 导航组件
 * @date: 2018/09/07 16:40:33
 * @author: HB <bin.huang02@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import Anchor from '../components/Anchor';

const { Link } = Anchor;
export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: props.menuList || [],
    };
  }

  @Bind()
  handleClickAnchor(e) {
    e.preventDefault();
  }

  render() {
    const { menuList } = this.state;
    const { getContainer } = this.props;
    return (
      <Anchor getContainer={getContainer} onClick={this.handleClickAnchor}>
        {menuList.map(item => (
          <Link key={item.key} href={item.href} title={item.title} />
        ))}
      </Anchor>
    );
  }
}
