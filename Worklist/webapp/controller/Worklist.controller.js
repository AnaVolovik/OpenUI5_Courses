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
      const oAction = this._PopupDescription._Action,
            iDescription = sap.ui.core.Fragment.byId("PopupDescription","iDescription");

      this._PopupDescription.setBusy(true);

      if (oAction === 'Action1') {
        this.onAction1Press();
      } else if (oAction === 'Action2Multi') {
        this.onAction2Press();
      } else if (oAction === 'Action2MultiBatch') {
        this.onAction2BatchPress();
      }

      if (iDescription) {
        iDescription.setValue("");
      }
    },
    
    onCancelPress: function () {
      this._PopupDescription.setBusy(false);
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

    openPopupDescription: async function (oEvent) {
      const oButton = oEvent.getSource(),
            sAction = oButton.data("action");

      if (!this._PopupDescription) {
        this._PopupDescription = await sap.ui.core.Fragment.load({
            name: "zjblessons.Worklist.view.fragment.PopupDescription",
            controller: this,
            id: "PopupDescription"
        });
        
        this._PopupDescription._Source = oButton;
        this._PopupDescription._Action = sAction;
        this.getView().addDependent(this._PopupDescription);

        this._PopupDescription.open();
      } else {
        this._PopupDescription._Source = oButton;
        this._PopupDescription._Action = sAction;

        this._PopupDescription.open();
      }
    },

    onAction1Press: function() {
      const iParameters = {},
            iDescription = sap.ui.core.Fragment.byId("PopupDescription","iDescription"),
            inputValue = iDescription.getValue();

      if (inputValue === '1' || inputValue === '2') {
        const errorCritical = this.getModel("i18n").getResourceBundle().getText("errorCriticalPopup"),
              errorMessage = this.getModel("i18n").getResourceBundle().getText("errorPopupMsg");

        sap.m.MessageBox.error((errorCritical + ": " + errorMessage), {
          title: errorCritical
        });
        return;
      } else if (inputValue === '3') {
          const errorExecute = this.getModel("i18n").getResourceBundle().getText("errorExecute");

          sap.m.MessageToast.show(errorExecute, {
            duration: 3000,
            autoClose: true
          });
          return;
      } else if (isNaN(inputValue) || inputValue.length > 50) {
        const errorTitle = this.getModel("i18n").getResourceBundle().getText("errorPopup"),
              errorMessage = this.getModel("i18n").getResourceBundle().getText("errorPopupMsg");

        sap.m.MessageBox.error((errorTitle + ": " + errorMessage), {
          title: errorTitle
        });
        return;
      }

      iParameters.ActionExec = {
        ActionID: "Action1",
        iParam1: iDescription.getValue()
      };
      iParameters.fnCallBackAfterSubmit = this.execActionCallBack.bind(this);

      this.performAction(iParameters);
    },

    onAction2Press: function() {
      const iParameters = {},
            iDescription = sap.ui.core.Fragment.byId("PopupDescription", "iDescription"),
            oTable = this.byId("table"),
            aSelectedItems = oTable.getSelectedItems().map(item => item.getBindingContext().getObject()),
            inputValue = iDescription.getValue();
      
      if (isNaN(inputValue) || inputValue.length > 50) {
        const errorTitle = this.getModel("i18n").getResourceBundle().getText("errorPopup"),
              errorMessage = this.getModel("i18n").getResourceBundle().getText("errorPopupMsg");

        sap.m.MessageBox.error((errorTitle + ": " + errorMessage), {
          title: errorTitle
        });
        return;
      }
      
      iParameters.ActionExec = {
        ActionID: "Action2Multi",
        iParam1: iDescription.getValue(),
        SelectedItems: aSelectedItems
      };
      iParameters.fnCallBackAfterSubmit = this.execActionCallBack.bind(this);

      this.performAction(iParameters);
    },
    
    onAction2BatchPress: function() {
      const iParameters = {},
            iDescription = sap.ui.core.Fragment.byId("PopupDescription", "iDescription"),
            oTable = this.byId("table"),
            aSelectedItems = oTable.getSelectedItems().map(item => item.getBindingContext().getObject()),
            inputValue = iDescription.getValue();

      if (isNaN(inputValue) || inputValue.length > 50) {
        const errorTitle = this.getModel("i18n").getResourceBundle().getText("errorPopup"),
              errorMessage = this.getModel("i18n").getResourceBundle().getText("errorPopupMsg");

        sap.m.MessageBox.error((errorTitle + ": " + errorMessage), {
          title: errorTitle
        });
        return;
      }

      iParameters.ActionExec = {
        ActionID: "Action2MultiBatch",
        iParam1: iDescription.getValue(),
        SelectedItems: aSelectedItems
      };
      iParameters.fnCallBackAfterSubmit = this.execActionCallBack.bind(this);

      this.performAction(iParameters);
    },

    performAction: function(iParameters) {
      switch (iParameters.ActionExec.ActionID) {
        case "Action1":
          this.updateDescriptions(iParameters.ActionExec.iParam1);
          break;
        case "Action2Multi":
          this.updateDescriptions(iParameters.ActionExec.iParam1, false, iParameters.ActionExec.SelectedItems);
          break;
        case "Action2MultiBatch":
          this.updateDescriptions(iParameters.ActionExec.iParam1, true, iParameters.ActionExec.SelectedItems);
          break;
      }

      if (iParameters.fnCallBackAfterSubmit) {
        iParameters.fnCallBackAfterSubmit({ Success: true });
      }
    },

    updateDescriptions: function(newDescription, isBatch = false, selectedItems = []) {
      const oModel = this.getView().getModel(),
            aData = oModel.oData;

      const entries = Object.keys(aData).map(key => ({
        HeaderID: key.replace("zjblessons_base_Headers('", "").replace("')", ""),
        ...aData[key]
      }));

      const showMessage = (isSuccess) => {
        const message = isSuccess 
          ? this.getResourceBundle().getText("successMsgToast") 
          : this.getResourceBundle().getText("errorMsgToast");
        sap.m.MessageToast.show(message);
      };

      if (!selectedItems.length) {
        for (let i = 0; i < entries.length; i++) {
          entries[i].Description = newDescription;
        }

        entries.forEach(entry => {
          const sPath = `/zjblessons_base_Headers('${entry.HeaderID}')`;
          this.getModel().setProperty(`${sPath}/Description`, entry.Description);
        });

        this.getModel().submitChanges({
          success: () => {
            showMessage(true);
          },
          error: () => showMessage(false)
        });
      } else {
          if (isBatch) {
            const oModel = this.getView().getModel();
            oModel.setUseBatch(isBatch);

            selectedItems.forEach(item => {
              const index = entries.findIndex(data => data.HeaderID === item.HeaderID);
              if (index !== -1) {
                entries[index].Description = newDescription;
                const sPath = `/zjblessons_base_Headers('${entries[index].HeaderID}')`;
                this.getModel().setProperty(`${sPath}/Description`, entries[index].Description);
              }
            });

            this.getModel().submitChanges({
              success: () => {
                showMessage(true);
              },
              error: () => showMessage(false)
            });
          } else {
            const oModel = this.getView().getModel();
            oModel.setUseBatch(isBatch);

            selectedItems.forEach(item => {
              const index = entries.findIndex(data => data.HeaderID === item.HeaderID);
              if (index !== -1) {
                entries[index].Description = newDescription;
                const sPath = `/zjblessons_base_Headers('${entries[index].HeaderID}')`;

                this.getModel().update(sPath, { Description: entries[index].Description }, {
                  success: () => {
                    showMessage(true);
                  },
                  error: () => showMessage(false)
                });
              }
            });
          }
      }
    },

    execActionCallBack: function(iParameters) {
      if (iParameters.Success === false) {return;}
      this.resetSelections();
      this.onActionComplete();

      setTimeout(() => {
        if (this._PopupDescription !== undefined) {this._PopupDescription.setBusy(false);}
        this._PopupDescription.close();
      }, 2000);
    },

    resetSelections: function() {
      const oTable = this.byId("table");
      if (oTable) {
        oTable.removeSelections(true);
      }
    },

    onActionComplete: function() {
      this.resetSelections();
      this._bindTable();
    },

  });
  }
);