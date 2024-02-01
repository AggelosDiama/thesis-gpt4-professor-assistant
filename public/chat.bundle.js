/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chat.js":
/*!*********************!*\
  !*** ./src/chat.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// forms\nconst metaForm = document.getElementById(\"chat-form\");\n\n// output elements\nconst messages = document.querySelector(\".messages p\");\n\nmetaForm.addEventListener(\"submit\", async (e) => {\n  e.preventDefault();\n  console.log(\"gamo\");\n\n  const res = await fetch(\n    \"http://127.0.0.1:5001/thesis-77e2b/us-central1/generateMeta\",\n    {\n      headers: { \"Content-Type\": \"application/json\" },\n      body: JSON.stringify({ title: metaForm.title.value }),\n      method: \"POST\",\n      mode: \"cors\",\n    }\n  );\n  const data = await res.json();\n\n  console.log(data);\n\n  messages.textContent = data.messages.content;\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2hhdC5qcyIsIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsb0NBQW9DO0FBQ3JELDZCQUE2Qiw2QkFBNkI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aGVzaXMtZ3B0NC1wcm9mZXNzb3ItYXNzaXN0YW50Ly4vc3JjL2NoYXQuanM/ZDdhMyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmb3Jtc1xuY29uc3QgbWV0YUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXQtZm9ybVwiKTtcblxuLy8gb3V0cHV0IGVsZW1lbnRzXG5jb25zdCBtZXNzYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVzc2FnZXMgcFwiKTtcblxubWV0YUZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnNvbGUubG9nKFwiZ2Ftb1wiKTtcblxuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcbiAgICBcImh0dHA6Ly8xMjcuMC4wLjE6NTAwMS90aGVzaXMtNzdlMmIvdXMtY2VudHJhbDEvZ2VuZXJhdGVNZXRhXCIsXG4gICAge1xuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0aXRsZTogbWV0YUZvcm0udGl0bGUudmFsdWUgfSksXG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgbW9kZTogXCJjb3JzXCIsXG4gICAgfVxuICApO1xuICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcblxuICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICBtZXNzYWdlcy50ZXh0Q29udGVudCA9IGRhdGEubWVzc2FnZXMuY29udGVudDtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/chat.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/chat.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;