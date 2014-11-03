define([
],

	function (
		) {
		"use strict";

		return {
			"id": "defaultConfig",
			"simulator_config":{
				"atlas":"defaultSpriteAtlas",

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

					}
				},
				"TrailRenderer": {
					"enabled": true,
					"settings": {
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