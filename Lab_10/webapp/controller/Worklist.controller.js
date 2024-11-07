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
        sCount: '0'
      });
      this.setModel(oViewModel, "worklistView");

      const oModel = this.getOwnerComponent().getModel();
      oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
    },

    onBeforeRendering: function () {
      this._getTableCounter();
    },

    _getTableCounter() {
      const oModel = this.getOwnerComponent().getModel(),
            oTable = this.byId("table"),
            oBinding = oTable.getBinding("items");

      if (oBinding) {
        oBinding.attachEvent("dataReceived", () => {
          oModel.mCodeListModelParams.defaultCountMode = sap.ui.model.odata.CountMode.Inline;
          const iCount = oBinding.getLength();
          this.getView().getModel("worklistView").setProperty("/sCount", iCount);
        });
      }
    },


    onChangeDescription (oEvent) {
      const oBindingContext = oEvent.getSource().getBindingContext(),
            sNewValue = oEvent.getParameter("newValue");

      oBindingContext.getModel().setProperty("Description", sNewValue, oBindingContext);
      oBindingContext.getModel().refresh(true);
    },

  });
}
);