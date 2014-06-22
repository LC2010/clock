void function () {
    var canvas = document.getElementById('canvas'),
    marquee = document.getElementById('notice'),
    context = canvas.getContext('2d'),
    FONT_HEIGHT = 15,
    MARGIN = 75,
    HAND_TRUNCATION = canvas.width/25,
    HOUR_HAND_TRUNCATION = canvas.width/8;
    NUMERAL_SPACING = 20,
    RADIUS = canvas.width/2 - MARGIN,
    HAND_RADIUS = RADIUS + NUMERAL_SPACING - 45,
    TICK_WIDTH = 10,
    TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, 0.9)',
    TICK_SHORT_STROKE_STYLE = 'rgba(100, 140, 230, 0.7)';

    // 画中心小圆
    function drawCenter() {
        context.beginPath();
        context.save();
        context.lineWidth = 0;
        context.arc(canvas.width/2, canvas.height/2, 5, 0, Math.PI*2, true );
        context.fill();
        context.restore();
    }

    // 画表针
    function drawHand(loc, type) {
        var angle = (Math.PI*2) * (loc/60) - Math.PI/2;
        var handRadius = 0;
        context.save();
        context.beginPath();

        handRadius = type === 'hour' ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION
                            : RADIUS - HAND_TRUNCATION;

        switch (type) {
            case 'hour':
                context.lineWidth = 5;
                break;
            case 'minutes':
                handRadius -= 30;
                context.lineWidth = 3;
                break;
            case 'seconds':
                handRadius -= 25;
                break;
            case 'default':
           
        }

        context.moveTo(canvas.width/2, canvas.height/2);
        context.lineTo(canvas.width/2 + Math.cos(angle)*handRadius, canvas.height/2 + Math.sin(angle)*handRadius);
        context.stroke();
        context.restore();
    }

    function drawHands() {
        var date = new Date,
            hour = date.getHours();

        hour = hour > 12 ? hour - 12 : hour;
        drawHand(hour*5 + (date.getMinutes()/60)*5, 'hour');
        drawHand(date.getMinutes(), 'minutes');
        drawHand(date.getSeconds(), 'seconds');
    }

    // 画表盘数字
    function drawNumbers() {
        var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        angle = 0,
        numberalWidth = 0;

        numbers.forEach(function (n) {
            angle = Math.PI/6 * (n-3);
            numberalWidth = context.measureText(n).width;
            context.fillText(n, canvas.width/2 + Math.cos(angle) *(HAND_RADIUS) - numberalWidth/2, canvas.height/2 + Math.sin(angle)*(HAND_RADIUS) + FONT_HEIGHT/3);
        });
    }


    // 画球队比赛信息
    function drawTeam() {
        var date = new Date();
        var month = ('00' + (date.getMonth() + 1)).slice(-2);
        var date = ('00' + date.getDate()).slice(-2);
        var key = month + date;
        var groups = [], step = 0;
        // 如果当天有比赛
        var agenda = Team[key];
        if (agenda) {
            agenda.forEach(function (item) {
                var time = item.time, group = item.group;
                groups.push(group);
            });
            marquee.innerHTML = groups.join('<br>');
        }
    }

    // 画表盘秒针格
    function drawTick(angle, radius, cnt) {
        context.save();
        var tickWidth = cnt % 5 === 0 ? TICK_WIDTH : TICK_WIDTH/2;
        var circle = { x: canvas.width/2, y: canvas.height/2, radius: 150 };
        context.beginPath();
        if (cnt % 5 === 0) {
            context.lineWidth = 5;
        }
        context.moveTo(circle.x + Math.cos(angle) * (radius - tickWidth),
                      circle.y + Math.sin(angle) * (radius - tickWidth));

        context.lineTo(circle.x + Math.cos(angle) * (radius),
                      circle.y + Math.sin(angle) * (radius));

        context.stroke();        
        context.restore();
    }

    function drawTicks() {
        var ANGLE_MAX = 2*Math.PI,
        ANGLE_DELTA = Math.PI/30,
        tickWidth;

        context.save();

        for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
            drawTick(angle, RADIUS, cnt++);
        }

        context.restore();
    }

    function drawClock() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCenter();
        drawHands();
        drawNumbers();
        drawTicks();
        drawTeam();
        document.getElementById('logo').style.display = 'block';
    }

    function drawClockBackground() {
        var canvas = document.getElementById('bg'),
        context = canvas.getContext('2d');
        var image = new Image();
        image.src = 'clock.png';
        image.onload = function() {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    }

    context.font = FONT_HEIGHT + 'px Arial';

    drawClockBackground();

    setInterval(drawClock, 1000);

}();
