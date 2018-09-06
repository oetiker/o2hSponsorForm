/* ************************************************************************

   Copyright: OETIKER+PARTNER AG
   License: MIT
   Authors: Tobias Oetiker <tobi@oetiker.ch>

************************************************************************ */

/**
 * Abstract Visualization widget.
 */
qx.Class.define("sponsor.ui.Page1", {
    extend: sponsor.ui.PageBase,
    /**
     * Demo Doc
     */
    construct: function(data) {
        this.base(arguments, data,"1");
        this.addListener('appear',() => {
          let tabs = this.getTabs();
          if (tabs.length>2){
            tabs[1].setEnabled(false);
            tabs[2].setEnabled(false);
          }
        },this);
        this.setEnabled(true);
    },
    members: {
        _maxEntries: 12,
        _check: function(field){
            var part = this.getField('partSelect').getSelection();
            var d = {};
            d['part'] = null;
            if (part.length == 1 && part[0].isVisible()){
                d.part = {
                    Id: part[0].getModel(),
                    Hid: part[0].getLabel()
                };
            }
            this.getField('searchText').setValid(!!d.part);

            ['FrKm','FrFix'].forEach(function(key){
                d[key] = parseFloat(this.getFieldValue(key));
            },this);

            return !!(d.part && ( d.FrKm > 0 || d.FrFix > 0 )) ;
        },
        _populate: function(){
            this.addLabel(this.tr("Beim 2-Stunden Lauf braucht es Leute die laufen, aber vor allem auch Sponsoren. Hier kannst deine Sponsoringzusage erfassen."));
            this.addTitle(this.tr("Wen möchtest du sponsoren?"));
            var search = this.addTextField('searchText',this.tr('Gesuchter Name ...'));
            var found = window.location.hash.match('q=([^&]+)');
            search.addListener('appear', function(e) {
                search.focus();
                search.activate();
                if (found && found[1] && !search.getValue()){
                    search.setValue(decodeURI(found[1]));
                    this.__searchParts();
                }
            }, this);
            search.addListener('input',function(){
              this.__searchParts();
              window.location.hash = '#q=' + encodeURIComponent(search.getValue())
            },this);

            var radio = this._formField['partSelect'] = new qx.ui.form.RadioGroup();

            for (var i = 0; i < this._maxEntries; i++) {
                var entry = new qx.ui.form.RadioButton().set({
                    visibility: 'excluded'
                });
                this.add(entry, {
                    column: 1,
                    row: this._row++,
                    colSpan: 12
                });
                radio.add(entry);
            }

            this.addTitle(this.tr("Welchen Betrag willst du einsetzen?"));
            this.addTextField("FrKm",this.tr("Fr pro km"),3);
            this.addLabel(this.tr("Fr/km"),3);
            this.addTextField("FrFix",this.tr("Fr fix"),3);
            this.addLabel(this.tr("Fr fix"),3);

            this._nextBtn.addListener("execute", function() {
                if (this._check()){
                    this.getTabs()[1].setEnabled(true);
                    this.setActiveTab(1);
                }
            }, this);

            this._prevBtn.setVisibility('excluded');


        },
        __searchParts: function(e){
            var radio = this.getField('partSelect');
            var text = this.getFieldValue('searchText');
            if (text.length < 3) {
                var items = radio.getItems();
                items.map(function(item, i) {
                    item.set({
                        visibility: 'excluded'
                    });
                });
                radio.resetSelection();
                return;
            }
            var req = new qx.io.request.Xhr("https://www.o2h.ch/ssas/REST/v1/getPart", "POST").set({
                requestData: {
                    search: text,
                    limit: this._maxEntries
                }
            });
            var FrKm = this.getField('FrKm');
            req.addListener('success', function(e) {
                var req = e.getTarget();
                var data = req.getResponse();
                var items = this.getField('partSelect').getItems();
                radio.resetSelection();
                items.map(function(item, i) {
                    if (i < data.length) {
                        item.set({
                            label: data[i].text,
                            model: data[i].id,
                            visibility: 'visible'
                        });
                    } else {
                        item.set({
                            visibility: 'excluded'
                        });
                    }
                    if (data.length == 1){
                      FrKm.focus();
                      FrKm.activate();
                    }
                },this);
            },this);
            req.addListener('fail', function(e) {
                var req = e.getTarget();
                console.log(req);
            },this);
            req.send();
        }
    }
});
