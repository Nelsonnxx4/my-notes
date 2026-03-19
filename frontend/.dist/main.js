"use strict";
exports.__esModule = true;
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_query_1 = require("@tanstack/react-query");
var react_query_devtools_1 = require("@tanstack/react-query-devtools");
var react_redux_1 = require("react-redux");
var store_1 = require("./stores/store");
var App_1 = require("./App");
var queryClient = new react_query_1.QueryClient();
client_1["default"].createRoot(document.getElementById("root")).render(React.createElement(react_1.StrictMode, null,
    React.createElement(react_query_1.QueryClientProvider, { client: queryClient },
        React.createElement(react_redux_1.Provider, { store: store_1.store },
            React.createElement(App_1["default"], null)),
        React.createElement(react_query_devtools_1.ReactQueryDevtools, null))));
