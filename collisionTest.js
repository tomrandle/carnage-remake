
function collisionTest(a,b) {

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
    
    // Check collisisons

    var response = new SAT.Response();
    var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);

    console.log(collided);

    return(collided);


};
