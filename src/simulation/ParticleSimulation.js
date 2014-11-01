"use strict";

define([
	'particle_system/simulation/SimulationParameters'

], function(
	SimulationParameters) {




	var ParticleSimulation = function(posVec, normVec, defaultSettings, effectData) {
		this.settings = defaultSettings;
	    this.renderers = [];
		this.params = new SimulationParameters(posVec, normVec, defaultSettings, effectData);
		this.particles = [];

	};


	ParticleSimulation.prototype.registerParticleRenderer = function(renderer) {
		this.renderers.push(renderer);
	};

	ParticleSimulation.prototype.attachSpawnBehaviour = function(nr, rendererName) {
		this.behaviors[nr] = createSpawner(rendererName);
	};

	ParticleSimulation.prototype.cleanupDead = function() {

		for (var i = 0; i < this.particles.length; i++) {
			if (this.particles[i].dead) {
				this.particles.splice(this.particles.indexOf(this.particles[i]), 1);
				i--
			}
		}
	};

	ParticleSimulation.prototype.notifyDied = function(particle) {

		this.particles[this.particles.indexOf(particle.index)] == null;

		for (var i = 0; i < this.renderers.length; i++) {
			this.renderers[i].died(particle)
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