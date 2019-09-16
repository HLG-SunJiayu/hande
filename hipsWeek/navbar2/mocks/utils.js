/**
 * createMock 创建mock方法
 * @param Mock Mock对象
 * @param module 当前module
 */
const createMock = (Mock, module) => {
    if (module.length > 0) {
        module.map((item) => {
            Mock.mock(item.rurl, item.rtype.toLowerCase(), item.template || item.callback)
        })
    }
}

export {
    createMock
}