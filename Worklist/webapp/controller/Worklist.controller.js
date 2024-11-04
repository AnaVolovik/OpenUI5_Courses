sap.ui.define([
  "zjblessons/Worklist/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "zjblessons/Worklist/model/formatter",
  "sap/ui/model/Filter",
  "sap/ui/model/Sorter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment"
], function (BaseController, JSONModel, formatter, Filter, Sorter, FilterOperator, Fragment) {
  "use strict";

  return BaseController.extend("zjblessons.Worklist.controller.Worklist", {

    formatter: formatter,

    onInit : function () {
      const oViewModel = new JSONModel({
        sCount: '0',
        sIconTHKey: 'All',
        action2Enabled: false
      });
      this.setModel(oViewModel, "worklistView");

      const oTable = this.byId("table");
      oTable.setMode("None");
    },

    onBeforeRendering: function () {
      this._bindTable();
    },
    
    _bindTable() {
      const oTable = this.getView().byId('table');

      oTable.bindItems({
        path: '/zjblessons_base_Headers',
        sorter: [new Sorter('DocumentDate', true)],
        template: this._getTableTemplate(),
        filters: this._getTableFilters(),
        urlParameters: {
          $select: 'HeaderID,DocumentNumber,DocumentDate,PlantText,RegionText,Description,Created,Version'
        },
        events: {
          dataRequested: (oData) => {
            this._getTableCounter();
          }
        }
      });
    },

    _getTableCounter() {
      this.getModel().read('/zjblessons_base_Headers/$count', {
        success: (sCount) => {
          this.getModel('worklistView').setProperty('/sCount', sCount);
        }
      })
    },
    
    _getTableTemplate() {
      const oTemplate = new sap.m.ColumnListItem({
        highlight: "{= ${Version} === 'A' ? 'Success' : 'Error'}",
        type: 'Navigation',
        navigated: true,
        cells: [
          new sap.m.Text({
            text: '{DocumentNumber}'
          }),
          new sap.m.Text({
            text: {
              path: 'DocumentDate',
              formatter: this.formatter.formatDate.bind(this.formatter)
            }
          }),
          new sap.m.Text({
            text: '{PlantText}'
          }),
          new sap.m.Text({
            text: '{RegionText}'
          }),
          new sap.m.Text({
            text: '{Description}'
          }),
          new sap.m.Text({
            text: {
              path: 'Created',
              formatter: this.formatter.formatDate.bind(this.formatter)
            }
          }),
          new sap.m.Switch({
            state: "{= ${Version} === 'D'}",
            change: this.onChangeVersion.bind(this)
          }),
          new sap.m.Button({
            type: 'Transparent',
            icon: this.getResourceBundle().getText('iDecline'),
            press: this.onPressDelete.bind(this)
          })
        ]
      });
      
      return oTemplate;
    },

    _getTableFilters() {
      const oModel = this.getModel('worklistView'),
            sSelectedKey = oModel.getProperty('/sIconTHKey');

      return sSelectedKey === 'All' ? [] : [new Filter('Version', FilterOperator.EQ, 'D')];
    },

    onPressDelete(oEvent){
      const oBindingContext = oEvent.getSource().getBindingContext(),
            sKey = this.getModel().createKey('/zjblessons_base_Headers', {
              HeaderID: oBindingContext.getProperty('HeaderID')
            }),
            sPath = oBindingContext.getPath(),
            sVersion = this.getModel().getProperty(`${sPath}/Version`);
          
      if (sVersion === 'D') {
        const sBoxMessage = this.getResourceBundle().getText("MessageBoxMessage"),
              sBoxTitle = this.getResourceBundle().getText("MessageBoxTitle");
        
        sap.m.MessageBox.confirm(sBoxMessage, {
          title: sBoxTitle,
          onClose: (oAction) => {
            if (oAction === sap.m.MessageBox.Action.OK) {
              this.getModel().remove(sKey, {
                  success: (oData) => {
                    console.log('Delete successful:', oData);
                  },
                  error: (oError) => {
                    console.error('Delete failed:', oError);
                  }
              });
            } else {
              console.log('Delete action canceled');
            }
          }
        });
        
      } else {
        const sMessageToast = this.getResourceBundle().getText("AlertToastMessage");
        sap.m.MessageToast.show(sMessageToast);
      }
    },

    onPressRefresh() {
      const sMessageToast = this.getResourceBundle().getText("MessageToastMessage");
      this._bindTable();
      sap.m.MessageToast.show(sMessageToast);
    },

    onPressCreate() {
      this._loadCreateDialog();
    },

    _loadCreateDialog : async function () {
      if (!this._oDialog) {
        this._oDialog = await Fragment.load({
          name: "zjblessons.Worklist.view.fragment.CreateDialog",
          controller: this,
          id: "DialogAddNewRow"
        }).then(oDialog => {
          this.getView().addDependent(oDialog);
          return oDialog;
        })
      }
      this._oDialog.open();
    },

    onDialogBeforeOpen(oEvent) {
      const oDialog = oEvent.getSource(),
          oParams = {
            Version: "A",
            HeaderID: "0"
          },
          oEntry = this.getModel().createEntry("/zjblessons_base_Headers", {
            properties: oParams
          });

      oDialog.setBindingContext(oEntry);
    },

    onPressSave(oEvent) {
      const oDialog = this._oDialog,
            oBindingContext = oDialog.getBindingContext(),
            oData = oBindingContext.getObject();

      this.getModel().submitChanges();
      this._oDialog.close();
    },
    
    onPressCancel() {
      this.getModel().resetChanges()
      this._oDialog.close();
    },

    onChangeVersion(oEvent) {
      const sVersion = oEvent.getParameter('state') ? 'D' : 'A',
            sPath = oEvent.getSource().getBindingContext().getPath();

      this.getModel().setProperty(`${sPath}/Version`, sVersion);

      this.getModel().submitChanges({
        success: () => {
          this.getModel().read(sPath, {
            success: (oData) => {
                this.getModel().setProperty(`${sPath}/Version`, oData.Version);
            }
          });
        }
      });
    },

    onSearch(oEvent) {
      const sValue = oEvent.getParameter('query');

      this._searchHandler(sValue);
    },

    _searchHandler(sValue) {
      const oTable = this.getView().byId('table'),
            oFilter = new Filter({
                filters: [
                    new Filter('DocumentNumber', FilterOperator.Contains, sValue),
                    new Filter('PlantText', FilterOperator.EQ, sValue)
                ],
                and: false
            });

      oTable.getBinding('items').filter(oFilter);
    },

    _onDateRangeChange(oEvent) {
      const oTable = this.getView().byId('table'),
            oDateRange = oEvent.getSource(),
            oStartDate = oDateRange.getDateValue(),
            oEndDate = oDateRange.getSecondDateValue(),
            oFilter = new sap.ui.model.Filter("DocumentDate", sap.ui.model.FilterOperator.BT, oStartDate, oEndDate);

      oTable.getBinding('items').filter([oFilter]);
    },

    onItemSelect(oEvent) {
      const oSelectedItem = oEvent.getParameter('listItem'),
            sHeaderId = oSelectedItem.getBindingContext().getProperty('HeaderID');

      this.getRouter().navTo('object', {
        objectId: sHeaderId
      })
    },

    onIconTabHeaderSelect(oEvent) {
      const sSelectedKey = oEvent.getParameter('key');

      this.getModel('worklistView').setProperty('/sIconTHKey', sSelectedKey);
      this._bindTable()
    },


    onExecutePress: function () {
      console.log("Execute button pressed");
      var oAction = this._PopupDescription._Action; 

      if (oAction === 'Action1') {
        console.log("this is onAction1");
        this.onAction1Press();
      } else if (oAction === 'Action2Multi') {
        console.log("this is onAction2Press");
        this.onAction2Press();
      } else if (oAction === 'Action2MultiBatch') {
        console.log("this is onAction2BatchPress");
        this.onAction2BatchPress();
      } else if (oAction === 'PostError') {
        this.PostError();
      }
      this._PopupDescription.close();
    },
    
    onCancelPress: function () {
      console.log("Cancel button pressed");
      this._PopupDescription.close();
    },

    onMultiSelectPress: function() {
      const oTable = this.byId("table");
      const bSelected = oTable.getMode() === "MultiSelect" ? false : true;

      oTable.setMode(bSelected ? "MultiSelect" : "None");

      const oViewModel = this.getView().getModel("worklistView");

      const bEnabled = bSelected;
      oViewModel.setProperty("/action2Enabled", bEnabled);
    },

    openPopupDescription: async function (oEvent, action) {
      //TODO oEvent
      if (!this._PopupDescription) {
        this._PopupDescription = await sap.ui.core.Fragment.load({
          name: "zjblessons.Worklist.view.fragment.PopupDescription",
          controller: this,
          id: "PopupDescription"
        });

        this._PopupDescription._Action = action;
        this.getView().addDependent(this._PopupDescription);

        this._PopupDescription.open();
      } else {
        this._PopupDescription._Action = action;
        this._PopupDescription.open();
      }
    },

    onAction1Press: function(oEvent) {
      var action = "Action1";
      this.openPopupDescription(oEvent, action);

    },

    onAction2Press: function(oEvent) {
      var action = "Action2Multi";
      this.openPopupDescription(oEvent, action);

    },
    
    onAction2BatchPress: function(oEvent) {
      var action = "Action2MultiBatch";
      this.openPopupDescription(oEvent, action);

    },


  });
  }
);