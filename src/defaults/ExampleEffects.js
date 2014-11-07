define({
	"effects":[
		{
			"id":"firework_blue",
			"effect_data":{
				"color":[0.4,0.4, 1, 1],
				"count":40,
				"opacity":[0.4, 1],
				"alpha":[[0,1], [0.15, 0], [0.3, 1],[0.5, 0], [0.7, 1] ,[1,0]],
				"size":[0.2, 0.22],
				"growthFactor":[0.01, 0.7],
				"growth":[[0, -1], [0.05, 1], [0.3, 2],[0.45, -2], [0.6, 1], [0.75, -1], [0.9,1 ], [1,0]],
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
				"count":50,
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
				"count":60,
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
				"count":30,
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