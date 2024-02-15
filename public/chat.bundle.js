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

eval("__webpack_require__.r(__webpack_exports__);\n// Forms\nconst chatForm = document.getElementById(\"chat-form\");\nconst formInput = document.getElementById(\"chat-input\");\n\n// Output elements\nconst messagesContainer = document.querySelector(\".messages\");\nconst messages = messagesContainer.querySelector(\"p\");\n\nchatForm.addEventListener(\"submit\", async (e) => {\n  e.preventDefault();\n\n  try {\n    const userMessage = formInput.value;\n\n    // Create a new paragraph element for the user's input\n    const userMessageElement = document.createElement(\"p\");\n    userMessageElement.textContent = userMessage;\n    userMessageElement.classList.add(\"user-message\"); // Add a class for styling\n\n    // Append the user's message to the messages container\n    messagesContainer.appendChild(userMessageElement);\n\n    // Create a new paragraph element for the response message\n    const responseMessageElement = document.createElement(\"p\");\n\n    // Fetch response message from server...\n    const res = await fetch(\n      \"http://127.0.0.1:5001/thesis-77e2b/us-central1/generateMeta\",\n      {\n        headers: { \"Content-Type\": \"application/json\" },\n        body: JSON.stringify({ title: formInput.value }),\n        method: \"POST\",\n        mode: \"cors\",\n      }\n    );\n\n    if (!res.ok) {\n      throw new Error(`HTTP error! Status: ${res.status}`);\n    }\n\n    const data = await res.json();\n\n    console.log(data.description);\n\n    // Create a new paragraph element for the message\n    const newMessage = document.createElement(\"p\");\n    newMessage.textContent =\n      data.description.content || \"No description available\";\n\n    // Append the new message to the messages container\n    messagesContainer.appendChild(newMessage);\n\n    // Scroll to the bottom of the messages container\n    messagesContainer.scrollTop = messagesContainer.scrollHeight;\n\n    chatForm.reset();\n  } catch (error) {\n    console.error(\"Error fetching data:\", error);\n  }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2hhdC5qcyIsIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEOztBQUV0RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsb0NBQW9DO0FBQ3ZELCtCQUErQix3QkFBd0I7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2Q0FBNkMsV0FBVztBQUN4RDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aGVzaXMtZ3B0NC1wcm9mZXNzb3ItYXNzaXN0YW50Ly4vc3JjL2NoYXQuanM/ZDdhMyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGb3Jtc1xuY29uc3QgY2hhdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXQtZm9ybVwiKTtcbmNvbnN0IGZvcm1JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhdC1pbnB1dFwiKTtcblxuLy8gT3V0cHV0IGVsZW1lbnRzXG5jb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVzc2FnZXNcIik7XG5jb25zdCBtZXNzYWdlcyA9IG1lc3NhZ2VzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJwXCIpO1xuXG5jaGF0Rm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJNZXNzYWdlID0gZm9ybUlucHV0LnZhbHVlO1xuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IHBhcmFncmFwaCBlbGVtZW50IGZvciB0aGUgdXNlcidzIGlucHV0XG4gICAgY29uc3QgdXNlck1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgdXNlck1lc3NhZ2VFbGVtZW50LnRleHRDb250ZW50ID0gdXNlck1lc3NhZ2U7XG4gICAgdXNlck1lc3NhZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ1c2VyLW1lc3NhZ2VcIik7IC8vIEFkZCBhIGNsYXNzIGZvciBzdHlsaW5nXG5cbiAgICAvLyBBcHBlbmQgdGhlIHVzZXIncyBtZXNzYWdlIHRvIHRoZSBtZXNzYWdlcyBjb250YWluZXJcbiAgICBtZXNzYWdlc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh1c2VyTWVzc2FnZUVsZW1lbnQpO1xuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IHBhcmFncmFwaCBlbGVtZW50IGZvciB0aGUgcmVzcG9uc2UgbWVzc2FnZVxuICAgIGNvbnN0IHJlc3BvbnNlTWVzc2FnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblxuICAgIC8vIEZldGNoIHJlc3BvbnNlIG1lc3NhZ2UgZnJvbSBzZXJ2ZXIuLi5cbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcbiAgICAgIFwiaHR0cDovLzEyNy4wLjAuMTo1MDAxL3RoZXNpcy03N2UyYi91cy1jZW50cmFsMS9nZW5lcmF0ZU1ldGFcIixcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHRpdGxlOiBmb3JtSW5wdXQudmFsdWUgfSksXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIG1vZGU6IFwiY29yc1wiLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBTdGF0dXM6ICR7cmVzLnN0YXR1c31gKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcblxuICAgIGNvbnNvbGUubG9nKGRhdGEuZGVzY3JpcHRpb24pO1xuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IHBhcmFncmFwaCBlbGVtZW50IGZvciB0aGUgbWVzc2FnZVxuICAgIGNvbnN0IG5ld01lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBuZXdNZXNzYWdlLnRleHRDb250ZW50ID1cbiAgICAgIGRhdGEuZGVzY3JpcHRpb24uY29udGVudCB8fCBcIk5vIGRlc2NyaXB0aW9uIGF2YWlsYWJsZVwiO1xuXG4gICAgLy8gQXBwZW5kIHRoZSBuZXcgbWVzc2FnZSB0byB0aGUgbWVzc2FnZXMgY29udGFpbmVyXG4gICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQobmV3TWVzc2FnZSk7XG5cbiAgICAvLyBTY3JvbGwgdG8gdGhlIGJvdHRvbSBvZiB0aGUgbWVzc2FnZXMgY29udGFpbmVyXG4gICAgbWVzc2FnZXNDb250YWluZXIuc2Nyb2xsVG9wID0gbWVzc2FnZXNDb250YWluZXIuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgY2hhdEZvcm0ucmVzZXQoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgZGF0YTpcIiwgZXJyb3IpO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/chat.js\n");

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