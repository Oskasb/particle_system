define([
],

	function (
		) {
		"use strict";

		return {
			"id": "defaultConfig",
			"simulator_config":{
				"atlas":"defaultSpriteAtlas",
				"renderers": [
					"ParticleRenderer",
					"TrailRenderer"
				],
				"poolCount": 400,
				"blending": {
					"value": "AdditiveBlending",
					"type": "option",
					"values": ["AdditiveBlending", "SubtractiveBlending", "MultiplyBlending", "NoBlending", "CustomBlending"],
					"texts": ["AdditiveBlending", "SubtractiveBlending", "MultiplyBlending", "NoBlending", "CustomBlending"]
				},
				"alphakill": {
					"value": 0,
					"type": "number",
					"min": 0.0,
					"max": 1.0
				}
			}
		};
	});