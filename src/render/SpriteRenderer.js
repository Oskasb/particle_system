define([
	'goo/math/Vector3',
	'goo/math/MathUtils',
	'goo/renderer/MeshData',
	'goo/renderer/Shader',
	'goo/renderer/Material'
],
	function(
		Vector3,
		MathUtils,
		MeshData,
		Shader,
		Material
		) {

		SpriteRenderer = function(goo, id, particleSettings, texture) {
			this.id = id;
			var attributeMap = MeshData.defaultMap([MeshData.POSITION, MeshData.COLOR]);
			attributeMap.DATA = MeshData.createAttribute(4, 'Float');
			var meshData = new MeshData(attributeMap, particleSettings.poolCount);
			meshData.vertexData.setDataUsage('DynamicDraw');
			meshData.indexModes = ['Points'];
			this.meshData = meshData;

			var material = new Material('ParticleMaterial', particleShader);
			material.setTexture('PARTICLE_MAP', texture);

			if ( particleSettings.blending === 'additive') {
				material.blendState.blending = 'AdditiveBlending';
			} else {
				material.blendState.blending = 'CustomBlending';
			}

			material.depthState.write = false;
			material.renderQueue = 3010;
			var entity = goo.world.createEntity(this.meshData, material);
			entity.name = 'Simulator';
			entity.meshRendererComponent.cullMode = 'Never';

			if (particleSettings.reflectable == true) {

			} else {
				entity.meshRendererComponent.isReflectable = false;
			}

			entity.addToWorld();
			this.entity = entity;

			this.col = meshData.getAttributeBuffer(MeshData.COLOR);
			this.data = meshData.getAttributeBuffer('DATA');
			this.pos = meshData.getAttributeBuffer(MeshData.POSITION);

			this.lastAlive = 0;

			this.indexLengths = [this.lastAlive];
			this.indexCount = this.lastAlive;
			this.indexTransfer = [this.lastAlive]
		};

		SpriteRenderer.prototype.renderMeshData = function(responseData) {
			// Response from worker, not used in main thread mode
			if (responseData) {
				if (!responseData.indexTransfer[0]) return;
				this.meshData.dataViews.COLOR.set(responseData.colData);
				this.meshData.dataViews.DATA.set(responseData.uvData);
				this.meshData.dataViews.POSITION.set(responseData.posData);


				this.col = this.meshData.getAttributeBuffer(MeshData.COLOR)
				this.data = this.meshData.getAttributeBuffer('DATA')
				this.pos = this.meshData.getAttributeBuffer(MeshData.POSITION)

				if (!this.meshData.dataViews.COLOR.length) {
					console.log("No length on Col!", this.id)
					return;
				}

				this.meshData.indexLengths =    [responseData.indexTransfer[0]];
				this.meshData.indexCount =      responseData.indexTransfer[0];
			}
			this.meshData.setVertexDataUpdated();

		};




		var particleShader = {
			attributes: {
				vertexPosition: MeshData.POSITION,
				vertexColor: MeshData.COLOR,
				vertexData: 'DATA'
			},
			uniforms: {
				viewProjectionMatrix: Shader.VIEW_PROJECTION_MATRIX,
				projectionMatrix: Shader.PROJECTION_MATRIX,
				worldMatrix: Shader.WORLD_MATRIX,
				particleMap: 'PARTICLE_MAP',
				camFov: Shader.CAMERA_FOV,
				resolution: Shader.RESOLUTION
			},
			vshader: [
				'attribute vec3 vertexPosition;',
				'attribute vec4 vertexColor;',
				'attribute vec4 vertexData;',
				'uniform mat4 viewProjectionMatrix;',
				'uniform mat4 projectionMatrix;',
				'uniform mat4 worldMatrix;',
				'uniform vec2 resolution;',
				'uniform float camFov;',
				'varying vec4 color;',
				'varying mat3 spinMatrix;',

				'void main(void) {',
				'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition.xyz, 1.0);',
				'gl_PointSize = vertexData.x * resolution.y / (camFov * 20.0) / gl_Position.w;',
				'color = vertexColor;',
				'float c = cos(vertexData.z); float s = sin(vertexData.z);',
				'spinMatrix = mat3(c, s, 0.0, -s, c, 0.0, (s-c+1.0)*0.5, (-s-c+1.0)*0.5, 1.0);',
				'}'
			].join('\n'),
			fshader: [
				'uniform sampler2D particleMap;',

				'varying vec4 color;',
				'varying mat3 spinMatrix;',

				'void main(void)',
				'{',
				'vec2 coords = ((spinMatrix * vec3(gl_PointCoord, 1.0)).xy - 0.5) * 1.4142 + 0.5;',
				'vec4 col = color * texture2D(particleMap, coords);',
				'if (col.a <= 0.0) discard;',
				'gl_FragColor = col;',
				'}'
			].join('\n')
		};

		return SpriteRenderer;
	});