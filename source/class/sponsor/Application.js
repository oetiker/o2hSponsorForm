/* ************************************************************************

   Copyright: OETIKER+PARTNER AG
   License: MIT
   Authors: Tobias Oetiker <tobi@oetiker.ch>

************************************************************************ */

/**
 * This is the main application class of your custom application "sponsor"
 *
 * @asset(sponsor/*)
 */
qx.Class.define("sponsor.Application",
{
  extend : qx.application.Standalone,

  members :
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     *
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }
      var deco =  new qx.ui.decoration.Decorator('#68038a').set({
          backgroundColor : '#68038a'
      });
      var scroll = new qx.ui.container.Scroll();
      var currentPopup;
      var newPop = function () {
          if (currentPopup){
            scroll.remove(currentPopup);
          }
          currentPopup = new sponsor.ui.Popup().set({
              layout: new qx.ui.layout.VBox().set({
                  alignY : 'middle',
                  alignX : 'center',
              }),
              decorator: deco
          });
          scroll.add(currentPopup);
          currentPopup.addListenerOnce('changeVisibility',function(e){
              if (! currentPopup.isVisible()){
                newPop();
              }
          });
      };
      this.getRoot().set({
          blockerColor   : '#000',
          blockerOpacity : 0.5
      }).add(scroll,{
          width  : '100%',
          height : '100%'
      });
      newPop();
    }
  }
});
