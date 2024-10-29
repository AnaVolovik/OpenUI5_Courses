sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/model/json/JSONModel',
	'sap/f/FlexibleColumnLayoutSemanticHelper',
	'sap/f/library',
	"sap/ui/model/odata/v2/ODataModel"
], function(UIComponent, JSONModel, FlexibleColumnLayoutSemanticHelper, fioriLibrary, ODataModel) {
	'use strict';

	return UIComponent.extend('MasterDetail.Component', {

		metadata: {
			manifest: 'json'
		},

		init: function () {
			var oRouter;

			UIComponent.prototype.init.apply(this, arguments);
			
			const oDataSourceUri = this.getManifestEntry("sap.app").dataSources.mainService.uri;

			const oModel = new ODataModel(oDataSourceUri, {
				json: true,
				loadMetadataAsync: true 
			});
			
			this.setModel(oModel, "items");

			const oMasterModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oMasterModel, "masterModel");
			
			oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();
		},

		getHelper: function () {
			return this._getFcl().then(function(oFCL) {
				var oSettings = {
					defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded,
					initialColumnsCount: 2,
					maxColumnsCount: 2
				};
				return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
			 });
		},

		_onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel("masterModel"),
				sLayout = oEvent.getParameters().arguments.layout,
				oNextUIState;

			if (!sLayout) {
				this.getHelper().then(function(oHelper) {
					oNextUIState = oHelper.getNextUIState(0);
					oModel.setProperty("/layout", oNextUIState.layout);
				});
				return;
			}

			oModel.setProperty("/layout", sLayout);
		},

		_getFcl: function () {
			return new Promise(function(resolve, reject) {
				var oFCL = this.getRootControl().byId('flexibleColumnLayout');
				if (!oFCL) {
					this.getRootControl().attachAfterInit(function(oEvent) {
						resolve(oEvent.getSource().byId('flexibleColumnLayout'));
					}, this);
					return;
				}
				resolve(oFCL);

			}.bind(this));
		}
	});
});