(Demo.Routes = function($, jQuery){

	function _setNavBackAndHome(){
		$.UI.setLeftNav("Back")
			.setRightNav("Home", "index.html");
	}

	// ----- Private Vars -----
	var _history = [],
		_routes = {

			"index.html": function(){

				$.Routes.clearHistory();

				$.UI.setLeftNav()
					.setTitle("Demo")
					.setRightNav();

			},

			"platforms.html": function(){
				_setNavBackAndHome();
			},

			"applications.html": function(){

				var i,
					appSelect = jQuery("#launchApplicationsSelect"),
					applications = Widget.Device.getAvailableApplications();

				_setNavBackAndHome();

				for(i = 0; i < applications.length; i++) {
					appSelect.append($.Utils.createElement("option", {
						"value": applications[i],
						"innerText": applications[i]
					}));
				}

				jQuery("#launchApplicationButton").bind("mousedown", function() {
					Widget.Device.launchApplication(appSelect.val());
				});

			},

			"infopane.html": function(){
				_setNavBackAndHome();
			},

			"config.html": function(){
				_setNavBackAndHome();
			},

			"orientation.html": function(){

				_setNavBackAndHome();

				function captureScreenDimensionChange(width, height) {
					var message = "JIL :: onScreenChangeDimensions was called. <br />" +
									"Width ==> " + width + " Height ==> " + height;
					_notifyEventWasCalled(message);
				}
				
				Widget.Device.DeviceStateInfo.onScreenChangeDimensions = captureScreenDimensionChange;

			},

			"gps.html": function(){

				_setNavBackAndHome();
					
				if (GBrowserIsCompatible()) {
					
					var map = new GMap2(document.getElementById("map_canvas"));

					map.setUIToDefault();

					// callback to update map info
					function updateMap(positionInfo){

						var point = new GLatLng(positionInfo.latitude, positionInfo.longitude);

						map.setCenter(point, 13);

						map.clearOverlays();

						map.addOverlay(new GMarker(point));

					}					

					// Register for JIL callback
					Widget.Device.DeviceStateInfo.onPositionRetrieved = updateMap;

					Widget.Device.DeviceStateInfo.requestPositionInfo("gps");

					jQuery("#refreshMapButton").bind("mousedown", function () {
						Widget.Device.DeviceStateInfo.requestPositionInfo("gps");
					});
					

				}

			},

			"persistence.html": function(){

				_setNavBackAndHome();
	
				jQuery("#persistenceSaveButton").bind("mousedown", function() {
					$.Persistence.save(jQuery("#persistenceKey")[0].value, jQuery("#persistenceValue")[0].value);
					jQuery("#persistenceResult").removeClass("irrelevant");
				});

				jQuery("#persistenceDeleteButton").bind("mousedown", function() {
					$.Persistence.remove(jQuery("#persistenceKey")[0].value);
					jQuery("#persistenceResult").removeClass("irrelevant");
				});

			},

			"events.html": function() {

				var message = " was fired and successfully captured!";

				_setNavBackAndHome();

				Widget.onMaximize = function() {
					_notifyEventWasCalled("Widget.onMaximize" + message);
				};
				
				Widget.onWakeup = function() {
					_notifyEventWasCalled("Widget.onWakeup" + message);
				};
				
				Widget.onFocus = function() {
					_notifyEventWasCalled("Widget.onFocus" + message);
				};
				
				Widget.onRestore = function() {
					_notifyEventWasCalled("Widget.onRestore" + message);
				};
				
			}
		};

	// ----- Private Methods -----
	function _notifyEventWasCalled(message) {
		var eventDiv = jQuery("#eventResult"),
			eventResultDiv;

		if (eventDiv.length > 0) {

			eventResultDiv = eventDiv.children("#eventResultInfo");
			eventDiv
				.show(0, function() {
					eventResultDiv.html(message);
				})
				.delay(5000)
				.hide(0, function() {
					eventResultDiv.html("");
				});
		}

	}

	// ----- Public Properties -----
	return {

		load: function(view){

			return _routes[view] || null;

		},

		clearHistory: function (){
			_history = [];
		},

		// TODO: add other callback in case callee wants to pass a custom callback not in Routes.
		navigate: function (view, params){

			try{

				if(!view){

					// if im going back I need to remove myself first
					_history.pop();

					var lastView = _history.pop();

					view = (lastView && lastView[0]) || "index.html";
					params = (lastView && lastView[2]) || null;

				}
				
				var xhr = new XMLHttpRequest(),
					callback;

				xhr.onreadystatechange = function (){

					if(this.readyState === 4){
						
						try{

							$.UI.loadView(this.responseText);

							callback = $.Routes.load(view);

							if (callback){
								callback.apply(null, params);
							}

							$.Routes.historyChanged(view, callback, params);
							
						}
						catch (e){
							$.Exception.handle(e);
						}

					}

				};

				xhr.open("GET", "html/" + view);

				xhr.send(null);
			}
			catch (e){
				$.Exception.handle(e);
			}

		},
		
		historyChanged: function(view, callback, params){
			_history.push([view, callback, params]);
		}

	};

}(Demo, $));