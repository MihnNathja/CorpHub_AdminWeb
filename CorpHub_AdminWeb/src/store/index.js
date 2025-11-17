import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import userReducer from "../features/user/store/userSlice";
import departmentReducer from "../features/department/store/departmentSlice";
import ticketReducer from "../features/ticket/store/ticketSlice";
import categoryReducer from "../features/ticket/store/categorySlice";
import eventReducer from "../features/calendar/store/calendarSlice";
import commentReducer from "../features/ticket/store/commentSlice";
import attachmentReducer from "../features/ticket/store/attachmentSlice";
import employeeReducer from "../features/employee/store/employeeSlice";
import roomReducer from "../features/room/store/roomSlice";
import roomRequirementReducer from "../features/room/store/roomRequirementSlice";
import roomTypeReducer from "../features/room/store/roomTypeSlice";
import assetReducer from "../features/asset/store/assetSlice";
import notificationReducer from "../features/notification/store/notificationSlice";
import profileReducer from "../features/profile/store/profileSlice";
import absenceTypeReducer from "../features/absence/store/absenceTypeSlice";
import absenceBalanceReducer from "../features/absence/store/absenceBalanceSlice";
import absenceRequestReducer from "../features/absence/store/absenceRequestSlice";
import holidayReducer from "../features/absence/store/holidayCalendarSlice";
import documentReducer from "../features/profile/store/documentSlice";
import shiftReducer from "../features/schedule/store/shiftSlice";
import scheduleReducer from "../features/schedule/store/scheduleSlice";
import attendanceReducer from "../features/attendance/store/attendanceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    department: departmentReducer,
    tickets: ticketReducer,
    category: categoryReducer,
    events: eventReducer,
    comments: commentReducer,
    rooms: roomReducer,
    roomRequirements: roomRequirementReducer,
    roomTypes: roomTypeReducer,
    assets: assetReducer,
    attachments: attachmentReducer,
    employees: employeeReducer,
    notification: notificationReducer,
    profile: profileReducer,
    absenceType: absenceTypeReducer,
    absenceBalance: absenceBalanceReducer,
    absenceRequest: absenceRequestReducer,
    holiday: holidayReducer,
    document: documentReducer,
    shift: shiftReducer,
    schedule: scheduleReducer,
    attendance: attendanceReducer
  },
});
