(function($) {
    $.fn.puissance4 = function( x = 7, y = 6,  ia = false ,p1 = "Player 1", p2 = "Player 2", color1 = "red", color2 = "yellow" , win = 4) {
        var matrix = [];
        var grid = "";
        grid += ("<h1><img src='img/puissance4.png' alt='logo puissance 4'></h1>");
        grid += ("<p><strong id=next>Que le meilleur gagne!</strong></p>");
        grid += ("<button id='newGame' type='button'>New Game</button>");
        grid += ("<button id='undo' type='button'>Undo</button>");
        grid += ("<div id='score'><div id='P1'>0</div><div id='P2'>0</div></div>");
        grid += ("<div id='puissance' data-freeCases="+x*y+">");
        for(var i=0; i<x; i++) {
            matrix[i] = [];
            grid += ("<div class='col' data-col="+i+" data-jetton="+ y +">")
            for(var j=0; j<y; j++) {
                grid += (matrix[i][j] = "<div class='cases' id="+y+"-"+j+" data-line="+j+" data-col="+y+" data-player=0></div>" );
            }
            grid += ("</div>");
        }
        grid += ("</div>");
        $("body").append(grid);

        if (color1 == color2){
            color1 = "red";
            color2 = "yellow";
        }

        var newGameButton = $("#newGame");
        var undo = $("#undo");
        var last;
        var lastClickCol;
        var col = $(".col");
        var cases = $(".cases");
        var next = $("#next");

        var scoreP1 = 0;
        var scoreP2 = 0;

        var player = 1;
        var undoOk = 0;

        $("#P1").css("background-color", color1);
        $("#P2").css("background-color", color2);

        if (ia == false) {undo.css("visibility","visible");}

        undo.click(function(){
            if (undoOk == 0) {
                if (last == undefined) {
                    alert("Commence déjà à jouer -_-'")
                }
                else if (last !=  undefined){
                    last.css("background-color", "unset");
                    last.attr("data-player",0);

                    var freeCasesPlus = $("#puissance").attr("data-freeCases");
                    $("#puissance").attr("data-freeCases", parseInt(freeCasesPlus) +1);
                    var jettonPlus = lastClickCol.attr("data-jetton");
                    lastClickCol.attr("data-jetton", parseInt(jettonPlus) +1);
                    if (player == 1 && undoOk == 0) {
                        player = 2;
                        undoOk = 3;
                        document.getElementById("next").innerHTML = "C'est au tour de "+p2;
                    };
                    if (player == 2 && undoOk == 0) {
                        player = 1;
                        undoOk = 3;
                        document.getElementById("next").innerHTML = "C'est au tour de "+p1;
                    };
                    undoOk = 1;
                }
            }
        });

        col.click(function(){
            lastClickCol = $(this);
            var jetton = $(this).attr("data-jetton")-1;
            var elem = $($(this).children()[jetton]);
            last = elem;
            var freeCases = $($(this).parent()).attr("data-freeCases");
            if (jetton >= 0 && player === 1){
             elem.css("background-color", color1);
             elem.attr("data-player",1);
             undoOk = 0;
             if(check_win_v(elem) === true  || check_win_h(elem) === true || check_win_d1(elem) === true || check_win_d2(elem) === true){
                document.getElementById("next").innerHTML = p1 + "win!";
                scoreP1++;
                document.getElementById("P1").innerHTML = scoreP1;
                alert("Player " + p1 + " win");
                player = undefined;
            }
            else {

                player = 2;
                document.getElementById("next").innerHTML = "C'est au tour de "+p2;
                $(this).attr("data-jetton",jetton);
                var upFreeCases = $($(this).parent()).attr("data-freeCases", freeCases -1);
                if (jetton >= 0 && player === 2 && ia == true){
                    document.getElementById("next").innerHTML = "C'est au tour de "+p1;
                    var rand = Math.floor((Math.random() * parseInt(x)) + 0);
                    var randCol = $($(this).parent().children()[rand]);
                    var randColJetton = randCol.attr("data-jetton")-1;
                    var randCases = $(randCol.children()[randColJetton]);
                    var jettonRandCases = randCol.attr("data-jetton",randColJetton);
                    randCases.css("background-color", color2);
                    randCases.attr("data-player",2);
                    player = 1;
                    undoOk = 0;
                }
            }
        }
        else if (jetton >= 0 && player === 2 && ia != true){
         elem.css("background-color", color2);
         elem.attr("data-player",2);
         if(check_win_v(elem) === true  || check_win_h(elem) === true || check_win_d1(elem) === true || check_win_d2(elem) === true){
            document.getElementById("next").innerHTML = p2 + "win!";
            scoreP2 ++
            document.getElementById("P2").innerHTML = scoreP2;
            alert("Player " + p2 + " win");
            player = undefined;
            undoOk = 0;
        }
        else{
            player = 1;
            document.getElementById("next").innerHTML = "C'est au tour de "+p1;
            $(this).attr("data-jetton",jetton);
            var upFreeCases = $($(this).parent()).attr("data-freeCases", freeCases -1);
        }
    }
    else if (freeCases == 0 && player != undefined) {
        alert("Match nul.");
        undoOk = 0;
    }

});

        function check_win_v(elem) {
            var dataCol = elem.parent().attr("data-col");
            var dataLine = elem.attr("data-line");
            var dataPlayer = elem.attr("data-player");
            var count = 0;
            for (var i = 0 ; i < y; i++) {
                var checkColor = $($(elem.parent().parent().children()[dataCol]).children()[i]).attr("data-player");
                if (checkColor == dataPlayer) {
                    count++;
                    if (count == win) {
                        return true;
                    }
                } else {
                    count = 0;
                }
            }
        }

        function check_win_h(elem) {
            var dataCol = elem.parent().attr("data-col");
            var dataLine = elem.attr("data-line");
            var dataPlayer = elem.attr("data-player");
            var count = 0;
            for (var i = 0 ; i < x; i++) {
                var checkColor = $($(elem.parent().parent().children()[i]).children()[dataLine]).attr("data-player");
                if (checkColor == dataPlayer) {
                    count++;
                    if (count == win) {
                        return true;
                    }
                } else {
                    count = 0;
                }
            }
        }

        function check_win_d1(elem) {
            var dataCol = parseInt(elem.parent().attr("data-col"));
            var dataLine = parseInt(elem.attr("data-line"));
            var dataPlayer = elem.attr("data-player");
            var count = 0;
            for (i = -win-1; i <= win-1; i++) {
                if (elem.parent().parent().children()[dataCol + i] !== undefined &&
                    $(elem.parent().parent().children()[dataCol + i]).children()[dataLine + i] !== undefined) {
                    if ($($(elem.parent().parent().children()[dataCol + i]).children()[dataLine + i]).attr("data-player") == dataPlayer)
                        ++count;
                    else
                        count = 0;
                    if (count == win) {
                     return true;
                 }
             }
         }
     }

     function check_win_d2(elem) {
        var dataCol = parseInt(elem.parent().attr("data-col"));
        var dataLine = parseInt(elem.attr("data-line"));
        var dataPlayer = elem.attr("data-player");
        var count = 0;
        for (i = -win-1; i <= win-1; i++) {
            if (elem.parent().parent().children()[dataCol - i] !== undefined &&
                $(elem.parent().parent().children()[dataCol - i]).children()[dataLine + i] !== undefined) {
                if ($($(elem.parent().parent().children()[dataCol - i]).children()[dataLine + i]).attr("data-player") == dataPlayer)
                    ++count;
                else
                    count = 0;
                if (count == win) {
                    return true;
                }
            }
        }
    }
    newGameButton.click(function(){
        player = 1;
        undoOk = 0;
        document.getElementById("next").innerHTML = "C'est au tour de "+p1;
        $("#puissance").attr("data-freeCases",x*y);
        $(".col").attr("data-jetton", y);
        $(".cases").attr("data-player", 0);
        $(".cases").css("background-color","unset");
    });



}
})(jQuery);
$('body').puissance4();