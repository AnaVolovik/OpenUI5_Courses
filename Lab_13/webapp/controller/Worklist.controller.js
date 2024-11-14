sap.ui.define([
    "Lab_13/Lab_13/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "Lab_13/Lab_13/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("Lab_13.Lab_13.controller.Worklist", {

      formatter: formatter,

      onInit : function () {
        const oViewModel = new JSONModel({

        });
        this.setModel(oViewModel, "worklistView");

      },

      

    });
  }
);