sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("MasterDetail.controller.App", {
    onInit: function () {
      this.oOwnerComponent = this.getOwnerComponent();
      this.oRouter = this.oOwnerComponent.getRouter();

      this.oModel = this.oOwnerComponent.getModel("items");
      this.oMasterModel = this.oOwnerComponent.getModel("masterModel");
      this.oRouter.attachRouteMatched(this.onRouteMatched, this);
    },

    onRouteMatched: function (oEvent) {
      var sRouteName = oEvent.getParameter("name"),
          oArguments = oEvent.getParameter("arguments");

      this._updateUIElements();

      this.currentRouteName = sRouteName;
      this.currentItem = oArguments.item;
    },

    onStateChanged: function (oEvent) {
      var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
          sLayout = oEvent.getParameter("layout");

      this._updateUIElements();

      if (bIsNavigationArrow) {
        this.oRouter.navTo(this.currentRouteName, {
          layout: sLayout,
          item: this.currentItem,
          supplier: this.currentSupplier
        }, true); 
      }
    },

    _updateUIElements: function () { 
      var oModel = this.getOwnerComponent().getModel("masterModel"), 
          oUIState;

      this.oOwnerComponent.getHelper().then(function(oHelper) { 
        oUIState = oHelper.getCurrentUIState(); 
        oModel.setData(oUIState); 
      }); 
    },

    onExit: function () {
      this.oRouter.detachRouteMatched(this.onRouteMatched, this);
      this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
    }
  });
});