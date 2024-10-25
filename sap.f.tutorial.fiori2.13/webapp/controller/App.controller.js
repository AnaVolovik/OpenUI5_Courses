sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.fiori2.controller.App", {
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

			// Save the current route name
			this.currentRouteName = sRouteName;
			this.currentItem = oArguments.item;
			this.currentSupplier = oArguments.supplier;
		},

		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();
			
			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
		        this.oRouter.navTo(this.currentRouteName, {
		            layout: sLayout,
		            item: this.currentItem,
		            supplier: this.currentSupplier
		        }, true); 
		    }
		},

		// Update the close/fullscreen buttons visibility
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