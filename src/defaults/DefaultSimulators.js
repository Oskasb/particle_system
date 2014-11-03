define({
	"simulators":[
		{
			"id": "AdditiveParticleAndTrail",
			"atlas":"defaultSpriteAtlas",
			"renderers": [
				"ParticleRenderer",
				"TrailRenderer"
			],
			"poolCount": 2000,
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
		},
		{
			"id": "AdditiveParticle",
			"atlas":"defaultSpriteAtlas",
			"renderers": [
				"ParticleRenderer"
			],
			"poolCount": 4000,
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
	]
});