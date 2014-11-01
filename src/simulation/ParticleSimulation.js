"use strict";

define([
	'goo/math/Vector3',
	'particle_system/simulation/SimulationParameters'

], function(
	Vector3,
	SimulationParameters
	) {

	var ParticleSimulation = function() {
		this.resetSimulation();
	};

	ParticleSimulation.prototype.resetSimulation = function() {
		this.renderers = [];
		this.particles = [];
		this.recover = [];
		this.active = false;
	};

	ParticleSimulation.prototype.initSimulation = function(posVec, normVec, defaultSettings, effectData) {
		this.resetSimulation();
		this.settings = defaultSettings;
		this.params = new SimulationParameters(posVec, normVec, defaultSettings, effectData);
		this.calcVec = new Vector3();
		this.active = true;
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
		this.recover.push(particle);
	};

	function randomBetween(min, max) {
		return Math.random() * (max - min) + min;
	}


	ParticleSimulation.prototype.includeParticle = function(particle, ratio) {
		var simD = this.params.data;
		particle.position.x = this.params.position.x + this.params.normal.x*ratio;
		particle.position.y = this.params.position.y + this.params.normal.y*ratio;
		particle.position.z = this.params.position.z + this.params.normal.z*ratio;

		particle.velocity.x = simD.strength*((Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*this.params.normal.x);
		particle.velocity.y = simD.strength*((Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*this.params.normal.y);
		particle.velocity.z = simD.strength*((Math.random() -0.5) * (2*simD.spread) + (1-simD.spread)*this.params.normal.z);

		particle.color.set(simD.color);
		particle.opacity = randomBetween(simD.opacity[0], simD.opacity[1]);
		particle.alpha = simD.alpha;


		particle.size = randomBetween(simD.size[0], simD.size[1]);
		particle.growthFactor = randomBetween(simD.growthFactor[0], simD.growthFactor[1]);
		particle.growth = simD.growth;

		particle.spin = simD.spin;
		particle.spinspeed = randomBetween(simD.spinspeed[0], simD.spinspeed[1]);
		particle.rotation = randomBetween(simD.rotation[0], simD.rotation[1]);

		particle.acceleration = simD.acceleration;
		particle.gravity = simD.gravity;

		particle.progress = 0;
		particle.lifeSpan = randomBetween(simD.lifespan[0], simD.lifespan[1]);
		particle.lifeSpanTotal = particle.lifeSpan;

		particle.frameOffset = ratio;

		particle.dead = false;
		this.particles.push(particle);

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

	ParticleSimulation.prototype.updateSimParticles = function(tpf) {

		for (var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];

			if (particle == undefined) {
				console.error("no particle", this.particles.length, i);
				continue
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

			if (particle.lifeSpan < 0) {
				this.notifyDied(particle);
				continue;
			}

			// Note frame offset expects ideal frame (0.016) to make stable geometries
			particle.progress = 1-((particle.lifeSpan - particle.frameOffset*0.016)  / particle.lifeSpanTotal);

			particle.size += particle.growthFactor * this.valueFromCurve(particle.progress, particle.growth) * deduct;
			particle.rotation += particle.spinspeed * this.valueFromCurve(particle.progress, particle.spin) * deduct;

			particle.velocity.muld(particle.acceleration, particle.acceleration, particle.acceleration);
			particle.velocity.add_d(0, particle.gravity*deduct, 0);

			this.calcVec.set(particle.velocity)
			this.calcVec.muld(deduct, deduct, deduct);
			particle.position.addv(this.calcVec);

			particle.color.data[3] = particle.opacity * this.valueFromCurve(particle.progress, particle.alpha);

			this.renderParticle(tpf, particle);
		}

	};

	ParticleSimulation.prototype.renderParticle = function(tpf, particle) {

		for (var i = 0; i < this.renderers.length; i++) {
			if (typeof(this.renderers[i].updateParticle) == 'function') {
				this.renderers[i].updateParticle(tpf, particle)
			}

		}

	};

	return ParticleSimulation
})
;