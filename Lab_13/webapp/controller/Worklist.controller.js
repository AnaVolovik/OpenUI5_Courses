sap.ui.define([
  "Lab_13/Lab_13/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "Lab_13/Lab_13/model/Formatter"
], function (BaseController, JSONModel, Formatter) {
  "use strict";

  return BaseController.extend("Lab_13.Lab_13.controller.Worklist", {
    formatter: Formatter,

    jsonAnnotation: new JSONModel({
      RequestAtLeast: "",
      Annotation: [
        {
          "id": "HeaderID",
          "label": "{i18n>HeaderID}",
          "Column": {
            "order": 1,
            "sortProperty": "HeaderID",
            "visible": true,
            "type": "text",
            "select": "HeaderID",
            "text": "{HeaderID}"
          },
          "Filter": {
            "order": 2,
            "mode": "SingleSelectMaster",
            "filter": "HeaderID",
            "text": "HeaderID",
            "sort": "HeaderID",
            "key": "HeaderID",
            "entitySet": "zjblessons_base_Headers",
            "visible": true,
            "hidden": false
          }
        },
        {
          "id": "MaterialID",
          "label": "{i18n>MaterialID}",
          "Column": {
            "order": 3,
            "sortProperty": "MaterialID",
            "visible": true,
            "type": "text",
            "select": "MaterialID",
            "text": "{MaterialID}"
          },
          "Filter": {
            "order": 4,
            "mode": "MultiSelect",
            "filter": "MaterialID",
            "text": "MaterialID",
            "sort": "MaterialID",
            "key": "MaterialID",
            "entitySet": "zjblessons_base_Materials",
            "visible": true,
            "hidden": false
          }
        },
        {
          "id": "GroupID",
          "label": "{i18n>GroupID}",
          "Column": {
            "order": 5,
            "sortProperty": "GroupID",
            "visible": true,
            "type": "text",
            "select": "GroupID",
            "text": "{GroupID}"
          },
          "Filter": {
            "order": 6,
            "mode": "MultiSelect",
            "filter": "GroupID",
            "text": "GroupID",
            "sort": "GroupID",
            "key": "GroupID",
            "entitySet": "zjblessons_base_Groups",
            "visible": true,
            "hidden": false
          }
        },
        {
          "id": "SubGroupID",
          "label": "{i18n>SubGroupID}",
          "Column": {
            "order": 7,
            "sortProperty": "SubGroupID",
            "visible": true,
            "type": "text",
            "select": "SubGroupID",
            "text": "{SubGroupID}"
          },
          "Filter": {
            "order": 8,
            "mode": "MultiSelect",
            "filter": "SubGroupID",
            "text": "SubGroupID",
            "sort": "SubGroupID",
            "key": "SubGroupID",
            "entitySet": "zjblessons_base_SubGroups",
            "visible": true,
            "hidden": false
          }
        },
        {
          "id": "Quantity",
          "label": "{i18n>Quantity}",
          "Column": {
            "order": 9,
            "sortProperty": "Quantity",
            "visible": true,
            "type": "number",
            "select": "Quantity",
            "text": "{Quantity}"
          },
          "Filter": {
            "order": 10,
            "mode": "SearchField",
            "filter": "Quantity",
            "text": "Quantity",
            "sort": "Quantity",
            "key": "Quantity",
            "filterKey": "Quantity",
            "entitySet": "zjblessons_base_Items",
            "visible": true,
            "hidden": false
          }
        },
        {
          "id": "Price",
          "label": "{i18n>Price}",
          "Column": {
            "order": 11,
            "sortProperty": "Price",
            "visible": true,
            "type": "number",
            "select": "Price",
            "text": "{Price}"
          },
          "Filter": {
            "order": 12,
            "mode": "SearchField",
            "filter": "Price",
            "text": "Price",
            "sort": "Price",
            "key": "Price",
            "filterKey": "Price",
            "entitySet": "zjblessons_base_Items",
            "visible": true,
            "hidden": false
          }
        },
        {
          "id": "Created",
          "label": "{i18n>Created}",
          "Column": {
            "order": 13,
            "sortProperty": "Created",
            "sortOrder": 1,
            "sort": "desc",
            "visible": true,
            "type": "date",
            "typeFormat":"medium",
            "text": "{Created}"
          },
          "Filter": {
            "order": 14,
            "visible": true,
            "hidden": false,
            "mode": "DateField",
            "datePath": "Created",
            "dateMode": true,
            "entitySet": "zjblessons_base_Items",
            "selectedPeriod": "all",
            "visiblePeriodButtons": "day, week, month, year, all"
          }
        },
        {
          "id": "CreatedBy",
          "label": "{i18n>CreatedBy}",
          "Column": {
            "order": 15,
            "sortProperty": "CreatedBy",
            "visible": true,
            "type": "avatarAndLink",
            "select": "CreatedByAvatar, CreatedByFullName",
          },
          "Filter": {
            "order": 16,
            "mode": "MultiSelect",
            "filter": "CreatedBy",
            "text": "CreatedByFullName",
            "sort": "CreatedBy",
            "image": "CreatedByAvatar",
            "key": "CreatedBy",
            "entitySet": "zjblessons_base_Items",
            "visible": true,
            "hidden": false
          }
        },
        {
          "id": "Modified",
          "label": "{i18n>Modified}",
          "Column": {
            "order": 17,
            "sortProperty": "Modified",
            "sort": "desc",
            "visible": true,
            "type": "dateTime",
            "typeFormat":"medium",
            "text": "{Modified}"
          },
          "Filter": {
            "order": 18,
            "visible": true,
            "hidden": false,
            "mode": "DateField",
            "datePath": "Modified",
            "dateMode": true,
            "entitySet": "zjblessons_base_Items",
            "selectedPeriod": "all",
            "visiblePeriodButtons": "day, week, month, year, all"
          }
        },
        {
          "id": "ModifiedBy",
          "label": "{i18n>ModifiedBy}",
          "Column": {
            "order": 19,
            "sortProperty": "ModifiedBy",
            "visible": true,
            "type": "avatarAndLink",
            "select": "ModifiedByAvatar, ModifiedByFullName",
          },
          "Filter": {
            "order": 20,
            "mode": "MultiSelect",
            "filter": "ModifiedBy",
            "text": "ModifiedByFullName",
            "sort": "ModifiedBy",
            "image": "ModifiedByAvatar",
            "key": "ModifiedBy",
            "entitySet": "zjblessons_base_Items",
            "visible": true,
            "hidden": false
          }
        }
      ]
    }),

    onInit : function () {
      const oViewModel = new JSONModel({});
      this.setModel(oViewModel, "worklistView");

      this.setModel(this.jsonAnnotation, "annotation");
    },

    onPressRefresh:function() {
      this.byId('table').getBinding('rows').refresh();
    },

    prepareSelect: function (oEvent) {
      this.aSorter = oEvent.getParameter("aSorts");
      this.sSelect = oEvent.getParameter("sSelect");

      this.callBindTable();
    },

    callBindTable: function (sPath) {
      if (this.sSelect && this.aFilters) {
      let sRequestAtLeast = this.getModel('annotation').getData().RequestAtLeast;
        this.byId("table").bindRows({
          path: "/zjblessons_base_Items",
          template: new sap.ui.table.Row({}),
          filters: this.aFilters,
          sorter: this.aSorter,
          parameters: {
            select: this.sSelect + (sRequestAtLeast ? ","+ sRequestAtLeast: ''),
          },
        });
      }
    },

    onPressFilterBarChange: function (oEvent) {
      this.aFilters = oEvent.getParameter("OdataFilters");

      this.callBindTable();
    }

  });
}
);