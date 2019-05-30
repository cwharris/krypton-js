/// <reference path="global.d.ts" />

import * as THREE from 'three'
import * as rx from 'rxjs'

import { Observable } from 'rxjs';
import { sample, map, startWith } from 'rxjs/operators';

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import { createShadowHullMesh } from './shadowHull'


type UnpackedObservable<T> = T extends Observable<infer U> ? U : never;
type CBLRes<T> = Observable<{ [P in keyof T]: UnpackedObservable<T[P]> }> ;
type CBLInput = { [key: string]: Observable<any> };

function combineLatestObject<T extends CBLInput>(source: T): CBLRes<T> {
    var keys = Object.keys(source);
    return <CBLRes<T>> rx.combineLatest(Object.values(source))
        .pipe(map(
            values => values.reduce((acc, value, index) => ({
                ...acc, [keys[index]]: value
            }), {})
        ));
}

init();

function init() {
    
    // camera
    var camera = new THREE.OrthographicCamera(-10, 10, 10, -10);
    camera.position.z = 1000;

    // scene
    var scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xeeeeee );

    var shadowHullMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    var geometry = createShadowHullMesh([
            new THREE.Vector2(-0.5, -0.5),
            new THREE.Vector2( 0.5, -0.5),
            new THREE.Vector2( 0.5,  0.5),
            new THREE.Vector2(-0.5,  0.5),
        ]);

    var mesh = new THREE.Mesh( geometry, shadowHullMaterial );

    scene.add( mesh );
    
    var renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    window.addEventListener('resize', onWindowResize, false);

    combineLatestObject({
        mouse: rx.fromEvent<MouseEvent>(document, "mousemove")
    })
    .pipe(
        sample(rx.interval(0, rx.animationFrameScheduler))
    )
    .subscribe(update);

    function onWindowResize() {
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    function update({ mouse }: { mouse: MouseEvent }) {
        var rect = renderer.domElement.getBoundingClientRect()
        var pos = new THREE.Vector3(
            ((mouse.x - rect.left) / rect.width) * 2 - 1,
            1 - ((mouse.y - rect.top) / rect.height) * 2,
            0
        );
    
        var lightPosition = pos.unproject(camera)
    
        shadowHullMaterial.uniforms['light_position'] = { value: lightPosition };
    
        renderer.render(scene, camera);
    }
}
