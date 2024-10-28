sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("AppForm.controller.View1", {
		onInit: function() {
			this.oName = this.getView().byId("idName");
			this.oSurname = this.getView().byId("idSurname");
			this.oPhone = this.getView().byId("idPhoneNumber");
			this.oEmail = this.getView().byId("idEmail");
			this.oPassword = this.getView().byId("idPassword");
			this.oConfirmPassword = this.getView().byId("idConfirmPassword");
			this.oCheckbox = this.getView().byId("idTermsCheckbox");
			this.oRegisterButton = this.getView().byId("idRegisterButton");
			this.oMessageStrip = this.getView().byId("messageStrip");
			console.log(this.oAppModel);
		},

		_onNameInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource();
			const sCheckFieldNames = this.getView().getModel("i18n").getResourceBundle().getText("CheckFieldNames");
			this.checkField(oField, /^[А-Яа-яЁё\s-]+$/, sCheckFieldNames);
		},
		
		_onPhoneInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource();
			const sCheckFieldPhone = this.getView().getModel("i18n").getResourceBundle().getText("CheckFieldPhone");
			this.checkField(oField, /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, sCheckFieldPhone);
		},
		
		_onEmailInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource();
			const sCheckFieldEmail = this.getView().getModel("i18n").getResourceBundle().getText("CheckFieldEmail");
			this.checkField(oField, /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/, sCheckFieldEmail);
		},
		
		_onPasswordInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource();
			const sCheckFieldPassword = this.getView().getModel("i18n").getResourceBundle().getText("CheckFieldPassword");
			this.checkField(oField, /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, sCheckFieldPassword);
		},
		
		_onConfirmPasswordInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource();
			const sConfirmPassword = oField.getValue().trim();
			const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

    	const sEmptyPasswordText = oResourceBundle.getText("ConfirmPasswordEmpty");
    	const sPasswordsMismatchText = oResourceBundle.getText("PasswordsDoNotMatch");
	
			if (sConfirmPassword === "") {
				oField.setValueState("Error");
				oField.setValueStateText(sEmptyPasswordText);
			} else if (sConfirmPassword !== this.oPassword.getValue()) {
				oField.setValueState("Error");
				oField.setValueStateText(sPasswordsMismatchText);
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
			this.oRegisterButton.setEnabled(oCheckbox.getSelected());
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
    	const oAppModel = this.getView().getModel("appModel");
			const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			let bValid = true;
			let firstInvalidField = null;

			const fields = [
        { field: this.oName, regex: /^[А-Яа-яЁё\s-]+$/, message: oResourceBundle.getText("NameFieldMessage")},
        { field: this.oSurname, regex: /^[А-Яа-яЁё\s-]+$/, message: oResourceBundle.getText("NameFieldMessage")},
        { field: this.oPhone, regex: /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, message: oResourceBundle.getText("PhoneFieldMessage")},
        { field: this.oEmail, regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/, message: oResourceBundle.getText("EmailFieldMessage")},
        { field: this.oPassword, regex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, message: oResourceBundle.getText("PasswordFieldMessage")},
        { field: this.oConfirmPassword, regex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, message: oResourceBundle.getText("PasswordFieldMessage")}
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

			if (bValid) {
        oAppModel.setProperty("/busy", true);

        setTimeout(() => {
					oAppModel.setProperty("/busy", false);

					this._resetForm();

					this.oMessageStrip.setText(oResourceBundle.getText("RegistrationSuccessMessage"));
					this.oMessageStrip.setType("Success");
					this.oMessageStrip.setVisible(true);
        }, 3000);
			}
		},

		_resetForm: function() {
			this.oName.setValue("");
			this.oSurname.setValue("");
			this.oPhone.setValue("");
			this.oEmail.setValue("");
			this.oPassword.setValue("");
			this.oConfirmPassword.setValue("");
			this.oCheckbox.setSelected(false);
			this.oRegisterButton.setEnabled(false);
		}
	});
});