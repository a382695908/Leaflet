
L.Layer = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		pane: 'overlayPane'
	},

	addTo: function (map) {
		this._map = map;

		var id = L.stamp(this);
		if (map._layers[id]) { return this; }
		map._layers[id] = this;

		// TODO getMaxZoom, getMinZoom in ILayer (instead of options)
		if (this.options && (!isNaN(this.options.maxZoom) || !isNaN(this.options.minZoom))) {
			map._zoomBoundLayers[id] = this;
			map._updateZoomLevels();
		}

		map.whenReady(this._layerAdd, this);

		return this;
	},

	_layerAdd: function () {
		// check in case layer gets added and then removed before the map is ready
		if (!this._map.hasLayer(this)) { return; }

		this.onAdd(this._map);
		this._map.fire('layeradd', {layer: this});
	},

	removeFrom: function (map) {
		var id = L.stamp(this);
		if (!map._layers[id]) { return this; }

		if (map._loaded) {
			this.onRemove(map);
		}

		delete map._layers[id];

		if (map._loaded) {
			map.fire('layerremove', {layer: this});
		}

		if (map._zoomBoundLayers[id]) {
			delete map._zoomBoundLayers[id];
			map._updateZoomLevels();
		}
	},

	getPane: function () {
		// TODO make pane if not present
		return this._map._panes[this.options.pane];
	}
});
