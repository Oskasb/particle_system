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


var MeshData, Shader, Material, MeshRendererComponent, Vector3, Vector4, Renderer

var trailDirection;
var trailCamVec;



var setup = function(args, ctx, goo) {

	MeshData = goo.MeshData;
	Shader = goo.Shader;
	Material = goo.Material;
	MeshRendererComponent = goo.MeshRendererComponent;
	Vector3 = goo.Vector3;
	Vector4 = goo.Vector4;
	Renderer = goo.Renderer;

	trailDirection = new Vector3();
	trailCamVec = new Vector3();

	ctx.particlesAPI = new ParticlesAPI(ctx.world.gooRunner)


	console.log("Setup Particles:", ctx.particlesAPI, ctx.entity)

	var tx = ctx.entity.meshRendererComponent.materials[0]._textureMaps.DIFFUSE_MAP;

	ctx.particlesAPI.createParticleSystems(DefaultSimulators, DefaultRendererConfigs, DefaultSpriteAtlas.atlases[0], tx);

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

	var eData = {
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
		"trailsprite":"bluetrails",
		"trailwidth":0.8
	}

	ctx.particlesAPI.spawnParticles(
		'AdditiveParticleAndTrail',
		ctx.entity.transformComponent.transform.translation,
		new Vector3(0.5-Math.random(), 1 ,0.5-Math.random()),
		eData);


	ctx.particlesAPI.requestFrameUpdate(ctx.world.tpf);

};

/**
 * Parameters defined here will be available on the 'args' object as 'args.key'
 * and customizable using the script panel. Parameters are defined like below.
 * 'key', 'type', and 'default' are required properties.
 *
 * For details refer to: http://www.goocreate.com/learn/parameters
 */
var parameters = [];






// Deps:

// var MeshData, Shader, Material, MeshRendererComponent, Vector3, Vector4, Renderer



// Particle script follow...

var ParticlesAPI = function(gooRunner) {
	this.particleSystem = new ParticleSystem(gooRunner);
};

ParticlesAPI.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};

ParticlesAPI.prototype.requestFrameUpdate = function(tpf) {
	this.particleSystem.update(tpf);
};

ParticlesAPI.prototype.spawnParticles = function(id, position, normal, effectData, callbacks) {
	this.particleSystem.spawnParticleSimulation(id, position, normal, effectData, callbacks)
};

ParticlesAPI.prototype.createParticleSystems = function(systemConfigs, rendererConfigs, atlasConfig, texture) {
	this.particleSystem.addConfiguredAtlasSystems(systemConfigs, rendererConfigs, atlasConfig, texture)
};

ParticlesAPI.prototype.removeParticleSystem = function(id) {
	this.particleSystem.remove(id)
};



function ParticleSystem(goo) {
	this.goo = goo;
	this.atlases = {};
	this.simData = {};
	this.simulators = {};
	this.groups = {};
}

ParticleSystem.prototype.addConfiguredAtlasSystems = function (simConfigs, rendererConfigs, atlasConfig, texture) {
	for (var i = 0; i < simConfigs.simulators.length; i++) {
		var simSettings = simConfigs.simulators[i];
		var simulator = new ParticleSimulator(this.goo, simSettings, rendererConfigs, atlasConfig, texture);
		this.simulators[simSettings.id] = simulator;
	}
};

ParticleSystem.prototype.spawnParticleSimulation = function(id, position, normal, effectData, callbacks) {
	this.simulators[id].addEffectSimulation(position, normal, effectData, callbacks)
};

ParticleSystem.prototype.get = function (id) {
	return this.simulators[id];
};

ParticleSystem.prototype.remove = function (id) {
	if (this.simulators[id]) {
		this.simulators[id].remove();
		delete this.simulators[id];
	}
};

ParticleSystem.prototype.wakeParticle = function(id) {
	var simulator = this.simulators[id];
	if (simulator) {
		return simulator.wakeParticle();
	}
};

ParticleSystem.prototype.setVisible = function(id, visible) {
	var simulator = this.simulators[id];
	if (simulator) {
		return simulator.setVisible(visible);
	}
};

ParticleSystem.prototype.update = function(tpf) {
	var infostr = '';
	for (var simulatorId in this.simulators) {
		var simulator = this.simulators[simulatorId];
		simulator.update(tpf);

		infostr += simulatorId + ' = ' + simulator.aliveParticles + '<br>';
	}

	// document.getElementById('particlestats').innerHTML = infostr;
};



var curves = {
	"zeroToOne":    [[0, 0], [1, 1]],
	"oneToZero":    [[0, 1], [1, 0]],
	"posToNeg":     [[0, 1], [1,-1]],
	"negToPos":     [[0,-1], [1, 1]],
	"zeroOneZero":  [[0, 0], [0.5,1], [1, 0]],
	"oneZeroOne":   [[0, 1], [0.5,0], [1, 1]],
	"growShrink":   [[0, 1], [0.5,0], [1,-2]]
};

var SimulationParameters = function(position, normal, simParams, effectData) {
	this.position = position;
	this.normal = normal;
	this.data = this.configureData(simParams, effectData);
};

SimulationParameters.prototype.configureData = function(simParams, effectData) {
	var data = {};

	for (var i = 0; i < simParams.length; i++) {

		var value;

		if (effectData[simParams[i].param]) {
			value = effectData[simParams[i].param];
		} else {
			value = simParams[i].value
		}

		if (simParams[i].type == "curve" && typeof(value) == 'string') {
			data[simParams[i].param] = curves[value];
		} else {
			data[simParams[i].param] = value;
		}
	}


	data.effectCount = data.count;
	return data;
};


function createRenderer(name) {
	if (name === 'ParticleRenderer') {
		return new ParticleRenderer();
	} else if (name === 'TrailRenderer') {
		return new TrailRenderer();
	}
}

function ParticleSimulator(goo, settings, rendererConfigs, spriteAtlas, texture) {
	this.goo = goo;
	this.settings = settings;
	this.rendererConfigs = rendererConfigs;
	this.rendererSettings = {};
	this.meshPositions = [];
	this.simulations = [];

	this.totalPool = this.settings.poolCount;

	this.particles = [];

	this.availableParticles = [];

	for (var i = 0; i < this.totalPool; i++) {
		this.availableParticles[i] = new Particle(i);
	}

	this.setup = settings.setup;

	this.behaviors = [];

	this.renderers = [];
	settings.renderers = settings.renderers || [];

	for (i = 0; i < this.rendererConfigs.renderers.length; i++) {
		this.rendererSettings[this.rendererConfigs.renderers[i].id] = this.rendererConfigs.renderers[i];
	}

	for (i = 0; i < settings.renderers.length; i++) {
		this.initRenderer(settings.renderers[i], spriteAtlas, texture);
	}

	this.setVisible(true);

}


ParticleSimulator.prototype.getAvailableSimulation = function() {

	for (var i = 0; i < this.simulations.length; i++) {
		if (!this.simulations[i].active) {
			return this.simulations[i];
		}
	}
	var sim = new ParticleSimulation();
	this.simulations.push(sim);
	return sim;
};

ParticleSimulator.prototype.addEffectSimulation = function(position, normal, effectData, callbacks) {

	var sim = this.getAvailableSimulation();

	if (this.availableParticles.length -1 <= 0) {
		console.error("Pool exhausted:", this.settings.id);
		return;
	}

	sim.initSimulation(position, normal, this.settings.simulation_params, effectData);
	this.includeSimulation(sim, callbacks);
};


ParticleSimulator.prototype.initRenderer = function(rendererName, spriteAtlas, texture) {
	var rendererConf = this.rendererSettings[rendererName];
	var renderer = createRenderer(rendererConf.script);
	renderer.topSettings = this.settings;
	renderer.globalSettings = rendererConf;
	this.renderers.push(renderer);
	if (renderer.init) {
		renderer.init(this.goo, this.settings, rendererConf.settings, spriteAtlas, texture);
	}
};


ParticleSimulator.prototype.remove = function () {
	for (var i = 0; i < this.renderers.length; i++) {
		if (this.renderers[i].remove) {
			this.renderers[i].remove();
		}
	}
};

ParticleSimulator.prototype.setVisible = function (visible) {
	for (var i = 0; i < this.renderers.length; i++) {
		if (this.renderers[i].setVisible) {
			this.renderers[i].setVisible(visible);
		}
	}
	this.visible = visible;
};




ParticleSimulator.prototype.includeSimulation = function(sim, callbacks) {

	if (callbacks) {
		sim.registerEffectCallbacks(callbacks);
	}

	for (var i = 0; i < this.renderers.length; i++) {
		sim.registerParticleRenderer(this.renderers[i]);
	}

	var simD = sim.params.data;
	var count = Math.ceil(simD.count * (this.availableParticles.length-1) / this.totalPool);
	//	count = Math.min(count, this.availableParticles.length-1);
	//	console.log("counts: ", count, this.availableParticles.length, this.totalPool);

	for (i = 0; i < count; i++) {
		var particle = this.availableParticles.pop();
		if (!particle) {
			console.log("");
			return;
		}
		var ratio = 1 - (simD.count-i) / simD.count;
		sim.includeParticle(particle, ratio);
	}
};

var i;

ParticleSimulator.prototype.recoverSimulation = function(sim) {
	for (var i = 0; i < sim.particles.length; i++) {
		var p = sim.particles[i];
		this.availableParticles.push(p);
	}

	if (sim.particles.length != sim.recover.length) {
		console.error("count missmatch", sim)
		return;
	}

	sim.resetSimulation();

};

ParticleSimulator.prototype.updateSimulation = function (tpf, sim) {
	if (!sim.active) return;

	sim.updateSimParticles(tpf);

	if (sim.particles.length == sim.recover.length) {
		this.recoverSimulation(sim);
	}
};



ParticleSimulator.prototype.update = function (tpf) {
	if (!this.visible) {
		return;
	}

	for (i = 0; i < this.simulations.length; i++) {
		this.updateSimulation(tpf, this.simulations[i]);
	}

	for (i = 0; i < this.renderers.length; i++) {
		if (typeof(this.renderers[i].updateMeshdata) == 'function') {
			this.renderers[i].updateMeshdata();
		}
	}

};



var ParticleSimulation = function() {
	this.resetSimulation();
};

ParticleSimulation.prototype.resetSimulation = function() {
	this.renderers = [];
	this.particles = [];
	this.recover = [];
	this.active = false;
	this.onUpdate = null;
	this.particleUpdate = null;
	this.onParticleAdded = null;
	this.onParticleDead = null;
};

ParticleSimulation.prototype.initSimulation = function(posVec, normVec, defaultSettings, effectData) {
	this.resetSimulation();
	this.params = new SimulationParameters(new Vector3(posVec), new Vector3(normVec), DefaultSimulationParams.particle_params, effectData);
	this.calcVec = new Vector3();
	this.active = true;
};


ParticleSimulation.prototype.registerEffectCallbacks = function(callbacks) {
	if (callbacks.onUpdate) {
		this.onUpdate = callbacks.onUpdate;
	}

	if (callbacks.particleUpdate) {
		this.particleUpdate = callbacks.particleUpdate;
	}

	if (callbacks.onParticleAdded) {
		this.onParticleAdded = callbacks.onParticleAdded;
	}

	if (callbacks.onParticleDead) {
		this.onParticleDead = callbacks.onParticleDead;
	}

};

ParticleSimulation.prototype.registerParticleRenderer = function(renderer) {
	this.renderers.push(renderer);
};

ParticleSimulation.prototype.attachSpawnBehaviour = function(nr, rendererName) {
	this.behaviors[nr] = createSpawner(rendererName);
};

ParticleSimulation.prototype.notifyDied = function(particle) {
	particle.reset();
	for (var i = 0; i < this.renderers.length; i++) {
		this.renderers[i].died(particle)
	}
	if (this.onParticleDead) {
		this.onParticleDead(particle);
	}

	this.recover.push(particle);
};

ParticleSimulation.prototype.includeParticle = function(particle, ratio) {
	particle.joinSimulation(this.params, ratio);
	this.particles.push(particle);
	if (this.onParticleAdded) {
		this.onParticleAdded(particle);
	}
};

ParticleSimulation.prototype.getInterpolatedInCurveAboveIndex = function(value, curve, index) {
	return curve[index][1] + (value - curve[index][0]) / (curve[index+1][0] - curve[index][0])*(curve[index+1][1]-curve[index][1]);
};

ParticleSimulation.prototype.valueFromCurve = function(value, curve) {
	for (var i = 0; i < curve.length; i++) {
		if (!curve[i+1]) return 0;
		if (curve[i+1][0] > value) return this.getInterpolatedInCurveAboveIndex(value, curve, i)
	}
	return 0;
};


ParticleSimulation.prototype.applyParticleCurves = function(particle, deduct) {
	particle.size += particle.growthFactor * this.valueFromCurve(particle.progress, particle.growth) * deduct;
	particle.rotation += particle.spinspeed * this.valueFromCurve(particle.progress, particle.spin) * deduct;
	particle.color.data[3] = particle.opacity * this.valueFromCurve(particle.progress, particle.alpha);
};

ParticleSimulation.prototype.defaultParticleUpdate = function(particle, deduct) {

	// Note frame offset expects ideal frame (0.016) to make stable geometries
	particle.progress = 1-((particle.lifeSpan - particle.frameOffset*0.016)  / particle.lifeSpanTotal);

	this.applyParticleCurves(particle, deduct);

	particle.velocity.muld(particle.acceleration, particle.acceleration, particle.acceleration);
	particle.velocity.add_d(0, particle.gravity*deduct, 0);

	this.calcVec.set(particle.velocity);
	this.calcVec.muld(deduct, deduct, deduct);
	particle.position.addv(this.calcVec);

};

ParticleSimulation.prototype.updateParticle = function(particle, tpf) {

	if (particle.dead) {
		return;
	}

	// Particles need to have a fixed geometry the first frame of their life or things go bonkerz when framerate varies.
	var deduct = tpf;
	if (!particle.frameCount) {
		deduct = 0.016;
	}

	particle.lifeSpan -= deduct;

	if (this.particleUpdate) {
		this.particleUpdate(particle);
	} else {
		this.defaultParticleUpdate(particle, deduct)
	}

	if (particle.lifeSpan < 0 || particle.requestKill) {
		this.notifyDied(particle);
		return;
	}

	this.renderParticle(tpf, particle);
};

ParticleSimulation.prototype.updateSimParticles = function(tpf) {

	if (this.onUpdate) {
		this.onUpdate(this);
	}


	for (var i = 0; i < this.particles.length; i++) {
		this.updateParticle(this.particles[i], tpf)
	}

};

ParticleSimulation.prototype.renderParticle = function(tpf, particle) {

	for (var i = 0; i < this.renderers.length; i++) {
		if (typeof(this.renderers[i].updateParticle) == 'function') {
			this.renderers[i].updateParticle(tpf, particle)
		}

	}

};


function Particle(idx) {
	this.index = idx;
	this.position 	= new Vector3();
	this.direction = new Vector3();
	this.velocity 	= new Vector3();
	this.color 		= new Vector4();


	this.id = Particle.ID++;
	this.reset();
}

Particle.ID = 0;

Particle.prototype.reset = function () {
	this.position.set(0, 0, 0);
	this.velocity.set(0, 0, 0);
	this.color.set(1, 1, 1, 1);

	this.opacity = 1;
	this.alpha = [[0, 0], [1, 1]];

	this.size = 1;
	this.growthFactor = 1;
	this.growth = [[0, 1], [1, 0]];

	this.acceleration = 1;
	this.gravity = 0;
	this.rotation = 0;
	this.spinspeed = 0;
	this.spin = [[0, 1], [1, 0]];

	this.lifeSpan = 0;
	this.lifeSpanTotal = 0;
	this.progress = 0;
	this.frameOffset = 0;
	this.frameCount = 0;

	this.tileIndex = 0;
	this.offsetX = 0;
	this.offsetY = 0;

	this.dead = true;
	this.requestKill = false;
};

function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}


Particle.prototype.joinSimulation = function (simParams, ratio) {
	var simD = simParams.data;

	this.direction.x = (Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*simParams.normal.x;
	this.direction.y = (Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*simParams.normal.y;
	this.direction.z = (Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*simParams.normal.z;

	this.direction.normalize();

	this.velocity.x = simD.strength*this.direction.x;
	this.velocity.y = simD.strength*this.direction.y;
	this.velocity.z = simD.strength*this.direction.z;

	this.position.x = simParams.position.x + this.velocity.x * simD.stretch * ratio ;
	this.position.y = simParams.position.y + this.velocity.y * simD.stretch * ratio ;
	this.position.z = simParams.position.z + this.velocity.z * simD.stretch * ratio ;

	this.sprite = simD.sprite;
	this.trailSprite = simD.trailsprite;
	this.trailWidth = simD.trailwidth;
	this.loopcount = simD.loopcount;
	this.color.set(simD.color);
	this.opacity = randomBetween(simD.opacity[0], simD.opacity[1]);
	this.alpha = simD.alpha;

	this.size = randomBetween(simD.size[0], simD.size[1]);
	this.growthFactor = randomBetween(simD.growthFactor[0], simD.growthFactor[1]);
	this.growth = simD.growth;

	this.spin = simD.spin;
	this.spinspeed = randomBetween(simD.spinspeed[0], simD.spinspeed[1]);
	this.rotation = randomBetween(simD.rotation[0], simD.rotation[1]);

	this.acceleration = simD.acceleration;
	this.gravity = simD.gravity;

	this.progress = 0;
	this.lifeSpan = randomBetween(simD.lifespan[0], simD.lifespan[1]);
	this.lifeSpanTotal = this.lifeSpan;

	this.frameOffset = ratio;

	this.dead = false;
};

Particle.prototype.setTileInfo = function (tileInfo, scaleX, scaleY) {
	this.tileInfo = tileInfo;
	this.scaleX = scaleX;
	this.scaleY = scaleY;
};

Particle.prototype.setTrailInfo = function (trailInfo, trailScaleX, trailScaleY) {
	this.trailInfo = trailInfo;
	this.trailScaleX = trailScaleX;
	this.trailScaleY = trailScaleY;
	this.trailOffsetX = this.trailScaleX * this.trailInfo.tiles[0][0];
	this.trailOffsetY = 1 - this.trailScaleY * (this.trailInfo.tiles[0][1]+1);
};



Particle.prototype.selectAnimationFrame = function() {
	this.tileIndex = Math.floor(this.tileInfo.tiles.length * this.progress * this.loopcount) % this.tileInfo.tiles.length;
};

Particle.prototype.updateAtlasOffsets = function() {
	if (this.tileInfo.tiles.length > 1) {
		this.selectAnimationFrame();
	}
	this.offsetX = this.scaleX * this.tileInfo.tiles[this.tileIndex][0];
	this.offsetY = 1 - this.scaleY * (this.tileInfo.tiles[this.tileIndex][1]+1);
};

Particle.prototype.setDataUsage = function () {
};


Particle.prototype.killParticle = function () {
	this.requestKill = true;
};


function TrailRenderer() {
	this.settings = null;
	this.entity = null;
	this.meshData = null;

	this.segmentCount = 0;
	this.sprites = {};
	this.trailDatas = [];
	this.facingMode = 'Billboard'; //'Tangent'
	// 	this.updateMode = 'Step'; //'Interpolate'
	this.updateMode = 'Interpolate'; //'Step'
}

function TrailData(segments) {
	this.isReset = true;
	this.width = 1;
	this.invalid = true;
	this.throttle = 10;
	this.trailSegmentDatas = [];
	for (var i = segments - 1; i >= 0; i--) {
		this.trailSegmentDatas.push(new TrailSegmentData());
	}
}

function TrailSegmentData() {
	this.position = new Vector3();
	this.tangent = new Vector3();
	this.interpolatedPosition = new Vector3();
}

function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

TrailRenderer.prototype.init = function(goo, simConf, settings, spriteAtlas, texture) {
	this.settings = settings;

	this.atlasConf = spriteAtlas;

	for (var i = 0; i < this.atlasConf.sprites.length; i++) {
		this.sprites[this.atlasConf.sprites[i].id] = this.atlasConf.sprites[i];
	}

	this.scaleX = 1 / this.atlasConf.textureUrl.tilesX;
	this.scaleY = 1 / this.atlasConf.textureUrl.tilesY;

	this.segmentCount = settings.segmentCount || 8;

	settings.poolCount = simConf.poolCount;

	var attributeMap = MeshData.defaultMap([MeshData.POSITION, MeshData.TEXCOORD0, MeshData.COLOR]);
	attributeMap.TILE = MeshData.createAttribute(4, 'Float');
	var meshData = new MeshData(attributeMap,
		settings.poolCount * this.segmentCount * 2,
		settings.poolCount * (this.segmentCount - 1) * 6);
	meshData.vertexData.setDataUsage('DynamicDraw');
	this.meshData = meshData;



	var particleTrailShader = {
		attributes: {
			vertexPosition: MeshData.POSITION,
			vertexColor: MeshData.COLOR,
			vertexCoords: MeshData.TEXCOORD0,
			textureTile: 'TILE'
		},
		uniforms: {
			viewMatrix: Shader.VIEW_MATRIX,
			projectionMatrix: Shader.PROJECTION_MATRIX,
			worldMatrix: Shader.WORLD_MATRIX,
			particleMap: 'PARTICLE_MAP',
			cameraPosition: Shader.CAMERA,
			time: Shader.TIME,
			alphakill: 0
		},
		vshader: [
			'attribute vec3 vertexPosition;',
			'attribute vec4 vertexColor;',
			'attribute vec2 vertexCoords;',
			'attribute vec4 textureTile;',

			// 'uniform mat4 viewProjectionMatrix;',
			'uniform mat4 viewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform mat4 worldMatrix;',
			'uniform vec3 cameraPosition;',
			'uniform float time;',

			'varying vec4 color;',
			'varying vec2 coords;',

			'void main(void) {',
			'color = vertexColor;',
			'coords = vertexCoords * textureTile.zw + textureTile.xy;',
			'gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertexPosition.xyz, 1.0);',
			'}'
		].join('\n'),
		fshader: [
			'uniform sampler2D particleMap;',
			'uniform float alphakill;',

			'varying vec4 color;',
			'varying vec2 coords;',

			'void main(void)',
			'{',
			'vec4 col = color * texture2D(particleMap, coords);',
			'if (col.a <= alphakill) discard;',
			'gl_FragColor = col;',
			'}'
		].join('\n')
	};




	var material = new Material(particleTrailShader);
	material.uniforms.alphakill = simConf.alphakill.value;
	material.blendState.blending = simConf.blending.value;
	material.cullState.enabled = false;
	material.depthState.write = false;
	material.renderQueue = settings.renderqueue !== undefined ? settings.renderqueue : 3010;
	var entity = this.entity = goo.world.createEntity(meshData);
	entity.set(new MeshRendererComponent(material));
	entity.name = 'TrailRenderer';
	entity.meshRendererComponent.cullMode = 'Never';
	entity.addToWorld();

	material.setTexture('PARTICLE_MAP', texture);

	var col = this.meshData.getAttributeBuffer(MeshData.COLOR);
	var texcoord = this.meshData.getAttributeBuffer(MeshData.TEXCOORD0);
	var tile = this.meshData.getAttributeBuffer('TILE');
	var indices = this.meshData.getIndexBuffer();
	for (var i = 0; i < settings.poolCount; i++) {
		var trailData = new TrailData(this.segmentCount);
		trailData.width = this.settings.width.value;
		this.trailDatas.push(trailData);

		for (var j = 0; j < this.segmentCount; j++) {
			tile[this.segmentCount * 8 * i + j * 8 + 0] = 0; //offset u
			tile[this.segmentCount * 8 * i + j * 8 + 1] = 0; //offset w
			tile[this.segmentCount * 8 * i + j * 8 + 2] = 1; //scale u
			tile[this.segmentCount * 8 * i + j * 8 + 3] = 1; //scale w
			tile[this.segmentCount * 8 * i + j * 8 + 4] = 0; //offset u
			tile[this.segmentCount * 8 * i + j * 8 + 5] = 0; //offset w
			tile[this.segmentCount * 8 * i + j * 8 + 6] = 1; //scale u
			tile[this.segmentCount * 8 * i + j * 8 + 7] = 1; //scale w

			col[this.segmentCount * 8 * i + j * 8 + 0] = 1;
			col[this.segmentCount * 8 * i + j * 8 + 1] = 1;
			col[this.segmentCount * 8 * i + j * 8 + 2] = 1;
			col[this.segmentCount * 8 * i + j * 8 + 3] = 1;
			col[this.segmentCount * 8 * i + j * 8 + 4] = 1;
			col[this.segmentCount * 8 * i + j * 8 + 5] = 1;
			col[this.segmentCount * 8 * i + j * 8 + 6] = 1;
			col[this.segmentCount * 8 * i + j * 8 + 7] = 1;

			texcoord[this.segmentCount * 4 * i + j * 4 + 0] = j / this.segmentCount;
			texcoord[this.segmentCount * 4 * i + j * 4 + 1] = 0;
			texcoord[this.segmentCount * 4 * i + j * 4 + 2] = j / this.segmentCount;
			texcoord[this.segmentCount * 4 * i + j * 4 + 3] = 1;
		}

		var segCount = this.segmentCount - 1;
		for (var j = 0; j < segCount; j++) {
			indices[segCount * 6 * i + j * 6 + 0] = this.segmentCount * 2 * i + j * 2 + 0;
			indices[segCount * 6 * i + j * 6 + 1] = this.segmentCount * 2 * i + j * 2 + 1;
			indices[segCount * 6 * i + j * 6 + 2] = this.segmentCount * 2 * i + j * 2 + 2;
			indices[segCount * 6 * i + j * 6 + 3] = this.segmentCount * 2 * i + j * 2 + 2;
			indices[segCount * 6 * i + j * 6 + 4] = this.segmentCount * 2 * i + j * 2 + 1;
			indices[segCount * 6 * i + j * 6 + 5] = this.segmentCount * 2 * i + j * 2 + 3;
		}
	}
};

TrailRenderer.prototype.setTrailFront = function(trailData, position, tangent, tpf) {
	var trail = null;

	if (trailData.isReset) {
		for (var i = 0; i < this.segmentCount; i++) {
			var trailSegmentData = trailData.trailSegmentDatas[i];
			trailSegmentData.position.setv(position);
		}

		trailData.isReset = false;
	}

	var trailSegmentDatas = trailData.trailSegmentDatas;
	// Check if time to add or wrap the trail sections
	trailData.throttle += tpf * this.settings.updateSpeed.value;
	if (trailData.throttle > 1.0) {
		trailData.throttle %= 1.0;

		trail = trailSegmentDatas.splice(trailSegmentDatas.length - 1, 1)[0]; // removeLast();
		trailSegmentDatas.splice(0, 0, trail); // addFirst(trail);
	} else {
		trail = trailSegmentDatas[0]; // get first
	}

	// Always update the front section
	trail.position.setv(position);
	if (tangent != null) {
		trail.tangent.setv(tangent);
	}
	trailData.invalid = true;
};

TrailRenderer.prototype.updateTrail = function(trailData, particle, camPos, index) {


	var trailSegmentDatas = trailData.trailSegmentDatas;

	if (trailData.invalid || this.facingMode == 'Billboard') {
		if (this.updateMode == 'Step') {
			this.updateStep(trailData, particle, camPos, index);
		} else {
			this.updateInterpolate(trailData, particle, camPos, index);
		}
		trailData.invalid = false;
	}
};



TrailRenderer.prototype.updateStep = function(trailData, particle, camPos, index) {
	var trailSegmentDatas = trailData.trailSegmentDatas;

	var pos = this.meshData.getAttributeBuffer(MeshData.POSITION);
	var col = this.meshData.getAttributeBuffer(MeshData.COLOR);

	for (var i = 0; i < this.segmentCount; i++) {
		var trailSegmentData = trailSegmentDatas[i];
		var trailVector = trailSegmentData.position;

		if (this.facingMode == 'Billboard') {
			if (i === 0) {
				trailDirection.set(trailSegmentDatas[i + 1].position).subv(trailVector);
			} else if (i === this.segmentCount - 1) {
				trailDirection.set(trailVector).subv(trailSegmentDatas[i - 1].position);
			} else {
				trailDirection.set(trailSegmentDatas[i + 1].position)
					.subv(trailSegmentDatas[i - 1].position);
			}

			trailCamVec.set(trailVector).subv(camPos);
			trailDirection.cross(trailCamVec);
			trailDirection.normalize().mul(trailData.width * particle.size);
		} else if (trailSegmentData.tangent != null) {
			trailDirection.set(trailSegmentData.tangent).mul(trailData.width * particle.size);
		} else {
			trailDirection.set(trailData.width * particle.size, 0, 0);
		}

		pos[(index * this.segmentCount * 6) + 6 * i + 0] = trailVector.x - trailDirection.x;
		pos[(index * this.segmentCount * 6) + 6 * i + 1] = trailVector.y - trailDirection.y;
		pos[(index * this.segmentCount * 6) + 6 * i + 2] = trailVector.z - trailDirection.z;

		pos[(index * this.segmentCount * 6) + 6 * i + 3] = trailVector.x + trailDirection.x;
		pos[(index * this.segmentCount * 6) + 6 * i + 4] = trailVector.y + trailDirection.y;
		pos[(index * this.segmentCount * 6) + 6 * i + 5] = trailVector.z + trailDirection.z;

		col[(index * this.segmentCount * 8) + 8 * i + 3] = particle.color.data[3];
	}
};

TrailRenderer.prototype.updateInterpolate = function(trailData, particle, camPos, index) {
	var trailSegmentDatas = trailData.trailSegmentDatas;
	particle.setTrailInfo(this.sprites[particle.trailSprite], this.scaleX, this.scaleY);
	var pos = this.meshData.getAttributeBuffer(MeshData.POSITION);
	var col = this.meshData.getAttributeBuffer(MeshData.COLOR);
	var tile = this.meshData.getAttributeBuffer('TILE');

	for (var i = 0; i < this.segmentCount; i++) {
		var trailSegmentData = trailSegmentDatas[i];
		var interpolationVector = trailSegmentData.interpolatedPosition;

		interpolationVector.setv(trailSegmentData.position);

		if (i > 0) {
			interpolationVector.lerp(trailSegmentDatas[i - 1].position, trailData.throttle);
		}
	}



	var coldata = particle.color.data;
	var w = particle.size * particle.trailWidth;
	for (var i = 0; i < this.segmentCount; i++) {
		var trailSegmentData = trailSegmentDatas[i];
		var trailVector = trailSegmentData.interpolatedPosition;

		if (this.facingMode == 'Billboard') {
			if (i === 0) {
				trailDirection.setv(trailSegmentDatas[i + 1].interpolatedPosition).subv(trailVector);
			} else if (i === this.segmentCount - 1) {
				trailDirection.setv(trailVector).subv(trailSegmentDatas[i - 1].interpolatedPosition);
			} else {
				trailDirection.setv(trailSegmentDatas[i + 1].interpolatedPosition)
					.subv(trailSegmentDatas[i - 1].interpolatedPosition);
			}

			trailCamVec.setv(trailVector).subv(camPos);

			// trailDirection.cross(trailCamVec);
			var ldata = trailDirection.data;
			var rdata = trailCamVec.data;
			var x = rdata[2] * ldata[1] - rdata[1] * ldata[2];
			var y = rdata[0] * ldata[2] - rdata[2] * ldata[0];
			var z = rdata[1] * ldata[0] - rdata[0] * ldata[1];

			// trailDirection.normalize().muld(w, w, w);
			var l = Math.sqrt(x * x + y * y + z * z); //this.length();

			if (l < 0.0000001) {
				x = 0;
				y = 0;
				z = 0;
			} else {
				l = 1.0 / l;
				x *= l * w;
				y *= l * w;
				z *= l * w;
			}

			trailDirection.data[0] = x;
			trailDirection.data[1] = y;
			trailDirection.data[2] = z;
		} else if (trailSegmentData.tangent !== null) {
			trailDirection.setv(trailSegmentData.tangent).muld(w, w, w);
		} else {
			trailDirection.setd(w, 0, 0);
		}


		tile[(index * this.segmentCount * 8)+ i * 8 + 0] = particle.trailOffsetX; //offset u
		tile[(index * this.segmentCount * 8)+ i * 8 + 1] = particle.trailOffsetY; //offset w
		tile[(index * this.segmentCount * 8)+ i * 8 + 2] = this.scaleX; //scale u
		tile[(index * this.segmentCount * 8)+ i * 8 + 3] = this.scaleY; //scale w
		tile[(index * this.segmentCount * 8)+ i * 8 + 4] = particle.trailOffsetX; //offset u
		tile[(index * this.segmentCount * 8)+ i * 8 + 5] = particle.trailOffsetY; //offset w
		tile[(index * this.segmentCount * 8)+ i * 8 + 6] = this.scaleX; //scale u
		tile[(index * this.segmentCount * 8)+ i * 8 + 7] = this.scaleY; //scale w


		pos[(index * this.segmentCount * 6) + 6 * i + 0] = trailVector.data[0] - trailDirection.data[0];
		pos[(index * this.segmentCount * 6) + 6 * i + 1] = trailVector.data[1] - trailDirection.data[1];
		pos[(index * this.segmentCount * 6) + 6 * i + 2] = trailVector.data[2] - trailDirection.data[2];

		pos[(index * this.segmentCount * 6) + 6 * i + 3] = trailVector.data[0] + trailDirection.data[0];
		pos[(index * this.segmentCount * 6) + 6 * i + 4] = trailVector.data[1] + trailDirection.data[1];
		pos[(index * this.segmentCount * 6) + 6 * i + 5] = trailVector.data[2] + trailDirection.data[2];

		col[(index * this.segmentCount * 8) + 8 * i + 0] = coldata[0];
		col[(index * this.segmentCount * 8) + 8 * i + 1] = coldata[1];
		col[(index * this.segmentCount * 8) + 8 * i + 2] = coldata[2];
		col[(index * this.segmentCount * 8) + 8 * i + 4] = coldata[0];
		col[(index * this.segmentCount * 8) + 8 * i + 5] = coldata[1];
		col[(index * this.segmentCount * 8) + 8 * i + 6] = coldata[2];

		var alpha = i === 0 || i === this.segmentCount - 1 ? 0 : particle.color.data[3];
		col[(index * this.segmentCount * 8) + 8 * i + 3] = alpha;
		col[(index * this.segmentCount * 8) + 8 * i + 7] = alpha;
	}
};

TrailRenderer.prototype.rebuild = function() {
	if (this.settings.textureUrl.valueLoaded) {
		this.entity.meshRendererComponent.materials[0].setTexture('PARTICLE_MAP', this.settings.textureUrl.valueLoaded);
	}
	for (var i = 0; i < this.trailDatas.length; i++) {
		var trailData = this.trailDatas[i];
		trailData.width = this.settings.width.value;
	}
};

TrailRenderer.prototype.remove = function() {
	this.entity.removeFromWorld();
};

TrailRenderer.prototype.setVisible = function(visible) {
	this.entity.meshRendererComponent.hidden = !visible;
	this.entity.hidden = !visible;
};

TrailRenderer.prototype.died = function(particle) {
	var trailData = this.trailDatas[particle.index];
	trailData.isReset = true;
};

TrailRenderer.prototype.updateParticle = function(tpf, particle) {
	this.renderedCount++;

	if (particle.dead) {
		return;
	}

	var trailData = this.trailDatas[particle.index];
	this.setTrailFront(trailData, particle.position, null, tpf);
	this.updateTrail(trailData, particle, Renderer.mainCamera.translation, this.renderedCount);

	this.lastAlive = this.renderedCount + 1;
};

TrailRenderer.prototype.updateMeshdata = function() {
	if (this.entity.hidden) {
		return;
	}

	this.meshData.indexLengths = [this.lastAlive * (this.segmentCount - 1) * 6];
	this.meshData.indexCount = this.lastAlive * (this.segmentCount - 1) * 6;

	this.meshData.setVertexDataUpdated();
	this.lastAlive = 0;
	this.renderedCount = 0;
};



function ParticleRenderer() {
	this.settings = null;
	this.entity = null;
	this.meshData = null;
	this.sprites = {};
}

ParticleRenderer.prototype.init = function (goo, simConf, settings, spriteAtlas, texture) {



	this.settings = settings;
	this.atlasConf = spriteAtlas;

	for (var i = 0; i < this.atlasConf.sprites.length; i++) {
		this.sprites[this.atlasConf.sprites[i].id] = this.atlasConf.sprites[i];
	}

	var attributeMap = MeshData.defaultMap([MeshData.POSITION, MeshData.COLOR]);
	attributeMap.DATA = MeshData.createAttribute(2, 'Float');
	attributeMap.OFFSET = MeshData.createAttribute(2, 'Float');
	attributeMap.TILE = MeshData.createAttribute(4, 'Float');
	var meshData = new MeshData(attributeMap, simConf.poolCount * 4, simConf.poolCount * 6);
	meshData.vertexData.setDataUsage('DynamicDraw');
	this.meshData = meshData;


	var particleShader = {
		attributes: {
			vertexPosition: MeshData.POSITION,
			vertexColor: MeshData.COLOR,
			vertexData: 'DATA',
			vertexOffset: 'OFFSET',
			textureTile: 'TILE'
		},
		uniforms: {
			viewMatrix: Shader.VIEW_MATRIX,
			projectionMatrix: Shader.PROJECTION_MATRIX,
			worldMatrix: Shader.WORLD_MATRIX,
			particleMap: 'PARTICLE_MAP',
			cameraPosition: Shader.CAMERA,
			time: Shader.TIME,
			alphakill: 0
		},
		vshader: [
			'attribute vec3 vertexPosition;',
			'attribute vec4 vertexColor;',
			'attribute vec2 vertexData;',
			'attribute vec2 vertexOffset;',
			'attribute vec4 textureTile;',
			// 'uniform mat4 viewProjectionMatrix;',
			'uniform mat4 viewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform mat4 worldMatrix;',
			'uniform vec3 cameraPosition;',
			'uniform float time;',

			'varying vec4 color;',
			'varying vec2 coords;',

			'void main(void) {',
			'color = vertexColor;',

			'float rotation = vertexData.y;',

			'coords = (vertexOffset * 0.5 + 0.5) * textureTile.zw + textureTile.xy;',
			// 'coords = coords * 0.98 + 0.01;',

			'float c = cos(rotation); float s = sin(rotation);',
			'mat3 spinMatrix = mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);',
			'vec2 offset = (spinMatrix * vec3(vertexOffset, 1.0)).xy * vertexData.x;',

			'gl_Position = viewMatrix * worldMatrix * vec4(vertexPosition.xyz, 1.0);',
			'gl_Position.xy += offset;',
			'gl_Position = projectionMatrix * gl_Position;',
			'}'
		].join('\n'),
		fshader: [
			'uniform sampler2D particleMap;',
			'uniform float alphakill;',

			'varying vec4 color;',
			'varying vec2 coords;',

			'void main(void)',
			'{',
			'vec4 col = color * texture2D(particleMap, coords);',
			'if (col.a <= alphakill) discard;',
			'gl_FragColor = col;',
			'}'
		].join('\n')
	};


	var material = new Material(particleShader);
	material.uniforms.alphakill = simConf.alphakill.value;
	material.blendState.blending = simConf.blending.value;

	material.depthState.write = false;
	material.renderQueue = 3010;
	var entity = this.entity = goo.world.createEntity(meshData);
	entity.set(new MeshRendererComponent(material));
	entity.name = 'ParticleRenderer';
	entity.meshRendererComponent.cullMode = 'Never';
	entity.addToWorld();

	/*
	 entity.skip = true;
	 var textureCreator = new TextureCreator();



	 var texture = textureCreator.loadTexture2D(this.atlasConf.textureUrl.value, {
	 magFilter:"NearestNeighbor",
	 minFilter:"NearestNeighborNoMipMaps",
	 wrapS: 'EdgeClamp',
	 wrapT: 'EdgeClamp'
	 }, function() {
	 entity.skip = false;
	 });

	 */
	material.setTexture('PARTICLE_MAP', texture);

	var offset = this.meshData.getAttributeBuffer('OFFSET');
	var tile = this.meshData.getAttributeBuffer('TILE');
	var indices = this.meshData.getIndexBuffer();
	for (i = 0; i < simConf.poolCount; i++) {
		offset[8 * i + 0] = -1;
		offset[8 * i + 1] = -1;

		offset[8 * i + 2] = -1;
		offset[8 * i + 3] = 1;

		offset[8 * i + 4] = 1;
		offset[8 * i + 5] = 1;

		offset[8 * i + 6] = 1;
		offset[8 * i + 7] = -1;

		for (var j = 0; j < 4; j++) {
			tile[16 * i + j * 4 + 0] = 0; //offset u
			tile[16 * i + j * 4 + 1] = 0; //offset w
			tile[16 * i + j * 4 + 2] = 1; //scale u
			tile[16 * i + j * 4 + 3] = 1; //scale w
		}

		indices[6 * i + 0] = 4 * i + 0;
		indices[6 * i + 1] = 4 * i + 3;
		indices[6 * i + 2] = 4 * i + 1;
		indices[6 * i + 3] = 4 * i + 1;
		indices[6 * i + 4] = 4 * i + 3;
		indices[6 * i + 5] = 4 * i + 2;
	}
};

ParticleRenderer.prototype.rebuild = function () {
	if (this.settings.textureUrl.valueLoaded) {
		this.entity.meshRendererComponent.materials[0].setTexture('PARTICLE_MAP', this.settings.textureUrl.valueLoaded);
	}
};

ParticleRenderer.prototype.remove = function () {
	this.entity.removeFromWorld();
};

ParticleRenderer.prototype.setVisible = function (visible) {
	this.entity.meshRendererComponent.hidden = !visible;
	this.entity.hidden = !visible;
};

ParticleRenderer.prototype.died = function (particle) {
	var data = this.meshData.getAttributeBuffer('DATA');

	for (var j = 0; j < 4; j++) {
		data[(4 * 2 * particle.index + 0) + 2 * j] = 0;
	}
};

ParticleRenderer.prototype.initFrame = function () {

	this.pos = this.meshData.getAttributeBuffer(MeshData.POSITION);
	this.col = this.meshData.getAttributeBuffer(MeshData.COLOR);
	this.data = this.meshData.getAttributeBuffer('DATA');
	this.tile = this.meshData.getAttributeBuffer('TILE');



	this.tileInfo = this.settings.tile;
	//	this.isTiled = this.tileInfo !== undefined && this.tileInfo.enabled.value;
	this.tileCountX = this.atlasConf.textureUrl.tilesX;
	this.tileCountY = this.atlasConf.textureUrl.tilesY;
	this.loopScale = 1;
	//	if (this.isTiled) {
	//		this.tileCountX = this.tileInfo.tileCountX.value;
	//		this.tileCountY = this.tileInfo.tileCountY.value;
	//		this.loopScale  = this.tileInfo.loopScale.value;
	//	}
	this.scaleX = 1 / this.tileCountX;
	this.scaleY = 1 / this.tileCountY;
	//	this.totalTileCount = this.tileCountX * this.tileCountY;
	//	this.tileFrameCount = this.totalTileCount;
	//	if (this.isTiled && this.tileInfo.frameCount) {
	//		this.tileFrameCount = this.tileInfo.frameCount;
	//	}

	this.lastAlive = 0;

};

ParticleRenderer.prototype.updateParticle = function (tpf, particle) {
	if (!this.renderedCount) {
		this.initFrame();
	}
	this.renderedCount++;


	if (particle.dead) {
		return;
	}
	var j, i, l;
	i = this.renderedCount;

	particle.setTileInfo(this.sprites[particle.sprite], this.scaleX, this.scaleY);
	particle.updateAtlasOffsets(this.loopScale);
	//	if (this.isTiled) {


	for (j = 0; j < 4; j++) {
		this.tile[(4 * 4 * i + 0) + 4 * j] = particle.offsetX;
		this.tile[(4 * 4 * i + 1) + 4 * j] = particle.offsetY;
		this.tile[(4 * 4 * i + 2) + 4 * j] = particle.scaleX;
		this.tile[(4 * 4 * i + 3) + 4 * j] = particle.scaleY;
	}
	//	}

	var posdata = particle.position.data;
	var coldata = particle.color.data;
	for (j = 0; j < 4; j++) {
		this.pos[(4 * 3 * i + 0) + 3 * j] = posdata[0];
		this.pos[(4 * 3 * i + 1) + 3 * j] = posdata[1];
		this.pos[(4 * 3 * i + 2) + 3 * j] = posdata[2];

		this.col[(4 * 4 * i + 0) + 4 * j] = coldata[0];
		this.col[(4 * 4 * i + 1) + 4 * j] = coldata[1];
		this.col[(4 * 4 * i + 2) + 4 * j] = coldata[2];
		this.col[(4 * 4 * i + 3) + 4 * j] = coldata[3];

		this.data[(4 * 2 * i + 0) + 2 * j] = particle.size;
		this.data[(4 * 2 * i + 1) + 2 * j] = particle.rotation;
	}

	this.lastAlive = i + 1;

};

ParticleRenderer.prototype.updateMeshdata = function () {
	if (this.entity.hidden) {
		return;
	}

	this.meshData.indexLengths = [this.lastAlive * 6];
	this.meshData.indexCount = this.lastAlive * 6;
	this.renderedCount = 0;
	this.meshData.setVertexDataUpdated();
};


var DefaultSpriteAtlas = {
	"atlases":[
		{
			"id":"defaultSpriteAtlas",
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
					"id":"shockwave",
					"tiles":[[0, 0]]
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
				},
				{
					"id":"fielddot",
					"tiles":[[1, 2]]
				},
				{
					"id":"spinfield",
					"tiles":[[3, 1]]
				},
				{
					"id":"sinedot",
					"tiles":[[5, 1]]
				},
				{
					"id":"projectile_1",
					"tiles":[[7, 2]]
				},
				{
					"id":"splash_thick",
					"tiles":[[1, 0]]
				},
				{
					"id":"splash_thin",
					"tiles":[[2, 0]]
				},
				{
					"id":"smokey",
					"tiles":[[3, 0]]
				},
				{
					"id":"snow_4",
					"tiles":[[7, 7]]
				},
				{
					"id":"snow_3",
					"tiles":[[6, 7]]
				},
				{
					"id":"snow_2",
					"tiles":[[5, 7]]
				},
				{
					"id":"snow_1",
					"tiles":[[4, 7]]
				}
			]
		}
	]
};

DefaultSimulators = {
	"simulators":[
		{
			"id": "AdditiveParticleAndTrail",
			"atlas":"defaultSpriteAtlas",
			"renderers": [
				"ParticleRenderer",
				"TrailRenderer"
			],
			"poolCount": 1000,
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
			"poolCount": 1000,
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
			"id": "StandardParticle",
			"atlas":"defaultSpriteAtlas",
			"renderers": [
				"ParticleRenderer"
			],
			"poolCount": 2000,
			"blending": {
				"value": "CustomBlending",
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
			"id": "FastAdditiveTrail",
			"atlas":"defaultSpriteAtlas",
			"renderers": [
				"FastTrailRenderer"
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
	]
};

var DefaultSimulationParams = {
	"id": "defaultConfig",
	"particle_params":[
		{
			"param":"color",
			"value": [0.6, 0.7, 1, 1],
			"type": "color"
		},
		{
			"param":"count",
			"value": 25,
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
			"value": "oneToZero",
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
			"value": 0,
			"type": "number",
			"min": 0.0,
			"max": 1.0
		},
		{
			"param":"strength",
			"value": 0,
			"type": "number",
			"min": 0.0,
			"max": 100.0
		},
		{
			"param":"spread",
			"value": 0.94,
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
			"value": 0,
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
	]
};

var DefaultRendererConfigs = {
	"renderers":[
		{
			"id":"ParticleRenderer",
			"script":"ParticleRenderer",
			"settings": {}
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
		},
		{
			"id":"LineRenderer",
			"script":"LineRenderer",
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
			"script":"TriangleRenderer",
			"settings": {
				"distance": {
					"value": 0.2,
					"type": "number"
				}
			}
		}
	]
};












