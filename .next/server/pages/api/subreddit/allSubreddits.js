"use strict";
(() => {
var exports = {};
exports.id = "pages/api/subreddit/allSubreddits";
exports.ids = ["pages/api/subreddit/allSubreddits"];
exports.modules = {

/***/ "./pages/api/subreddit/allSubreddits.ts":
/*!**********************************************!*\
  !*** ./pages/api/subreddit/allSubreddits.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ "@prisma/client");
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);

const prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();

const handler = async (req, res) => {
  try {
    const allSubs = await prisma.subreddit.findMany();
    res.json(allSubs);
  } catch (error) {
    res.json(error);
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/subreddit/allSubreddits.ts"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXMvYXBpL3N1YnJlZGRpdC9hbGxTdWJyZWRkaXRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUVBLE1BQU1DLE1BQU0sR0FBRyxJQUFJRCx3REFBSixFQUFmOztBQUVBLE1BQU1FLE9BQU8sR0FBRyxPQUFPQyxHQUFQLEVBQTRCQyxHQUE1QixLQUFxRDtBQUNuRSxNQUFJO0FBQ0YsVUFBTUMsT0FBTyxHQUFHLE1BQU1KLE1BQU0sQ0FBQ0ssU0FBUCxDQUFpQkMsUUFBakIsRUFBdEI7QUFDQUgsSUFBQUEsR0FBRyxDQUFDSSxJQUFKLENBQVNILE9BQVQ7QUFDRCxHQUhELENBR0UsT0FBT0ksS0FBUCxFQUFjO0FBQ2RMLElBQUFBLEdBQUcsQ0FBQ0ksSUFBSixDQUFTQyxLQUFUO0FBQ0Q7QUFDRixDQVBEOztBQVNBLGlFQUFlUCxPQUFmOzs7Ozs7Ozs7O0FDZEEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvc3VicmVkZGl0L2FsbFN1YnJlZGRpdHMudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQHByaXNtYS9jbGllbnRcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcclxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XHJcblxyXG5jb25zdCBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XHJcblxyXG5jb25zdCBoYW5kbGVyID0gYXN5bmMgKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGFsbFN1YnMgPSBhd2FpdCBwcmlzbWEuc3VicmVkZGl0LmZpbmRNYW55KCk7XHJcbiAgICByZXMuanNvbihhbGxTdWJzKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLmpzb24oZXJyb3IpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGhhbmRsZXI7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBwcmlzbWEvY2xpZW50XCIpOyJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwiYWxsU3VicyIsInN1YnJlZGRpdCIsImZpbmRNYW55IiwianNvbiIsImVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==