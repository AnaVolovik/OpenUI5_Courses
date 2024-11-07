sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device"
], function (UIComponent, Device) {
  "use strict";

  return UIComponent.extend("Lab_10.Lab_10.Component", {

    metadata : {
      manifest: "json"
    },

    init : function () {
      UIComponent.prototype.init.apply(this, arguments);

      this.getRouter().initialize();
    },

    getContentDensityClass : function() {
      if (this._sContentDensityClass === undefined) {
        if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
          this._sContentDensityClass = "";
        } else if (!Device.support.touch) {
          this._sContentDensityClass = "sapUiSizeCompact";
        } else {
          this._sContentDensityClass = "sapUiSizeCozy";
        }
      }
      return this._sContentDensityClass;
    }

  });

}
);