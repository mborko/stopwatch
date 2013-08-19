
program = {
    timer:{},
    stopwatch:{},
    utility:{}
}
$(window).bind("load", function() {
    console.log('We have started the main thread');
    initializeApp(); 
    $('.footerContainer').fadeIn(1000,function(){
        $('#watch').fadeIn(1000, function(){});
    })
});

function initializeApp(){
    program.stopwatch.active = true;
    program.timer.active = false;
    program.utility.secondCounterReady = function(){
        if(program.timer.active == true){
            program.timer.counterReady = true;
        }
        if(program.stopwatch.active == true){
            program.stopwatch.counterReady = true;
        }
        console.log('this function ran')
    }
    init();
    initTimer();
    setDateTime();
    
    $('#toggle').on('click',function(){
        toggle();
    })
    $('#split').on('click',function(){
        splitClicked();
    })
    $('.circle').on('click',function(evt){
        circleClicked(evt);
    })
    $('#reset').on('click',function(){
        resetClicked();
    })
    $('.timer').on('click',function(){
        switchToTimer();
    })
    $('.stopwatch').on('click',function(){
        switchToStopwatch();
    })
    $('#editableInput input').on('focus',function(evt){
        //Remove whatever number is currently in there
        $(evt.target).val('');
    })
    $('#editableInput input').on('keydown',function(evt){
        //Only number characters can go in
        // Allow: backspace, delete, tab, escape, and enter
        if(event.keyCode == 13){
            $(evt.target).blur();
            return;
        }
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || 
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) || 
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
    })
    
    $(document).on('keydown',function(evt){
        if(evt.keyCode == 32){
            evt.preventDefault();
            toggle();
        }
    })
    
    $('#editableInput input').on('blur',function(evt){
        //If only one number came in, format it so that it has a leading or trailing zero
        var number = $(evt.target).val();
        if(number == ''){
            $(evt.target).val('00');
        } else if(number.length == 1){
            $(evt.target).val('0' + number);
        }
        
        //Analyze the number
        var hours = parseInt($('.hoursInput').val()) * 3600000;
        var minutes = parseInt($('.minutesInput').val()) * 60000;
        var seconds = parseInt($('.secondsInput').val()) * 1000;
        var miliseconds = parseInt($('.milisecondsInput').val()) * 10;
        program.timer.timeOnClock = hours + minutes + seconds + miliseconds;
        program.timer.currentDegrees = ((program.timer.timeOnClock % 60000)/166.6);
        animateSecondCounter();
        
    })  
}

function switchToStopwatch(){
    if(program.stopwatch.active == true){return;}
    program.timer.active = false;
    program.stopwatch.active = true;
    program.stopwatch.counterReady = false;
    program.timer.counterReady = false;
    animateSecondCounter();
    $('.timer').toggleClass('active');
    $('.stopwatch').toggleClass('active');
    $('#splitInfo').show();
    $('#timerInfo').hide();
    if(program.timer.alarmSounded == true){
        $('#toggle').text('Start/Stop')
    }
}

function resetClicked(){
    returnSlider();
    if(program.stopwatch.active == true){
        if(program.stopwatch.toContinue == true){return};
        init();
        newSplits();
    } else {
        resetTimer();
    }
}

function circleClicked(evt){
    //Format the Stopwatch
    if($(evt.target).hasClass('active')){return};
    $('.circle').removeClass('active');
    $(evt.target).addClass('active');
    if($(evt.target).text() == 'HH'){program.utility.format = 'hours'}
    else if($(evt.target).text() == 'MM'){program.utility.format = 'minutes'}
    else{program.utility.format = 'seconds'};
    formatSplits();
    $('#stopwatch').text(formatTime(program.stopwatch.timeOnClock));
    //Format the Timer Stuff too
    formatTimer();
}

function splitClicked(){
    if(program.stopwatch.active == true){
        if(program.stopwatch.toContinue == false){return};
        split();
    }
}

function toggle(){
    if(program.stopwatch.active == true){
        toggleClock();
    } else {
        toggleTimer();
    }
}

function switchToTimer(){
    if(program.timer.active == true){return;}
    program.timer.active = true;
    program.stopwatch.active = false;
    program.stopwatch.counterReady = false;
    program.timer.counterReady = false;
    $('.timer').toggleClass('active');
    $('.stopwatch').toggleClass('active');
    animateSecondCounter();
    $('#splitInfo').hide();
    $('#timerInfo').show();
    if(program.timer.alarmSounded == true){
        $('#toggle').text('Snooze')
    }
}