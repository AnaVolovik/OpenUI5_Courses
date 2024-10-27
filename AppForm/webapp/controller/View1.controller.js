sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("AppForm.controller.View1", {
		_onNameInputLiveChange: function(oEvent) {
			const nameRegex = /^[А-Яа-яЁё\s-]+$/;
			const sValue = oEvent.getParameter("value");

			if (nameRegex.test(sValue)) {
					oEvent.getSource().setValueState("None");
					oEvent.getSource().setValueStateText(""); 
			} else {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Поле может содержать только кириллицу, пробелы и дефисы");
			}
		},

		_onPhoneInputLiveChange: function(oEvent) {
			const phoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/,
						sValue = oEvent.getParameter("value");

			if (phoneRegex.test(sValue)) {
					oEvent.getSource().setValueState("None");
					oEvent.getSource().setValueStateText("");
			} else {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Введите номер в международном формате, начиная с +375");
			}
		}

	});
});