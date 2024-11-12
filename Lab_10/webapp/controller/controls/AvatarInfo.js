sap.ui.define([
  "sap/ui/core/Control",
  "sap/m/Avatar",
  "sap/m/Text"
], (Control, Avatar, Text) => {
  "use strict";

  return Control.extend("Lab_10.Lab_10.controller.controls.AvatarInfo", {
    metadata : {
      properties: {
        src: { type: "string", defaultValue: "" },
        text: { type: "string", defaultValue: "" },
        displaySize: { type: "sap.m.AvatarSize", defaultValue: "L" },
        textAlign: { type: "string", defaultValue: "Left" },
        maxLines: { type: "int", defaultValue: 1 }
      },
      aggregations : {
        _avatar : {type : "sap.m.Avatar", multiple: false, visibility : "hidden"},
        _text : {type : "sap.m.Text", multiple: false, visibility : "hidden"}
      },
      events : {
        press: {}
      }
    },

    init() {
      this.setAggregation("_avatar", new Avatar({
        press: () => this.firePress()
      }));

      this.setAggregation("_text", new Text());

      this.addStyleClass("ui5AvatarInfo");
    },

    renderer(oRM, oControl) {
      const oAvatar = oControl.getAggregation("_avatar");
      const oText = oControl.getAggregation("_text");

      if (oControl.getSrc()) {
        oAvatar.setSrc(oControl.getSrc());
      } else {
        const initials = oControl.getText().charAt(0).toUpperCase();
        oAvatar.setInitials(initials);
      }

      oAvatar.setDisplaySize(oControl.getDisplaySize());

      oText.setText(oControl.getText());
      oText.setTextAlign(oControl.getTextAlign());
      oText.setMaxLines(oControl.getMaxLines());

      oRM.openStart("div", oControl);
      oRM.class("ui5AvatarInfo");
      oRM.openEnd();

      oRM.renderControl(oAvatar);
      oRM.renderControl(oText);

      oRM.close("div");
    },

  });
});