sap.ui.define([
  "Lab_10/Lab_10/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "Lab_10/Lab_10/model/formatter",
  "sap/ui/core/routing/History"
], function (
  BaseController, JSONModel, formatter, History) {
  "use strict";

  return BaseController.extend("Lab_10.Lab_10.controller.Object", {

    formatter: formatter,

    onInit : function () {
      const oModel = this.getOwnerComponent().getModel(),
            sPath = "/zjblessons_base_Headers";

      const oViewModel = new JSONModel({
        isBusy: true
      });
      this.setModel(oViewModel, "objectView");

      this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

    },

    onNavBack : function() {
      var sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        history.go(-1);
      } else {
        this.getRouter().navTo("worklist", {}, true);
      }
    },

    _onObjectMatched : function (oEvent) {
      const sObjectId =  oEvent.getParameter("arguments").objectId;
      
      this.getModel().metadataLoaded().then( function() {
        const sObjectPath = this.getModel().createKey("zjblessons_base_Headers", {
          HeaderID :  sObjectId
        });
        this._bindView("/" + sObjectPath);
      }.bind(this));
    },

    _bindView : function (sObjectPath) {
      var oViewModel = this.getModel("objectView"),
          oDataModel = this.getModel();

      this.getView().bindElement({
        path: sObjectPath,
        events: {
          change: this._onBindingChange.bind(this),
          dataRequested: function () {
            oDataModel.metadataLoaded().then(function () {
              oViewModel.setProperty("/busy", true);
            });
          },
          dataReceived: function () {
            oViewModel.setProperty("/busy", false);
          }
        }
      });
    },

    _onBindingChange : function () {
      var oView = this.getView(),
          oElementBinding = oView.getElementBinding();

      if (!oElementBinding.getBoundContext()) {
        return;
      }
    }


  });

}
);