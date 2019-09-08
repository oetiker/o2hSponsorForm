/* ************************************************************************

   Copyright: OETIKER+PARTNER AG
   License: MIT
   Authors: Tobias Oetiker <tobi@oetiker.ch>

************************************************************************ */

/**
 * Abstract Visualization widget.
 */
 qx.Class.define("sponsor.ui.Page2", {
     extend: sponsor.ui.PageBase,

     construct: function(data) {
         this.base(arguments, data,"2");
         this.addListener('appear',function(){
           var tabs = this.getTabs();
           if (tabs.length>2){
             tabs[2].setEnabled(false);
           }
         },this);
     },
     members: {
        _addressNote: null,
        _check: function(okCb){
            var ok = true;
            var address = {};
            ["FirstName","Name","Company","StreetAddress","Zip","Town"].forEach(function(key){
                var value = this.getFieldValue(key);
                if (!!value){
                  address[key] = value;
                }
            },this);
            var email = this.getFieldValue('eMail');
            var emailOk = (!!email && !!email.match(/^\s*\S+@\S+\s*$/));
            this.getField('eMail').setValid(emailOk);
            if (!emailOk){
               return false;
            }
            var payload = this._popup._lastPayload = {
              adr: address,
              partId: this.getField('partSelect').getSelection()[0].getModel(),
              delivery: this.getField('deliverySelect').getSelection()[0].getModel(),
              eMail: this.getFieldValue('eMail'),
              FrKm: parseFloat(this.getFieldValue('FrKm')),
              FrFix: parseFloat(this.getFieldValue('FrFix'))
            };
            var req = new qx.io.request.Xhr(
                "https://www.o2h.ch/ssas/REST/v1/validateAddress", "POST").set({
                requestData: payload
            });
            req.setRequestHeader('Content-Type','application/json');
            req.addListener('success', function (e) {
                var req = e.getTarget();
                var res = req.getResponse();
                var problem = null;
                var data = {};
                if (!res.Body || !res.Body.rows || res.Body.rows.length == 0) {
                    ok = false;
                }
                else {
                  data = res.Body.rows[0];
                }

                if (!data.AdressOfficial || !data.NameCurrentlyValid || !data.NameFirstNameCurrentlyValid){
                    ok = false;
                };
                if (!data.NameFirstNameCurrentlyValid){
                    problem = this.tr("der eingegebene Vorname+Nachname");
                }
                if (!data.NameCurrentlyValid){
                    problem = this.tr("der eingegebene Vorname+Nachname");
                }
                if (!data.HouseNbrValid){
                    problem = this.tr("die eingegebene Hausnummer");
                }
                if (!data.StreetValid){
                    problem = this.tr("die eingegebene Strasse");
                }
                if (!data.ZipValid){
                    problem = this.tr("die eingegebene Postleitzahl");
                }
                if (!data.TownValid){
                    problem = this.tr("der eingegebene Ort");
                }
                this.getField('Zip').setValid(!!data.ZipValid);
                if (data.TownOfficial && data.Town18) {
                    this.getField('Town').set({
                        valid: true,
                        value: data.Town18
                    });
                } else {
                    ok = false;
                    this.getField('Town').setValid(false);
                }
                if (!!data.StreetOfficial && !!data.HouseNbrValid) {
                    this.getField("StreetAddress").set({
                        valid: true
                    })
                } else {
                    ok = false;
                    this.getField("StreetAddress").setValid(false);
                }

                if (address.Company) {
                    this.getField("Company").set({
                        valid: !!data.NameCurrentlyValid
                    });
                    this.getField("FirstName").setValid(true);
                    this.getField("Name").setValid(true);
                } else {
                    this.getField("FirstName").set({
                        valid: !!data.NameFirstNameCurrentlyValid
                    });
                    this.getField("Name").set({
                        valid: !!data.NameCurrentlyValid
                    });
                }
                if (problem){
                    this._addressNote.setValue("Laut Angaben des Adresscheckers der Post ist "+ problem + " unbekannt.")
                }
                if (ok && okCb){
                    okCb();
                }
            }, this);
            req.addListener('fail', function (e) {
                var req = e.getTarget();
                console.log(req);
            }, this);
            req.send();
            this._addressNote.setValue(null);
        },
        _populate: function(){
            this.addLabel(this.tr("Du erhältst nach dem Lauf von uns eine Rechnung. Dazu brauchen wir einige Angaben von dir."));
            this.addTitle(this.tr("Was ist deine Postadresse?"));
            var start = this.addTextField("FirstName",this.tr("Vorname"),6,"given-name");
            start.addListener('appear', function(e) {
                start.focus();
                start.activate();

            }, this);
            this.addListenerOnce('appear',function(){
                var form = new qx.html.Element('form',null,{autocomplete: 'on'});
                var el = this.getContentElement();
                form.insertBefore(el);
                el.insertInto(form);
            },this);
            this.addTextField("Name",this.tr("Familienname"),6,"family-name");
            this.addTextField("Company",this.tr("Firma"),12,'organization');
            this.addTextField("StreetAddress",this.tr("Strasse Nr."),12,"street-address");
            this.addTextField("Zip",this.tr("PLZ"),3,"postal-code");
            this.addTextField("Town",this.tr("Ort"),9,"address-level2");
            this._addressNote = this.addLabel('',12).set({textColor: 'red'});

            this.addTitle(this.tr("Was ist deine eMail-Adresse?"));
            this.addTextField("eMail",this.tr("eMail"),12,"email");
            this.addTitle(this.tr("Wie soll die Rechnung zugestellt werden?"));
            var rPdf = new qx.ui.form.RadioButton(this.tr("Rechnung im PDF-Format per eMail")).set({
                model: 'eMail'
            });

            this.add(rPdf, {
                column: 1,
                row: this._row++,
                colSpan: 12
            });
            var rPrint = new qx.ui.form.RadioButton(this.tr("Gedruckte Rechnung auf Papier")).set({
                model: 'Brief'
            });
            this.add(rPrint, {
                column: 1,
                row: this._row++,
                colSpan: 12
            });
            var radio = this._formField['deliverySelect'] = new qx.ui.form.RadioGroup(rPdf, rPrint);

            this._nextBtn.addListener("execute", function() {
                var that = this;
                this._check(function(){
                    that.getTabs()[2].setEnabled(true);
                    that.setActiveTab(2);
                });
            },this);
            this._prevBtn.addListener("execute", function() {
                this.setActiveTab(0);
            },this);
        }
    }
});
