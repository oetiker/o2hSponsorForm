/* ************************************************************************

   Copyright: OETIKER+PARTNER AG
   License: MIT
   Authors: Tobias Oetiker <tobi@oetiker.ch>

************************************************************************ */

/**
 * Abstract Visualization widget.
 */
qx.Class.define("sponsor.ui.Popup", {
    extend: qx.ui.container.Composite,

    construct: function() {
        this.base(arguments);
        this.add(new qx.ui.basic.Label(this.tr("O2H Sponsoring Form")).set({
          font: 'bold',
          marginBottom: 15,
          textColor: '#fff'
        }));
        var tabView = this._tabView = new qx.ui.tabview.TabView().set({
          maxWidth: 350,
          height: 620,
          backgroundColor: '#fff',
          padding: [ 20,25,20,20]
        });
        this._formField = {};
        this.add(tabView);
        tabView.add(new sponsor.ui.Page1(this));
        tabView.add(new sponsor.ui.Page2(this));
        tabView.add(new sponsor.ui.Page3(this));
    },
    members: {
        _formField: null,
        _tabView: null
    }
});
