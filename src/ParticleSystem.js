define([
	'particle_system/simulation/ParticleSimulator'
],

function (
	ParticleSimulator
) {
	"use strict";

	function ParticleSystem(goo) {
		this.goo = goo;
		this.atlases = {};
		this.simulators = {};
		this.groups = {};
	}

	ParticleSystem.prototype.attachAtlases = function (atlasConfigs) {
		for (var i = 0; i < atlasConfigs.atlases.length; i++) {
			this.atlases[atlasConfigs.atlases[i].id] = atlasConfigs.atlases[i];
		}
	};

	ParticleSystem.prototype.getAtlasForSetting = function(settings) {
		return this.atlases[settings.simulator_config.atlas];
	};

	ParticleSystem.prototype.add = function (settings, rendererConfigs, atlasConfigs) {
		this.attachAtlases(atlasConfigs);
		var simulator = new ParticleSimulator(this.goo, settings, rendererConfigs, this.getAtlasForSetting(settings));
		this.simulators[settings.id] = simulator;
	};

	ParticleSystem.prototype.spawnParticleSimulation = function(id, position, normal, effectData) {
		this.simulators[id].addEffectSimulation(position, normal, effectData)
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

	return ParticleSystem;
});