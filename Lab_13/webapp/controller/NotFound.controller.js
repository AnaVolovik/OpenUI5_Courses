sap.ui.define([
    "Lab_13/Lab_13/controller/BaseController"
  ], function (BaseController) {
    "use strict";

    return BaseController.extend("Lab_13.Lab_13.controller.NotFound", {
      onLinkPressed : function () {
        this.getRouter().navTo("worklist");
      }

    });

  }
);