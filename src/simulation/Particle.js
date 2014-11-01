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
		this.index = idx;
		this.position 	= new Vector3();
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
		this.growth = [[0, 1], [1, 0]];

		this.acceleration = 1;
		this.gravity = 0;

		this.rotation = 0;
		this.spin = [[0, 1], [1, 0]];

		this.lifeSpan = 0;
		this.lifeSpanTotal = 0;
		this.progress = 0;
		this.frameOffset = 0;
		this.frameCount = 0;
		this.dead = true;
	};

	Particle.prototype.setDataUsage = function () {
	};

	return Particle;
});