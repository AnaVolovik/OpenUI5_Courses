sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/Fragment'
], function(Controller, Fragment) {
	"use strict";

	return Controller.extend("AppForm.controller.View1", {
		onInit: function() {
			this.oName = this.getView().byId("idName");
			this.oSurname = this.getView().byId("idSurname");
			this.oCity = this.getView().byId("idCity");
			this.oPhone = this.getView().byId("idPhoneNumber");
			this.oEmail = this.getView().byId("idEmail");
			this.oPassword = this.getView().byId("idPassword");
			this.oConfirmPassword = this.getView().byId("idConfirmPassword");
			this.oCheckbox = this.getView().byId("idTermsCheckbox");
			this.oRegisterButton = this.getView().byId("idRegisterButton");
			this.oMessageStrip = this.getView().byId("messageStrip");
			this.oPromocode = this.getView().byId("idPromocodeInput");

			const oURLParams = new URLSearchParams(window.location.search),
						promocode = oURLParams.get('promocode');

			if (promocode) {
				this.oPromocode.setValue(promocode);
				this.oPromocode.setEnabled(false);
			} else {
				this.oPromocode.setEnabled(true);
			}
		},

		onLogoPress: async function(oEvent) {
			const oButton = oEvent.getSource(),
						oView = this.getView();

			if (!this._pPopover) {
					this._pPopover = Fragment.load({
							id: oView.getId(),
							name: "AppForm.view.fragment.OpenPopover",
							controller: this
					}).then(function(oPopover) {
							oView.addDependent(oPopover);
							return oPopover;
					});
			}

			const oPopover = await this._pPopover;
			oPopover.openBy(oButton);
		},

		onMenuItemPress: function(oEvent) {
			const itemText = oEvent.getSource().getTitle();

			sap.m.MessageToast.show(itemText);
		},

		_checkPromocode: function(promocode, oResourceBundle) {
			const url = "https://www.vocabulary.com/word-of-the-day/";

			return new Promise((resolve, reject) => {
        $.ajax({
					url: url,
					method: "GET",
					success: (data) => {
						const wordOfTheDay = this._extractWordOfTheDay(data);
						let messageText = "";

						if (promocode.toLowerCase() === wordOfTheDay.toLowerCase()) {
								messageText = oResourceBundle.getText("PromocodeSuccessMessage", [promocode]);
						} else {
								messageText = oResourceBundle.getText("PromocodeFailureMessage", [promocode]);
						}

						resolve(messageText);
					},
					error: () => {
						reject();
					}
        });
    	});
		},

		_extractWordOfTheDay: function(data) {
			const tempDiv = document.createElement("div");
    	tempDiv.innerHTML = data;

			const wordElement = tempDiv.querySelector(".word-of-the-day");
    	return wordElement ? wordElement.textContent.trim() : null;
		},

		_onNameInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource(),
						sCheckFieldNames = this.getView().getModel("i18n").getResourceBundle().getText("CheckFieldNames");
			this._checkField(oField, /^[А-Яа-яЁё\s-]+$/, sCheckFieldNames);
		},
		
		_onPhoneInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource(),
						sCheckFieldPhone = this.getView().getModel("i18n").getResourceBundle().getText("CheckFieldPhone");
			this._checkField(oField, /^\+375[-\s]?\(?(29|44|33|25)\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, sCheckFieldPhone);
		},
		
		_onEmailInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource(),
						sCheckFieldEmail = this.getView().getModel("i18n").getResourceBundle().getText("CheckFieldEmail");
			this._checkField(oField, /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.(ru|com|org|net|by|info|biz|edu|gov|mil|me|co|xyz))+$/, sCheckFieldEmail);
		},
		
		_onPasswordInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource(),
						sCheckFieldPassword = this.getView().getModel("i18n").getResourceBundle().getText("CheckFieldPassword");
			this._checkField(oField, /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, sCheckFieldPassword);
		},
		
		_onConfirmPasswordInputLiveChange: function(oEvent) {
			const oField = oEvent.getSource(),
						sConfirmPassword = oField.getValue().trim(),
						oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
						sEmptyPasswordText = oResourceBundle.getText("ConfirmPasswordEmpty"),
						sPasswordsMismatchText = oResourceBundle.getText("PasswordsDoNotMatch");
	
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
			window.open("src/pdf/UsersAgreement.pdf", "_blank");
		},

		_onOpenPlatformRules: function() {
			window.open("src/pdf/PlatformRules.pdf", "_blank");
		},

		_onCheckboxSelect: function(oEvent) {
			const oCheckbox = oEvent.getSource();
			this.oRegisterButton.setEnabled(oCheckbox.getSelected());
		},

		_checkField: function(oField, regex, errorMessage) {
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

		_onCancelButtonPress: function() {
			this._resetForm();

			this.oName.setValueState("None");
			this.oSurname.setValueState("None");
			this.oPhone.setValueState("None");
			this.oEmail.setValueState("None");
			this.oPassword.setValueState("None");
			this.oConfirmPassword.setValueState("None");
			this.oPromocode.setValueState("None");
			this.oPromocode.setEnabled(true);
		},
		
		_onRegisterButtonPress: function() {
    	const oAppModel = this.getView().getModel("appModel"),
						oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			let bValid = true,
					firstInvalidField = null;

			const fields = [
        { field: this.oName, regex: /^[А-Яа-яЁё\s-]+$/, message: oResourceBundle.getText("NameFieldMessage")},
        { field: this.oSurname, regex: /^[А-Яа-яЁё\s-]+$/, message: oResourceBundle.getText("NameFieldMessage")},
        { field: this.oPhone, regex: /^\+375[-\s]?\(?(29|44|33|25)\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, message: oResourceBundle.getText("PhoneFieldMessage")},
        { field: this.oEmail, regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.(ru|com|org|net|by|info|biz|edu|gov|mil|me|co|xyz))+$/, message: oResourceBundle.getText("EmailFieldMessage")},
        { field: this.oPassword, regex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, message: oResourceBundle.getText("PasswordFieldMessage")},
        { field: this.oConfirmPassword, regex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, message: oResourceBundle.getText("PasswordFieldMessage")}
   		];

			for (const { field, regex, message } of fields) {
        const isValid = this._checkField(field, regex, message);
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
				const promocode = this.oPromocode.getValue();

				this._checkPromocode(promocode, oResourceBundle).then(messageText => {
					const successMessage = oResourceBundle.getText("RegistrationSuccessMessage");

        	setTimeout(() => {
            this.oMessageStrip.setText(successMessage + " " + messageText);
            this.oMessageStrip.setVisible(true);
            oAppModel.setProperty("/busy", false);
            this._resetForm();
        	}, 3000);
				}).catch(() => {
					oAppModel.setProperty("/busy", false);
				});
			}
		},

		_resetForm: function() {
			this.oName.setValue("");
			this.oSurname.setValue("");
			this.oCity.setSelectedKey("Minsk")
			this.oPhone.setValue("");
			this.oEmail.setValue("");
			this.oPassword.setValue("");
			this.oConfirmPassword.setValue("");
			this.oPromocode.setValue("");
			this.oCheckbox.setSelected(false);
			this.oRegisterButton.setEnabled(false);
		}
	});
});