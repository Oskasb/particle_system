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
					"value": [0.6, 0.7, 1, 1],
					"type": "color"
				},
				{
					"param":"count",
					"value": 85,
					"type": "number",
					"min": 1,
					"max": 200
				},
				{
					"param":"opacity",
					"value": [0.6, 1],
					"type": "range",
					"min": 0.0,
					"max": 1.0
				},
				{
					"param":"alpha",
					"value": "zeroOneZero",
					"type": "curve",
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
					"value": [0.02, 0.6],
					"type": "range",
					"min": 0.0,
					"max": 10.0
				},
				{
					"param":"growth",
					"value": "posToNeg",
					"type": "curve",
					"values":["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "posToNeg", "negToPos", "growShrink"],
			   		"texts": ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "posToNeg", "negToPos", "growShrink"]
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
					"value": 15,
					"type": "number",
					"min": 0.0,
					"max": 100.0
				},
				{
					"param":"spread",
					"value": 0.4,
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
					"value": -8,
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
					"type": "curve",
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
					"value": [0.01, 4],
					"type": "range",
					"min": 0.0,
					"max": 25.0
				},
				{
					"param": "sprite",
					"value": "dot_seq",
					"type": "option",
					"values":["dot", "dot_seq","spark_seq", "trail_dot", "flaredot", "sparks"],
					"texts": ["dot", "dot_seq","spark_seq", "trail_dot", "flaredot", "sparks"]
				},
				{
					"param": "loopcount",
					"value": 5,
					"type": "number",
					"min": 1,
					"max": 100.0
				},
				{
					"param": "trailsprite",
					"value": "tail",
					"type": "option",
					"values":["dot","tail", "bluetrails", "wave", "waves", "dot_seq","spark_seq", "trail_dot", "flaredot", "sparks"],
					"texts": ["dot","tail", "bluetrails", "wave", "waves", "dot_seq","spark_seq", "trail_dot", "flaredot", "sparks"]
				},
				{
					"param": "trailwidth",
					"value": 0.2,
					"type": "number",
					"min": 0,
					"max": 10.0
				}

			],
			"simulator_config":{
				"atlas": {
					"textureUrl": {
						"value": "./configs/gui/images/bin/test/particle_atlas.png",
						"type": "texture",
						"tilesX":8,
						"tilesY":8
					},
					"sprites":[
						{
							"id":"dot",
							"tiles":[[2, 4]]
						},
						{
							"id":"tail",
							"tiles":[[0, 5]]
						},
						{
							"id":"bluetrails",
							"tiles":[[2, 2]]
						},
						{
							"id":"waves",
							"tiles":[[0, 7]]
						},
						{
							"id":"wave",
							"tiles":[[0, 6]]
						},
						{
							"id":"sparks",
							"tiles":[[3, 0]]
						},
						{
							"id":"dot_seq",
							"tiles":[[0, 4],[2, 4],[1, 4], [3, 4],[2, 4], [4, 4]]
						},
						{
							"id":"spark_seq",
							"tiles":[[0, 3],[1, 3],[2, 3], [1, 3]]
						},
						{
							"id":"trail_dot",
							"tiles":[[2, 2],[3, 2],[4, 1], [5, 2], [6, 0], [7, 2], [8, 1]]
						},
						{
							"id":"flaredot",
							"tiles":[[4, 0]]
						}
					]
				},

				"follow": {
					"value": "box",
					"type": "string"
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
				"followType": {
					"value": "Mesh",
					"type": "option",
					"values": ["Mesh", "Joint"],
					"texts": ["Mesh", "Joint"]
				},
				"poolCount": 400,

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
								"value": true,
								"type": "boolean"
							},
							"tileCountX": {
								"value": 5,
								"type": "number",
								"step": 2,
								"decimals": 0
							},
							"tileCountY": {
								"value": 5,
								"type": "number",
								"step": 2,
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
						}
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
						"distance": {
							"value": 0.2,
							"type": "number"
						}
					}
				}
			}
		};
	});