"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var VertexShader_1 = require("./VertexShader");
var FragmentShader_1 = require("./FragmentShader");
var ParticleEngine = /** @class */ (function () {
    function ParticleEngine() {
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.color = new THREE.Color();
        this.limit = 10000;
        this.particles = 0;
        this.count = 0;
        this.time = 0;
        this.constructor();
    }
    return ParticleEngine;
}());
ParticleEngine.prototype = Object.create(THREE.Object3D.prototype);
ParticleEngine.prototype.constructor = function () {
    THREE.Object3D.apply(this);
    this.material = new THREE.ShaderMaterial({
        uniforms: {
            'uTime': {
                value: 0.0
            },
            'uScale': {
                value: 1.0
            },
            'tSprite': {
                value: new THREE.TextureLoader().load('particle.png')
            }
        }
    });
    this.material.vertexShader = VertexShader_1.VertexShader;
    this.material.fragmentShader = FragmentShader_1.FragmentShader;
    this.material.blending = THREE.AdditiveBlending;
    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.limit * 3), 3));
    this.geometry.addAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(this.limit * 3), 3));
    this.geometry.addAttribute('startTime', new THREE.BufferAttribute(new Float32Array(this.limit), 1));
    this.geometry.addAttribute('velocity', new THREE.BufferAttribute(new Float32Array(this.limit * 3), 3));
    this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(this.limit * 3), 3));
    this.geometry.addAttribute('size', new THREE.BufferAttribute(new Float32Array(this.limit), 1));
    this.geometry.addAttribute('life', new THREE.BufferAttribute(new Float32Array(this.limit), 1));
    this.points = new THREE.Points(this.geometry, this.material);
    this.add(this.points);
};
ParticleEngine.prototype.spawn = function () {
    var positionStartAttribute = this.geometry.getAttribute('positionStart');
    var startTimeAttribute = this.geometry.getAttribute('startTime');
    var velocityAttribute = this.geometry.getAttribute('velocity');
    var colorAttribute = this.geometry.getAttribute('color');
    var sizeAttribute = this.geometry.getAttribute('size');
    var lifeAttribute = this.geometry.getAttribute('life');
    this.position = this.position.set(0, 0, 0);
    var i = this.particles;
    // Position
    positionStartAttribute.array[i * 3 + 0] = this.position.x + ((Math.random() - 0.5) * 50);
    positionStartAttribute.array[i * 3 + 1] = this.position.y + ((Math.random() - 0.5) * 50);
    positionStartAttribute.array[i * 3 + 2] = this.position.z + ((Math.random() - 0.5) * 50);
    // Velocity
    velocityAttribute.array[i * 3 + 0] = THREE.Math.clamp((Math.random() - 0.5) * 10.0, 0, 1);
    velocityAttribute.array[i * 3 + 1] = THREE.Math.clamp((Math.random() - 0.5) * 10.0, 0, 1);
    velocityAttribute.array[i * 3 + 2] = THREE.Math.clamp((Math.random() - 0.5) * 10.0, 0, 1);
    // Color
    colorAttribute.array[i * 3 + 0] = Math.random();
    colorAttribute.array[i * 3 + 1] = Math.random();
    colorAttribute.array[i * 3 + 2] = Math.random();
    // Size
    sizeAttribute.array[i] = 5 + Math.random() * 10.0;
    lifeAttribute.array[i] = 1;
    startTimeAttribute.array[i] = this.time;
    // Count
    this.particles++;
    this.count++;
    if (this.particles >= this.limit)
        this.particles = 0;
};
ParticleEngine.prototype.update = function (time) {
    this.time = time;
    this.material.uniforms.uTime.value = time;
    this.geometry.getAttribute('positionStart').needsUpdate = true;
    this.geometry.getAttribute('startTime').needsUpdate = true;
    this.geometry.getAttribute('velocity').needsUpdate = true;
    this.geometry.getAttribute('color').needsUpdate = true;
    this.geometry.getAttribute('size').needsUpdate = true;
    this.geometry.getAttribute('life').needsUpdate = true;
    this.count = 0;
};
exports.default = ParticleEngine;
