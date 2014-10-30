"use strict";
define([
	'particle_system/chaos/ParticleSystem'
],
	function (
		ParticleSystem
		) {

		var ParticlesAPI = function(goo) {
			console.log("Particles API", goo)
			this.particleSystem = new ParticleSystem(goo);
		};

		ParticlesAPI.prototype.setEnabled = function(enabled) {
			this.enabled = enabled;
		};

		ParticlesAPI.prototype.requestFrameUpdate = function(tpf) {
			this.particleSystem.update(tpf);
		};

		ParticlesAPI.prototype.spawnParticles = function(id, position, normal, effectData) {
			this.particleSystem.wakeParticle(id)
		};

		ParticlesAPI.prototype.createParticleSystem = function(particleConfig) {
			this.particleSystem.add(particleConfig)
		};

		ParticlesAPI.prototype.removeParticleSystem = function(id) {
			this.particleSystem.remove(id)
		};

		return ParticlesAPI
	});