export const API_ENDPOINTS = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  CHANGE_PASSWORD: "/changepassword",
  REFRESH_TOKEN: "/refreshtoken",

  GET_BUSINESS_INFO: "/base/getbusinessinfo",
  GET_BUSINESS_DEPOSIT_INFO: "/base/getbusinessdepositinfo",
  REGISTER_BUSINESS_INFO: "/base/compoundregisterbusiness",
  MODIFY_BUSINESS_INFO: "/base/modifybusinessinfo",
  REGISTER_BUSINESS_DEPOSIT: "/base/registerbusinessdeposit",
  MODIFY_BUSINESS_DEPOSIT: "/base/modifybusinessdepositinfo",
  CHANGE_STATUS_BUSINESS: "/base/changebusinessstatus",
  RESET_BUSINESS_MASTER_KEY: "/base/resetbusinessmasterkey",
  RESET_BUSINESS_SERVICE_TEMPLATE: "/mcc/user/resetuserkey",
  LOAD_BUSINESS: "/bgl/loadbusiness",

  SEARCH_CARD_LIST: "/card/searchcard",
  GET_CARD_INFO: "/card/getcardinfo",
  CHANGE_STATUS_CARD: "/card/changecardstatus",
  GET_CARD_TRANSACTION: "/card/getcardtransaction",
  GET_CARD_EVENTS: "/card/getcardevents",
  GET_BUSINESS_DEPOSIT_STATEMENTS: "/bgl/getbusinessdepositstatements",
  GET_SETTLEMENT_REPORT: "/settlement/getsettlementreport",

  GET_TODAY_TRANSACTION_SUMMARY: "/dashboard/todaytransactionsummary",
  GET_TOTAL_BALANCE: "/dashboard/totalbalance",
  GET_BUSINESS_BALANCE: "/dashboard/businessbalance",
  GET_BUSINESS_SUMMARY: "/dashboard/businesssummary",
  GET_DAILY_TRANSACTION_SUMMARY: "/dashboard/dailytransactionsummary",

  SEARCH_CUSTOMER: "/customer/searchperson",
};
