define({
	"effects":[
		{
			"id":"firework_blue",
			"effect_data":{
				"color":[0.4,0.4, 1, 1],
				"count":100,
				"opacity":[0.4, 1],
				"alpha":"oneToZero",
				"size":[0.02, 0.2],
				"growthFactor":[0.01, 0.7],
				"growth":"posToNeg",
				"stretch":1,
				"strength":12,
				"spread":0.6,
				"acceleration":0.97,
				"gravity":-9,
				"rotation":[0,7],
				"spin":"oneToZero",
				"spinspeed":[-15, 15],
				"lifespan":[1, 3],
				"sprite":"dot_seq",
				"loopcount":15,
				"trailsprite":"tail",
				"trailwidth":0.3
			}
		},
		{
			"id":"firework_red",
			"effect_data":{
				"color":[1,0.4, 0.4, 1],
				"count":90,
				"opacity":[0.4, 1],
				"alpha":"oneToZero",
				"size":[0.02, 0.2],
				"growthFactor":[0.01, 0.7],
				"growth":"posToNeg",
				"stretch":1,
				"strength":22,
				"spread":1,
				"acceleration":0.97,
				"gravity":-9,
				"rotation":[0,7],
				"spin":"oneToZero",
				"spinspeed":[-15, 15],
				"lifespan":[1, 4],
				"sprite":"dot_seq",
				"loopcount":15,
				"trailsprite":"tail",
				"trailwidth":0.3
			}
		},
		{
			"id":"firework_green",
			"effect_data":{
				"color":[0.4, 1, 0.4, 1],
				"count":200,
				"opacity":[0.4, 1],
				"alpha":"oneToZero",
				"size":[0.02, 0.2],
				"growthFactor":[0.01, 0.7],
				"growth":"posToNeg",
				"stretch":1,
				"strength":12,
				"spread":1,
				"acceleration":0.97,
				"gravity":-9,
				"rotation":[0,7],
				"spin":"oneToZero",
				"spinspeed":[-15, 15],
				"lifespan":[1, 2],
				"sprite":"dot_seq",
				"loopcount":15,
				"trailsprite":"tail",
				"trailwidth":0.3
			}
		},
		{
			"id":"firework_cone_yellow",
			"effect_data":{
				"color":[0.8,0.8, 0.3, 1],
				"count":50,
				"opacity":[0.7, 1],
				"alpha":"oneToZero",
				"size":[0.02, 0.2],
				"growthFactor":[0.01, 0.7],
				"growth":"posToNeg",
				"stretch":1,
				"strength":12,
				"spread":0.3,
				"acceleration":0.97,
				"gravity":-9,
				"rotation":[0,7],
				"spin":"oneToZero",
				"spinspeed":[-15, 15],
				"lifespan":[1, 7],
				"sprite":"dot_seq",
				"loopcount":15,
				"trailsprite":"tail",
				"trailwidth":0.2
			}
		}
	]
});