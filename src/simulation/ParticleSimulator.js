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

		if (this.setup) {
			this.setup(this);
		}

		this.alphaFunction = settings.alphaFunction || function (particle) {
			var step = 1;
			if (!settings.skipFade.value) {
				if (particle.lifeSpan < particle.lifeSpanTotal * 0.5) {
					step = MathUtils.smoothstep(0, particle.lifeSpanTotal * 0.25, particle.lifeSpan);
				} else {
					step = 1 - MathUtils.smoothstep(particle.lifeSpanTotal * 0.6, particle.lifeSpanTotal, particle.lifeSpan);
				}
			}
			particle.alpha = particle.color.data[3] * step;
		};

		this.visible = true;

		this.calcVec = new Vector3();
	}

	ParticleSimulator.prototype.addEffectSimulation = function(position, normal, effectData) {
		var sim = new ParticleSimulation(new Vector3(position), new Vector3(normal), this.settings.simulation_params, effectData);

		for (var i = 0; i < this.renderers.length; i++) {
			sim.registerParticleRenderer(this.renderers[i]);
		}

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


	ParticleSimulator.prototype.updateSimulation = function (sim, tpf) {


		var acc = 1 - tpf * (sim.params.acceleration || 1);

		var i, j, l;
		for (i = 0, l = sim.particles.length; i < l; i++) {
			var particle = sim.particles[i];

			if (particle.dead) {
				continue;
			}

			particle.lifeSpan += tpf;
			if (!sim.params.data.eternal.value) {
				if (particle.lifeSpan >= particle.lifeSpanTotal) {
					particle.dead = true;
					this.aliveParticles--;
					sim.notifyDied(particle);
					continue;
				}
			}

			for (j = 0; j < sim.behaviors.length; j++) {
				this.behaviors[j](tpf, particle, this.settings, this);
			}

			particle.size += particle.growth * tpf;
			particle.rotation += particle.spin * tpf;

			particle.velocity.muld(acc, acc, acc);
			if (particle.velocity.lengthSquared() < 0.0001) {
				particle.velocity.setd(0, 0, 0);
			}
			this.calcVec.setv(particle.velocity).muld(tpf, tpf, tpf);
			particle.position.addv(this.calcVec);

			this.alphaFunction(particle);

			particle.color.data[3] = particle.alpha * this.valueFromCurve(particle.progress, particle.alphaCurve);
			particle.growth = this.valueFromCurve(particle.progress, particle.growthCurve);


		    sim.renderParticle(particle);



		}
	};

	var i;

	ParticleSimulator.prototype.update = function (tpf) {
		if (!this.visible) {
			return;
		}

		if (this.spawner) {
			this.spawner(this);
		}

		for (i = 0; i < this.simulations.length; i++) {
			this.updateSimulation(tpf, this.simulations[i]);
		}

		for (i = 0; i < this.renderers.length; i++) {
			this.renderers[i].updateMeshdata();
		}
	};

	return ParticleSimulator;
});