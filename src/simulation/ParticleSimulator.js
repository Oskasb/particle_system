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
		var count = sim.count;

		for (var i = 0, l = this.particles.length; i < l && count > 0; i++) {
			var particle = this.particles[i];
			if (particle.dead) {

				var ratio = 1 - particle.stretch * (sim.count-count) / sim.count;

				particle.position.x = sim.position.x + sim.normal.x*ratio;
				particle.position.y = sim.position.y + sim.normal.y*ratio;
				particle.position.z = sim.position.z + sim.normal.z*ratio;

				particle.velocity.x = sim.strength*((Math.random() -0.5) * (2*sim.spread) + (1-sim.spread)*sim.normal.x);
				particle.velocity.y = sim.strength*((Math.random() -0.5) * (2*sim.spread) + (1-sim.spread)*sim.normal.y);
				particle.velocity.z = sim.strength*((Math.random() -0.5) * (2*sim.spread) + (1-sim.spread)*sim.normal.z);

				particle.color.set(sim.color);
				particle.opacity = sim.opacity;
				particle.alpha = sim.alpha;

				particle.size = sim.size;
				particle.growth = sim.growth;


				particle.acceleration = sim.acceleration;
				particle.gravity = sim.gravity;

				particle.lifeSpan = randomBetween(sim.lifeSpan[0], sim.lifeSpan[1]);
				particle.lifeSpanTotal = particle.lifeSpan;

				particle.frameOffset = count/sim.effectCount;

				particle.dead = false;
				this.aliveParticles++;

				count--;

				sim.particles.push(particle);
			}
		}
	};

	ParticleSimulator.prototype.removeSimulation = function(sim) {
		this.simulations.splice(this.simulations.indexOf(sim, 1));
	};

	ParticleSimulator.prototype.updateSimulation = function (sim, tpf) {

		var i, j, l;
		for (i = 0, l = sim.particles.length; i < l; i++) {
			var particle = sim.particles[i];

			if (particle.dead) {
				continue;
			}

			// Particles need to have a fixed geometry the first frame of their life or things go bonkerz when framerate varies.
			var deduct = tpf;
			if (!particle.frameCount) {
				deduct = 0.016;
			}

			particle.lifeSpan -= deduct;
			if (particle.lifeSpan <= 0) {
				particle.dead = true;
				this.aliveParticles--;
				sim.notifyDied(particle);
				continue;
			}

			// Note frame offset expects ideal frame to make stable geometries
			particle.progress = 1-((particle.lifeSpan - particle.frameOffset*0.016)  / particle.lifeSpanTotal);

			for (j = 0; j < sim.behaviors.length; j++) {
				this.behaviors[j](deduct, particle, this.settings, this);
			}

			particle.size += this.valueFromCurve(particle.progress, particle.growth) * deduct;
			particle.rotation += this.valueFromCurve(particle.progress, particle.spin) * deduct;

			particle.velocity.muld(particle.acceleration*deduct, particle.acceleration*deduct, particle.acceleration*deduct);

			// Strange special case, needed?
		//	if (particle.velocity.lengthSquared() < 0.0001) {
		//		particle.velocity.setd(0, 0, 0);
		//	}

			particle.velocity.add_d(0, particle.gravity * deduct, 0);
			this.calcVec.setv(particle.velocity).muld(deduct, deduct, deduct);
			particle.position.addv(this.calcVec);

			particle.color.data[3] = particle.opacity * this.valueFromCurve(particle.progress, particle.alpha);

		    sim.renderParticle(particle);
		}

		if (sim.particles.length == 0) {
			this.removeSims.push(sim);
		}

	};

	var i;

	ParticleSimulator.prototype.update = function (tpf) {
		if (!this.visible) {
			return;
		}

		for (i = 0; i < this.simulations.length; i++) {
			this.updateSimulation(tpf, this.simulations[i]);
		}

		for (i = 0; i < this.renderers.length; i++) {
			this.renderers[i].updateMeshdata();
		}

		for (i = 0; i < this.removeSims.length; i++) {
			this.removeSimulation(this.removeSims[i]);
		}

		this.removeSims.length = 0;
	};

	return ParticleSimulator;
});