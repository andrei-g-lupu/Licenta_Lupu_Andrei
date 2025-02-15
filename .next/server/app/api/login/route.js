"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/login/route";
exports.ids = ["app/api/login/route"];
exports.modules = {

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CAndrei%5CDocuments%5CProiect_Licenta%5CTutorial_Rag%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAndrei%5CDocuments%5CProiect_Licenta%5CTutorial_Rag&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CAndrei%5CDocuments%5CProiect_Licenta%5CTutorial_Rag%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAndrei%5CDocuments%5CProiect_Licenta%5CTutorial_Rag&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/node-polyfill-headers */ \"(rsc)/./node_modules/next/dist/server/node-polyfill-headers.js\");\n/* harmony import */ var next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var C_Users_Andrei_Documents_Proiect_Licenta_Tutorial_Rag_app_api_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/login/route.ts */ \"(rsc)/./app/api/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_1__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_2__.RouteKind.APP_ROUTE,\n        page: \"/api/login/route\",\n        pathname: \"/api/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/login/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Andrei\\\\Documents\\\\Proiect_Licenta\\\\Tutorial_Rag\\\\app\\\\api\\\\login\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Andrei_Documents_Proiect_Licenta_Tutorial_Rag_app_api_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/login/route\";\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZsb2dpbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbG9naW4lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBbmRyZWklNUNEb2N1bWVudHMlNUNQcm9pZWN0X0xpY2VudGElNUNUdXRvcmlhbF9SYWclNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q0FuZHJlaSU1Q0RvY3VtZW50cyU1Q1Byb2llY3RfTGljZW50YSU1Q1R1dG9yaWFsX1JhZyZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFnRDtBQUNzRDtBQUN2QztBQUNvRDtBQUNuSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVHQUF1RztBQUMvRztBQUNpSjs7QUFFakoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0anMtZmlyc3RfY2hhdGJvdC8/ZDUzYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJuZXh0L2Rpc3Qvc2VydmVyL25vZGUtcG9seWZpbGwtaGVhZGVyc1wiO1xuaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcQW5kcmVpXFxcXERvY3VtZW50c1xcXFxQcm9pZWN0X0xpY2VudGFcXFxcVHV0b3JpYWxfUmFnXFxcXGFwcFxcXFxhcGlcXFxcbG9naW5cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2xvZ2luL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbG9naW5cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2xvZ2luL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcQW5kcmVpXFxcXERvY3VtZW50c1xcXFxQcm9pZWN0X0xpY2VudGFcXFxcVHV0b3JpYWxfUmFnXFxcXGFwcFxcXFxhcGlcXFxcbG9naW5cXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0IH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvbG9naW4vcm91dGVcIjtcbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0LCBvcmlnaW5hbFBhdGhuYW1lLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CAndrei%5CDocuments%5CProiect_Licenta%5CTutorial_Rag%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAndrei%5CDocuments%5CProiect_Licenta%5CTutorial_Rag&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/login/route.ts":
/*!********************************!*\
  !*** ./app/api/login/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   OPTIONS: () => (/* binding */ OPTIONS),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dotenv */ \"(rsc)/./node_modules/dotenv/lib/main.js\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_4__);\n// File: c:/Tutorial_Rag/app/login/route.ts\n\n // Assuming bcrypt is used for password hashing\n\n // Internal database client\n\ndotenv__WEBPACK_IMPORTED_MODULE_4__.config(); // Load environment variables\nasync function POST(request) {\n    console.log(\"POST /login request received\");\n    try {\n        const { email, password } = await request.json();\n        // Validate input\n        if (!email || !password) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Email and password are required.\"\n            }, {\n                status: 400\n            });\n        }\n        // Fetch user from the database\n        const res = await _lib_db__WEBPACK_IMPORTED_MODULE_3__[\"default\"].query(\"SELECT * FROM users WHERE email = $1\", [\n            email\n        ]);\n        if (res.rows.length === 0) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"User not found.\"\n            }, {\n                status: 404\n            });\n        }\n        const user = res.rows[0];\n        // Compare passwords\n        const isMatch = await bcrypt__WEBPACK_IMPORTED_MODULE_1___default().compare(password, user.password_hash);\n        if (!isMatch) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Invalid credentials.\"\n            }, {\n                status: 401\n            });\n        }\n        // Generate JWT\n        const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default().sign({\n            id: user.id,\n            email: user.email,\n            username: user.username\n        }, process.env.JWT_SECRET, {\n            expiresIn: \"1h\"\n        });\n        // Set HTTP-only cookie\n        const response = next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            message: \"Login successful.\"\n        });\n        response.cookies.set(\"token\", token, {\n            httpOnly: true,\n            secure: \"development\" === \"production\",\n            path: \"/\",\n            sameSite: \"strict\",\n            maxAge: 60 * 60\n        });\n        return response;\n    } catch (error) {\n        console.error(\"Login Error:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Internal Server Error.\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function OPTIONS() {\n    return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({}, {\n        status: 200\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2xvZ2luL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBMkM7QUFFQTtBQUNmLENBQUMsK0NBQStDO0FBQzdDO0FBQ0ksQ0FBQywyQkFBMkI7QUFDOUI7QUFFakNJLDBDQUFhLElBQUksNkJBQTZCO0FBVXZDLGVBQWVFLEtBQUtDLE9BQWdCO0lBQ3pDQyxRQUFRQyxHQUFHLENBQUM7SUFFWixJQUFJO1FBQ0YsTUFBTSxFQUFFQyxLQUFLLEVBQUVDLFFBQVEsRUFBRSxHQUFHLE1BQU1KLFFBQVFLLElBQUk7UUFFOUMsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQ0YsU0FBUyxDQUFDQyxVQUFVO1lBQ3ZCLE9BQU9YLGtGQUFZQSxDQUFDWSxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQW1DLEdBQzVDO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSwrQkFBK0I7UUFDL0IsTUFBTUMsTUFBTSxNQUFNWiwrQ0FBSUEsQ0FBQ2EsS0FBSyxDQUMxQix3Q0FDQTtZQUFDTjtTQUFNO1FBR1QsSUFBSUssSUFBSUUsSUFBSSxDQUFDQyxNQUFNLEtBQUssR0FBRztZQUN6QixPQUFPbEIsa0ZBQVlBLENBQUNZLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBa0IsR0FDM0I7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE1BQU1LLE9BQU9KLElBQUlFLElBQUksQ0FBQyxFQUFFO1FBRXhCLG9CQUFvQjtRQUNwQixNQUFNRyxVQUFVLE1BQU1uQixxREFBYyxDQUFDVSxVQUFVUSxLQUFLRyxhQUFhO1FBRWpFLElBQUksQ0FBQ0YsU0FBUztZQUNaLE9BQU9wQixrRkFBWUEsQ0FBQ1ksSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUF1QixHQUNoQztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsZUFBZTtRQUNmLE1BQU1TLFFBQVFyQix3REFBUSxDQUNwQjtZQUFFdUIsSUFBSU4sS0FBS00sRUFBRTtZQUFFZixPQUFPUyxLQUFLVCxLQUFLO1lBQUVnQixVQUFVUCxLQUFLTyxRQUFRO1FBQUMsR0FDMURDLFFBQVFDLEdBQUcsQ0FBQ0MsVUFBVSxFQUN0QjtZQUFFQyxXQUFXO1FBQUs7UUFHcEIsdUJBQXVCO1FBQ3ZCLE1BQU1DLFdBQVcvQixrRkFBWUEsQ0FBQ1ksSUFBSSxDQUFDO1lBQUVvQixTQUFTO1FBQW9CO1FBQ2xFRCxTQUFTRSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxTQUFTWCxPQUFPO1lBQ25DWSxVQUFVO1lBQ1ZDLFFBQVFULGtCQUF5QjtZQUNqQ1UsTUFBTTtZQUNOQyxVQUFVO1lBQ1ZDLFFBQVEsS0FBSztRQUNmO1FBRUEsT0FBT1I7SUFDVCxFQUFFLE9BQU9sQixPQUFPO1FBQ2RMLFFBQVFLLEtBQUssQ0FBQyxnQkFBZ0JBO1FBQzlCLE9BQU9iLGtGQUFZQSxDQUFDWSxJQUFJLENBQ3RCO1lBQUVDLE9BQU87UUFBeUIsR0FDbEM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0Y7QUFHTyxlQUFlMEI7SUFDcEIsT0FBT3hDLGtGQUFZQSxDQUFDWSxJQUFJLENBQUMsQ0FBQyxHQUFHO1FBQUVFLFFBQVE7SUFBSTtBQUM3QyIsInNvdXJjZXMiOlsid2VicGFjazovL25leHRqcy1maXJzdF9jaGF0Ym90Ly4vYXBwL2FwaS9sb2dpbi9yb3V0ZS50cz82MDFmIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGM6L1R1dG9yaWFsX1JhZy9hcHAvbG9naW4vcm91dGUudHNcclxuXHJcbmltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcclxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnOyAvLyBBc3N1bWluZyBiY3J5cHQgaXMgdXNlZCBmb3IgcGFzc3dvcmQgaGFzaGluZ1xyXG5pbXBvcnQgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XHJcbmltcG9ydCBwb29sIGZyb20gJy4uLy4uLy4uL2xpYi9kYic7IC8vIEludGVybmFsIGRhdGFiYXNlIGNsaWVudFxyXG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcclxuXHJcbmRvdGVudi5jb25maWcoKTsgLy8gTG9hZCBlbnZpcm9ubWVudCB2YXJpYWJsZXNcclxuXHJcbi8vIERlZmluZSB0aGUgVXNlciBpbnRlcmZhY2UgYmFzZWQgb24geW91ciBkYXRhYmFzZSBzY2hlbWFcclxuaW50ZXJmYWNlIFVzZXIge1xyXG4gIGlkOiBudW1iZXI7XHJcbiAgdXNlcm5hbWU6IHN0cmluZztcclxuICBlbWFpbDogc3RyaW5nO1xyXG4gIHBhc3N3b3JkX2hhc2g6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogUmVxdWVzdCkge1xyXG4gIGNvbnNvbGUubG9nKCdQT1NUIC9sb2dpbiByZXF1ZXN0IHJlY2VpdmVkJyk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XHJcblxyXG4gICAgLy8gVmFsaWRhdGUgaW5wdXRcclxuICAgIGlmICghZW1haWwgfHwgIXBhc3N3b3JkKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiAnRW1haWwgYW5kIHBhc3N3b3JkIGFyZSByZXF1aXJlZC4nIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmV0Y2ggdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcG9vbC5xdWVyeTxVc2VyPihcclxuICAgICAgJ1NFTEVDVCAqIEZST00gdXNlcnMgV0hFUkUgZW1haWwgPSAkMScsXHJcbiAgICAgIFtlbWFpbF1cclxuICAgICk7XHJcblxyXG4gICAgaWYgKHJlcy5yb3dzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogJ1VzZXIgbm90IGZvdW5kLicgfSxcclxuICAgICAgICB7IHN0YXR1czogNDA0IH1cclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1c2VyID0gcmVzLnJvd3NbMF07XHJcblxyXG4gICAgLy8gQ29tcGFyZSBwYXNzd29yZHNcclxuICAgIGNvbnN0IGlzTWF0Y2ggPSBhd2FpdCBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgdXNlci5wYXNzd29yZF9oYXNoKTtcclxuXHJcbiAgICBpZiAoIWlzTWF0Y2gpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgIHsgZXJyb3I6ICdJbnZhbGlkIGNyZWRlbnRpYWxzLicgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAxIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZW5lcmF0ZSBKV1RcclxuICAgIGNvbnN0IHRva2VuID0gand0LnNpZ24oXHJcbiAgICAgIHsgaWQ6IHVzZXIuaWQsIGVtYWlsOiB1c2VyLmVtYWlsLCB1c2VybmFtZTogdXNlci51c2VybmFtZSB9LFxyXG4gICAgICBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIGFzIHN0cmluZyxcclxuICAgICAgeyBleHBpcmVzSW46ICcxaCcgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBTZXQgSFRUUC1vbmx5IGNvb2tpZVxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6ICdMb2dpbiBzdWNjZXNzZnVsLicgfSk7XHJcbiAgICByZXNwb25zZS5jb29raWVzLnNldCgndG9rZW4nLCB0b2tlbiwge1xyXG4gICAgICBodHRwT25seTogdHJ1ZSxcclxuICAgICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxyXG4gICAgICBwYXRoOiAnLycsXHJcbiAgICAgIHNhbWVTaXRlOiAnc3RyaWN0JyxcclxuICAgICAgbWF4QWdlOiA2MCAqIDYwLCAvLyAxIGhvdXIgaW4gc2Vjb25kc1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdMb2dpbiBFcnJvcjonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHsgZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3IuJyB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIE9QVElPTlMoKSB7XHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHt9LCB7IHN0YXR1czogMjAwIH0pO1xyXG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImJjcnlwdCIsImp3dCIsInBvb2wiLCJkb3RlbnYiLCJjb25maWciLCJQT1NUIiwicmVxdWVzdCIsImNvbnNvbGUiLCJsb2ciLCJlbWFpbCIsInBhc3N3b3JkIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwicmVzIiwicXVlcnkiLCJyb3dzIiwibGVuZ3RoIiwidXNlciIsImlzTWF0Y2giLCJjb21wYXJlIiwicGFzc3dvcmRfaGFzaCIsInRva2VuIiwic2lnbiIsImlkIiwidXNlcm5hbWUiLCJwcm9jZXNzIiwiZW52IiwiSldUX1NFQ1JFVCIsImV4cGlyZXNJbiIsInJlc3BvbnNlIiwibWVzc2FnZSIsImNvb2tpZXMiLCJzZXQiLCJodHRwT25seSIsInNlY3VyZSIsInBhdGgiLCJzYW1lU2l0ZSIsIm1heEFnZSIsIk9QVElPTlMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dotenv */ \"(rsc)/./node_modules/dotenv/lib/main.js\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);\n// cod reutilizabil pentru conectare la postgresql\n\n\ndotenv__WEBPACK_IMPORTED_MODULE_1___default().config();\nconst pool = new pg__WEBPACK_IMPORTED_MODULE_0__.Pool({\n    // host: process.env.SUPABASE_HOST,\n    // user: process.env.POSTGRES_USER,\n    // password: process.env.SUPABASE_PASSWORD,\n    // database: process.env.SUPABASE_HOST,\n    // port: Number(process.env.SUPABASE_PORT) || 5432,\n    connectionString: \"postgresql://postgres.bqhtfgqaiidzsatkchao:Godofnaruto1!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true\",\n    // \"postgresql://postgres:[YOUR-PASSWORD]@db.apbkobhfnmcqqzqeeqss.supabase.co:5432/postgres\",\n    ssl: {\n        rejectUnauthorized: false\n    }\n});\npool.on(\"connect\", ()=>{\n    console.log(\"Connected to PostgreSQL\");\n});\npool.on(\"error\", (err)=>{\n    console.error(\"Unexpected PostgreSQL error:\", err);\n    process.exit(-1);\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pool);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxrREFBa0Q7QUFDeEI7QUFDRTtBQUU1QkMsb0RBQWE7QUFFYixNQUFNRSxPQUFPLElBQUlILG9DQUFJQSxDQUFDO0lBQ3BCLG1DQUFtQztJQUNuQyxtQ0FBbUM7SUFDbkMsMkNBQTJDO0lBQzVDLHVDQUF1QztJQUN0QyxtREFBbUQ7SUFDbkRJLGtCQUVBO0lBQ0QsNkZBQTZGO0lBRTVGQyxLQUFLO1FBQUVDLG9CQUFvQjtJQUFLO0FBQ2xDO0FBRUFILEtBQUtJLEVBQUUsQ0FBQyxXQUFXO0lBQ2pCQyxRQUFRQyxHQUFHLENBQUM7QUFDZDtBQUVBTixLQUFLSSxFQUFFLENBQUMsU0FBUyxDQUFDRztJQUNoQkYsUUFBUUcsS0FBSyxDQUFDLGdDQUFnQ0Q7SUFDOUNFLFFBQVFDLElBQUksQ0FBQyxDQUFDO0FBQ2hCO0FBRUEsaUVBQWVWLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0anMtZmlyc3RfY2hhdGJvdC8uL2xpYi9kYi50cz8xZGYwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGNvZCByZXV0aWxpemFiaWwgcGVudHJ1IGNvbmVjdGFyZSBsYSBwb3N0Z3Jlc3FsXHJcbmltcG9ydCB7IFBvb2wgfSBmcm9tICdwZyc7XHJcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcclxuXHJcbmRvdGVudi5jb25maWcoKTtcclxuXHJcbmNvbnN0IHBvb2wgPSBuZXcgUG9vbCh7XHJcbiAgLy8gaG9zdDogcHJvY2Vzcy5lbnYuU1VQQUJBU0VfSE9TVCxcclxuICAvLyB1c2VyOiBwcm9jZXNzLmVudi5QT1NUR1JFU19VU0VSLFxyXG4gIC8vIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5TVVBBQkFTRV9QQVNTV09SRCxcclxuIC8vIGRhdGFiYXNlOiBwcm9jZXNzLmVudi5TVVBBQkFTRV9IT1NULFxyXG4gIC8vIHBvcnQ6IE51bWJlcihwcm9jZXNzLmVudi5TVVBBQkFTRV9QT1JUKSB8fCA1NDMyLFxyXG4gIGNvbm5lY3Rpb25TdHJpbmc6IFxyXG5cclxuICBcInBvc3RncmVzcWw6Ly9wb3N0Z3Jlcy5icWh0ZmdxYWlpZHpzYXRrY2hhbzpHb2RvZm5hcnV0bzEhQGF3cy0wLWV1LWNlbnRyYWwtMS5wb29sZXIuc3VwYWJhc2UuY29tOjY1NDMvcG9zdGdyZXM/cGdib3VuY2VyPXRydWVcIixcclxuIC8vIFwicG9zdGdyZXNxbDovL3Bvc3RncmVzOltZT1VSLVBBU1NXT1JEXUBkYi5hcGJrb2JoZm5tY3FxenFlZXFzcy5zdXBhYmFzZS5jbzo1NDMyL3Bvc3RncmVzXCIsXHJcblxyXG4gIHNzbDogeyByZWplY3RVbmF1dGhvcml6ZWQ6IGZhbHNlfVxyXG59KTtcclxuXHJcbnBvb2wub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ0Nvbm5lY3RlZCB0byBQb3N0Z3JlU1FMJyk7XHJcbn0pO1xyXG5cclxucG9vbC5vbignZXJyb3InLCAoZXJyKSA9PiB7XHJcbiAgY29uc29sZS5lcnJvcignVW5leHBlY3RlZCBQb3N0Z3JlU1FMIGVycm9yOicsIGVycik7XHJcbiAgcHJvY2Vzcy5leGl0KC0xKTtcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwb29sO1xyXG4iXSwibmFtZXMiOlsiUG9vbCIsImRvdGVudiIsImNvbmZpZyIsInBvb2wiLCJjb25uZWN0aW9uU3RyaW5nIiwic3NsIiwicmVqZWN0VW5hdXRob3JpemVkIiwib24iLCJjb25zb2xlIiwibG9nIiwiZXJyIiwiZXJyb3IiLCJwcm9jZXNzIiwiZXhpdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/dotenv","vendor-chunks/ms","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/jws","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/safe-buffer","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CAndrei%5CDocuments%5CProiect_Licenta%5CTutorial_Rag%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAndrei%5CDocuments%5CProiect_Licenta%5CTutorial_Rag&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();