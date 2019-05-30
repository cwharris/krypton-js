import * as three from 'three'
import { Mesh } from 'three';

export class ShadowHull extends three.Group {
    _mesh: Mesh;
    constructor(mesh: Mesh) {
        super();
        this._mesh = mesh;
    }
}

export function createShadowHullMesh(
    points: three.Vector2[]
) {

    var vertices: number[] = [];
    var normals:  number[] = [];
    var indices: number[] = [];

    var pointCount = points.length

    for (var i = 0; i < points.length; i++) {
        var p1 = points[(i + 0) % pointCount];
        var p2 = points[(i + 1) % pointCount];
        
        var line = new three.Vector2().subVectors(p2, p1);
        var normal = new three.Vector2(-line.y, +line.x).normalize();

        vertices.push(p1.x, p1.y, 0);
        normals.push(normal.x, normal.y, 0);

        vertices.push(p2.x, p2.y, 0);
        normals.push(normal.x, normal.y, 0);
    }

    for (var i = 0; i < (pointCount * 2) - 2; i++) {
        indices.push(0);
        indices.push(i + 1);
        indices.push(i + 2);
    }

    // var geometry = new three.BufferGeometry();
    var geometry = new three.BufferGeometry();

    // // new three.InstancedBufferAttribute(vertices, 3)

    // new three.Float32BufferAttribute()
    
    geometry.setIndex(indices);
    geometry.addAttribute('position', new three.Float32BufferAttribute(vertices, 3));
    geometry.addAttribute('normal', new three.Float32BufferAttribute(normals, 3));

    return geometry;
}
