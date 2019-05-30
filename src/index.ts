/// <reference path="global.d.ts" />

import * as THREE from 'three'
import * as rx from 'rxjs'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import { createShadowHullMesh } from './shadowHull'

init();

function init() {
    
    var camera = new THREE.OrthographicCamera(-10, 10, 10, -10);
    camera.position.z = 1000;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xeeeeee );

    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    var geometry = createShadowHullMesh([
            new THREE.Vector2(-0.5, -0.5),
            new THREE.Vector2( 0.5, -0.5),
            new THREE.Vector2( 0.5,  0.5),
            new THREE.Vector2(-0.5,  0.5),
        ]);

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    
    var renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    
    window.addEventListener('resize', onWindowResize, false);

    var animationInput =
        rx.combineLatest(
            rx.interval(0, rx.animationFrameScheduler),
            rx.fromEvent<MouseEvent>(document, "mousemove"),
            rx.animationFrameScheduler
        )
        .subscribe(animate);

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
}
