qx.Theme.define("sponsor.theme.Appearance", {
    extend: qx.theme.indigo.Appearance,
    appearances: {
        "cred-card": {
            style: function(states) {
                return {
                    decorator: "material-card",
                    padding: 10,
                    margin: [3, 3, 4, 3]
                }
            }
        },
        "toolbar": {
            style: function(states) {
                return {
                    backgroundColor: null,
                    padding: [0, 0, 10, 0]
                };
            }
        },
        "toolbar-button": "button",
        "tabview/pane": {
            alias: "widget",
            style: function(state) {
                return {
                    padding: [20, 0, 0, 0]
                }
            }
        },
        "tabview-page/button": {
            style: function(states) {
                var decorator = "tabview-page-button-top";

                if (states.checked) {
                    decorator = "tabview-page-button-top-checked";
                }

                return {
                    //        zIndex : states.checked ? 10 : 5,
                    decorator: decorator,
                    padding: [6, 11, 6, 7],
                    textColor: states.disabled ? "text-disabled" : "tabview-page-button-text",
                    marginRight: 20,
                    marginLeft: 10,
                    marginTop: 10,
                    cursor: "pointer",
                    font: "bold"
                };
            }
        },
        "textfield": {
            style: function(states) {
                var textColor;
                if (states.disabled) {
                    textColor = "text-disabled";
                } else if (states.showingPlaceholder) {
                    textColor = "text-placeholder";
                } else {
                    textColor = undefined;
                }

                var decorator;
                var padding;
                if (states.readonly) {
                    decorator = "flat";
                    padding = [0, 0, 5, 0];
                } else if (states.invalid) {
                    decorator = "material-textfield-invalid";
                    padding = [0, 0, 3, 0];
                } else if (states.focused) {
                    decorator = "material-textfield-focussed";
                    padding = [0, 0, 3, 0];
                } else {
                    padding = [0, 0, 4, 0];
                    decorator = "material-textfield";
                }

                return {
                    decorator: decorator,
                    padding: padding,
                    textColor: textColor
                };
            }
        },
        "button": {
            style: function(states) {
                var backgroundColor = "material-button";
                var decorator = "material-button";
                if (states.hovered || states.focused) {
                    decorator = "material-button-hovered";
                    backgroundColor = "material-button-hovered";
                }
                if (states.pressed) {
                    decorator = "material-button-pressed";
                    backgroundColor = "material-button-pressed";
                }
                if (states.disabled) {
                    decorator = "material-button-disabled";
                    backgroundColor = "material-button-disabled";
                }
                return {
                    decorator: decorator,
                    backgroundColor: backgroundColor,
                    textColor: "#fff",
                    padding: [6, 10, 6, 10],
                    margin: [4, 4, 4, 4]
                }
            }
        }
    }
});
