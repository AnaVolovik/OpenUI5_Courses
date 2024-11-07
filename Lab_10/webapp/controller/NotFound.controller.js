sap.ui.define([
		"Lab_10/Lab_10/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Lab_10.Lab_10.controller.NotFound", {

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