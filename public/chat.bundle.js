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

eval("__webpack_require__.r(__webpack_exports__);\n// Forms\nconst chatForm = document.getElementById(\"chat-form\");\nconst formInput = document.getElementById(\"chat-input\");\n\n// Output elements\nconst messagesContainer = document.querySelector(\".messages\");\nconst messages = messagesContainer.querySelector(\"p\");\n\nchatForm.addEventListener(\"submit\", async (e) => {\n  e.preventDefault();\n\n  try {\n    const userMessage = formInput.value;\n\n    // Create a new paragraph element for the user's input\n    const userMessageElement = document.createElement(\"p\");\n    userMessageElement.textContent = userMessage;\n    userMessageElement.classList.add(\"user-message\"); // Add a class for styling\n\n    // Append the user's message to the messages container\n    messagesContainer.appendChild(userMessageElement);\n\n    // Create a new paragraph element for the response message\n    const responseMessageElement = document.createElement(\"p\");\n\n    // Fetch response message from server...\n    const res = await fetch(\n      \"http://127.0.0.1:5001/thesis-77e2b/us-central1/generateMeta\",\n      {\n        headers: { \"Content-Type\": \"application/json\" },\n        body: JSON.stringify({ title: formInput.value }),\n        method: \"POST\",\n        mode: \"cors\",\n      }\n    );\n\n    if (!res.ok) {\n      throw new Error(`HTTP error! Status: ${res.status}`);\n    }\n\n    const data = await res.json();\n\n    console.log(data.description);\n\n    // Create a new paragraph element for the message\n    const newMessage = document.createElement(\"p\");\n    newMessage.textContent =\n      data.description.content || \"No description available\";\n\n    // Append the new message to the messages container\n    messagesContainer.appendChild(newMessage);\n\n    // Store the message in Firestore\n    const exerciseId = document.getElementById(\"exercise-id\").textContent; // Get the exercise ID from the DOM\n    const exerciseDocRef = doc(getFirestore(), \"exercises\", exerciseId); // Get the exercise document reference\n    const messagesRef = collection(exerciseDocRef, \"messages\"); // Get the messages subcollection reference\n\n    await addDoc(messagesRef, {\n      text: userMessage,\n      timestamp: serverTimestamp(),\n    }); // Add the user message to the messages subcollection\n\n    // Scroll to the bottom of the messages container\n    messagesContainer.scrollTop = messagesContainer.scrollHeight;\n\n    chatForm.reset();\n  } catch (error) {\n    console.error(\"Error fetching data:\", error);\n  }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2hhdC5qcyIsIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEOztBQUV0RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsb0NBQW9DO0FBQ3ZELCtCQUErQix3QkFBd0I7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2Q0FBNkMsV0FBVztBQUN4RDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMkVBQTJFO0FBQzNFLHlFQUF5RTtBQUN6RSxnRUFBZ0U7O0FBRWhFO0FBQ0E7QUFDQTtBQUNBLEtBQUssR0FBRzs7QUFFUjtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGhlc2lzLWdwdDQtcHJvZmVzc29yLWFzc2lzdGFudC8uL3NyYy9jaGF0LmpzP2Q3YTMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRm9ybXNcbmNvbnN0IGNoYXRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGF0LWZvcm1cIik7XG5jb25zdCBmb3JtSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXQtaW5wdXRcIik7XG5cbi8vIE91dHB1dCBlbGVtZW50c1xuY29uc3QgbWVzc2FnZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2VzXCIpO1xuY29uc3QgbWVzc2FnZXMgPSBtZXNzYWdlc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwicFwiKTtcblxuY2hhdEZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1c2VyTWVzc2FnZSA9IGZvcm1JbnB1dC52YWx1ZTtcblxuICAgIC8vIENyZWF0ZSBhIG5ldyBwYXJhZ3JhcGggZWxlbWVudCBmb3IgdGhlIHVzZXIncyBpbnB1dFxuICAgIGNvbnN0IHVzZXJNZXNzYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHVzZXJNZXNzYWdlRWxlbWVudC50ZXh0Q29udGVudCA9IHVzZXJNZXNzYWdlO1xuICAgIHVzZXJNZXNzYWdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidXNlci1tZXNzYWdlXCIpOyAvLyBBZGQgYSBjbGFzcyBmb3Igc3R5bGluZ1xuXG4gICAgLy8gQXBwZW5kIHRoZSB1c2VyJ3MgbWVzc2FnZSB0byB0aGUgbWVzc2FnZXMgY29udGFpbmVyXG4gICAgbWVzc2FnZXNDb250YWluZXIuYXBwZW5kQ2hpbGQodXNlck1lc3NhZ2VFbGVtZW50KTtcblxuICAgIC8vIENyZWF0ZSBhIG5ldyBwYXJhZ3JhcGggZWxlbWVudCBmb3IgdGhlIHJlc3BvbnNlIG1lc3NhZ2VcbiAgICBjb25zdCByZXNwb25zZU1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cbiAgICAvLyBGZXRjaCByZXNwb25zZSBtZXNzYWdlIGZyb20gc2VydmVyLi4uXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXG4gICAgICBcImh0dHA6Ly8xMjcuMC4wLjE6NTAwMS90aGVzaXMtNzdlMmIvdXMtY2VudHJhbDEvZ2VuZXJhdGVNZXRhXCIsXG4gICAgICB7XG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0aXRsZTogZm9ybUlucHV0LnZhbHVlIH0pLFxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBtb2RlOiBcImNvcnNcIixcbiAgICAgIH1cbiAgICApO1xuXG4gICAgaWYgKCFyZXMub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCBlcnJvciEgU3RhdHVzOiAke3Jlcy5zdGF0dXN9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKCk7XG5cbiAgICBjb25zb2xlLmxvZyhkYXRhLmRlc2NyaXB0aW9uKTtcblxuICAgIC8vIENyZWF0ZSBhIG5ldyBwYXJhZ3JhcGggZWxlbWVudCBmb3IgdGhlIG1lc3NhZ2VcbiAgICBjb25zdCBuZXdNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgbmV3TWVzc2FnZS50ZXh0Q29udGVudCA9XG4gICAgICBkYXRhLmRlc2NyaXB0aW9uLmNvbnRlbnQgfHwgXCJObyBkZXNjcmlwdGlvbiBhdmFpbGFibGVcIjtcblxuICAgIC8vIEFwcGVuZCB0aGUgbmV3IG1lc3NhZ2UgdG8gdGhlIG1lc3NhZ2VzIGNvbnRhaW5lclxuICAgIG1lc3NhZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKG5ld01lc3NhZ2UpO1xuXG4gICAgLy8gU3RvcmUgdGhlIG1lc3NhZ2UgaW4gRmlyZXN0b3JlXG4gICAgY29uc3QgZXhlcmNpc2VJZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXhlcmNpc2UtaWRcIikudGV4dENvbnRlbnQ7IC8vIEdldCB0aGUgZXhlcmNpc2UgSUQgZnJvbSB0aGUgRE9NXG4gICAgY29uc3QgZXhlcmNpc2VEb2NSZWYgPSBkb2MoZ2V0RmlyZXN0b3JlKCksIFwiZXhlcmNpc2VzXCIsIGV4ZXJjaXNlSWQpOyAvLyBHZXQgdGhlIGV4ZXJjaXNlIGRvY3VtZW50IHJlZmVyZW5jZVxuICAgIGNvbnN0IG1lc3NhZ2VzUmVmID0gY29sbGVjdGlvbihleGVyY2lzZURvY1JlZiwgXCJtZXNzYWdlc1wiKTsgLy8gR2V0IHRoZSBtZXNzYWdlcyBzdWJjb2xsZWN0aW9uIHJlZmVyZW5jZVxuXG4gICAgYXdhaXQgYWRkRG9jKG1lc3NhZ2VzUmVmLCB7XG4gICAgICB0ZXh0OiB1c2VyTWVzc2FnZSxcbiAgICAgIHRpbWVzdGFtcDogc2VydmVyVGltZXN0YW1wKCksXG4gICAgfSk7IC8vIEFkZCB0aGUgdXNlciBtZXNzYWdlIHRvIHRoZSBtZXNzYWdlcyBzdWJjb2xsZWN0aW9uXG5cbiAgICAvLyBTY3JvbGwgdG8gdGhlIGJvdHRvbSBvZiB0aGUgbWVzc2FnZXMgY29udGFpbmVyXG4gICAgbWVzc2FnZXNDb250YWluZXIuc2Nyb2xsVG9wID0gbWVzc2FnZXNDb250YWluZXIuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgY2hhdEZvcm0ucmVzZXQoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgZGF0YTpcIiwgZXJyb3IpO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/chat.js\n");

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