define({
	"renderers":[
		{
			"id":"ParticleRenderer",
			"settings": {}
		},
		{
			"id":"TrailRenderer",
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
		{
			"id":"LineRenderer",
			"settings": {
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
		{
			"id":"TriangleRenderer",
			"settings": {
				"distance": {
					"value": 0.2,
					"type": "number"
				}
			}
		}
	]
});