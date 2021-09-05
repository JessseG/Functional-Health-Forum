"use strict";
(() => {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "./pages/api/auth/[...nextauth].ts":
/*!*****************************************!*\
  !*** ./pages/api/auth/[...nextauth].ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ "next-auth");
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_auth_providers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers */ "next-auth/providers");
/* harmony import */ var next_auth_providers__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_auth_adapters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/adapters */ "next-auth/adapters");
/* harmony import */ var next_auth_adapters__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_adapters__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @prisma/client */ "@prisma/client");
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_3__);




const prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_3__.PrismaClient();
const options = {
  providers: [// OAuthentication providers ...
  next_auth_providers__WEBPACK_IMPORTED_MODULE_1___default().GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  })],
  // Optional SQL or MongoDB database to presist users
  adapter: next_auth_adapters__WEBPACK_IMPORTED_MODULE_2___default().Prisma.Adapter({
    prisma
  })
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((req, res) => next_auth__WEBPACK_IMPORTED_MODULE_0___default()(req, res, options));

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/adapters":
/*!*************************************!*\
  !*** external "next-auth/adapters" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("next-auth/adapters");

/***/ }),

/***/ "next-auth/providers":
/*!**************************************!*\
  !*** external "next-auth/providers" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/auth/[...nextauth].ts"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNSSxNQUFNLEdBQUcsSUFBSUQsd0RBQUosRUFBZjtBQUVBLE1BQU1FLE9BQU8sR0FBRztBQUNkQyxFQUFBQSxTQUFTLEVBQUUsQ0FDVDtBQUNBTCxFQUFBQSxpRUFBQSxDQUFpQjtBQUNmTyxJQUFBQSxRQUFRLEVBQUVDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxnQkFEUDtBQUVmQyxJQUFBQSxZQUFZLEVBQUVILE9BQU8sQ0FBQ0MsR0FBUixDQUFZRztBQUZYLEdBQWpCLENBRlMsQ0FERztBQVFkO0FBQ0FDLEVBQUFBLE9BQU8sRUFBRVosd0VBQUEsQ0FBd0I7QUFBRUUsSUFBQUE7QUFBRixHQUF4QjtBQVRLLENBQWhCO0FBWUEsaUVBQWUsQ0FBQ2EsR0FBRCxFQUFNQyxHQUFOLEtBQWNsQixnREFBUSxDQUFDaUIsR0FBRCxFQUFNQyxHQUFOLEVBQVdiLE9BQVgsQ0FBckM7Ozs7Ozs7Ozs7QUNuQkE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBwcmlzbWEvY2xpZW50XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibmV4dC1hdXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibmV4dC1hdXRoL2FkYXB0ZXJzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibmV4dC1hdXRoL3Byb3ZpZGVyc1wiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tIFwibmV4dC1hdXRoXCI7XHJcbmltcG9ydCBQcm92aWRlcnMgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnNcIjtcclxuaW1wb3J0IEFkYXB0ZXJzIGZyb20gXCJuZXh0LWF1dGgvYWRhcHRlcnNcIjtcclxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XHJcblxyXG5jb25zdCBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XHJcblxyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgLy8gT0F1dGhlbnRpY2F0aW9uIHByb3ZpZGVycyAuLi5cclxuICAgIFByb3ZpZGVycy5HaXRIdWIoe1xyXG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuR0lUSFVCX0NMSUVOVF9JRCxcclxuICAgICAgY2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5HSVRIVUJfQ0xJRU5UX1NFQ1JFVCxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgLy8gT3B0aW9uYWwgU1FMIG9yIE1vbmdvREIgZGF0YWJhc2UgdG8gcHJlc2lzdCB1c2Vyc1xyXG4gIGFkYXB0ZXI6IEFkYXB0ZXJzLlByaXNtYS5BZGFwdGVyKHsgcHJpc21hIH0pLFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHJlcSwgcmVzKSA9PiBOZXh0QXV0aChyZXEsIHJlcywgb3B0aW9ucyk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBwcmlzbWEvY2xpZW50XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQtYXV0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0LWF1dGgvYWRhcHRlcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC1hdXRoL3Byb3ZpZGVyc1wiKTsiXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJQcm92aWRlcnMiLCJBZGFwdGVycyIsIlByaXNtYUNsaWVudCIsInByaXNtYSIsIm9wdGlvbnMiLCJwcm92aWRlcnMiLCJHaXRIdWIiLCJjbGllbnRJZCIsInByb2Nlc3MiLCJlbnYiLCJHSVRIVUJfQ0xJRU5UX0lEIiwiY2xpZW50U2VjcmV0IiwiR0lUSFVCX0NMSUVOVF9TRUNSRVQiLCJhZGFwdGVyIiwiUHJpc21hIiwiQWRhcHRlciIsInJlcSIsInJlcyJdLCJzb3VyY2VSb290IjoiIn0=