/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"Lab_10/Lab_10/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Lab_10/Lab_10/test/integration/pages/Worklist",
	"Lab_10/Lab_10/test/integration/pages/Object",
	"Lab_10/Lab_10/test/integration/pages/NotFound",
	"Lab_10/Lab_10/test/integration/pages/Browser",
	"Lab_10/Lab_10/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Lab_10.Lab_10.view."
	});

	sap.ui.require([
		"Lab_10/Lab_10/test/integration/WorklistJourney",
		"Lab_10/Lab_10/test/integration/ObjectJourney",
		"Lab_10/Lab_10/test/integration/NavigationJourney",
		"Lab_10/Lab_10/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});