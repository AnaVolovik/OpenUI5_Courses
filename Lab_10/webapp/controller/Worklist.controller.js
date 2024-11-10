sap.ui.define([
  "Lab_10/Lab_10/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "Lab_10/Lab_10/model/formatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Sorter) {
  "use strict";

  return BaseController.extend("Lab_10.Lab_10.controller.Worklist", {

    formatter: formatter,

    onInit : function () {
      const oModel = this.getOwnerComponent().getModel(),
            sPath = "/zjblessons_base_Headers";

      const oViewModel = new JSONModel({
        sCount: "0",
        sIconTHKey: 'All',
        isBusy: true
      });
      this.setModel(oViewModel, "worklistView");

      const oDataPromise = new Promise((resolve, reject) => {
        oModel.read(sPath, {
          success: (oData) => {
            this.oJsonModel = new sap.ui.model.json.JSONModel(oData.results);
            this.oJsonModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

            const aData = this.oJsonModel.getData();
            aData.forEach((item, index) => {
              item.order = index + 1;
            });
            this.oJsonModel.setData(aData);

            this.getView().setModel(this.oJsonModel, "myJsonModel");

            resolve(this.oJsonModel);
          },
          error: (oError) => {
            console.error("Error fetching data", oError);
            oViewModel.setProperty("/isBusy", false);
            reject(oError);
          }
        });
      });

      oDataPromise
        .then((oJsonModel) => {
          this._setDefaultSorting();

          this._getTableCounter(oJsonModel);

          oViewModel.setProperty("/isBusy", false);
        })
        .catch((oError) => {
          oViewModel.setProperty("/isBusy", false);
          console.error("Error during data fetch:", oError);
        });
    },

    _setDefaultSorting() {
      const oTable = this.byId("table"),
            oBinding = oTable.getBinding("items");

      const oDefaultSorter = new sap.ui.model.Sorter("order", false);
      oBinding.sort([oDefaultSorter]);
    },

    _getTableCounter(oJsonModel) {
      const oModelData = oJsonModel.getData(),
            oTable = this.byId("table"),
            oBinding = oTable.getBinding("items");

      if (oBinding) {
        oJsonModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
        const iCount = oModelData.length;
        this.getView().getModel("worklistView").setProperty("/sCount", iCount);
      }
    },

    onIconTabHeaderSelect(oEvent) {
      const sSelectedKey = oEvent.getParameter("selectedKey"),
            oTable = this.byId("table"),
            oBinding = oTable.getBinding("items");

      this.getModel("worklistView").setProperty("/sIconTHKey", sSelectedKey);

      let aFilters = [],
          oCombinedFilter;

      aFilters.push(new Filter("DocumentNumber", sap.ui.model.FilterOperator.Contains, "DocumentNumber"));
      aFilters.push(new Filter("PlantText", sap.ui.model.FilterOperator.StartsWith, "Plant"));

      if (sSelectedKey === 'FilteredAnd') {
        oCombinedFilter = new Filter({
          filters: aFilters,
          and: true
        });
      }
      else if (sSelectedKey === 'FilteredOr') {
        oCombinedFilter = new Filter({
            filters: aFilters,
            and: false
        });
      }
      else {
        oBinding.filter([]);
        return;
      }

      oBinding.filter(oCombinedFilter);
    },

    onChangeDescription (oEvent) {
      const oInput = oEvent.getSource(),
            oBindingContext = oInput.getBindingContext("myJsonModel"),
            sPath = oBindingContext.getPath(),
            sNewValue = oEvent.getParameter("newValue");

      oBindingContext.getModel().setProperty(sPath + "/Description", sNewValue);
      oBindingContext.getModel().refresh(true);
    },

    onGroupRegionText () {
      const oTable = this.byId("table"),
            oBinding = oTable.getBinding("items"),
            bGrouped = oBinding.isGrouped();

      const oViewModel = this.getView().getModel("worklistView");
      oViewModel.setProperty("/isBusy", true);

      if (bGrouped) {
        const oDefaultSorter = new Sorter("order", false);
        oBinding.sort([oDefaultSorter]);
      } else {
        const oSorterRegionText = new Sorter("RegionText", false, true),
              oSorterPlantText = new Sorter("PlantText", false);

        oBinding.sort([oSorterRegionText, oSorterPlantText]);
      }

      oViewModel.setProperty("/isBusy", false);
    },

    onDropSelectedItem(oEvent) {
      const oDroppedItem = oEvent.getParameter("droppedControl"),
            oDraggedItem = oEvent.getParameter("draggedControl"),
            sDropPosition = oEvent.getParameter("dropPosition"),
            oModel = this.getView().getModel("myJsonModel"),
            aData = oModel.getProperty("/");
  
      const sDraggedItemPath = oDraggedItem.getBindingContext("myJsonModel").getPath(),
            sDroppedItemPath = oDroppedItem.getBindingContext("myJsonModel").getPath();
  
      const oDraggedData = oModel.getProperty(sDraggedItemPath),
            oDroppedData = oModel.getProperty(sDroppedItemPath);
  
      const iDraggedOrder = oDraggedData.order,
            iDroppedOrder = oDroppedData.order;

      let iNewOrder;

      if (iDraggedOrder === iDroppedOrder) return;

      sDropPosition === "After" ? iNewOrder = iDroppedOrder + 1 : iNewOrder = iDroppedOrder;

      aData.forEach((item) => {
        oDraggedData.order = iNewOrder;

        if (iDraggedOrder < iDroppedOrder && sDropPosition === "After") {
          if (item.order > iDraggedOrder && item.order <= iDroppedOrder + 1) {
            item.order -= 1;
          }
          else if (item.order > iDroppedOrder) {
            item.order += 0;
          }

        } else if (iDraggedOrder < iDroppedOrder && sDropPosition === "Before") {
          if (item.order > iDraggedOrder && item.order <= iDroppedOrder) {
            item.order -= 1;
          }
          else if (item.order > iDroppedOrder) {
            item.order += 0;
          }

        } else if (iDraggedOrder > iDroppedOrder && sDropPosition === "After") {
            if (item.order > iDraggedOrder && item.order <= iDroppedOrder) {
              item.order -= 1;
            }
            else if (item.order > iDroppedOrder) {
              item.order += 1;
            }

        } else if (iDraggedOrder > iDroppedOrder && sDropPosition === "Before") {
            if (item.order > iDraggedOrder && item.order < iDroppedOrder) {
              item.order -= 1;
            }
            else if (item.order >= iDroppedOrder) {
              item.order += 1;
            }
        }
      });

      oModel.setProperty("/", aData);

      this._setDefaultSorting();
    }
  });
}
);