/// <reference path="global.d.ts" />

import * as THREE from 'three'
import * as rx from 'rxjs'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import { createShadowHullGeometry } from './createShadowHullGeometry'


var camera:     THREE.OrthographicCamera,
    scene:      THREE.Scene,
    renderer:   THREE.WebGLRenderer;

var mesh:       THREE.Mesh,
    material:   THREE.ShaderMaterial;

init();

var animationInput =
    rx.combineLatest(
        rx.interval(0, rx.animationFrameScheduler),
        rx.fromEvent<MouseEvent>(document, "mousemove"),
        rx.animationFrameScheduler
    );

animationInput.subscribe(animate);

function init() {
    camera = new THREE.OrthographicCamera(-10, 10, 10, -10);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xeeeeee );

    material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    var geometry = createShadowHullGeometry([
            new THREE.Vector2(-0.5, -0.5),
            new THREE.Vector2( 0.5, -0.5),
            new THREE.Vector2( 0.5,  0.5),
            new THREE.Vector2(-0.5,  0.5),
        ]);

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate([, mouse]: [number, MouseEvent]) {
    var rect = renderer.domElement.getBoundingClientRect()
    var pos = new THREE.Vector3(
        ((mouse.x - rect.left) / rect.width) * 2 - 1,
        1 - ((mouse.y - rect.top) / rect.height) * 2,
        0
    );

    var lightPosition = pos.unproject(camera)

    material.uniforms['light_position'] = { value: lightPosition };

    renderer.render(scene, camera);
}
