sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("MasterDetail.controller.Detail", {
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

		_loadHeaderData: async function (ID) {
			const oModel = this.getView().getModel();

			this.getView().setModel(new sap.ui.model.json.JSONModel({}), "headerData");
    	this.getView().setBindingContext(null, "headerData");
	
			try {
				const oData = await new Promise((resolve, reject) => {
					oModel.read(`/zjblessons_base_Headers(HeaderID='${ID}')`, {
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
			} catch (error) {
				console.error("Error fetching Group data:", error);
			}
		},

		_calculateAmount: function(price, quantity) {
			return price * quantity;
		},

		_onCostButtonPress: function () {
			var that = this;

			this.oModel.read("/zjblessons_base_Items", {
					success: function(oData) {
						var totalCostEUR = 0;

						if (oData.results && Array.isArray(oData.results)) {
								totalCostEUR = oData.results.reduce(function (sum, item) {
									var price = parseFloat(item.Price) || 0;
                  return sum + price;
								}, 0);
						}
	
						$.ajax({
								url: "https://www.nbrb.by/api/exrates/rates?periodicity=0",
								method: "GET",
								success: function (data) {
										var exchangeRateEUR = data.find(rate => rate.Cur_Abbreviation === "EUR")?.Cur_OfficialRate || 1;
										var totalCostBYN = totalCostEUR * exchangeRateEUR; 
										sap.m.MessageToast.show("Стоимость всех товаров в белорусских рублях: " + totalCostBYN.toFixed(2));
								},
								error: function () {
										sap.m.MessageToast.show("Ошибка при получении курса валюты.");
								}
						});
					},
					error: function(oError) {
						console.error("Error fetching data:", oError);
						sap.m.MessageToast.show("Ошибка при получении данных о товарах.");
					}
			});
		},

		onDeleteButtonPress(oEvent) {
			const oBindingContext = oEvent.getSource().getBindingContext("items"),
						sKey = this.oModel.createKey('/zjblessons_base_Items', {
							ItemID: oBindingContext.getProperty('ItemID'),
							HeaderID: oBindingContext.getProperty('HeaderID')
						});
			
			const sBoxMessage = "Are you sure you want to delete this item?",
						sBoxTitle = "Confirm Deletion";
				
			sap.m.MessageBox.warning(sBoxMessage, {
				title: sBoxTitle,
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: (oAction) => {
						if (oAction === sap.m.MessageBox.Action.OK) {
							this.oModel.remove(sKey, {
									success: () => {
										sap.m.MessageToast.show("Item deleted successfully.");
										this.oModel.refresh(true);
									},
									error: (oError) => {
										sap.m.MessageBox.error("Failed to delete item: " + oError.message);
									}
							});
						}
				}
			});
		},

		onEditButtonPress: async function (oEvent) {
			const oBindingContext = oEvent.getSource().getBindingContext("items"),
						itemID = oBindingContext.getProperty("ItemID"),
						headerID = oBindingContext.getProperty("HeaderID"),
						sPath = `/zjblessons_base_Items(ItemID='${itemID}',HeaderID='${headerID}')`;

			await this.getOwnerComponent()._loadCreateItem(false);

			this._loadData(sPath);
		},

		_loadData: function (sPath) {
			this.oModel.read(sPath, {
					success: () => {
						const oContext = new sap.ui.model.Context(this.oModel, sPath);
					 	this.getOwnerComponent()._oDialog.setBindingContext(oContext, "items");
					},
					error: (oError) => {
							console.error("Ошибка при загрузке данных для редактирования:", oError);
					}
			});
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