define([
],

	function (
		) {
		"use strict";

		return {
			"id": "defaultConfig",
			"simulation_params":[
				{
					"param":"color",
					"value": [1, 1, 1, 1],
					"type": "color"
				},
				{
					"param":"count",
					"value": 55,
					"type": "number",
					"min": 1,
					"max": 100
				},
				{
					"param":"opacity",
					"value": [0, 1],
					"type": "range",
					"min": 0.0,
					"max": 1.0
				},
				{
					"param":"alpha",
					"value": "zeroOneZero",
					"type": "option",
					"values":   ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "growShrink"],
					"texts":    ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "growShrink"]
				},
				{
					"param":"size",
					"value": [0.01, 0.1],
					"type": "range",
					"min": 0.0,
					"max": 10.0
				},
				{
					"param":"growthFactor",
					"value": [0.01, 0.3],
					"type": "range",
					"min": 0.0,
					"max": 10.0
				},
				{
					"param":"growth",
					"value": "posToNeg",
					"type": "option",
					"values":   ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "growShrink"],
					"texts":    ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "growShrink"]
				},
				{
					"param":"stretch",
					"value": 1,
					"type": "number",
					"min": 0.0,
					"max": 1.0
				},
				{
					"param":"strength",
					"value": 25,
					"type": "number",
					"min": 0.0,
					"max": 100.0
				},
				{
					"param":"spread",
					"value": 0.2,
					"type": "number",
					"min": 0.0,
					"max": 1.0
				},
				{
					"param":"acceleration",
					"value": 0.98,
					"type": "number",
					"min": 0.0,
					"max": 5.0
				},
				{
					"param":"gravity",
					"value": -10,
					"type": "number",
					"min": -20.0,
					"max": 20.0
				},
				{
					"param":"rotation",
					"value": [0, 6.29],
					"type": "range",
					"min": 0.0,
					"max": 6.29
				},

				{
					"param":"spin",
					"value": "posToNeg",
					"type": "option",
					"values":["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "posToNeg", "negToPos", "growShrink"],
					"texts": ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "posToNeg", "negToPos", "growShrink"]
				},
				{
					"param":"spinspeed",
					"value": [-15, 15],
					"type": "range",
					"min": -40.0,
					"max":  40.0
				},
				{
					"param": "lifespan",
					"value": [0.2, 3],
					"type": "range",
					"min": 0.0,
					"max": 25.0
				}
			],
			"simulator_config":{

				"follow": {
					"value": "box",
					"type": "string"
				},
				"followType": {
					"value": "Mesh",
					"type": "option",
					"values": ["Mesh", "Joint"],
					"texts": ["Mesh", "Joint"]
				},
				"poolCount": 200,

				"spawner": {
					"value": "meshSpawner",
					"type": "option",
					"values": ["sphereSpawner", "randomSpawner", "meshSpawner"],
					"texts": ["sphereSpawner", "randomSpawner", "meshSpawner"]
				},
				"behaviors": [
					// "flockcenter2"
					"meshFollower"
				]
			},
			"renderers": {
				"ParticleRenderer": {
					"enabled": true,
					"settings": {
						"textureUrl": {
							"value": "./configs/gui/images/bin/test/testimage.png",
							"type": "texture"
						},
						"tile": {
							"enabled": {
								"value": false,
								"type": "boolean"
							},
							"tileCountX": {
								"value": 5,
								"type": "number",
								"step": 1,
								"decimals": 0
							},
							"tileCountY": {
								"value": 5,
								"type": "number",
								"step": 1,
								"decimals": 0
							},
							"loopScale": {
								"value": 1,
								"type": "number",
								"step": 0.1,
								"decimals": 1
							},
							"value": true,
							"type": "tile"
						},
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
						},
						"poolCount": 200
					}
				},
				"TrailRenderer": {
					"enabled": true,
					"settings": {
						"textureUrl": {
							"value": "./configs/gui/images/bin/test/testimage.png",
							"type": "texture"
						},
						"tile": {
							"enabled": {
								"value": true,
								"type": "boolean"
							},
							"tileCountX": {
								"value": 1,
								"type": "number",
								"step": 1,
								"decimals": 0
							},
							"tileCountY": {
								"value": 1,
								"type": "number",
								"step": 1,
								"decimals": 0
							},
							"loopScale": {
								"value": 1,
								"type": "number",
								"step": 1,
								"decimals": 1
							},
							"value": true,
							"type": "tile"
						},
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
						},
						"poolCount": 2,
						"segmentCount": 5,
						"width": {
							"value": 1,
							"type": "number"
						},
						"updateSpeed": {
							"value": 5,
							"type": "number"
						}
					}
				},
				"LineRenderer": {
					"enabled": false,
					"settings": {
						"textureUrl": {
							"value": "./configs/gui/images/bin/test/testimage.png",
							"type": "texture"
						},
						"tile": {
							"enabled": {
								"value": false,
								"type": "boolean"
							},
							"tileCountX": {
								"value": 5,
								"type": "number",
								"step": 1,
								"decimals": 0
							},
							"tileCountY": {
								"value": 5,
								"type": "number",
								"step": 1,
								"decimals": 0
							},
							"loopScale": {
								"value": 1,
								"type": "number",
								"step": 0.1,
								"decimals": 1
							},
							"value": true,
							"type": "tile"
						},
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
						},
						"poolCount": 2000,
						"width": {
							"value": 0.1,
							"type": "number",
							"step": 0.01,
							"decimals": 2
						},
						"distance": {
							"value": 0.2,
							"type": "number",
							"step": 0.1
						},
						"limit": {
							"value": 3,
							"type": "number",
							"step": 1,
							"decimals": 0
						}
					}
				},
				"TriangleRenderer": {
					"enabled": false,
					"settings": {
						"textureUrl": {
							"value": "./configs/gui/images/bin/test/testimage.png",
							"type": "texture"
						},
						"tile": {
							"enabled": {
								"value": false,
								"type": "boolean"
							},
							"tileCountX": {
								"value": 5,
								"type": "number",
								"step": 1,
								"decimals": 0
							},
							"tileCountY": {
								"value": 5,
								"type": "number",
								"step": 1,
								"decimals": 0
							},
							"loopScale": {
								"value": 1,
								"type": "number",
								"step": 0.1,
								"decimals": 1
							},
							"value": true,
							"type": "tile"
						},
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
						},
						"poolCount": 2000,
						"distance": {
							"value": 0.2,
							"type": "number"
						}
					}
				}
			}
		};
	});