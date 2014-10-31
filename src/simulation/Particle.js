define([
	'goo/math/Vector3',
	'goo/math/Vector4'
],

function (
	Vector3,
	Vector4
) {
	"use strict";

	function Particle(idx) {
		this.index = idx
		this.position = new Vector3();
		this.velocity = new Vector3();
		this.color = new Vector4();

		this.progress = 0;
		this.frameOffset = 0;
		this.alpha = 1;
		this.gravity = 0;
		this.size = 1;
		this.rotation = 0;
		this.growth = 0;
		this.spin = 0;
		this.sizeVelocity = 0;
		this.rotationVelocity = 0;
		this.lifeSpan = 0;
		this.lifeSpanTotal = 0;
		this.dead = true;
		this.id = Particle.ID++;
	}

	Particle.ID = 0;

	Particle.prototype.setDataUsage = function () {
	};

	return Particle;
});