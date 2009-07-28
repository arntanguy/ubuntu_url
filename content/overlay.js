var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefBranch);

var Ubuntu_url = {
   QueryInterface: function(iid)
    {
        if (iid.equals(Components.interfaces.nsIURIContentListener) ||
         iid.equals(Components.interfaces.nsISupportsWeakReference) ||
            iid.equals(Components.interfaces.nsISupports))
            return this;
        throw Components.results.NS_NOINTERFACE;
    },
    onStartURIOpen: function(aUri)
    {
           // do here some processing of aUri and based on this:
           // return false; -> to let the URL go,
           // return true; -> to stop loading this url
           // getBrowser().mCurrentTab.linkedBrowser.loadURI("http://redirect.com"); return true; -> to redirect
         prefSite.pref("extensions.ubuntu_url.preferedSite", "http://forum.kubuntu-fr.org");
         var prefSite = prefManager.getCharPref("extensions.ubuntu_url.preferedSite");
        alert(prefSite);
        var host = aUri.host;
        var path = aUri.path;
        if(prefSite == "http://forum.ubuntu-fr.org") {
            if(host == "forum.kubuntu-fr.org") {
               getBrowser().mCurrentTab.linkedBrowser.loadURI("http://forum.ubuntu-fr.org"+path); return true;//-> to redirect
            }
        } else if (prefSite == "http://forum.kubuntu-fr.org") {
            if(host == "forum.ubuntu-fr.org") {
               getBrowser().mCurrentTab.linkedBrowser.loadURI("http://forum.kubuntu-fr.org"+path); return true;//-> to redirect
            }
        }
        return false;
    },
    doContent: function(aContentType, aIsContentPreferred, aRequest, aContentHandler )
    {
          throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
    },
    canHandleContent: function(aContentType, aIsContentPreferred, aDesiredContentType)
   {
          throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
    },
    isPreferred: function(aContentType, aDesiredContentType)
   {
        try
       {
            var webNavInfo =
            Components.classes["@mozilla.org/webnavigation-info;1"]
                        .getService(Components.interfaces.nsIWebNavigationInfo);
            return webNavInfo.isTypeSupported(aContentType, null);
        }
      catch (e)
      {
            return false;
        }
    },
      GetWeakReference : function()
   {
       throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
    }
}

// Setting up the content listener
var wnd = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                        .getInterface(Components.interfaces.nsIWebNavigation)
                        .QueryInterface(Components.interfaces.nsIDocShell)
                        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                  .getInterface(Components.interfaces.nsIURIContentListener);
wnd.parentContentListener = Ubuntu_url;
