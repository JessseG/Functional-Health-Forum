"use strict";
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./pages/index.tsx":
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Page; }
/* harmony export */ });
/* harmony import */ var C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/next/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/next/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_auth_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/client */ "./node_modules/next-auth/dist/client/index.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* module decorator */ module = __webpack_require__.hmd(module);


var _jsxFileName = "C:\\Users\\acon3\\Asclepius\\asclepio\\pages\\index.tsx",
    _s = $RefreshSig$();





function Page() {
  _s();

  var _useSession = (0,next_auth_client__WEBPACK_IMPORTED_MODULE_2__.useSession)(),
      _useSession2 = (0,C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__.default)(_useSession, 2),
      session = _useSession2[0],
      loading = _useSession2[1];

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(Nav, {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 10,
      columnNumber: 7
    }, this), !session && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
      children: ["Not signed in ", /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("br", {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 13,
        columnNumber: 25
      }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("button", {
        onClick: function onClick() {
          return (0,next_auth_client__WEBPACK_IMPORTED_MODULE_2__.signIn)();
        },
        children: "Sign in"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 14,
        columnNumber: 11
      }, this)]
    }, void 0, true), session && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
      children: ["Signed in as ", session.user.name, " ", /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("br", {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 19,
        columnNumber: 44
      }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("button", {
        onClick: function onClick() {
          return (0,next_auth_client__WEBPACK_IMPORTED_MODULE_2__.signOut)();
        },
        children: "Sign out"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 20,
        columnNumber: 11
      }, this)]
    }, void 0, true)]
  }, void 0, true);
}

_s(Page, "btnbnkOsPYI0mLfZro/2DT47AuA=", false, function () {
  return [next_auth_client__WEBPACK_IMPORTED_MODULE_2__.useSession];
});

_c = Page;

var _c;

$RefreshReg$(_c, "Page");

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }


/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljL3dlYnBhY2svcGFnZXMvaW5kZXguNjQwZWMyZWNkZGFmNTI5Mzg0MDEuaG90LXVwZGF0ZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTs7O0FBR2UsU0FBU0ksSUFBVCxHQUFnQjtBQUFBOztBQUM3QixvQkFBMkJELDREQUFVLEVBQXJDO0FBQUE7QUFBQSxNQUFPRSxPQUFQO0FBQUEsTUFBZ0JDLE9BQWhCOztBQUVBLHNCQUNFO0FBQUEsNEJBQ0UsOERBQUMsR0FBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBREYsRUFFRyxDQUFDRCxPQUFELGlCQUNDO0FBQUEsZ0RBQ2dCO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FEaEIsZUFFRTtBQUFRLGVBQU8sRUFBRTtBQUFBLGlCQUFNSix3REFBTSxFQUFaO0FBQUEsU0FBakI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FGRjtBQUFBLG9CQUhKLEVBUUdJLE9BQU8saUJBQ047QUFBQSxrQ0FDZ0JBLE9BQU8sQ0FBQ0UsSUFBUixDQUFhQyxJQUQ3QixvQkFDbUM7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQURuQyxlQUVFO0FBQVEsZUFBTyxFQUFFO0FBQUEsaUJBQU1OLHlEQUFPLEVBQWI7QUFBQSxTQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQUZGO0FBQUEsb0JBVEo7QUFBQSxrQkFERjtBQWlCRDs7R0FwQnVCRTtVQUNLRDs7O0tBRExDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3BhZ2VzL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBzaWduSW4sIHNpZ25PdXQsIHVzZVNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoL2NsaWVudFwiO1xuaW1wb3J0IExheW91dCBmcm9tIFwiLi4vY29tcG9uZW50cy9MYXlvdXRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGFnZSgpIHtcbiAgY29uc3QgW3Nlc3Npb24sIGxvYWRpbmddID0gdXNlU2Vzc2lvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxOYXYgLz5cbiAgICAgIHshc2Vzc2lvbiAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgTm90IHNpZ25lZCBpbiA8YnIgLz5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNpZ25JbigpfT5TaWduIGluPC9idXR0b24+XG4gICAgICAgIDwvPlxuICAgICAgKX1cbiAgICAgIHtzZXNzaW9uICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICBTaWduZWQgaW4gYXMge3Nlc3Npb24udXNlci5uYW1lfSA8YnIgLz5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNpZ25PdXQoKX0+U2lnbiBvdXQ8L2J1dHRvbj5cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgIDwvPlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlJlYWN0Iiwic2lnbkluIiwic2lnbk91dCIsInVzZVNlc3Npb24iLCJQYWdlIiwic2Vzc2lvbiIsImxvYWRpbmciLCJ1c2VyIiwibmFtZSJdLCJzb3VyY2VSb290IjoiIn0=