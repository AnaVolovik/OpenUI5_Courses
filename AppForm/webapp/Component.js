sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"AppForm/model/models",
	"sap/ui/model/json/JSONModel",
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("AppForm.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);

			const oCityModel = new JSONModel({
				cities: [
						{ id: "Minsk", name: "Минск" },
						{ id: "Grodno", name: "Гродно" },
						{ id: "Brest", name: "Брест" },
						{ id: "Gomel", name: "Гомель" },
						{ id: "Mogilev", name: "Могилев" },
						{ id: "Vitebsk", name: "Витебск" }
				]
			});
			this.setModel(oCityModel, "cityModel");

			const oAppModel = new sap.ui.model.json.JSONModel({
        busy: false
			});
			this.setModel(oAppModel, "appModel");

			this.setModel(models.createDeviceModel(), "device");
		}
	});
});