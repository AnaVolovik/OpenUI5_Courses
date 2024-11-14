/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"Lab_13/Lab_13/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Lab_13/Lab_13/test/integration/pages/Worklist",
	"Lab_13/Lab_13/test/integration/pages/Object",
	"Lab_13/Lab_13/test/integration/pages/NotFound",
	"Lab_13/Lab_13/test/integration/pages/Browser",
	"Lab_13/Lab_13/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Lab_13.Lab_13.view."
	});

	sap.ui.require([
		"Lab_13/Lab_13/test/integration/WorklistJourney",
		"Lab_13/Lab_13/test/integration/ObjectJourney",
		"Lab_13/Lab_13/test/integration/NavigationJourney",
		"Lab_13/Lab_13/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});