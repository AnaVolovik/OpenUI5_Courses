sap.ui.define([
  'sap/ui/core/UIComponent',
  'sap/ui/model/json/JSONModel',
  'sap/f/FlexibleColumnLayoutSemanticHelper',
  'sap/f/library',
  "sap/ui/model/odata/v2/ODataModel",
  "sap/ui/core/Fragment"
], function(UIComponent, JSONModel, FlexibleColumnLayoutSemanticHelper, fioriLibrary, ODataModel, Fragment) {
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
        useBatch: true,
        defaultBindingMode: "TwoWay"
      });
      
      this.setModel(oModel, "items");

      const oMasterModel = new sap.ui.model.json.JSONModel({
        isEditable: true,
        isVisible: false
      });
      this.setModel(oMasterModel, "masterModel");
      
      oRouter = this.getRouter();
      oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
      oRouter.initialize();
    },

    _loadCreateItem : async function (isNewItem = true) {
      if (this._oDialog) {
        this._oDialog.destroy();
        this._oDialog = null;
      }
      this._oDialog = await Fragment.load({
        name: "MasterDetail.view.fragment.CreateItem",
        controller: this,
        id: "DialogAddNewRow"
      }).then(oDialog => {
        this.getRootControl().addDependent(oDialog);
        return oDialog;
      });

      this._oDialog.isNewItem = isNewItem;

      this._oDialog.open();
    },

    onDialogBeforeOpen(oEvent) {
      const oModel = this.getModel("items"),
            oMasterModel = this.getModel("masterModel"),
            oDialog = oEvent.getSource();

      if (oDialog.isNewItem) {
        const oDialog = oEvent.getSource(),
              oParams = {
                ItemID: "0"
              },
              oEntry = oModel.createEntry("/zjblessons_base_Items", {
                properties: oParams
              });
      
        oDialog.setBindingContext(oEntry, "items");
        oMasterModel.setProperty("/isEditable", true);
        oMasterModel.setProperty("/isVisible", false);
      } else {
        oMasterModel.setProperty("/isEditable", false);
        oMasterModel.setProperty("/isVisible", true);
      }
    },

    onPressSave() {
      const oDialog = this._oDialog,
            oBindingContext = oDialog.getBindingContext("items"),
            oData = oBindingContext.getObject();

      const oModel = this.getModel("items");

      oData.Quantity = Number(oData.Quantity);
      oData.Price = Number(oData.Price);
      delete oData.Instance;

      oModel.submitChanges({
        success: () => {
          sap.m.MessageToast.show("Record saved successfully");
          oModel.refresh(true);
          this._oDialog.close();
        },
        error: (oError) => {
          sap.m.MessageBox.error("Error while saving the record: " + oError.message);
        }
      });
    },

    onPressCancel() {
      const oModel = this.getModel("items");
      oModel.resetChanges()
      this._oDialog.destroy();
      this._oDialog = null;
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