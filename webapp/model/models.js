sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            /*
            createBtpUserModel: function(serviceUrl, userEmail) {
                var oModel = new sap.ui.model.json.JSONModel();
                const oBusy = new sap.m.BusyDialog();
                const uriBtpUserSet = serviceUrl + "?$filter=UserEmail eq '" + userEmail + "'";

                oBusy.open();

                oModel.loadData(uriBtpUserSet);
                oModel.attachRequestCompleted(function onCompleted(oEvent) {
                    oBusy.close();
                });
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            */

            createPOrdersModel: function (serviceUrl, serviceUsersUrl, userEmail) {
                const oBusy = new sap.m.BusyDialog();
                const uriBtpUserSet = serviceUsersUrl + "?$filter=UserEmail eq '" + userEmail + "'";
                var oUserModel = new sap.ui.model.json.JSONModel();
                var oModel = new sap.ui.model.json.JSONModel();

                oBusy.open();

                oUserModel.loadData(uriBtpUserSet);
                oUserModel.attachRequestCompleted(function onCompleted(oEvent) {
                    const btpUsers = oUserModel.getProperty('/d/results');
                    var uriHeaderSet = serviceUrl;

                    if (btpUsers !== undefined && btpUsers.length > 0) {
                        uriHeaderSet = uriHeaderSet + "?$filter=Vendor eq '"
                        for (let index = 0; index < btpUsers.length; index++) {
                            uriHeaderSet = uriHeaderSet + btpUsers[index].Vendor + "'";
                            
                            if (index !== btpUsers.length - 1) {
                                uriHeaderSet = uriHeaderSet + " or Vendor eq '";
                            }
                        }
                        uriHeaderSet = uriHeaderSet + "&$expand=UserDetail";
                    }else{
                        uriHeaderSet = uriHeaderSet + "?$expand=UserDetail";
                    }

                    oModel.loadData(uriHeaderSet);
                    oModel.attachRequestCompleted(function onCompleted(oEvent) {
                        oBusy.close();
                    });
                });

                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            }
        };
    });