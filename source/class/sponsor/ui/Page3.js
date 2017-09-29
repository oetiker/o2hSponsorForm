/* ************************************************************************

   Copyright: OETIKER+PARTNER AG
   License: MIT
   Authors: Tobias Oetiker <tobi@oetiker.ch>

************************************************************************ */

/**
 * Abstract Visualization widget.
 */
 qx.Class.define("sponsor.ui.Page3", {
     extend: sponsor.ui.PageBase,

     construct: function(data) {
         this.base(arguments, data,"3");
     },
     members: {
        _check: function(okCb){
          var payload = this._popup._lastPayload;
          var code = payload['code'] = this.getFieldValue('code');
          this.getField('code').setValid(!!code);
          if (!code){
              return;
          }
          var req = new qx.io.request.Xhr("https://www.o2h.ch/ssas/REST/v1/validateAddress", "POST").set({
              requestData: payload
          });
          req.setRequestHeader('Content-Type','application/json');
          req.addListener('success', function(e) {
              var req = e.getTarget();
              var data = req.getResponse();
              if (data.status == 'ok'){
                okCb();
                return;
              }
              this.getField('code').setValid(false);
          },this);
          req.addListener('fail', function(e) {
              var req = e.getTarget();
              this.getField('code').setValid(false);
              console.log(req);
          },this);
          req.send();
        },
        _populate: function(){
            this.addTitle(this.tr("Du unterstützt"));
            var hid = this.addLabel();
            this.addTitle(this.tr("Deine Adresse"));
            var addr = this.addLabel();
            this.addTitle(this.tr("Zustellung der Rechnung"));
            var bill = this.addLabel();
            this.addTitle(this.tr("Sind deine Angaben korrekt?"));
            this.addLabel(this.tr("Wenn die obigen Angaben OK sind, tippe auf der Zeile unten bitte den Bestätigungscode ein. Den Code hast du soeben per eMail erhalten!"),12);
            var code = this.addTextField('code',this.tr("Bestätigungscode"),12);

            this.addListener('appear',function() {
                var d = {};
                ['FrKm','FrFix','FirstName','Name','Company','StreetAddress','Zip','Town','eMail'].forEach(function(key){
                  var value = this.getFieldValue(key);
                  d[key] = !!value ? value : '';
                },this);
                d['delivery'] = null;
                var delivery = this.getField('deliverySelect').getSelection();
                if (delivery.length == 1){
                    d.delivery  = delivery[0].getLabel();
                }
                d['part'] = null;
                var part = this.getField('partSelect').getSelection();
                if (part.length == 1 && part[0].isVisible()){
                    d.part = {
                        Id: part[0].getModel(),
                        Hid: part[0].getLabel()
                    };
                }
                hid.setValue(
                    d.part.Hid + '<br/>'
                    + 'mit ' + ( d.FrKm ? d.FrKm + " Fr/km " : "" )
                    + (( d.FrKm && d.FrFix ) ? ' und ' : '' )
                    + ( d.FrFix ? d.FrFix + " Fr fix " : "" )
                );
                addr.setValue(
                    d.FirstName + ' ' + d.Name
                    + ( d.Company.length > 0 ? ', ' + d.Company : '' ) + '<br/>'
                    + d.StreetAddress + ', '
                    + d.Zip + ' ' + d.Town+'<br/>'
                    + d.eMail
                );
                bill.setValue(
                    d.delivery
                );
                code.activate();
                code.focus();
            },this);

            this._nextBtn.setLabel(this.tr("Bestätigen"));
            this._prevBtn.setLabel(this.tr("Ändern"));
            this._nextBtn.addListener("execute",function(){
                var that = this;
                this._check(function(){
                    var win = new qx.ui.window.Window(that.tr("Beitrag gespeichert")).set({
                      centerOnAppear: true,
                      showClose: false,
                      showMinimize: false,
                      showMaximize: false,
                      showStatusbar: false,
                      layout: new qx.ui.layout.VBox(10),
                      modal: true
                    });
                    win.add(new qx.ui.basic.Label(that.tr("<h1>Danke für deinen Beitrag</h1><p>Eine Bestätigung wurde per eMail zugestellt.</p>")).set({
                      rich: true,
                      padding: [50,50,50,50]
                    }));
                    var ok = new qx.ui.form.Button(that.tr("OK")).set({
                      allowGrowX: false,
                      alignX: 'right'
                    });
                    win.add(ok);
                    ok.addListenerOnce('execute',function(){
                      window.location.hash = '';
                      win.close();
                      this._popup.exclude();
                      win.dispose();
                    },that);
                    win.open();
                });
            },this);
            this._prevBtn.addListener("execute", function() {
              this.setActiveTab(1);
            },this);
        }
    }
});
