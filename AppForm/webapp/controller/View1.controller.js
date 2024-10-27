sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("AppForm.controller.View1", {
		_onNameInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource();
			this.checkField(oField, /^[А-Яа-яЁё\s-]+$/, "Поле может содержать только кириллицу, пробелы и дефисы");
		},
		
		_onPhoneInputLiveChange: function(oEvent) {
				const oField = oEvent.getSource();
				this.checkField(oField, /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, "Введите номер в международном формате, начиная с +375");
		},
		
		_onEmailInputLiveChange: function(oEvent) {
				const oField = oEvent.getSource();
				this.checkField(oField, /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/, "Введите корректный адрес электронной почты");
		},
		
		_onPasswordInputLiveChange: function(oEvent) {
				const oField = oEvent.getSource();
				this.checkField(oField, /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Пароль должен содержать латинские буквы и цифры, и быть длиной не менее 6 символов.");
		},
		
		_onConfirmPasswordInputLiveChange: function(oEvent) {
				const oField = oEvent.getSource();
				const oPassword = this.getView().byId("idPassword");
				const sConfirmPassword = oField.getValue().trim();
		
				if (sConfirmPassword === "") {
						oField.setValueState("Error");
						oField.setValueStateText("Повторите пароль");
				} else if (sConfirmPassword !== oPassword.getValue()) {
						oField.setValueState("Error");
						oField.setValueStateText("Пароли не совпадают");
				} else {
						oField.setValueState("None");
				}
		},

		_onOpenUsersAgreement: function() {
			window.open("pdf/UsersAgreement.pdf", "_blank");
		},

		_onOpenPlatformRules: function() {
				window.open("pdf/PlatformRules.pdf", "_blank");
		},

		_onCheckboxSelect: function(oEvent) {
			const oCheckbox = oEvent.getSource();
			const oRegisterButton = this.getView().byId("idRegisterButton");
	
			oRegisterButton.setEnabled(oCheckbox.getSelected());
		},

		checkField: function(oField, regex, errorMessage) {
			const value = oField.getValue().trim();
			if (value === "" || (regex && !regex.test(value))) {
					oField.setValueState("Error");
					oField.setValueStateText(errorMessage);
					return false;
			} else {
					oField.setValueState("None");
					return true;
			}
		},
		
		_onRegisterButtonPress: function() {
			const oName = this.getView().byId("idName");
			const oSurname = this.getView().byId("idSurname");
			const oPhone = this.getView().byId("idPhoneNumber");
			const oEmail = this.getView().byId("idEmail");
			const oPassword = this.getView().byId("idPassword");
			const oConfirmPassword = this.getView().byId("idConfirmPassword");

			let bValid = true;
			let firstInvalidField = null;

			const fields = [
        { field: oName, regex: /^[А-Яа-яЁё\s-]+$/, message: "Поле обязательно для заполнения и может содержать только кириллицу, пробелы и дефисы" },
        { field: oSurname, regex: /^[А-Яа-яЁё\s-]+$/, message: "Поле обязательно для заполнения и может содержать только кириллицу, пробелы и дефисы" },
        { field: oPhone, regex: /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, message: "Введите номер в международном формате, начиная с +375" },
        { field: oEmail, regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/, message: "Введите корректный адрес электронной почты" },
        { field: oPassword, regex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, message: "Пароль должен содержать латинские буквы и цифры, и быть длиной не менее 6 символов." },
        { field: oConfirmPassword, regex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, message: "Пароль должен содержать латинские буквы и цифры, и быть длиной не менее 6 символов." }
   		];

			for (const { field, regex, message } of fields) {
        const isValid = this.checkField(field, regex, message);
        bValid &= isValid;
        if (!isValid && !firstInvalidField) {
            firstInvalidField = field;
        }
    	}

			if (!bValid && firstInvalidField) {
        firstInvalidField.focus();
        setTimeout(() => {
            const oDomRef = firstInvalidField.getDomRef();
            if (oDomRef) {
                oDomRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);
    	}
		}

	});
});