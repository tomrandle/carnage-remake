
function planeCollisionTest(a,b) {

    var V = SAT.Vector;
    var P = SAT.Polygon;

    // Polygon A
    var polygon1 = new P(
        new V(a[0][0],a[0][1]), [
            new V(a[1][0],a[1][1]),
            new V(a[2][0],a[2][1]),
            new V(a[3][0],a[3][1]),
            new V(a[4][0],a[4][1]),
        ]);

    // Polygon B
    var polygon2 = new P(
        new V(b[0][0],b[0][1]), [
            new V(b[1][0],b[1][1]),
            new V(b[2][0],b[2][1]),
            new V(b[3][0],b[3][1]),
            new V(b[4][0],b[4][1]),

        ]);
    
    // Check collisions

    var response = new SAT.Response();
    var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);

    console.log('Plane collided', collided);

    return(collided);

};


function bulletCollisionTest(plane, bullet) {
    var V = SAT.Vector;
    var C = SAT.Circle;
    var P = SAT.Polygon;

    //circle x y radius

    var circle = new C(new V(bullet[0],bullet[1]), bullet[2]);

    //  Plane Polygon
    
    var polygon = new P(
        new V(plane[0][0],plane[0][1]), [
        new V(plane[1][0],plane[1][1]),
        new V(plane[2][0],plane[2][1]),
        new V(plane[3][0],plane[3][1]),
        new V(plane[4][0],plane[4][1]),
    ]);


    var response = new SAT.Response();
    var collided = SAT.testPolygonCircle(polygon, circle, response);

    console.log('Bullet hit:', collided);
    return (collided);


}


