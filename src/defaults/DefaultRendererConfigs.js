define({
	"renderers":[
		{
			"id":"ParticleRenderer",
			"script":"ParticleRenderer",
			"settings": {
			}
		},
		{
			"id":"SurfaceRenderer",
			"script":"ParticleRenderer",
			"settings": {
				"billboardType":2,
				"up":[0, 0, 1]
			}
		},
		{
			"id":"FastTrailRenderer",
			"script":"TrailRenderer",
			"settings": {
				"segmentCount": 3,
				"width": {
					"value": 1,
					"type": "number"
				},
				"updateSpeed": {
					"value": 15,
					"type": "number"
				}
			}
		},
		{
			"id":"TrailRenderer",
			"script":"TrailRenderer",
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
		}
	]
});