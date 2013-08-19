
function initTimer(){
    if(program.stopwatch.active == true){
        $('#timerInfo').hide();
    }
    $('audio').remove();
    program.timer.started = false;
    program.timer.paused = false;
    program.timer.initDate = null;
    program.timer.timeOnClock = 0;
    program.timer.counterReady = true;
    program.timer.alarmSounded = false;
    program.timer.currentDegrees = 0;
    $('.none').stop();
    $('.none').clearQueue();
    $('.hoursInput').val('00');
    $('.minutesInput').val('00');
    $('.secondsInput').val('00');
    $('.milisecondsInput').val('00');
    $('#editableInput').show();
    $('.none').hide();
    $('.initTimer').text(formatTime(0));
    $('.elapsed').text(formatTime(0));
    $('#toggle').text('Stop/Start');
    $('#editableInput input').each(function(){$(this).css('width','58');});
}

function toggleTimer(){
    if(program.timer.started == false){
        //Analyze the number
        var hours = parseInt($('.hoursInput').val()) * 3600000;
        var minutes = parseInt($('.minutesInput').val()) * 60000;
        var seconds = parseInt($('.secondsInput').val()) * 1000;
        var miliseconds = parseInt($('.milisecondsInput').val()) * 10;
        program.timer.timeOnClock = hours + minutes + seconds + miliseconds;
        program.timer.initialTime = program.timer.timeOnClock;
        //Verify that the data is valid before starting the timer
        if(program.timer.timeOnClock == 0){return;}
        //We are starting the timer
        program.timer.started = true;
        program.timer.initStart = new Date();
        //Configure and show the span tag
        $('.none').text(formatTime(program.timer.timeOnClock));
        $('.none').show();
        $('.none').css('opacity','1');
        //hide the input tag
        $('#editableInput').hide();
        $('.initTimer').text(formatTime(program.timer.initialTime));
        //start subtracting time
        
        program.timer.counterReady = false;
        subtractTime();
        animateSecondCounter();
    } else if(program.timer.alarmSounded == true) {
        //The alarm has sounded and we need to turn it off
        resetTimer();
    } else if(program.timer.paused == false) {
        //We are pausing the timer
        program.timer.paused = true;
        program.timer.timeOnClock =  program.timer.timeOnClock - (new Date() - program.timer.initStart);
    } else {
        //We are resuming the timer
        program.timer.paused = false;
        program.timer.initStart = new Date();
        subtractTime();
    }
}

function soundAlarm(){
    $('.elapsed').text(formatTime(program.timer.initialTime));
    var mp3snd = "../sounds/alarm.mp3";
    var audio = $('<audio autoplay="autoplay"></audio>');
    $('<source src="'+mp3snd+'" type="audio/mpeg">').appendTo(audio);
    $('<bgsound src="'+mp3snd+'" loop="loop">').appendTo(audio);
    audio.appendTo($('#audio'));
    $('.none').text('Alarm');
    $('#toggle').fadeOut('500',function(){
        $('#toggle').text('Snooze');
        $('#toggle').fadeIn('500');
    })
    program.timer.alarmSounded = true;
    triggerAlarm();
}

function triggerAlarm(){
    if(program.timer.alarmSounded == true){
        $('.none').effect("pulsate", {}, 1000);
        setTimeout("triggerAlarm()",1000);
    }
}


function subtractTime(){
    if(program.timer.paused === false){
        var time = program.timer.timeOnClock - (new Date() - program.timer.initStart);
        if(time <= 0){
            soundAlarm();
            return;
        }
        program.timer.currentDegrees = ((time % 60000)/166.6);
        if(program.timer.counterReady == true){
            $('#overlay').css('-webkit-transform','rotate(' + program.timer.currentDegrees + 'deg)');
        }
        $('.elapsed').text(formatTime(program.timer.initialTime - time));
        $('.none').text(formatTime(time));
        setTimeout("subtractTime()",10);
    }
}

function resetTimer(){
    if(program.timer.started == true){
        if(program.timer.paused == true){
            initTimer();
        } else if(program.timer.timeOnClock - (new Date() - program.timer.initStart) <= 0){
            initTimer();
        }
    } else {
        initTimer();
    }
}