sap.ui.define([
    "Lab_10/Lab_10/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "Lab_10/Lab_10/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("Lab_10.Lab_10.controller.Worklist", {

      formatter: formatter,

      onInit : function () {
        const oViewModel = new JSONModel({

        });
        this.setModel(oViewModel, "worklistView");
      },
    });
  }
);