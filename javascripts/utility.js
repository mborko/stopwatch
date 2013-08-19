
function formatTimer(){
    var time = validNumber(program.timer.timeOnClock);
    var elapsed = validNumber(program.timer.initialTime - program.timer.timeOnClock);
    var initialTime = validNumber(program.timer.initialTime);
    if(program.timer.paused == true){
        $('.none').text(formatTime(time));
        $('.elapsed').text(formatTime(elapsed));
        $('.initTimer').text(formatTime(initialTime));
    } else {
        $('.initTimer').text(formatTime(initialTime));
        $('.elapsed').text(formatTime(elapsed));
    }
}

function validNumber(number){
    if(isNaN(number)){
        return 0;
    } else {
        return number;
    }
}

function formatTime(time){
    time = parseInt(time/10);
    if(program.utility.format == 'seconds'){
        return formatSeconds(time);
    } else if(program.utility.format == 'minutes'){
        return formatMinutes(time);
    } else {
        return formatDefault(time);
    }    
}

function formatSeconds(time, type){
    var ss = 0,
        ms = 0;
    if(time > 99){
        ss = parseInt(time/100);
    }
    if(time < 10){
        ms = 0
    } else {
        ms = parseInt(time.toString().slice(time.toString().length - 2));
    }
    ss = leadingZero(ss);
    ms = leadingZero(ms);
    if(type == 'timer'){
        return {
            hh:'00',
            mm:'00',
            ss:ss,
            ms:ms
        }
    } else {
        return ss + ':' + ms;
    }
}

function formatMinutes(time, type){
    var mm = 0,
        ss = 0,
        ms = 0;

    if(time > 99){
        if(time > 5999){
            mm = parseInt(time/6000)
        }
        ss = parseInt((time - (mm * 6000))/100);
    }
    if(time < 10){
        ms = 0
    } else {
        ms = parseInt(time.toString().slice(time.toString().length - 2));
    }
    mm = leadingZero(mm);
    ss = leadingZero(ss);
    ms = leadingZero(ms);
    if(type == 'timer'){
        return {
            hh:'00',
            mm:mm,
            ss:ss,
            ms:ms
        }
    } else {
        return mm + ':' + ss + ':' + ms;
    }
}

function formatDefault(time, type){
    var hh = 0,
        mm = 0,
        ss = 0,
        ms = 0;
    if(time > 99){
        if(time > 5999){
            if(time > 359999){
                hh = parseInt(time/360000);
            }
            mm = parseInt((time - (hh * 360000))/6000)
        }
        ss = parseInt((time - (mm * 6000) - (hh * 360000))/100);
    }
    if(time < 10){
        ms = 0
    } else {
        ms = parseInt(time.toString().slice(time.toString().length - 2));
    }
    hh = leadingZero(hh);
    mm = leadingZero(mm);
    ss = leadingZero(ss);
    ms = leadingZero(ms);
    if(type == 'timer'){
        return {
            hh:hh,
            mm:mm,
            ss:ss,
            ms:ms
        }
    } else {
        return hh + ':' + mm + ':' + ss + ':' + ms;
    }
}

function leadingZero(number){
    if(number < 10){
        return '0' + number
    } else {
        return number;
    }
}

function animateSecondCounter(){
    var startValue = parseFloat($('#overlay').css('transform').replace('rotate(',''));
    var endValue = 0;
    var difference = .75 * (360/60);
    
    if(program.timer.active == true){
        //We are switching to the timer right now.
        //Identify the point at where we need to be.
        endValue = function(){
            if(program.timer.currentDegrees){
                if(program.timer.currentDegrees == 0){
                    return 0;
                } else if(program.timer.started == false || program.timer.paused == true){
                    return program.timer.currentDegrees;
                } else {
                    return program.timer.currentDegrees - difference;
                }
            } else {
                return 0;
            }
        }()
    }
    if(program.stopwatch.active == true){
        //We are switching to the stopwatch right now.
        //Identify the point at where we need to be.
        endValue = function(){
            if(program.stopwatch.currentDegrees){
                if(program.stopwatch.currentDegrees == 0){
                    return 0;
                } else if(program.stopwatch.toContinue == false){
                    return program.stopwatch.currentDegrees;
                } else {
                    return program.stopwatch.currentDegrees + difference;
                }
            } else {
                return 0;
            }
        }() 
    }
    if(endValue - startValue > 180){
        startValue = 360 + startValue;
    }
    $('#spinnerMargin').stop();
    $('#spinnerMargin').clearQueue();
    $('#spinnerMargin').css('margin-top',startValue);
    $('#spinnerMargin').animate({
        'marginTop':endValue
    },{
        duration:750,
        step: function(now, fx) {
            $('#overlay').css('-webkit-transform','rotate(' + now + 'deg)');
        },
        complete:function(){
            program.utility.secondCounterReady();
        }
    });
}

function returnSlider(){
    var currentDegrees = 0;
    if(program.stopwatch.active == true){
        currentDegrees = program.stopwatch.currentDegrees;
    } else {
        currentDegrees = program.timer.currentDegrees;
    }
    var value = 0;
    if(currentDegrees > 180){
        value = 360;
    } else {
        value = 0;
    }
    $('#spinnerMargin').stop();
    $('#spinnerMargin').clearQueue();
    $('#spinnerMargin').css('margin-top',currentDegrees);
    $('#spinnerMargin').animate({
        'marginTop':value
    },{
        duration:750,
        step: function(now, fx) {
            $('#overlay').css('transform','rotate(' + now + 'deg)');
        },
        complete:function(){
            $('#overlay').css('transform','rotate(0deg)');
        }
    });
}