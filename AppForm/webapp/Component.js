sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"AppForm/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("AppForm.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);

			const oResourceBundle = this.getModel("i18n").getResourceBundle();

			const oCityModel = new JSONModel({
				cities: [
						{ id: "Minsk", name: oResourceBundle.getText("cityMinsk") },
						{ id: "Grodno", name: oResourceBundle.getText("cityGrodno") },
						{ id: "Brest", name: oResourceBundle.getText("cityBrest") },
						{ id: "Gomel", name: oResourceBundle.getText("cityGomel") },
						{ id: "Mogilev", name: oResourceBundle.getText("cityMogilev") },
						{ id: "Vitebsk", name: oResourceBundle.getText("cityVitebsk") }
				]
			});
			this.setModel(oCityModel, "cityModel");

			const oNavButtons = new JSONModel({
				buttons: [
					{ id: "Main", name: oResourceBundle.getText("navButtonMain"), icon: oResourceBundle.getText("iconMain") },
					{ id: "Registration", name: oResourceBundle.getText("navButtonRegistration"), icon: oResourceBundle.getText("iconRegistr") },
					{ id: "Login", name: oResourceBundle.getText("navButtonLogin"), icon: oResourceBundle.getText("iconLogin") },
					{ id: "Support", name: oResourceBundle.getText("navButtonSupport"), icon: oResourceBundle.getText("iconHelp") }
				]
			});
			this.setModel(oNavButtons, "navButtons");

			const oAppModel = new sap.ui.model.json.JSONModel({
        busy: false
			});
			this.setModel(oAppModel, "appModel");

			this.setModel(models.createDeviceModel(), "device");
		}
	});
});