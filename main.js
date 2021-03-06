$(document).ready(function() {
           
            /* Variables */

            var FPS = 30;
            var g = 10;
            var timeInterval = 1 / FPS;
            var bullets = [];
            var players = [];

            var planeHeight = 20;
            var planeWidth = 40;

            /* Create canvas */

            var canvasWidth = $(window).width();
            var canvasHeight = $(window).height();

            var canvasElement = $("<canvas width='" + canvasWidth + "' height='" + canvasHeight + "'></canvas>");
            var canvas = canvasElement.get(0).getContext("2d");

            canvasElement.appendTo('body');


            /* Create players */ 

            players.push(new player(0,'Baron von PB','#333', 'left', 'right','space'));
            players.push(new player(1,'Wing commander fox','#ff3300', 'q', 'w','e'));


            /* Each frame */
    
            function update() {


                for (var i=0;i<players.length;i++) {
                    var player = players[i];
 
                    /* Update positions */

                    player.calculatePositions();

                    /* Check for collisions */

                    planeCollisionTest(players[0].getCoordinates(),players[1].getCoordinates());

                    /* Check for collisions */

                    player.draw();
                    player.drawForceVectors();
                }


                /* Draw bullets */

                for (var i=0;i<bullets.length;i++) {
                    
                    bullets[i].draw();

                    /* Remove any bullets no longer on canvas */
                    if (bullets[i].x < 0 | bullets[i].x > canvasWidth | bullets[i].y < 0 | bullets[i].y > canvasHeight )
                    {
                        destroyBullet(i,bullets[i].owner);

                    }
                }


                /* Check for bullet hits */

                for (var j=0;j<players.length;j++) {


                    for (var i=0;i<bullets.length;i++) {
                    
                            if (bulletCollisionTest(players[j].getCoordinates(), bullets[i].getCoordinates()))
                            {
                                console.log('Hit by:',players[bullets[i].owner].name);
                                destroyBullet(i,bullets[i].owner);
                            }
                        
                    }
                }


            }
            
            setInterval(function() {
                canvas.clearRect(0, 0, canvasWidth, canvasHeight);
                update();
            }, 1000/FPS);

            var destroyBullet = function(bullet, player) {
                bullets.splice(bullet,1);
                players[player].ammo += 1;

            } 


            function bullet(owner, sourceX, sourceY, angle) {
                this.speed = 5;
                this.x = sourceX;
                this.y = sourceY;
                this.bulletRadius = 4;
                this.angle = angle;
                this.position = 0;
                this.owner = owner;
                this.damage = 10;
                this.updateReadings = function() {
                    this.x = (Math.cos(-this.angle) * this.speed) + this.x;
                    this.y = this.y + Math.sin(this.angle) * this.speed;
                };

                this.draw = function() {
                    this.updateReadings();
                    canvas.beginPath();
                    canvas.arc(this.x,canvasHeight - this.y, this.bulletRadius, 0, Math.PI*2, true); 
                    canvas.closePath();
                    canvas.fill();
                };

                this.getCoordinates = function() {
                    return([this.x, canvasHeight - this.y, this.bulletRadius]);
                }

            };

            function player(id , name, color, rotateAnticlockwiseKey, rotateClockwiseKey, shootKey, startPosition) {
                this.id = id;
                this.name = name;
                this.health = 0;
                this.color = color;
                this.rotateAnticlockwiseKey = rotateAnticlockwiseKey;
                this.rotateClockwiseKey = rotateClockwiseKey;
                this.shootKey = shootKey;
                this.ammo = 10;
                this.kills = 0;
                this.lives = 10;
                this.takeOffPosition = 1;
                this.x = 50;
                this.y = 50;
                this.angleOfAttack= 0;
                this.turnSpeed= Math.PI / 32;
                this.xSpeed=0;
                this.ySpeed=0;
                this.mass=100;
                this.weight= 0;
                this.terminalVelocity=50;
                this.dragCoefficient= 0.1;
                this.thrust= 600;
                this.coordinates;

                this.fire = function() {
                    if (this.ammo > 1) {
                        this.ammo -= 1;

                        var sourceX = this.x + (Math.cos(-this.angleOfAttack) * planeHeight * 1.1);
                        var sourceY = this.y + Math.sin(this.angleOfAttack) * planeHeight* 1.1;

                        bullets.push (new bullet(this.id, sourceX, sourceY, this.angleOfAttack));
                    }
                };

                this.checkKeyboard = function() {

                    if (keydown[this.rotateAnticlockwiseKey]) {
                        this.angleOfAttack += this.turnSpeed;
                    }

                    if (keydown[this.rotateClockwiseKey]) {
                        this.angleOfAttack -= this.turnSpeed;
                    }

                    if (keydown[this.shootKey]) {
                        this.fire();
                    }

                    if (this.angleOfAttack >= (Math.PI))
                    {
                        this.angleOfAttack = this.angleOfAttack - (Math.PI * 2);
                    }

                    else {
                        if (this.angleOfAttack <= - Math.PI)
                        {
                            this.angleOfAttack = this.angleOfAttack + (2 * Math.PI);
                        }
                    }

                };




                this.calculateLift = function() {
                    
                    // var angle = this.calculateAngleOfMotion();

                    // var liftCoefficient = 0.1;


                    // if (Math.abs(angle) > Math.PI /2 ) {
                    //     liftCoefficient = 0;
                    // }

                   
                    // var lift = liftCoefficient * this.airspeed() * this.airspeed();
                    return (0);

                };

                this.calculateDrag = function() {

                    // To be realisitc the drag and lift coefficients need to change depending on the direction the plane is pointing. Drag needs to be much more agressive in the direction perpendicular to the bearing of the plane. 

                    var drag = this.dragCoefficient * this.airspeed() * this.airspeed();
                    return(drag);
                };

                this.calculateXAcceleration = function(){
                    // ((F-D)cosC + L sin C ) / m;

                    var thrustComponent = this.thrust *  Math.cos(this.angleOfAttack);
                    var dragComponent = this.calculateDrag() * Math.cos(this.calculateAngleOfMotion());
                    var liftComponent =this.calculateLift() * Math.sin(this.calculateAngleOfMotion());

                    $('#thrust-x-value').html(thrustComponent);
                    $('#drag-x-value').html(dragComponent);
                    $('#lift-x-value').html(liftComponent);

                    var a = (thrustComponent - dragComponent + liftComponent) / this.mass;
                    return(a);
                };

                this.calculateYAcceleration = function(){
                    // ((F-D)sinC + L cos C - W) / m;

                    var thrustComponent = this.thrust *  Math.sin(this.angleOfAttack);
                    var dragComponent = this.calculateDrag() * Math.sin(this.calculateAngleOfMotion());
                    var liftComponent = this.calculateLift() * Math.cos(this.calculateAngleOfMotion());


                    $('#thrust-y-value').html(thrustComponent);
                    $('#drag-y-value').html(dragComponent);
                    $('#lift-y-value').html(liftComponent);
                    var a = (thrustComponent - dragComponent + liftComponent - this.weight) /this.mass;
                    return(a);

                };


                this.calculateSpeeds = function () {

                    var aX = this.calculateXAcceleration();
                    var aY = this.calculateYAcceleration();

                    /* v = u + at */

                    this.xSpeed = this.xSpeed + (aX * timeInterval);
                    this.ySpeed = this.ySpeed + (aY * timeInterval);

                };

                this.calculatePositions = function() {
                    this.checkKeyboard(); //make sure this only gets called once
                    this.calculateSpeeds();

                    /* Infinite canvas */

                    if (this.x > canvasWidth) {
                        this.x = 0;
                    }

                    if (this.x < 0) {
                        this.x = canvasWidth;
                    }


                    if (this.y > canvasHeight) {
                        this.y = 0;
                    }

                    if (this.y < 0) {
                        this.y = canvasHeight;
                    }

                    /* s = ut + 0.5 at^2*/
                    /*BODGE*/

                    this.x = this.x + (this.xSpeed * timeInterval);
                    this.y = this.y + (this.ySpeed * timeInterval);

                    };


       

                this.airspeed = function() {
                    var v = (Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2)));
                    return(v);
                };

                this.calculateAngleOfMotion = function() {

                    var angle = Math.atan(this.ySpeed / this.xSpeed);
                        if (!angle) {
                        return(0);
                    }

                    if (this.xSpeed < 0 && this.ySpeed > 0)
                    {
                        angle = angle + Math.PI;

                    }

                    if (this.xSpeed < 0 && this.ySpeed < 0)
                    {
                        angle = angle - Math.PI;
                    }    
                
                    return (angle);

                };

                this.updateReadings = function() {
                    $('#bearing-value').html(this.angleOfAttack * 180 / Math.PI);
                    $('#angle-of-motion-value').html(this.calculateAngleOfMotion() * 180 / Math.PI);

                    $('#acceleration-x-value').html(this.calculateXAcceleration());
                    $('#acceleration-y-value').html(this.calculateYAcceleration());
                    $('#speed-x-value').html(this.xSpeed);
                    $('#speed-y-value').html(this.ySpeed);
                    $('#x-value').html(this.x);
                    $('#y-value').html(this.y);
                    $('#airspeed-value').html(this.airspeed());
                    $('#drag-value').html(this.calculateDrag());

                };

                this.draw = function() {
                    this.updateReadings();
                    canvas.save();
                    canvas.translate(this.x, (canvasHeight - this.y));
                    canvas.rotate(-this.angleOfAttack);
                    canvas.fillStyle = this.color;
                    canvas.fillRect((- planeWidth / 2), (- planeHeight / 2), planeWidth, planeHeight);
                    canvas.restore();


                },
                this.getCoordinates = function() {
                    //Begin our drawing

                    var centerX = this.x;
                    var centerY = canvasHeight - this.y;

                    var internalAngle = Math.atan(planeHeight / planeWidth);
                    var internalLength = Math.sqrt((planeWidth * planeWidth) + (planeHeight * planeHeight)) * 0.5;
             
                    var pheta = this.angleOfAttack + internalAngle;
                    var alpha = this.angleOfAttack - internalAngle;

                    var topRightX = (internalLength * Math.cos(pheta));
                    var topRightY = - (internalLength * Math.sin(pheta)) ;
                 
                    var bottomRightX = (internalLength * Math.cos(alpha));
                    var bottomRightY = - (internalLength * Math.sin(alpha));

                    var bottomLeftX = - (internalLength * Math.cos(-pheta));
                    var bottomLeftY =  - (internalLength * Math.sin(-pheta)) ;
                 
                    var topLeftX = - (internalLength * Math.cos(-alpha));
                    var topLeftY = - (internalLength * Math.sin(-alpha));


                    return [
                        [centerX, centerY],
                        [topRightX, topRightY],
                        [bottomRightX, bottomRightY],
                        [bottomLeftX, bottomLeftY],
                        [topLeftX,topLeftY]
                    ];

                    // canvas.beginPath();
                    // canvas.moveTo(topRightX, topRightY);

                    // canvas.lineTo(bottomRightX,bottomRightY);
                    // canvas.lineTo(bottomLeftX, bottomLeftY);
                    // canvas.lineTo(topLeftX,topLeftY);
                     
                    // //Define the style of the shape
                    // canvas.lineWidth = 1;
                    // canvas.fillStyle = "rgb(102, 204, 0)";
                    // canvas.strokeStyle = "rgb(0, 50, 200)";
                     
                    // //Close the path
                    // canvas.closePath(); 
                     
                    // //Fill the path with ourline and color
                    // canvas.fill();
                    // canvas.stroke();
                };


                this.drawForceVectors = function() {

                    var lineScale = 1;
                    var currentX = this.x;
                    var currentY = canvasHeight - this.y;


                    /* Weight */

                    var weightLineEndX = (this.weight * lineScale) + currentY;

                    canvas.beginPath();
                    canvas.moveTo(currentX, currentY);
                    canvas.lineTo(currentX,weightLineEndX);
                    canvas.stroke();

                    /* Lift */
                    
                    var liftLineEndX = (Math.sin(-this.angleOfAttack) * this.calculateLift() * lineScale) + currentX;
                    var liftLineEndY = -(Math.cos(-this.angleOfAttack) * this.calculateLift() * lineScale) + currentY;

                    canvas.beginPath();
                    canvas.moveTo(currentX, currentY);
                    canvas.lineTo(liftLineEndX,liftLineEndY);
                    canvas.stroke();

                    /* Thrust */
                    
                    var thrustLineEndX = (Math.cos(this.angleOfAttack) * this.thrust * lineScale) + currentX;
                    var thrustLineEndY = (Math.sin(-this.angleOfAttack) * this.thrust * lineScale) + currentY;

                    canvas.beginPath();
                    canvas.moveTo(currentX, currentY);
                    canvas.lineTo(thrustLineEndX,thrustLineEndY);
                    canvas.stroke();

                    /* Drag */

                    var drag = this.calculateDrag();
                    
                    var dragLineEndX = -(Math.cos(this.calculateAngleOfMotion()) * drag * lineScale) + currentX;
                    var dragLineEndY = (Math.sin(this.calculateAngleOfMotion()) * drag * lineScale) + currentY;


                    canvas.beginPath();
                    canvas.moveTo(currentX, currentY);
                    canvas.lineTo(dragLineEndX,dragLineEndY);
                    canvas.stroke();

                }
            };
        });