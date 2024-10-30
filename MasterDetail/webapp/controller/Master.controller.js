sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/Fragment"
], function (Controller, Filter, FilterOperator, Sorter, MessageBox, JSONModel, Fragment) {
	"use strict";

	return Controller.extend("MasterDetail.controller.Master", {
		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oItemsTable = this.getView().byId("itemsTable");
			this.oModel = this.getOwnerComponent().getModel("items");
			this.oRouter = this.getOwnerComponent().getRouter();
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("ItemID", FilterOperator.Contains, sQuery)];
			}

			this.oItemsTable.getBinding("items").filter(oTableSearchState, "Application");
		},

		onAdd: function () {
			this._loadCreateItem();
		},

		_loadCreateItem : async function () {
			if (!this._oDialog) {
				this._oDialog = await Fragment.load({
					name: "MasterDetail.view.fragment.CreateItem",
					controller: this,
					id: "DialogAddNewRow"
				}).then(oDialog => {
					this.oView.addDependent(oDialog);
					return oDialog;
				})
			}
			this._oDialog.open();
		},

		onDialogBeforeOpen(oEvent) {
			const oDialog = oEvent.getSource(),
						oParams = {
							IntegrationID: ""
						},
						oEntry = this.oModel.createEntry("/tItems", {
							properties: oParams
						});
			
			oDialog.setBindingContext(oEntry, "items");
		},


		onPressSave() {
			const oDialog = this._oDialog,
						oBindingContext = oDialog.getBindingContext("items"),
						oData = oBindingContext.getObject();

			const oModel = this.getView().getModel("items");

			oData.Quantity = Number(oData.Quantity);
    	oData.Price = Number(oData.Price);

      oModel.submitChanges();
			this._oDialog.close();
		},

		onPressCancel() {
			this.oModel.resetChanges()
			this._oDialog.close();
		},

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oItemsTable.getBinding("items"),
				oSorter = new Sorter("ItemID", this._bDescendingSort);

			oBinding.sort(oSorter);
		},

		onListItemPress: function (oEvent) {
			var itemPath = oEvent.getSource().getBindingContext("items").getPath(),
				item = itemPath.split("/").slice(-1).pop(),
				oNextUIState;

			this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(1);
				this.oRouter.navTo("detail", {
					layout: oNextUIState.layout,
					item: item
				});
			}.bind(this));
		}
	});
});