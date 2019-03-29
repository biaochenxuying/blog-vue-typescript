// import Mock from "mockjs";
// import URLs from "./urls.js";

// const DEBUG = true; // debug 总开关
// /**
//  * debug: false | true,
//  * data: {}
//  */
// const mockData: object = {
//   getLineList: {
//     debug: true,
//     data: {
//       status: "100",
//       message: "操作成功",
//       data: {
//         count: "@natural(10, 100)",
//         "list|7-10": [
//           {
//             date: '@date("MMdd")',
//             ringRatio: "@natural(10, 50)",
//             rate: "@natural(-10, 50)",
//             name: "@city",
//             rank: "@natural(1, 50)",
//             value: "@natural(1, 100)"
//           }
//         ]
//       }
//     }
//   },
//   getClassroomInformList: {
//     debug: true,
//     data: {
//       status: "100",
//       message: "操作成功",
//       data: {
//         count: "@natural(10, 100000)",
//         "list|1-10": [
//           {
//             id: "@natural(10, 100000)",
//             classroom_id: "@natural(10, 100000)",
//             student_id: "@natural(10, 100000)",
//             student_name: "@string",
//             user_name: "@string",
//             student_url: "//www.baidu.com/img/bd_logo1.png",
//             head_portrait: "//www.baidu.com/img/bd_logo1.png",
//             assignment_type: "@natural(1, 2)",
//             own: "@natural(10, 100000)",
//             article: "@string",
//             score: "@natural(10, 100000)",
//             integral: "@natural(10, 100000)",
//             time: "@natural(10, 100000)",
//             task_time: "@natural(10, 100000)",
//             "comment|1-10": [
//               {
//                 id: "@natural(10, 100000)",
//                 name: "@string",
//                 comment: "@string"
//               }
//             ],
//             "seal|1-10": [
//               {
//                 id: "@natural(10, 100000)",
//                 user_id: "@natural(10, 100000)",
//                 name: "@string",
//                 colour: "@string",
//                 style: "@string"
//               }
//             ]
//           }
//         ]
//       }
//     }
//   }
// };

// Mock.setup({
//   timeout: 500
// });

// const mockTest: Function = function(urls: object) {
//   if (!DEBUG) {
//     return false;
//   }
//   for (const key in mockData) {
//     if (mockData[key].debug === true && urls[key] !== undefined) {
//       Mock.mock(urls[key], mockData[key].data);
//       // console.log('urls[key]',urls[key])
//     }
//   }
// };

// mockTest(URLs);
