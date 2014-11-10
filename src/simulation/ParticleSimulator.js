define([
	'particle_system/simulation/Particle',

	'particle_system/simulation/ParticleSimulation',
	'goo/math/Vector3',
	'goo/math/Vector4',
	'goo/math/MathUtils',
	'goo/renderer/MeshData',
	'goo/entities/EntityUtils',
	'particle_system/chaos/ParticleBehaviors',
	'particle_system/render/ParticleRenderer',
	'particle_system/render/LineRenderer',
	'particle_system/render/TriangleRenderer',
	'particle_system/render/TrailRenderer'
],

function (
	Particle,
	ParticleSimulation,
	Vector3,
	Vector4,
	MathUtils,
	MeshData,
	EntityUtils,
	ParticleBehaviors,
	ParticleRenderer,
	LineRenderer,
	TriangleRenderer,
	TrailRenderer
) {
	"use strict";

	function createSpawner(name) {
		if (!name) {
			return null;
		}

		return ParticleBehaviors[name];
	}

	function createRenderer(name) {
		if (name === 'ParticleRenderer') {
			return new ParticleRenderer();
		} else if (name === 'LineRenderer') {
			return new LineRenderer();
		} else if (name === 'TriangleRenderer') {
			return new TriangleRenderer();
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

		sim.initSimulation(new Vector3(position), new Vector3(normal), this.settings.simulation_params, effectData);
		this.includeSimulation(sim, callbacks);
	};

	ParticleSimulator.prototype.attachSpawnBehaviour = function(nr, rendererName) {
		this.behaviors[nr] = createSpawner(rendererName);
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


	ParticleSimulator.prototype.rebuild = function () {
		this.spawner = createSpawner(this.settings.spawner.value);
		for (var i = 0; i < this.renderers.length; i++) {
			if (this.renderers[i].rebuild) {
				this.renderers[i].rebuild();
			}
			this.renderers[i].setVisible(this.renderers[i].globalSettings.enabled);
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

	return ParticleSimulator;
});