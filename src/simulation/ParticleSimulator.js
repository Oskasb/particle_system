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

	function ParticleSimulator(goo, settings) {
		this.goo = goo;
		this.settings = settings;
		this.meshPositions = [];
		this.simulations = [];
		this.removeSims = [];
	/*
	// move to behaviour logic...
		var entity = goo.world.by.name(settings.follow.value).first();
		if (entity) {
			if (settings.followType.value === 'Mesh') {
				entity.traverse(function (child) {
					if (child.meshDataComponent) {
						this.entity = child;
						this.meshPositions = child.meshDataComponent.meshData.getAttributeBuffer(MeshData.POSITION);
						// settings.poolCount = Math.min(this.meshPositions.length, settings.poolCount);
						// console.log(settings.poolCount);
					}
				}.bind(this));
			} else if (settings.followType.value === 'Joint') {
				var pose = entity.animationComponent._skeletonPose;

				this.entity = entity;
				// EntityUtils.hide(this.entity);
				this.jointTransforms = [];
				for (var i = pose._globalTransforms.length - 1; i >= 0; i--) {
					var jointTransform = pose._globalTransforms[i];
					if (!jointTransform) { continue; }
					this.jointTransforms.push(jointTransform);
				}
				settings.poolCount = Math.min(this.jointTransforms.length, 100);
			}
		}
     */
		this.particles = [];
		for (var i = 0; i < settings.simulator_config.poolCount; i++) {
			this.particles[i] = new Particle(i);
		}

		this.aliveParticles = 0;

		this.setup = settings.setup;
		this.spawner = createSpawner(settings.simulator_config.spawner.value);

		this.behaviors = [];

		for (i = 0; i < settings.simulator_config.behaviors.length; i++) {
			this.attachSpawnBehaviour(i, settings.simulator_config.behaviors[i])
		}

		this.renderers = [];
		settings.renderers = settings.renderers || {};

		for (var rendererName in settings.renderers) {
			this.initRenderer(rendererName);
		}

		this.visible = true;
		this.calcVec = new Vector3();
	}



	ParticleSimulator.prototype.addEffectSimulation = function(position, normal, effectData) {
		var sim = new ParticleSimulation(new Vector3(position), new Vector3(normal), this.settings.simulation_params, effectData);

		for (var i = 0; i < this.renderers.length; i++) {
			sim.registerParticleRenderer(this.renderers[i]);
		}

		this.includeSimulation(sim);

		this.simulations.push(sim)
	};

	ParticleSimulator.prototype.attachSpawnBehaviour = function(nr, rendererName) {
		this.behaviors[nr] = createSpawner(rendererName);
	};

	ParticleSimulator.prototype.initRenderer = function(rendererName) {
		var rendererConf = this.settings.renderers[rendererName];
		var renderer = createRenderer(rendererName);
		renderer.topSettings = this.settings;
		renderer.globalSettings = rendererConf;
		this.renderers.push(renderer);
		if (renderer.init) {
			renderer.init(this.goo, rendererConf.settings);
			renderer.setVisible(rendererConf.enabled);
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

	function randomBetween(min, max) {
		return Math.random() * (max - min) + min;
	}

	ParticleSimulator.prototype.wakeParticle = function () {
		for (var i = 0, l = this.particles.length; i < l; i++) {
			var particle = this.particles[i];

			if (particle.dead) {
				particle.dead = false;
				this.aliveParticles++;

				particle.color.seta(this.settings.color.value);
				particle.size = randomBetween(this.settings.size.value[0], this.settings.size.value[1]);
				particle.rotation = randomBetween(this.settings.rotation.value[0], this.settings.rotation.value[1]);
				particle.lifeSpanTotal = randomBetween(this.settings.lifespan.value[0], this.settings.lifespan.value[1]);
				particle.lifeSpan = 0;

				particle.growth = randomBetween(this.settings.growth.value[0], this.settings.growth.value[1]);
				particle.spin = randomBetween(this.settings.spin.value[0], this.settings.spin.value[1]);

				return particle;
			}
		}
	};

	ParticleSimulator.prototype.getInterpolatedInCurveAboveIndex = function(value, curve, index) {
		return curve[index][1] + (value - curve[index][0]) / (curve[index+1][0] - curve[index][0])*(curve[index+1][1]-curve[index][1]);
	};

	ParticleSimulator.prototype.valueFromCurve = function(value, curve) {
		for (var i = 0; i < curve.length; i++) {
			if (!curve[i+1]) return 0;
			if (curve[i+1][0] > value) return this.getInterpolatedInCurveAboveIndex(value, curve, i)
		}
		return 0;
	};


	ParticleSimulator.prototype.includeSimulation = function(sim) {
		var simD = sim.params.data;
		var count = simD.count;

		for (var i = 0, l = this.particles.length; i < l && count > 0; i++) {
			var particle = this.particles[i];
			if (particle.dead) {

				var ratio = 1 - simD.stretch * (simD.count-count) / simD.count;

				particle.position.x = sim.params.position.x + sim.params.normal.x*ratio;
				particle.position.y = sim.params.position.y + sim.params.normal.y*ratio;
				particle.position.z = sim.params.position.z + sim.params.normal.z*ratio;

				particle.velocity.x = simD.strength*((Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*sim.params.normal.x);
				particle.velocity.y = simD.strength*((Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*sim.params.normal.y);
				particle.velocity.z = simD.strength*((Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*sim.params.normal.z);

				particle.color.set(simD.color);
				particle.opacity = randomBetween(simD.opacity[0], simD.opacity[1]);
				particle.alpha = simD.alpha;


				particle.size = randomBetween(simD.size[0], simD.size[1]);
				particle.growth = simD.growth;

				particle.spin = simD.spin;
				particle.rotation = randomBetween(simD.rotation[0], simD.rotation[1]);

				particle.acceleration = simD.acceleration;
				particle.gravity = simD.gravity;

				particle.progress = 0;
				particle.lifeSpan = randomBetween(simD.lifespan[0], simD.lifespan[1]);
				particle.lifeSpanTotal = particle.lifeSpan;

				particle.frameOffset = count/simD.effectCount;

				particle.dead = false;
				this.aliveParticles++;

				count--;

				if (!particle) {
					console.error("No particle: ", i, sim )
				} else {
					sim.particles.push(particle);
				}


			}
		}
	};

	ParticleSimulator.prototype.removeSimulation = function(sim) {
		this.simulations.splice(this.simulations.indexOf(sim, 1));
	};

	ParticleSimulator.prototype.updateSimulation = function (tpf, sim) {

		var i, j, l;
		for (i = 0, l = sim.particles.length; i < l; i++) {
			var particle = sim.particles[i];

			if (!particle) {
				console.error("no particle", sim.particles.length, i);
				return
			}

			if (particle.dead) {
				continue;
			}

			// Particles need to have a fixed geometry the first frame of their life or things go bonkerz when framerate varies.
			var deduct = tpf;
			if (!particle.frameCount) {
				deduct = 0.016;
			}

			particle.lifeSpan -= deduct;

			if (particle.lifeSpan  <= 0) {
				particle.reset();
				this.aliveParticles--;
				console.log(this.aliveParticles);
				sim.notifyDied(sim.particles[i]);
				i--;
				continue;
			}

			// Note frame offset expects ideal frame (0.016) to make stable geometries
			particle.progress = 1-((particle.lifeSpan - particle.frameOffset*0.016)  / particle.lifeSpanTotal);

			particle.size += this.valueFromCurve(particle.progress, particle.growth) * deduct;
			particle.rotation += this.valueFromCurve(particle.progress, particle.spin) * deduct;

			particle.velocity.muld(particle.acceleration*deduct, particle.acceleration*deduct, particle.acceleration*deduct);

			particle.velocity.add_d(0, particle.gravity * deduct, 0);
			this.calcVec.setv(particle.velocity).muld(deduct, deduct, deduct);
			particle.position.addv(this.calcVec);

			particle.color.data[3] = particle.opacity * this.valueFromCurve(particle.progress, particle.alpha);

		    sim.renderParticle(tpf, particle);
		}

		sim.cleanupDead();

		if (sim.particles.length == 0) {
			this.removeSims.push(sim);
		}
	};

	var i;

	ParticleSimulator.prototype.update = function (tpf) {
		if (!this.visible) {
			return;
		}
	//	console.log(this.simulations.length)

		for (i = 0; i < this.simulations.length; i++) {
			this.updateSimulation(tpf, this.simulations[i]);
		}

		for (i = 0; i < this.renderers.length; i++) {
			if (typeof(this.renderers[i].updateMeshdata) == 'function') {
				this.renderers[i].updateMeshdata();
			}
		}

		for (i = 0; i < this.removeSims.length; i++) {
			this.removeSimulation(this.removeSims[i]);
		}

		this.removeSims.length = 0;
	};

	return ParticleSimulator;
});