import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./ui-slice";
import userReducer from "./user-slice";
// import assignRetailerReducer from "./assignRetailer-slice";
// import cartSliceReducer from "./cart-slice";
// import ordersSliceReducer from "./orders-slice";

const store= configureStore({
    reducer:{
        ui: uiReducer,
        user: userReducer,
        // assignRetailer: assignRetailerReducer,
        // cart: cartSliceReducer,
        // orders: ordersSliceReducer,
    }
});

export default store;