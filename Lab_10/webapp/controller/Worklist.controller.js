sap.ui.define([
  "Lab_10/Lab_10/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "Lab_10/Lab_10/model/formatter"
], function (BaseController, JSONModel, formatter) {
  "use strict";

  return BaseController.extend("Lab_10.Lab_10.controller.Worklist", {

    formatter: formatter,

    onInit : function () {
      const oModel = this.getOwnerComponent().getModel(),
            sPath = "/zjblessons_base_Headers";

      const oViewModel = new JSONModel({
        sCount: "0",
        isBusy: true
      });
      this.setModel(oViewModel, "worklistView");

      const oDataPromise = new Promise((resolve, reject) => {
        oModel.read(sPath, {
          success: (oData) => {
            this.oJsonModel = new sap.ui.model.json.JSONModel(oData.results);
            this.oJsonModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

            this.getView().setModel(this.oJsonModel, "myJsonModel");

            resolve(this.oJsonModel);
          },
          error: (oError) => {
            console.error("Error fetching data", oError);
            oViewModel.setProperty("/isBusy", false);
            reject(oError);
          }
        });
      });

      oDataPromise
        .then((oJsonModel) => {
          const oTable = this.byId("table"),
                oBinding = oTable.getBinding("items");

          const oDefaultSorter = new sap.ui.model.Sorter("DocumentNumber", false);
          oBinding.sort([oDefaultSorter]);

          this._getTableCounter(oJsonModel);

          oViewModel.setProperty("/isBusy", false);
        })
        .catch((oError) => {
          oViewModel.setProperty("/isBusy", false);
          console.error("Error during data fetch:", oError);
        });
    },

    _getTableCounter(oJsonModel) {
      const oModelData = oJsonModel.getData(),
            oTable = this.byId("table"),
            oBinding = oTable.getBinding("items");

      if (oBinding) {
        oJsonModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
        const iCount = oModelData.length;
        this.getView().getModel("worklistView").setProperty("/sCount", iCount);
      }
    },

    onChangeDescription (oEvent) {
      const oInput = oEvent.getSource(),
            oBindingContext = oInput.getBindingContext("myJsonModel"),
            sPath = oBindingContext.getPath(),
            sNewValue = oEvent.getParameter("newValue");

      oBindingContext.getModel().setProperty(sPath + "/Description", sNewValue);
      oBindingContext.getModel().refresh(true);
    },

    onGroupRegionText () {
      const oTable = this.byId("table"),
            oBinding = oTable.getBinding("items"),
            bGrouped = oBinding.isGrouped();

      const oViewModel = this.getView().getModel("worklistView");
      oViewModel.setProperty("/isBusy", true);

      if (bGrouped) {
        const oDefaultSorter = new sap.ui.model.Sorter("DocumentNumber", false);
        oBinding.sort([oDefaultSorter]);
      } else {
        const oSorter = new sap.ui.model.Sorter("RegionText", false, true);
        oBinding.sort([oSorter]);
      }

      oViewModel.setProperty("/isBusy", false);
    }

  });
}
);