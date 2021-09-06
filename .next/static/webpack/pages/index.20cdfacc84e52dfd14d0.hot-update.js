"use strict";
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./components/nav.tsx":
/*!****************************!*\
  !*** ./components/nav.tsx ***!
  \****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Nav; }
/* harmony export */ });
/* harmony import */ var C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/next/node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/next/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/next/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/next/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/next/node_modules/@babel/runtime/regenerator */ "./node_modules/next/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");
/* harmony import */ var next_auth_client__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next-auth/client */ "./node_modules/next-auth/dist/client/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/router */ "./node_modules/next/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__);
/* module decorator */ module = __webpack_require__.hmd(module);



var _jsxFileName = "C:\\Users\\acon3\\Asclepius\\asclepio\\components\\nav.tsx",
    _s = $RefreshSig$();








function Nav() {
  _s();

  var _session$user;

  var _useSession = (0,next_auth_client__WEBPACK_IMPORTED_MODULE_4__.useSession)(),
      _useSession2 = (0,C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__.default)(_useSession, 2),
      session = _useSession2[0],
      loading = _useSession2[1];

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)([]),
      subReddits = _useState[0],
      setSubreddits = _useState[1];

  var router = (0,next_router__WEBPACK_IMPORTED_MODULE_6__.useRouter)();
  (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(function () {
    fetchData();
  }, []);

  var convertSubs = function convertSubs() {
    if (subReddits.length < 1) return;
    var options = subReddits.map(function (sub) {
      return {
        value: sub.id,
        label: sub.name
      };
    });
    return options;
  };

  var fetchData = /*#__PURE__*/function () {
    var _ref = (0,C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__.default)( /*#__PURE__*/C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
      var res, subreddits;
      return C_Users_acon3_Asclepius_asclepio_node_modules_next_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch("/api/subreddit/allSubreddits");

            case 2:
              res = _context.sent;
              _context.next = 5;
              return res.json();

            case 5:
              subreddits = _context.sent;
              setSubreddits(subreddits);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function fetchData() {
      return _ref.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("nav", {
    className: "flex items-center justify-between py-4 bg-gray-700 x1",
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
      className: "flex items-center x2",
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
        className: "w-12 h-12 rounded-full bg-red-300 mx-4 x3",
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
          href: "/",
          children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("a", {
            className: "text-white text-2xl font-bold ml-16 x4",
            children: "Reddit"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 13
          }, this)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 37,
          columnNumber: 11
        }, this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 36,
        columnNumber: 9
      }, this)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 35,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
      className: "w-4/12 x5",
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(react_select__WEBPACK_IMPORTED_MODULE_8__.default, {
        options: convertSubs(),
        onChange: function onChange(option) {
          router.push("/subreddits/".concat(option.name));
        }
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 43,
        columnNumber: 9
      }, this)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 42,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("h3", {
      className: "text-white font-bold text-xl x6",
      children: ["Welcome ", loading ? "" : session === null || session === void 0 ? void 0 : (_session$user = session.user) === null || _session$user === void 0 ? void 0 : _session$user.name]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
      className: "text-white font-bold mr-4 text-xl x7",
      children: [!session && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("button", {
        onClick: next_auth_client__WEBPACK_IMPORTED_MODULE_4__.signIn,
        children: "Login"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 55,
        columnNumber: 22
      }, this), session && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("button", {
        onClick: next_auth_client__WEBPACK_IMPORTED_MODULE_4__.signOut,
        children: "Logout"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 56,
        columnNumber: 21
      }, this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 54,
      columnNumber: 7
    }, this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 34,
    columnNumber: 5
  }, this);
}

_s(Nav, "SmpYe52Yk1HRMj6ZPm0uONVaI8g=", false, function () {
  return [next_auth_client__WEBPACK_IMPORTED_MODULE_4__.useSession, next_router__WEBPACK_IMPORTED_MODULE_6__.useRouter];
});

_c = Nav;

var _c;

$RefreshReg$(_c, "Nav");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljL3dlYnBhY2svcGFnZXMvaW5kZXguMjBjZGZhY2M4NGU1MmRmZDE0ZDAuaG90LXVwZGF0ZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsU0FBU1EsR0FBVCxHQUFlO0FBQUE7O0FBQUE7O0FBQzVCLG9CQUEyQk4sNERBQVUsRUFBckM7QUFBQTtBQUFBLE1BQU9PLE9BQVA7QUFBQSxNQUFnQkMsT0FBaEI7O0FBQ0Esa0JBQW9DTCwrQ0FBUSxDQUFDLEVBQUQsQ0FBNUM7QUFBQSxNQUFPTSxVQUFQO0FBQUEsTUFBbUJDLGFBQW5COztBQUVBLE1BQU1DLE1BQU0sR0FBR04sc0RBQVMsRUFBeEI7QUFFQUQsRUFBQUEsZ0RBQVMsQ0FBQyxZQUFNO0FBQ2RRLElBQUFBLFNBQVM7QUFDVixHQUZRLEVBRU4sRUFGTSxDQUFUOztBQUlBLE1BQU1DLFdBQVcsR0FBRyxTQUFkQSxXQUFjLEdBQU07QUFDeEIsUUFBSUosVUFBVSxDQUFDSyxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBRTNCLFFBQU1DLE9BQU8sR0FBR04sVUFBVSxDQUFDTyxHQUFYLENBQWUsVUFBQ0MsR0FBRDtBQUFBLGFBQVU7QUFDdkNDLFFBQUFBLEtBQUssRUFBRUQsR0FBRyxDQUFDRSxFQUQ0QjtBQUV2Q0MsUUFBQUEsS0FBSyxFQUFFSCxHQUFHLENBQUNJO0FBRjRCLE9BQVY7QUFBQSxLQUFmLENBQWhCO0FBSUEsV0FBT04sT0FBUDtBQUNELEdBUkQ7O0FBVUEsTUFBTUgsU0FBUztBQUFBLHVUQUFHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQ0VVLEtBQUssQ0FBQyw4QkFBRCxDQURQOztBQUFBO0FBQ1ZDLGNBQUFBLEdBRFU7QUFBQTtBQUFBLHFCQUVTQSxHQUFHLENBQUNDLElBQUosRUFGVDs7QUFBQTtBQUVWQyxjQUFBQSxVQUZVO0FBR2hCZixjQUFBQSxhQUFhLENBQUNlLFVBQUQsQ0FBYjs7QUFIZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBSDs7QUFBQSxvQkFBVGIsU0FBUztBQUFBO0FBQUE7QUFBQSxLQUFmOztBQU1BLHNCQUNFO0FBQUssYUFBUyxFQUFDLHVEQUFmO0FBQUEsNEJBQ0U7QUFBSyxlQUFTLEVBQUMsc0JBQWY7QUFBQSw2QkFDRTtBQUFLLGlCQUFTLEVBQUMsMkNBQWY7QUFBQSwrQkFDRSw4REFBQyxrREFBRDtBQUFNLGNBQUksRUFBQyxHQUFYO0FBQUEsaUNBQ0U7QUFBRyxxQkFBUyxFQUFDLHdDQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBREYsZUFRRTtBQUFLLGVBQVMsRUFBQyxXQUFmO0FBQUEsNkJBQ0UsOERBQUMsaURBQUQ7QUFDRSxlQUFPLEVBQUVDLFdBQVcsRUFEdEI7QUFFRSxnQkFBUSxFQUFFLGtCQUFDYSxNQUFELEVBQVk7QUFDcEJmLFVBQUFBLE1BQU0sQ0FBQ2dCLElBQVAsdUJBQTJCRCxNQUFNLENBQUNMLElBQWxDO0FBQ0Q7QUFKSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQVJGLGVBaUJFO0FBQUksZUFBUyxFQUFDLGlDQUFkO0FBQUEsNkJBQ1diLE9BQU8sR0FBRyxFQUFILEdBQVFELE9BQVIsYUFBUUEsT0FBUix3Q0FBUUEsT0FBTyxDQUFFcUIsSUFBakIsa0RBQVEsY0FBZVAsSUFEekM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBakJGLGVBb0JFO0FBQUssZUFBUyxFQUFDLHNDQUFmO0FBQUEsaUJBQ0csQ0FBQ2QsT0FBRCxpQkFBWTtBQUFRLGVBQU8sRUFBRU4sb0RBQWpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBRGYsRUFFR00sT0FBTyxpQkFBSTtBQUFRLGVBQU8sRUFBRUwscURBQWpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBRmQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBcEJGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQURGO0FBMkJEOztHQXJEdUJJO1VBQ0tOLDBEQUdaSzs7O0tBSk9DIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvbmF2LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGluayBmcm9tIFwibmV4dC9saW5rXCI7XHJcbmltcG9ydCBTZWxlY3QgZnJvbSBcInJlYWN0LXNlbGVjdFwiO1xyXG5pbXBvcnQgeyB1c2VTZXNzaW9uLCBzaWduSW4sIHNpZ25PdXQgfSBmcm9tIFwibmV4dC1hdXRoL2NsaWVudFwiO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L3JvdXRlclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2KCkge1xyXG4gIGNvbnN0IFtzZXNzaW9uLCBsb2FkaW5nXSA9IHVzZVNlc3Npb24oKTtcclxuICBjb25zdCBbc3ViUmVkZGl0cywgc2V0U3VicmVkZGl0c10gPSB1c2VTdGF0ZShbXSk7XHJcblxyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgZmV0Y2hEYXRhKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBjb252ZXJ0U3VicyA9ICgpID0+IHtcclxuICAgIGlmIChzdWJSZWRkaXRzLmxlbmd0aCA8IDEpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBvcHRpb25zID0gc3ViUmVkZGl0cy5tYXAoKHN1YikgPT4gKHtcclxuICAgICAgdmFsdWU6IHN1Yi5pZCxcclxuICAgICAgbGFiZWw6IHN1Yi5uYW1lLFxyXG4gICAgfSkpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZmV0Y2hEYXRhID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXCIvYXBpL3N1YnJlZGRpdC9hbGxTdWJyZWRkaXRzXCIpO1xyXG4gICAgY29uc3Qgc3VicmVkZGl0cyA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICBzZXRTdWJyZWRkaXRzKHN1YnJlZGRpdHMpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8bmF2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweS00IGJnLWdyYXktNzAwIHgxXCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgeDJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTIgaC0xMiByb3VuZGVkLWZ1bGwgYmctcmVkLTMwMCBteC00IHgzXCI+XHJcbiAgICAgICAgICA8TGluayBocmVmPVwiL1wiPlxyXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIHRleHQtMnhsIGZvbnQtYm9sZCBtbC0xNiB4NFwiPlJlZGRpdDwvYT5cclxuICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy00LzEyIHg1XCI+XHJcbiAgICAgICAgPFNlbGVjdFxyXG4gICAgICAgICAgb3B0aW9ucz17Y29udmVydFN1YnMoKX1cclxuICAgICAgICAgIG9uQ2hhbmdlPXsob3B0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIHJvdXRlci5wdXNoKGAvc3VicmVkZGl0cy8ke29wdGlvbi5uYW1lfWApO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGZvbnQtYm9sZCB0ZXh0LXhsIHg2XCI+XHJcbiAgICAgICAgV2VsY29tZSB7bG9hZGluZyA/IFwiXCIgOiBzZXNzaW9uPy51c2VyPy5uYW1lfVxyXG4gICAgICA8L2gzPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtd2hpdGUgZm9udC1ib2xkIG1yLTQgdGV4dC14bCB4N1wiPlxyXG4gICAgICAgIHshc2Vzc2lvbiAmJiA8YnV0dG9uIG9uQ2xpY2s9e3NpZ25Jbn0+TG9naW48L2J1dHRvbj59XHJcbiAgICAgICAge3Nlc3Npb24gJiYgPGJ1dHRvbiBvbkNsaWNrPXtzaWduT3V0fT5Mb2dvdXQ8L2J1dHRvbj59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9uYXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiTGluayIsIlNlbGVjdCIsInVzZVNlc3Npb24iLCJzaWduSW4iLCJzaWduT3V0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSb3V0ZXIiLCJOYXYiLCJzZXNzaW9uIiwibG9hZGluZyIsInN1YlJlZGRpdHMiLCJzZXRTdWJyZWRkaXRzIiwicm91dGVyIiwiZmV0Y2hEYXRhIiwiY29udmVydFN1YnMiLCJsZW5ndGgiLCJvcHRpb25zIiwibWFwIiwic3ViIiwidmFsdWUiLCJpZCIsImxhYmVsIiwibmFtZSIsImZldGNoIiwicmVzIiwianNvbiIsInN1YnJlZGRpdHMiLCJvcHRpb24iLCJwdXNoIiwidXNlciJdLCJzb3VyY2VSb290IjoiIn0=