/**
 * Implement this method to initialize your script.
 * Called when pressing play and when running exported projects.
 *
 * @param {object} args
 *     Refer to http://www.goocreate.com/learn/parameters
 * @param {object} ctx
 *     Refer to http://www.goocreate.com/learn/the-ctx-object
 * @param {object} goo
 *     Refer to http://www.goocreate.com/learn/the-goo-object
 */



var setup = function(args, ctx, goo) {
	ctx.velVec = new goo.Vector3();
	ctx.posVec = new goo.Vector3();

	ctx.emitProbability = 1;
	ctx.changeEmitProbability = function() {
		ctx.emitProbability = args.probability;
	};

	goo.SystemBus.addListener('changeEmitProbability', ctx.changeEmitProbability);
};

/**
 * Implement this method to do cleanup.
 * Called when the script is stopped or deleted.
 *
 * @param {object} args
 *     Refer to http://www.goocreate.com/learn/parameters
 * @param {object} ctx
 *     Refer to http://www.goocreate.com/learn/the-ctx-object
 * @param {object} goo
 *     Refer to http://www.goocreate.com/learn/the-goo-object
 */
var cleanup = function(args, ctx, goo) {
	goo.SystemBus.removeListener('changeEmitProbability', ctx.changeEmitProbability);
};

/**
 * This function will be called every frame.
 *
 * @param {object} args
 *     Contains all the parameters defined in the 'parameters' variable below.
 *     Its values are chosen in the scripts panel.
 *
 * @param {object} ctx
 *     Refer to http://www.goocreate.com/learn/the-ctx-object
 * @param {object} goo
 *     Refer to http://www.goocreate.com/learn/the-goo-object
 */
var update = function(args, ctx, goo) {

	if (Math.random() > ctx.emitProbability) {
		return;
	}

	ctx.velVec.set(0,0,1);
	ctx.entity.transformComponent.worldTransform.rotation.applyPost(ctx.velVec);
	var eData = {
		"color0":[args.color0[0],args.color0[1],args.color0[2]],
		"color1":[args.color1[0],args.color1[1],args.color1[2]],
		"colorCurve":args.colorCurve,
		"colorRandom":args.colorRandom,
		"count":args.count,
		"opacity":[args.opacity, args.opacity],
		"alpha":args.alpha,
		"size":[args.sizeMin, args.sizeMax],
		"growthFactor":[args.growthFactor, args.growthFactor],
		"growth":args.growth,
		"stretch":args.stretch,
		"strength":args.strength,
		"spread":args.spread,
		"acceleration":args.acceleration,
		"gravity":args.gravity,
		"rotation":[0, args.rotation],
		"spin":args.spin,
		"spinspeed":[args.spinMin, args.spinMax],
		"lifespan":[args.lifeMin, args.lifeMax],
		"sprite":args.sprite,
		"loopcount":args.loopcount,
		"trailsprite":args.trailsprite,
		"trailwidth":args.trailwidth
	};
	ctx.posVec.set(ctx.entity.transformComponent.worldTransform.translation);

	var size = args.volumeBox;

	ctx.posVec.add_d(2*size*Math.random()-size, 2*size*Math.random()-size, 2*size*Math.random()-size);

	goo.SystemBus.emit('spawn_particles', {
		systemId:args.renderer,
		pos:ctx.posVec,
		vel:ctx.velVec,
		effectData:eData
	});
};

/**
 * Parameters defined here will be available on the 'args' object as 'args.key'
 * and customizable using the script panel. Parameters are defined like below.
 * 'key', 'type', and 'default' are required properties.
 *
 * For details refer to: http://www.goocreate.com/learn/parameters
 */
var parameters = [{
	name:"Renderer",
	key:"renderer",
	type:"string",
	default: "AdditiveParticleAndTrail",
	control: "select",
	options: ["AdditiveParticleAndTrail", "StandardParticle", "AdditiveParticle", "FastAdditiveTrail"]
},{
	name:"Color0",
	key:"color0",
	type:"vec3",
	default: [1, 0.7, 0.5],
	control: "color"
},{
	name:"Color1",
	key:"color1",
	type:"vec3",
	default: [1, 0.7, 0.5],
	control: "color"

},{
	name:"ColorCurve",
	key:"colorCurve",
	type:"string",
	default: "oneToZero",
	control: "select",
	options: ["zeroToOne", "oneToZero", "centerStep", "zeroOneZero", "oneZeroOne", "quickFadeOut", "quickInOut"]
},{
	name:"ColorRND",
	key:"colorRandom",
	type:"float",
	default: 0,
	min:0,
	max:1,
	control: "slider"
},{
	name:"Probability",
	key:"probability",
	type:"float",
	default: 1,
	min:0,
	max:1,
	control: "slider"
},{
	name:"VolumeBox",
	key:"volumeBox",
	type:"float",
	default: 0,
	min:0,
	max:200,
	control: "slider"
},{
	name:"Count",
	key:"count",
	type:"int",
	default: 3,
	min:1,
	max:100,
	control: "slider"
},{
	name:"Opacity",
	key:"opacity",
	type:"float",
	default: 1,
	min:0,
	max:1,
	control: "slider"
},{
	name:"AlphaCurve",
	key:"alpha",
	type:"string",
	default: "oneToZero",
	control: "select",
	options: ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "quickFadeOut", "quickInOut"]
},{
	name:"SizeMin",
	key:"sizeMin",
	type:"float",
	default: 1,
	min:0,
	max:10,
	control: "slider"
},{
	name:"SizeMax",
	key:"sizeMax",
	type:"float",
	default: 3,
	min:0,
	max:10,
	control: "slider"
},{
	name:"GrowthFactor",
	key:"growthFactor",
	type:"float",
	default: 3,
	min:-100,
	max:100,
	control: "slider"
},{
	name:"GrowthCurve",
	key:"growth",
	type:"string",
	default: "oneToZero",
	control: "select",
	options: ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "posToNeg", "negToPos", "growShrink"]
},{
	name:"Stretch",
	key:"stretch",
	type:"float",
	default: 0,
	min:0,
	max:1,
	control: "slider"
},{
	name:"Strength",
	key:"strength",
	type:"float",
	default: 0,
	min:0,
	max:250,
	control: "slider"
},{
	name:"Spread",
	key:"spread",
	type:"float",
	default: 0,
	min:0,
	max:1,
	control: "slider"
},{
	name:"Acceleration",
	key:"acceleration",
	type:"float",
	default: 0,
	min:0,
	max:2,
	control: "slider"
},{
	name:"Gravity",
	key:"gravity",
	type:"float",
	default: 0,
	min:-100,
	max:30,
	control: "slider"
},{
	name:"Rotation",
	key:"rotation",
	type:"float",
	default: 7,
	min:0,
	max:7,
	control: "slider"
},{
	name:"SpinCurve",
	key:"spin",
	type:"string",
	default: "oneToZero",
	control: "select",
	options: ["zeroToOne", "oneToZero", "zeroOneZero", "oneZeroOne", "posToNeg", "negToPos", "growShrink"]
},{
	name:"SpinMin",
	key:"spinMin",
	type:"float",
	default: -1,
	min:-30,
	max:30,
	control: "slider"
},{
	name:"SpinMax",
	key:"spinMax",
	type:"float",
	default: 1,
	min:-30,
	max:30,
	control: "slider"
},{
	name:"LifeMin",
	key:"lifeMin",
	type:"float",
	default: -1,
	min:0,
	max:30,
	control: "slider"
},{
	name:"LifeMax",
	key:"lifeMax",
	type:"float",
	default: 1,
	min:0,
	max:30,
	control: "slider"
},{
	name:"AtlasSprite",
	key:"sprite",
	type:"string",
	default: "dot",
	control: "select",
	options: ["0_0", "0_1", "0_2","0_3","0_4","0_5","0_6","0_7","1_0","1_1","1_2","1_3","1_4","1_5","1_6","1_7", "dot", "shockwave", "tail", "bluetrails", "waves", "wave", "smokey", "splash_thin","projectile_1","splash_thick","fielddot","spinfield","sinedot","flaredot","trail_dot","dot_seq","spark_seq","sparks","snow_1","snow_2","snow_3","snow_4","Coin"]
},{
	name:"LoopCount",
	key:"loopcount",
	type:"int",
	default: 1,
	min:1,
	max:100,
	control: "slider"
},{
	name:"TrailSprite",
	key:"trailsprite",
	type:"string",
	default: "projectile_1",
	control: "select",
	options: ["0_0", "0_1", "0_2","0_3","0_4","0_5","0_6","0_7","1_0","1_1","1_2","1_3","1_4","1_5","1_6","1_7", "dot", "shockwave", "tail", "bluetrails", "waves", "wave", "smokey", "splash_thin","projectile_1","splash_thick","fielddot","spinfield","sinedot","flaredot","trail_dot","sparks"]
},{
	name:"TrailWidth",
	key:"trailwidth",
	type:"float",
	default: 1,
	min:0,
	max:3,
	control: "slider"
}
];