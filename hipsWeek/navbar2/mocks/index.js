import Mock from 'mockjs'

import { createMock } from './utils'

import User from './modules/user'

Mock.setup({
    timeout: 2000
})

createMock(Mock, User)

export default Mock