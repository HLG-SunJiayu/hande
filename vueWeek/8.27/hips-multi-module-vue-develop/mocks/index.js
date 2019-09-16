import Mock from 'mockjs'

import { createMock } from './utils'

import User from './modules/user'
import Shuju from './modules/shuju'
Mock.setup({
    timeout: 2000,
})

createMock(Mock, User)
createMock(Mock, Shuju)
export default Mock