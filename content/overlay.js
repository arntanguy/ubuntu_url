/******************************************************************************
     Copyright (C) 2009  TANGUY Arnaud arn.tanguy@gmail.com
*                                                                             *
* This program is free software; you can redistribute it and/or modify        *
* it under the terms of the GNU General Public License as published by        *
* the Free Software Foundation; either version 2 of the License, or           *
* (at your option) any later version.                                         *
*                                                                             *
* This program is distributed in the hope that it will be useful,             *
* but WITHOUT ANY WARRANTY; without even the implied warranty of              *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the                *
* GNU General Public License for more details.                                *
*                                                                             *
* You should have received a copy of the GNU General Public License along     *
* with this program; if not, write to the Free Software Foundation, Inc.,     *
* 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.                 *
 ******************************************************************************/


// Get the pref manager
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
         var prefSite = prefManager.getCharPref("extensions.ubuntu_url.preferedSite");
         var sites = prefManager.getCharPref("extensions.ubuntu_url.sites").split(",");
        var host = aUri.host;
        var path = aUri.path;
         for(var i in sites) {
             if(host == sites[i]) { // If the host is concerned by the redirection
                 if("http://"+host != prefSite) {
                   getBrowser().mCurrentTab.linkedBrowser.loadURI(prefSite+path); return true;//-> to redirect
                 }
             }
         }
        return false; // Else load the url as usual
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

// Preferences class (menu implementation)
var Preferences = {
    onLoad: function() {
        this.initialised=true;
    },
    onUbuntu: function() {
         prefManager.setCharPref("extensions.ubuntu_url.preferedSite", "http://forum.ubuntu-fr.org");
    },
    onKubuntu: function() {
         prefManager.setCharPref("extensions.ubuntu_url.preferedSite", "http://forum.kubuntu-fr.org");
    },
    onXubuntu: function() {
         prefManager.setCharPref("extensions.ubuntu_url.preferedSite", "http://forum.xubuntu-fr.org");
    },
    onEdubuntu: function() {
         prefManager.setCharPref("extensions.ubuntu_url.preferedSite", "http://forum.edubuntu-fr.org");
    }

}
window.addEventListener("load", function(e) { Preferences.onLoad(e); }, false);
