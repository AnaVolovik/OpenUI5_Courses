sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.fiori2.controller.Detail", {
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel("items");
			this.oMasterModel = this.oOwnerComponent.getModel("masterModel");

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
		},

		_onProductMatched: function (oEvent) {
			this._item = oEvent.getParameter("arguments").item || "0";

			const itemPath = "/" + this._item;
			this.getView().bindElement({
				path: itemPath,
				model: "items",
				events: {
					change: this._onBindingChange.bind(this)
				}
			});
		},

		_onBindingChange: function () {
			const oModel = this.getView().getModel("items"),
				context = this.getView().getBindingContext("items");
	
			if (context) {
				const headerID = context.getProperty("HeaderID");
				const materialID = context.getProperty("MaterialID");
				const groupID = context.getProperty("GroupID");

				this._loadHeaderData(headerID);
				this._loadMaterialData(materialID);
				this._loadGroupData(groupID);
			}
		},

		_loadHeaderData: async function (headerID) {
			const oModel = this.getView().getModel();

			this.getView().setModel(new sap.ui.model.json.JSONModel({}), "headerData");
    	this.getView().setBindingContext(null, "headerData");
	
			try {
				const oData = await new Promise((resolve, reject) => {
					oModel.read(`/zjblessons_base_Headers('${headerID}')`, {
						success: function (data) {
							resolve(data);
						},
						error: function (oError) {
							reject(oError);
						}
					});
				});

				const headerModel = new sap.ui.model.json.JSONModel(oData);
				this.getView().setModel(headerModel, "headerData");
				this.getView().setBindingContext(headerModel.createBindingContext("/"), "headerData");
			} catch (error) {
				console.error("Error fetching Header data:", error);
			}
		},
	
		_loadMaterialData: async function (materialID) {
			const oModel = this.getView().getModel();

			this.getView().setModel(new sap.ui.model.json.JSONModel({}), "materialData");
    	this.getView().setBindingContext(null, "materialData");
	
			try {
				const oData = await new Promise((resolve, reject) => {
					oModel.read(`/zjblessons_base_Materials('${materialID}')`, {
						success: function (data) {
							resolve(data);
						},
						error: function (oError) {
							reject(oError);
						}
					});
				});

				const materialModel = new sap.ui.model.json.JSONModel(oData);
				this.getView().setModel(materialModel, "materialData");
				this.getView().setBindingContext(materialModel.createBindingContext("/"), "materialData");
			} catch (error) {
				console.error("Error fetching Material data:", error);
			}
		},
	
		_loadGroupData: async function (groupID) {
			const oModel = this.getView().getModel();

			this.getView().setModel(new sap.ui.model.json.JSONModel({}), "groupData");
    	this.getView().setBindingContext(null, "groupData");
	
			try {
				const oData = await new Promise((resolve, reject) => {
					oModel.read(`/zjblessons_base_Groups('${groupID}')`, {
						success: function (data) {
							resolve(data);
						},
						error: function (oError) {
							reject(oError);
						}
					});
				});

				const groupModel = new sap.ui.model.json.JSONModel(oData);
				this.getView().setModel(groupModel, "groupData");
				this.getView().setBindingContext(groupModel.createBindingContext("/"), "groupData");
				console.log("Group Data:", oData);
			} catch (error) {
				console.error("Error fetching Group data:", error);
			}
		},

		_calculateAmount: function(price, quantity) {
			return price * quantity;
		},

		handleFullScreen: function () {
			var sNextLayout = this.oMasterModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, item: this._item});
		},

		handleExitFullScreen: function () {
			var sNextLayout = this.oMasterModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, item: this._item});
		},

		handleClose: function () {
			var sNextLayout = this.oMasterModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: sNextLayout});
		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});