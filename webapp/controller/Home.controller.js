sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter",
	"com/porders/pordersapp/model/models",
	"com/porders/pordersapp/model/formatter"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, UIComponent, Filter, FilterOperator, Fragment, Sorter, Model, formatter) {
		"use strict";

		return Controller.extend("com.porders.pordersapp.controller.Home", {

			formatter: formatter,

			onInit: function () {
				var oRouter = UIComponent.getRouterFor(this);

				//   Se actualizan los datos de la lista de pedidos
				oRouter.getRoute("RouteHome").attachPatternMatched(this.onRouteMatched, this);
			},

			onRouteMatched: function (oEvent) {
				const userEmail = sap.ushell.Container.getUser().getEmail();
				const uriPOrdersSet = this.getOwnerComponent().getModel().sServiceUrl + '/HeaderSet';
				const uriBtpUserSet = this.getOwnerComponent().getModel().sServiceUrl + '/BtpUserSet';
				//const uriRoleCollection = 'https://api.authentication.us10.hana.ondemand.com/sap/rest/authorization/v2/rolecollections?showUsers=false&showRoles=true&showGroups=false';
				//const uriRoleCollection = '/sap/rest/authorization/v2/rolecollections?showUsers=true';
				//const uriRoleCollection = this.getOwnerComponent().getModel("apiAuthModel").sServiceUrl + '/rolecollections?showUsers=true';
				const oModelPOrders = Model.createPOrdersModel(uriPOrdersSet, uriBtpUserSet, userEmail);
				//const oModelAuth = Model.createAuthModel(uriRoleCollection);

				//console.log(uriBtpUserSet);
				//console.log(uriRoleCollection);

				//   Se actualiza el modelo de pedidos
				this.getView().setModel(oModelPOrders, 'porderList');
			},

			onSearch: function (oEvent) {
				var aFilters = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery)
					aFilters.push(new Filter("PODescription", FilterOperator.Contains, sQuery));

				var oTable = this.byId("idPordersTable");
				var oBinding = oTable.getBinding("items");

				oBinding.filter(aFilters);
			},

			onSort: function () {
				// 1. get current view
				var oView = this.getView();

				// 2. load the fragment file
				if (!this.byId("sortDialog")) {
					Fragment.load({
						id: oView.getId(),
						name: "com.porders.pordersapp.fragment.SortDialog",
						controller: this
					}).then(function (oDialog) {
						// 3. Open dialog
						// connect dialog to the root view of component (model, lifecycle)
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.byId("sortDialog").open();
				}

			},

			onSortDialogConfirm: function (oEvent) {
				var oSortItem = oEvent.getParameter("sortItem");
				var sColumnPath = "PONumber";
				var bDescending = oEvent.getParameter("sortDescending");
				var aSorters = [];

				if (oSortItem) {
					sColumnPath = oSortItem.getKey();
				}

				aSorters.push(new Sorter(sColumnPath, bDescending));

				var oTable = this.byId("idPordersTable");
				var oBinding = oTable.getBinding("items");

				oBinding.sort(aSorters);
			},

			onGroup: function () {
				// 1. get current view
				var oView = this.getView();

				// 2. load the fragment file
				if (!this.byId("groupDialog")) {
					Fragment.load({
						id: oView.getId(),
						name: "com.porders.pordersapp.fragment.GroupDialog",
						controller: this
					}).then(function (oDialog) {
						// 3. Open dialog
						// connect dialog to the root view of component (model, lifecycle)
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.byId("groupDialog").open();
				}

			},

			onGroupDialogConfirm: function (oEvent) {
				var oSortItem = oEvent.getParameter("groupItem");
				var sColumnPath = "PONumber";
				var bDescending = oEvent.getParameter("groupDescending");
				var aSorters = [];
				var bGroupEnabled = false;

				if (oSortItem) {
					sColumnPath = oSortItem.getKey();
					bGroupEnabled = true;
				}

				aSorters.push(new Sorter(sColumnPath, bDescending, bGroupEnabled));

				var oTable = this.byId("idPordersTable");
				var oBinding = oTable.getBinding("items");

				oBinding.sort(aSorters);
			},

			onPressItem: function (oEvent) {
				var oRouter = UIComponent.getRouterFor(this);
				var oItem = oEvent.getSource();

				oRouter.navTo("Detail", {
					PONumber: oItem.getBindingContext('porderList').getObject().PONumber
				});
			}
		});
	});