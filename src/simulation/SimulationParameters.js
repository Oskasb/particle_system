"use strict";

define(function() {

	// Curve format:    [pointA, pointB]
	// Point:           [progress, amplitude]

	var curves = {
		"zeroToOne":    [[0, 0], [1, 2]],
		"oneToZero":    [[0, 1], [1, 0]],
		"zeroOneZero":  [[0, 0], [0.5,1], [1, 0]],
		"oneZeroOne":   [[0, 1], [0.5,0], [1, 1]],
		"growShrink":   [[0, 1], [0.5,0], [1,-2]]
	};

	var SimulationParameters = function(position, normal, simParams, effectData) {
		this.position = position;
		this.normal = normal;
		this.data = this.configureData(simParams, effectData);
	};

	SimulationParameters.prototype.configureData = function(simParams, effectData) {
		var data = {};

		for (var i = 0; i < simParams.length; i++) {
			if (simParams[i].type == "option") {
				data[simParams[i].param] = curves[simParams[i].value];
			} else {
				data[simParams[i].param] = simParams[i].value;
			}
		}

		if (effectData) {
			for (var key in effectData) {
				data[key] = effectData[key];
			}
		}

		data.effectCount = data.count;
		return data;
	};

	return SimulationParameters
})
;