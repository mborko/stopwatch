
function init(){
    program.stopwatch.toContinue = false;
    program.stopwatch.initStart = null;
    program.stopwatch.timeOnClock = 0;
    program.stopwatch.counterReady = true;
    program.stopwatch.currentDegrees = 0;
    $('#stopwatch').text(formatTime(0));
    program.stopwatch.splitTimer = {
        toContinue:false,
        initStart:null,
        timeOnClock:0
    }
    $('#currentSplit span').text(formatTime(0));
    $('#difference span').text(formatTime(0));
    $('#splitCounter span').text(formatTime(0));
    $('#laps span.number').text(0);
}

function toggleClock(){
    if(program.stopwatch.initStart == null){
        program.stopwatch.initStart = new Date();
    }
    if(program.stopwatch.toContinue == true){
        if(program.stopwatch.splitTimer.toContinue == true){
            program.stopwatch.splitTimer.toContinue = false;
            program.stopwatch.splitTimer.timeOnClock += new Date() - program.stopwatch.splitTimer.initStart;
            program.stopwatch.splitTimer.initStart = null;
        }
        program.stopwatch.toContinue = false;
        program.stopwatch.timeOnClock += new Date() - program.stopwatch.initStart;
        program.stopwatch.initStart = null;
        return;
    }
    program.stopwatch.toContinue = true;
    if(program.stopwatch.splitTimer.timeOnClock > 0){
        program.stopwatch.splitTimer.toContinue = true;
        program.stopwatch.splitTimer.initStart = new Date();
        addSplitTime();
    }
    addTime();
}

function addTime(){
    if(program.stopwatch.toContinue === true){
        var time = new Date() - program.stopwatch.initStart + program.stopwatch.timeOnClock;
        program.stopwatch.currentDegrees = (time % 60000)/166.6;
        if(program.stopwatch.counterReady == true){
            $('#overlay').css('-webkit-transform','rotate(' + program.stopwatch.currentDegrees + 'deg)');
        }
        $('#stopwatch').text(formatTime(time));
        setTimeout("addTime()",10);
    }
}

function split(){
    var split = {},
        number = 0,
        row = $(),
        data = $();
    row = $('<tr></tr>');
    number = $('.currentSplits tbody').find('tr').length + 1;
    if(number == 1){
        split = {
            time: new Date() - program.stopwatch.initStart + program.stopwatch.timeOnClock,
            difference: 0
        }
    } else {
        split.time = new Date() - program.stopwatch.initStart + program.stopwatch.timeOnClock,
        split.difference = split.time - $.data($('.currentSplits tbody').find('tr')[number - 2]).time
    }
    program.stopwatch.splitTimer.initStart = new Date();
    startSplitTimer();
    row.data(split);
    data = $('<td>' + number + '</td><td>' + formatTime(split.time) + '</td><td>' + formatTime(split.difference) + '</td>');
    data.appendTo(row);
    row.appendTo('.currentSplits tbody');
    $('#currentSplit span').text(formatTime(split.time)).data(split);
    $('#difference span').text(formatTime(split.difference)).data(split);
    $('#laps span.number').text(number);
    var height = function(){
        var height = 0;
        $.each($('.splits table'),function(){
            height += $(this).height();
        })
        return height + 10;
    }();
    $('.splitsContainer').fadeIn(300, function(){
        $('.splits').animate({
            height:height
        })
    });
}

function startSplitTimer(){
    program.stopwatch.splitTimer.initStart = new Date();
    program.stopwatch.splitTimer.timeOnClock = 0;
    program.stopwatch.splitTimer.toContinue = true;
    addSplitTime();
}

function addSplitTime(){
    if(program.stopwatch.splitTimer.toContinue === true){
        var time = new Date() - program.stopwatch.splitTimer.initStart + program.stopwatch.splitTimer.timeOnClock;
        $('#splitCounter span').text(formatTime(time));
        setTimeout("addSplitTime()",10);
    }
}

function formatSplits(){
    var rows = $('.splits tbody').find('tr');
    rows.each(function(index){
        var split = $(this).data();
        $(this).children().remove();
        var data = $('<td>' + (index + 1) + '</td><td>' + formatTime(split.time) + '</td><td>' + formatTime(split.difference) + '</td>');
        data.appendTo($(this));
    })
    $('#difference span').text(formatTime($('#difference span').data().difference ? $('#difference span').data().difference : 0));
    $('#currentSplit span').text(formatTime($('#currentSplit span').data().difference ? $('#currentSplit span').data().time : 0));
    
    if(program.stopwatch.splitTimer.toContinue == false){
        $('#splitCounter span').text(formatTime(program.stopwatch.splitTimer.timeOnClock));
    }
}

function newSplits(){
    if($('.currentSplits tbody').find('tr').length == 0){return};
    $('.currentSplits').removeClass('currentSplits');
    var table = $('<table class="currentSplits"></table>');
    $('<thead><tr><th>#</th><th>Split</th><th>Difference</th></tr></thead>').appendTo(table);
    $('<tbody></tbody>').appendTo(table);
    table.appendTo($('.splits'));
}
