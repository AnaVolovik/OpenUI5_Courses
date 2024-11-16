sap.ui.define([], function () {
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
    }
  };
});