/* ************************************************************************

   Copyright: OETIKER+PARTNER AG
   License: MIT
   Authors: Tobias Oetiker <tobi@oetiker.ch>

************************************************************************ */

/**
 * Abstract Visualization widget.
 */
qx.Class.define("sponsor.ui.PageBase", {
    extend: qx.ui.tabview.Page,

    construct: function(popup,label) {
        this.base(arguments,label);
        this._data = popup._data;
        this._popup = popup;
        this._formField = popup._formField;
        var grid = new qx.ui.layout.Grid(10, 1);
        this.set({
           layout: grid,
           enabled: false
        });
        [1,2,3,4,5,6,7,8,9,10,11,12].map(function(i){
            grid.setColumnFlex(i, 1);
        });

        this._nextBtn = new qx.ui.form.Button(this.tr("Weiter")).set({
            allowGrowY: false,
            alignY: 'bottom',
            marginTop: 20,
            center: true
        });
        this._prevBtn = new qx.ui.form.Button(this.tr("Zurück")).set({
            allowGrowY: false,
            alignY: 'bottom',
            marginTop: 20,
            center: true
        });
        this._populate();
        grid.setRowFlex(this._row, 1);

        this.add(this._nextBtn, {
            column: 8,
            colSpan: 5,
            row: this._row
        });
        this.add(this._prevBtn, {
            column: 1,
            colSpan: 5,
            row: this._row
        });
    },
    members: {
        _row: 1,
        _col: 1,
        _nextBtn: null,
        _prevBtn: null,
        _formFields: null,
        _popup: null,
        _populate: function(){
          // needs populating
        },
        addTitle: function(label){
            return this.addLabel(label,12).set({
              font:'bold',
              marginTop: 9
            });
        },
        addLabel: function(label,width){
            if (!width){
              width = 12;
            }
            var label = new qx.ui.basic.Label(label).set({
                rich: true,
                alignY: 'top',
                marginTop: 6,
                marginBottom: 4
            });
            this.add(label, {
                column: this._col,
                row: this._row,
                colSpan: width,
            });
            this._col += width;
            if (this._col > 12){
              this._col = 1;
              this._row++;
            }
            return label;
        },
        addTextField: function(key,label,width,autocomplete){
            if (!width){
              width = 12;
            }
            var field = new qx.ui.form.TextField().set({
                placeholder: label,
                alignY: 'top',
                marginTop: 2,
                marginBottom: 2,
                nativeContextMenu: true
            });
            if (autocomplete){
              var el = field.getContentElement();
              el.setAttribute('autocomplete',autocomplete);
              el.setAttribute('name',autocomplete);
            }
            this.add(field, {
                column: this._col,
                row: this._row,
                colSpan: width,
            });
            this._col += width;
            if (this._col > 12){
              this._col = 1;
              this._row++;
            }
            this._formField[key] = field;
            return field;
        },
        getTabs: function(){
            return this._popup._tabView.getChildren();
        },
        getFieldValue: function(key){
            return this.getField(key).getValue();
        },
        getField: function(key){
          return this._formField[key];
        },
        setActiveTab: function(id){
            var tv =   this._popup._tabView;
            tv.setSelection([ this.getTabs()[id] ]);
        }
    }
});
