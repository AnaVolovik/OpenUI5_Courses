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
		},

		_onEmailInputLiveChange: function(oEvent) {
			const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
			const sValue = oEvent.getParameter("value");

			if (emailRegex.test(sValue)) {
					oEvent.getSource().setValueState("None");
					oEvent.getSource().setValueStateText(""); 
			} else {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Введите корректный адрес электронной почты");
			}
		},

		_onPasswordInputLiveChange: function(oEvent) {
			const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
			const sValue = oEvent.getParameter("value");

			if (passwordRegex.test(sValue)) {
					oEvent.getSource().setValueState("None");
					oEvent.getSource().setValueStateText(""); 
			} else {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Пароль должен содержать латинские буквы и цифры, и быть длиной не менее 6 символов.");
			}
		},

		_onRepeatPasswordInputLiveChange: function(oEvent) {
			const sPassword = this.getView().byId("idPassword").getValue();
			const sRepeatPassword = oEvent.getParameter("value");

			if (sRepeatPassword === "") {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Повторите пароль");
			} else if (sRepeatPassword === sPassword) {
					oEvent.getSource().setValueState("None");
					oEvent.getSource().setValueStateText(""); 
			} else {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValueStateText("Пароли не совпадают");
			}
		},

		_onOpenUsersAgreement: function() {
			window.open("pdf/UsersAgreement.pdf", "_blank");
		},

		_onOpenPlatformRules: function() {
				window.open("pdf/PlatformRules.pdf", "_blank");
		}

	});
});