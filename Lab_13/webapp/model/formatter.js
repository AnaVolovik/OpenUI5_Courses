sap.ui.define([], function () {
  "use strict";

  return {
    checkIcon: function (createdByAvatar) {
      if (createdByAvatar && createdByAvatar.trim() !== "") {
        return createdByAvatar;
      }

      return "sap-icon://customer";
    }
  };
});