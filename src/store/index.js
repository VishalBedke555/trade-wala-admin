import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import ApprovalsSlice from "./approvalsSlice";
import OrdersSlice from "./ordersSlice";
import UsersSlice from "./usersSlice";
import StatsSlice from "./StatsSlice";
import CategorySlice from "./categorySlice";
import CouponsSlice from "./couponsSlice";
import PaymentsSlice from "./paymentsSlice";
import UploadFileSlice from "./uploadFileSlice";
import RangesSlice from "./rangeSlice";
import DeliveriesSlice from "./deliveriesSlice";
import CustomerSupportSlice from "./customerSupportSlice";

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        file: UploadFileSlice,
        approvals: ApprovalsSlice,
        orders: OrdersSlice,
        users: UsersSlice,
        stats: StatsSlice,
        category: CategorySlice,
        coupons: CouponsSlice,
        payments: PaymentsSlice,
        ranges: RangesSlice,
        deliveries: DeliveriesSlice,
        customerSupport: CustomerSupportSlice
    }
})

export default store;