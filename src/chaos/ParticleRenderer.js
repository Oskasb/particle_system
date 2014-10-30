define([
	'goo/renderer/MeshData',
	'goo/renderer/Shader',
	'goo/renderer/Material',
	'goo/entities/components/MeshRendererComponent',
	'goo/renderer/TextureCreator'
],

function (
	MeshData,
	Shader,
	Material,
	MeshRendererComponent,
	TextureCreator
) {
	"use strict";

	function ParticleRenderer() {
		this.settings = null;
		this.entity = null;
		this.meshData = null;
	}

	ParticleRenderer.prototype.init = function (goo, settings) {
		this.settings = settings;

		var attributeMap = MeshData.defaultMap([MeshData.POSITION, MeshData.COLOR]);
		attributeMap.DATA = MeshData.createAttribute(2, 'Float');
		attributeMap.OFFSET = MeshData.createAttribute(2, 'Float');
		attributeMap.TILE = MeshData.createAttribute(4, 'Float');
		var meshData = new MeshData(attributeMap, settings.poolCount * 4, settings.poolCount * 6);
		meshData.vertexData.setDataUsage('DynamicDraw');
		this.meshData = meshData;

		var material = new Material(particleShader);
		material.uniforms.alphakill = settings.alphakill.value;
		material.blendState.blending = settings.blending.value;

		material.depthState.write = false;
		material.renderQueue = 3010;
		var entity = this.entity = goo.world.createEntity(meshData);
		entity.set(new MeshRendererComponent(material));
		entity.name = 'ParticleRenderer';
		entity.meshRendererComponent.cullMode = 'Never';
		entity.addToWorld();

		entity.skip = true;
		var textureCreator = new TextureCreator();
		var texture = textureCreator.loadTexture2D(settings.textureUrl.value, {
			wrapS: 'EdgeClamp',
			wrapT: 'EdgeClamp'
		}, function() {
			entity.skip = false;
		});
		material.setTexture('PARTICLE_MAP', texture);

		var offset = this.meshData.getAttributeBuffer('OFFSET');
		var tile = this.meshData.getAttributeBuffer('TILE');
		var indices = this.meshData.getIndexBuffer();
		for (var i = 0; i < settings.poolCount; i++) {
			offset[8 * i + 0] = -1;
			offset[8 * i + 1] = -1;

			offset[8 * i + 2] = -1;
			offset[8 * i + 3] = 1;

			offset[8 * i + 4] = 1;
			offset[8 * i + 5] = 1;

			offset[8 * i + 6] = 1;
			offset[8 * i + 7] = -1;

			for (var j = 0; j < 4; j++) {
				tile[16 * i + j * 4 + 0] = 0; //offset u
				tile[16 * i + j * 4 + 1] = 0; //offset w
				tile[16 * i + j * 4 + 2] = 1; //scale u
				tile[16 * i + j * 4 + 3] = 1; //scale w
			}

			indices[6 * i + 0] = 4 * i + 0;
			indices[6 * i + 1] = 4 * i + 3;
			indices[6 * i + 2] = 4 * i + 1;
			indices[6 * i + 3] = 4 * i + 1;
			indices[6 * i + 4] = 4 * i + 3;
			indices[6 * i + 5] = 4 * i + 2;
		}
	};

	ParticleRenderer.prototype.rebuild = function () {
		if (this.settings.textureUrl.valueLoaded) {
			this.entity.meshRendererComponent.materials[0].setTexture('PARTICLE_MAP', this.settings.textureUrl.valueLoaded);
		}
	};

	ParticleRenderer.prototype.remove = function () {
		this.entity.removeFromWorld();
	};

	ParticleRenderer.prototype.setVisible = function (visible) {
		this.entity.meshRendererComponent.hidden = !visible;
		this.entity.hidden = !visible;
	};

	ParticleRenderer.prototype.died = function (i, particle) {
		var data = this.meshData.getAttributeBuffer('DATA');

		for (var j = 0; j < 4; j++) {
			data[(4 * 2 * i + 0) + 2 * j] = 0;
		}
	};

	ParticleRenderer.prototype.update = function (tpf, particles) {
		if (this.entity.hidden) {
			return;
		}

		var material = this.entity.meshRendererComponent.materials[0];
		material.uniforms.alphakill = this.settings.alphakill.value;
		material.blendState.blending = this.settings.blending.value;

		var pos = this.meshData.getAttributeBuffer(MeshData.POSITION);
		var col = this.meshData.getAttributeBuffer(MeshData.COLOR);
		var data = this.meshData.getAttributeBuffer('DATA');
		var tile = this.meshData.getAttributeBuffer('TILE');

		var tileInfo = this.settings.tile;
		var isTiled = tileInfo !== undefined && tileInfo.enabled.value;
		var tileCountX = 1;
		var tileCountY = 1;
		var loopScale = 1;
		if (isTiled) {
			tileCountX = tileInfo.tileCountX.value;
			tileCountY = tileInfo.tileCountY.value;
			loopScale = tileInfo.loopScale.value;
		}
		var scaleX = 1 / tileCountX;
		var scaleY = 1 / tileCountY;
		var totalTileCount = tileCountX * tileCountY;
		var tileFrameCount = totalTileCount;
		if (isTiled && tileInfo.frameCount) {
			tileFrameCount = tileInfo.frameCount;
		}

		var lastAlive = 0;
		var j, i, l;
		for (i = 0, l = particles.length; i < l; i++) {
			var particle = particles[i];

			if (particle.dead) {
				continue;
			}

			if (isTiled) {
				var tileTime = (((particle.lifeSpan / particle.lifeSpanTotal) * loopScale) % 1) * totalTileCount;
				tileTime = Math.floor(tileTime) % tileFrameCount;
				var offsetX = (tileTime % tileCountX) / tileCountX;
				var offsetY = 1 - scaleY - Math.floor(tileTime / tileCountX) / tileCountY;

				for (j = 0; j < 4; j++) {
					tile[(4 * 4 * i + 0) + 4 * j] = offsetX;
					tile[(4 * 4 * i + 1) + 4 * j] = offsetY;
					tile[(4 * 4 * i + 2) + 4 * j] = scaleX;
					tile[(4 * 4 * i + 3) + 4 * j] = scaleY;
				}
			}

			var posdata = particle.position.data;
			var coldata = particle.color.data;
			for (j = 0; j < 4; j++) {
				pos[(4 * 3 * i + 0) + 3 * j] = posdata[0];
				pos[(4 * 3 * i + 1) + 3 * j] = posdata[1];
				pos[(4 * 3 * i + 2) + 3 * j] = posdata[2];

				col[(4 * 4 * i + 0) + 4 * j] = coldata[0];
				col[(4 * 4 * i + 1) + 4 * j] = coldata[1];
				col[(4 * 4 * i + 2) + 4 * j] = coldata[2];
				col[(4 * 4 * i + 3) + 4 * j] = particle.alpha;

				data[(4 * 2 * i + 0) + 2 * j] = particle.size;
				data[(4 * 2 * i + 1) + 2 * j] = particle.rotation;
			}

			lastAlive = i + 1;
		}

		this.meshData.indexLengths = [lastAlive * 6];
		this.meshData.indexCount = lastAlive * 6;

		this.meshData.setVertexDataUpdated();
	};

	var particleShader = {
		attributes: {
			vertexPosition: MeshData.POSITION,
			vertexColor: MeshData.COLOR,
			vertexData: 'DATA',
			vertexOffset: 'OFFSET',
			textureTile: 'TILE'
		},
		uniforms: {
			viewMatrix: Shader.VIEW_MATRIX,
			projectionMatrix: Shader.PROJECTION_MATRIX,
			worldMatrix: Shader.WORLD_MATRIX,
			particleMap: 'PARTICLE_MAP',
			cameraPosition: Shader.CAMERA,
			time: Shader.TIME,
			alphakill: 0
		},
		vshader: [
			'attribute vec3 vertexPosition;',
			'attribute vec4 vertexColor;',
			'attribute vec2 vertexData;',
			'attribute vec2 vertexOffset;',
			'attribute vec4 textureTile;',
			// 'uniform mat4 viewProjectionMatrix;',
			'uniform mat4 viewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform mat4 worldMatrix;',
			'uniform vec3 cameraPosition;',
			'uniform float time;',

			'varying vec4 color;',
			'varying vec2 coords;',

			'void main(void) {',
				'color = vertexColor;',
				
				'float rotation = vertexData.y;',

				'coords = (vertexOffset * 0.5 + 0.5) * textureTile.zw + textureTile.xy;',
				// 'coords = coords * 0.98 + 0.01;',

				'float c = cos(rotation); float s = sin(rotation);',
				'mat3 spinMatrix = mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);',
				'vec2 offset = (spinMatrix * vec3(vertexOffset, 1.0)).xy * vertexData.x;',

				'gl_Position = viewMatrix * worldMatrix * vec4(vertexPosition.xyz, 1.0);',
				'gl_Position.xy += offset;',
				'gl_Position = projectionMatrix * gl_Position;',
			'}'
		].join('\n'),
		fshader: [
			'uniform sampler2D particleMap;',
			'uniform float alphakill;',

			'varying vec4 color;',
			'varying vec2 coords;',

			'void main(void)',
			'{',
				'vec4 col = color * texture2D(particleMap, coords);',
				'if (col.a <= alphakill) discard;',
				'gl_FragColor = col;',
			'}'
		].join('\n')
	};

	return ParticleRenderer;
});