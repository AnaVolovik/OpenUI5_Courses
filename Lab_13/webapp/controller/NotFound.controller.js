sap.ui.define([
		"Lab_13/Lab_13/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Lab_13.Lab_13.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);