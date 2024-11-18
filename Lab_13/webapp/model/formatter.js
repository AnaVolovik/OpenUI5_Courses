sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
  "use strict";

  return {
    checkIcon: function (createdByAvatar, createdByFullName) {
      if (createdByFullName && createdByFullName.trim() !== "") {
        if (createdByAvatar && createdByAvatar.trim() !== "") {
          return createdByAvatar;
        }
        return "sap-icon://customer";
      }

      return "sap-icon://customer";
    },

    checkIconColor: function (createdByFullName) {
      return createdByFullName && createdByFullName.trim() !== "" ? "Positive" : "Negative";
    },

    checkName: function (createdByFullName) {
      return createdByFullName && createdByFullName.trim() !== "" ? createdByFullName : "Unknown";
    },

    formatDate: function (oDate) {
      if (oDate) {
          const oDateFormat = DateFormat.getDateInstance({
              style: "medium"
          });
          return oDateFormat.format(oDate);
      }
      return "";
    },

    formatDateTime: function (oDate) {
      if (oDate) {
          const oDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
              style: "short"
          });
          return oDateTimeFormat.format(oDate);
      }
      return "";
    }
  };
});