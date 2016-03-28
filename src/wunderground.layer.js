/**
 * Layer for current radar and satellite data from Weather Underground
 */
L.Wunderground = (L.Layer?L.Layer:L.Class).extend({

	includes: L.Mixin.Events,

	options: {
		appId: null, // get your free Application ID at http://www.wunderground.com/weather/api/
		opacity: 0.35,
		position: 'front',
		apiRef: null,
	    updateInterval: 150
	},

	initialize: function (options) {
		L.setOptions(this, options);
		this._currentImage = null;
		this._map = null;
		this._urlTemplate = 'http://api.wunderground.com/api/{appId}/radar/satellite/image.gif?rad.maxlat={radmaxlat}&rad.maxlon={radmaxlon}&rad.minlat={radminlat}&rad.minlon={radminlon}&rad.width={radwidth}&rad.height={radheight}&rad.rainsnow=1&rad.reproj.automerc=1&sat.maxlat={satmaxlat}&sat.maxlon={satmaxlon}&sat.minlat={satminlat}&sat.minlon={satminlon}&sat.width={satwidth}&sat.height={satheight}&sat.key=sat_ir4_bottom&sat.gtt=107&sat.proj=me&sat.timelabel=0';
	},

	onAdd: function (map) {
		this._map = map;

		this.update = (L.Util.throttle?L.Util.throttle:L.Util.limitExecByInterval)(this.update, this.options.updateInterval, this);

		this._map.on('moveend', this.update, this);

		// if we had an image loaded and it matches the
		// current bounds show the image otherwise remove it
		if (this._currentImage && this._currentImage._bounds.equals(this._map.getBounds())) {
		    this._map.addLayer(this._currentImage);
		} else if (this._currentImage) {
			this._map.removeLayer(this._currentImage);
			this._currentImage = null;
		}

		this.update();
	},

	onRemove: function (map) {	
		
		if (this._currentImage) {
			this._map.removeLayer(this._currentImage);
		}
		
		this._map.off('moveend', this._update, this);
		this._map = null;
	},

	getAttribution: function () {
	    return 'Radar from <a href="http://www.wunderground.com/?apiref=' + this.options.apiRef + '"'
			+ ' alt="Radar and satellite map online">Weather Underground</a>';
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	removeFrom: function (map) {
		map.removeLayer(this);
		return this;
	},

	bringToFront: function () {
		this.options.position = 'front';
		if (this._currentImage) {
			this._currentImage.bringToFront();
		}
		return this;
	},

	bringToBack: function () {
		this.options.position = 'back';
		if (this._currentImage) {
			this._currentImage.bringToBack();
		}
		return this;
	},


	update: function () {
		
		// try to get cached data first
		var bounds = this._map.getBounds();
		var size = this._map.getSize();

		var url = this._urlTemplate
					.replace('{appId}', this.options.appId)
					.replace('{radmaxlat}', bounds.getNorth().toFixed(2))
					.replace('{radmaxlon}', bounds.getEast().toFixed(2))
					.replace('{radminlat}', bounds.getSouth().toFixed(2))
					.replace('{radminlon}', bounds.getWest().toFixed(2))
					.replace('{radwidth}', size.x)
					.replace('{radheight}', size.y)
					.replace('{satmaxlat}', bounds.getNorth().toFixed(2))
					.replace('{satmaxlon}', bounds.getEast().toFixed(2))
					.replace('{satminlat}', bounds.getSouth().toFixed(2))
					.replace('{satminlon}', bounds.getWest().toFixed(2))
					.replace('{satwidth}', size.x)
					.replace('{satheight}', size.y)
		;

		this._renderImage(url, bounds);
	},

	_renderImage: function (url, bounds) {
		if (this._map) {
			// create a new image overlay and add it to the map
			// to start loading the image
			// opacity is 0 while the image is loading
			var image = new L.ImageOverlay(url, bounds, {
				opacity: 0
			}).addTo(this._map);

			// once the image loads
			image.once('load', function (e) {
				var newImage = e.target;
				var oldImage = this._currentImage;

				// if the bounds of this image matches the bounds that
				// _renderImage was called with and we have a map with the same bounds
				// hide the old image if there is one and set the opacity
				// of the new image otherwise remove the new image
				if (newImage._bounds.equals(bounds) && newImage._bounds.equals(this._map.getBounds())) {
					this._currentImage = newImage;

					if (this.options.position === 'front') {
						this.bringToFront();
					} else {
						this.bringToBack();
					}

					if (this._map && this._currentImage._map) {
						this._currentImage.setOpacity(this.options.opacity);
					} else {
						this._currentImage._map.removeLayer(this._currentImage);
					}

					if (oldImage && this._map) {
						this._map.removeLayer(oldImage);
					}

					if (oldImage && oldImage._map) {
						oldImage._map.removeLayer(oldImage);
					}
				} else {
					this._map.removeLayer(newImage);
				}

				this.fire('load', {
					bounds: bounds
				});

			}, this);

			this.fire('loading', {
				bounds: bounds
			});
		}
	}
});

L.Wunderground.radar = function (options) { return new L.Wunderground(options); };