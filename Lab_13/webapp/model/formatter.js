sap.ui.define([], function () {
  "use strict";

  return {
    checkIcon: function (createdByAvatar, createdByFullName) {
      if (createdByFullName && createdByFullName.trim() !== "") {
        return "sap-icon://customer";
      }

      if (createdByAvatar && createdByAvatar.trim() !== "") {
        return createdByAvatar;
      }

      return "";
    }
  };
});
