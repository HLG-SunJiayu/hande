import Mock from "mockjs";
const Random = Mock.Random;

const Shuju = [
  {
    rurl: "/api/shuju",
    rtype: "get",
    template: {
      success: true,
      message: "",
      data: [
        {
          boolean: Random.boolean(), // 返回一个随机的布尔值。
          date: Random.date("yyyy-MM-dd"), // 生成一个随机日期,可加参数定义日期格式
          time: Random.time("HH:mm"), //获取一个随机时间
          datetime: Random.datetime(), // 返回一个随机的日期和时间字符串。
          cname: Random.cname(), //随机生成一个常见的中文姓名。
          province: Random.province(), //随机生成一个（中国）省（或直辖市、自治区、特别行政区）
          id: Random.id(), //随机生成一个 18 位身份证。
          integer: Random.integer(1, 100),
        },
        {
          boolean: Random.boolean(), // 返回一个随机的布尔值。
          date: Random.date("yyyy-MM-dd"), // 生成一个随机日期,可加参数定义日期格式
          time: Random.time("HH:mm"), //获取一个随机时间
          datetime: Random.datetime(), // 返回一个随机的日期和时间字符串。
          cname: Random.cname(), //随机生成一个常见的中文姓名。
          province: Random.province(), //随机生成一个（中国）省（或直辖市、自治区、特别行政区）
          id: Random.id(), //随机生成一个 18 位身份证。
          integer: Random.integer(1, 100),
        },
      ],
    },
  },
];

export default Shuju;
