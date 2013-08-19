//Date/time Settings

function setDateTime(){
    var today = new Date();
    program.utility.date = {
        tempDate:-1,
        date:today.getDate(),
        month:today.getMonth(),
        tempDay:0,
        day:function(){
            var degrees = today.getDay() * (360/7) + (((360/7)/24) * today.getHours());
            if(degrees > 180){
                degrees = degrees - 360;
            }
            return degrees
        }()
    };
    //To emphasize this animation, I'm delaying its start
    setTimeout('setMonth(2000);setDate(2000);setDay(2000);',1000)
    //Re run this every 1000 seconds just to make sure the date is accurate in case the timer or stopwatch is left on over the course of several days
    setTimeout('setDateTime()',1000000);
}

function setDay(ms){
    $('#date_ticker').animate({
        'rotation-transform':program.utility.date.day
    },{
        duration:ms,
        step: function(now, fx) {
            $('#date_ticker').css('transform','rotate(' + now + 'deg)');
        }
    });
}

function setDate(ms){
    $('#currentDay p').animate({
        marginTop:function(){
            var margins = [0,14,28,42,56,70,84,98,112,126,140,154,168,182,195,210,223,238,252,266,280,294,308,322,336,350,364,378,392,406,420]
            return margins[program.utility.date.date - 1] * -1 
        }()
    },ms)
}

function setMonth(ms){
    $('#currentMonth p').animate({
        marginTop:function(){
            var margins = [0,14,28,42,56,70,84,98,112,126,140,154]
            return margins[program.utility.date.month] * -1 
        }()
    },ms)
}