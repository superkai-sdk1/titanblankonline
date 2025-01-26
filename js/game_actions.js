(function($){
    var _action = false;
var roles = {
    'c': '&nbsp;',
    'm': 'М',
    'd': 'Д',
    's': 'Ш'
};
var $document = $(document);
var $window = $(window);

    function checkValues(){
        var m = $('.role_field_all[value="m"]').length;
        var d = $('.role_field_all[value="d"]').length;
        var s = $('.role_field_all[value="s"]').length;

        if((m != 2) | (d != 1) | (s != 1)){
            alert("Не правильно отмечены роли!");
            return -1;
        }

        return 0;
    }
    // Сохранение данных
    function saveData() {
        // Сохраняем никнеймы
        const nicknames = [];
        document.querySelectorAll('.nick_acpl').forEach((input, index) => {
            nicknames[index] = input.value;
            localStorage.setItem('nicknames', JSON.stringify(nicknames));
        });

        // Сохраняем роли
        const roles = [];
        document.querySelectorAll('.role_field_all').forEach((input, index) => {
            roles[index] = input.value;
            localStorage.setItem('roles', JSON.stringify(roles));
        });

        // Сохраняем фолы
        const falls = [];
        document.querySelectorAll('[id^=fall_field_]').forEach((input, index) => {
            falls[index] = input.value;
            localStorage.setItem('falls', JSON.stringify(falls));
        });

        // Сохраняем баллы
        const points = [];
        document.querySelectorAll('[id^=points_]').forEach((input, index) => {
            points[index] = input.value;
            localStorage.setItem('points', JSON.stringify(points));
        });
    }

// Загрузка данных
    function loadData() {
        // Загружаем никнеймы
        const nicknames = JSON.parse(localStorage.getItem('nicknames')) || [];
        document.querySelectorAll('.nick_acpl').forEach((input, index) => {
            if(nicknames[index]) input.value = nicknames[index];
        });

        // Загружаем роли
        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        document.querySelectorAll('.role_field_all').forEach((input, index) => {
            if(roles[index]) {
                input.value = roles[index];
                document.getElementById(`role_view_${index}`).innerHTML = roles[index];
            }
        });

        // Загружаем фолы
        const falls = JSON.parse(localStorage.getItem('falls')) || [];
        document.querySelectorAll('[id^=fall_field_]').forEach((input, index) => {
            if(falls[index]) input.value = falls[index];
        });

        // Загружаем баллы
        const points = JSON.parse(localStorage.getItem('points')) || [];
        document.querySelectorAll('[id^=points_]').forEach((input, index) => {
            if(points[index]) input.value = points[index];
        });
    }

// Добавляем обработчики событий
    $document.on('DOMContentLoaded', loadData);
    $document.on('input', saveData);

    function setFall(delta, value) {
        if((value >= 0) && (value <= 4)) {
            var input = $('#fall_field_'+delta);
            var view = $('#falls_view_'+delta);
            var addPoints = $('#add_points_'+delta);

            $(input).attr('value', value);
            $(input).val(value);
            $(view).attr('class', 'fall_'+value);

            // Добавляем штраф только при 4-м фоле
            if(value === 4) {
                var penalty = -0.5;
                var currentPoints = parseFloat(addPoints.val()) || 0;
                addPoints.attr('data-fall-penalty', penalty);
                addPoints.val((currentPoints + penalty).toFixed(2));
                addPoints.attr('value', (currentPoints + penalty).toFixed(2));
            }
        }
    }


	function setRole(delta, value){
		if(roles.hasOwnProperty(value)){
			var input = $('#role_field_'+delta);
			var view = $('#role_view_'+delta);
			$(input).attr('value', value);
            $(input).val(value);
			$(view).html(roles[value]);
		}
	}

	function check_all(){
		for(var i = 0; i < 10; i++){
			var val = parseInt($('#fall_field_'+i).val());
			var view = $('#falls_view_'+i);
            var bp = $('#BP_field_'+i).attr('value');

            var role = $('#role_field_'+i).attr('value');
            $('#role_view_'+i).html(roles[role]);

			if($(view).attr('class') != 'fall_'+val){
				$(view).attr('class', 'fall_'+val);
			}

            if(bp != ""){
                $('#bp_'+bp).html(i+1);
                $('#bp_'+bp).addClass('b_pl');
            }
		}

		clear_fk();
        for(var i = 0; i < 10; i++){
            if($('#FK_field_'+i).val() != ""){
    			var val = parseInt($('#FK_field_'+i).val());
    			$('#fk_'+val).addClass('fk_selected');
                $('#fk_'+val).html((i+1));

                if(i == 0){
                    $('.show_'+val).css("display", "table-cell");
                }

                if(i==0){
                    var bm = get_bm();
                    process_bm(bm);
                }
    		}
        }

        var m = $('#mafia');
        var c = $('#city');
        //alert($('#winner_field').attr());
        switch($('#winner_field').val() ){
            case 'c':
                $(c).addClass('win_team');
                $(m).removeClass('win_team');
            break;
            case 'm':
                $(m).addClass('win_team');
                $(c).removeClass('win_team');
            break;
        }
	}

	function process_bm(mass){
		var field = [$('#BM_field_0'), $('#BM_field_1'), $('#BM_field_2')];
		for(var i = 0; i<3; i++){
			$(field[i]).attr('value', '');
            $(field[i]).val('');
		}

		var l = mass.length;
		var tmp;
		for(var j = 0; j<l-1; j++){
			for(i = 0; i<l-1; i++){
				if(mass[i]>mass[i+1]){
					tmp = mass[i];
					mass[i] = mass[i+1];
					mass[i+1] = tmp;
				}
			}
		}

		$('.bm_selected').each(function(){
			$(this).removeClass('bm_selected');
		});

		for(i = 0; i<l; i++){
			$(field[i]).attr('value', mass[i]);
			$(field[i]).val(mass[i]);
            $('.bm_pos_'+mass[i]).each(function(){
				$(this).addClass('bm_selected');
			});
		}
	}


	function get_bm(){
		var res = [];
		var field = [$('#BM_field_0'), $('#BM_field_1'), $('#BM_field_2')];
		for(var i = 0; i<3; i++){
			if($(field[i]).val() != ''){
				res.push(parseInt($(field[i]).val()));
			}
		}
		return res;
	}

	function set_bm(pos){
		var bm = get_bm();
		var ip = in_bm(bm, pos);
		var l = bm.length;
		if(ip<0){
			if(l < 3){
				bm.push(pos);
			}
		} else {
			var tmp = [];
			for(var i = 0; i<l; i++){
				if(ip != i){
					tmp.push(bm[i]);
				}
			}
			bm = tmp;
		}

		process_bm(bm);
	}

	function hide_bm(delta){
		$('.bm_line_'+delta).css("display", "none");
		$('.hide_'+delta).css("display", "none");
		$('.show_'+delta).css("display", "table-cell");
		$('.nick_'+delta).css("display", "table-cell");
	}

	function show_bm(delta){
		$('.nick_'+delta).css("display", "none");
		$('.bm_line_'+delta).css("display", "table-cell");
		$('.hide_'+delta).css("display", "table-cell");
		$('.show_'+delta).css("display", "none");
	}

	function points_callc(delta, cur, target){
		var tar = (target == 0)?"#points_":"#add_points_";
		tar += delta;
        var data = +$(tar).val();
        data += values[cur];
		data = data.toFixed(6);
        $(tar).attr('value', +data);
        $(tar).val(+data);
	}

    function put_to_vote(delta){
        var pos = $('.voute_line[data-act="1"]').length;
        if(pos == 0){
            $('.vote-table').css('display', 'table');
            $('.vote-table-mirror').css('display', 'table');
        }
        var line = $('#vt_'+pos);
        var view = $('#vv_'+pos);
        var dv = $('#dv_'+pos);
        var pl = $('#vpl_'+delta);
        var butt = $('#save_day');
        if($(pl).attr('data-invote') == 0){
            $(pl).attr('data-invote', '1');
            $(view).html(delta+1);
            $(line).attr('data-act', '1');
            $(line).css('display', 'table-row');
            $(dv).css('display', 'table-cell');
            $(dv).html(delta+1);
            if($(butt).css('display') == 'none'){
                $(butt).css('display', 'table-row');
            }
        }
    }
    function toggleDropdown() {
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.classList.toggle('show');
    }

// Добавить обработчик клика вне меню
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-toggle')) {
            const dropdowns = document.getElementsByClassName('dropdown-content');
            for (let dropdown of dropdowns) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }
    });
    function rem_from_vote(delta){
        var pos = $('.voute_line[data-act="1"]').length - 1;
        if(pos == 0){
            $('.vote-table').css('display', 'none');
            $('.vote-table-mirror').css('display', 'none');
        }
        var view = $('#vv_'+pos);
        //alert($(view).html() + ' == ' + delta);
        if($(view).html() == delta){
            delta -= 1;
            var pl = $('#vpl_'+delta);
            var line = $('#vt_'+pos);
            var dv = $('#dv_'+pos);
            var butt = $('#save_day');
            $(pl).attr('data-invote', '0');
            $(view).html('');
            $(line).attr('data-act', '0');
            $(line).css('display', 'none');
            $(dv).css('display', 'none');
            $(dv).html("");
            $('#vt_'+pos+' .vote_st').each(function (){
                $(this).removeClass('vote_st');
            });
            $('#vt_'+pos+' .vote_nd').each(function (){
                $(this).removeClass('vote_nd');
            });

            if(pos == 0){
                $(butt).css('display', 'none');
            }
        }
    }

    function save_day(){
        var day = '';
        $('.voute_line[data-act="1"]').each(function (){
            var pos = $(this).data('line');
            var dv = $('#dv_'+pos);
            var line = $('#vt_'+pos);
            var view = $('#vv_'+pos);
            var st = $('#vt_'+pos+' .vote_st');
            var nd = $('#vt_'+pos+' .vote_nd');
            var pl = $(view).html();
            var tmp =0;
            var ppstr = pl;
            if($(st).length){
                tmp = ($(st).data('pos')+1);
                if(tmp == 6){ tmp += '+'; }
                str = pl + " - " + tmp + " голосов";
            } else {
                str = pl + " - " + tmp + " голосов";
            }

            if($(nd).length) {
                tmp = ($(nd).data('pos')+1);
                if(tmp == 6){ tmp += '+'; }
                str = str + " Голосв / После деления - " + tmp + " голосов";
            }

            $(line).css('display', 'none');
            $('#vpl_'+(pl-1)).attr('data-invote', '0');
            $(view).html('');
            $(line).attr('data-act', '0');
            $(dv).css('display', 'none');
            $(dv).html("");

            if(day != ''){
                day += '<br>';
            }

            day += str;
        });

        $('.vote_st').each(function (){
            $(this).removeClass('vote_st');
        });
        $('.vote_nd').each(function (){
            $(this).removeClass('vote_nd');
        });

        $('.vote-table').css('display', 'none');
        $('.vote-table-mirror').css('display', 'none');

        $('#save_day').css('display', 'none');

        var lp = parseInt($("#vote_res").attr("data-line"));
		var lpn = lp+1;
		$("#vote_res").attr("data-line", lpn);
		$("#vr_l"+lp).after('<div class="vote_day" id="vr_l'+lpn+'"><p>'+lpn+'</p><div data-day="'+lpn+'" class="helper">'+day+'</div></div>');
    }

    function get_cnt_bm(){
        var bm = get_bm();
        var bm_cnt = 0;
        var role = '';
        for(var j=0; j<3; j++){
            role = $('#role_field_'+bm[j]).attr('value');
            if((role == 'm') | (role == 'd')){
                bm_cnt++;
            }
        }

        return bm_cnt;
    }

    function set_winner_mafia(){

        for(var i=0; i<10; i++){

            var points = 0;
            var add_points = 0;

            switch($('#role_field_'+i).attr('value')){
                case 'm':
                    //$('#points_'+i).attr('value', mafia[0]);
                    points += mafia[0];
                break;
                case 'd':
                    //$('#points_'+i).attr('value', don[0]);
                    points += don[0];
                break;
                case 'c':
                    //$('#points_'+i).attr('value', city[1]);
                    points += city[1];
                break;
                case 's':
                    //$('#points_'+i).attr('value', sheriff[1]);
                    points += sheriff[1];
                break;
                    $('#points_'+i).attr('value', +points);
                    $('#points_'+i).val(+points);
                    $('#add_points_'+i).attr('value', +add_points);
                    updateTotal(i);
            }

            if($('#FK_field_0').attr('value') != ''){
                if($('#FK_field_0').attr('value') == i){
                    var bmp = 0;
                    switch($('#role_field_'+i).attr('value')){
                        case 'c':
                            bmp += first_killed[1];
                            switch(get_cnt_bm()){
                                case 0:
                                    bmp += bm_03[1];
                                break;
                                case 1:
                                    bmp += bm_13[1];
                                break;
                                case 2:
                                    bmp += bm_23[1];
                                break;
                                case 3:
                                    bmp += bm_33[1];
                                break;
                            }
                        break;
                        case 's':
                            bmp += first_killed[1];
                            switch(get_cnt_bm()){
                                case 0:
                                    bmp += bms_03[1];
                                break;
                                case 1:
                                    bmp += bms_13[1];
                                break;
                                case 2:
                                    bmp += bms_23[1];
                                break;
                                case 3:
                                    bmp += bms_33[1];
                                break;
                            }
                        break;
                    }

                    if(bmp_target[0] == 0){
                        points += bmp;
                    } else {
                        add_points += bmp;
                    }
                }
            }

            points = points.toFixed(6);
            add_points = add_points.toFixed(6);

            $('#points_'+i).attr('value', +points);
            $('#points_'+i).val(+points);
            $('#add_points_'+i).attr('value', +add_points);
            $('#add_points_'+i).val(+add_points);
        }

        $('#winner_field').attr('value', 'm');
        $('#winner_field').val('m');
    }

    function set_winner_city(){

        for(var i=0; i<10; i++){

            var points = 0;
            var add_points = 0;

            switch($('#role_field_'+i).attr('value')){
                case 'm':
                    //$('#points_'+i).attr('value', mafia[1]);
                    points =+ mafia[1];
                break;
                case 'd':
                    //$('#points_'+i).attr('value', don[1]);
                    points =+ don[1];
                break;
                case 'c':
                    //$('#points_'+i).attr('value', city[0]);
                    points =+ city[0];
                break;
                case 's':
                    //$('#points_'+i).attr('value', sheriff[0]);
                    points =+ sheriff[0];
                break;
                    $('#points_'+i).attr('value', +points);
                    $('#points_'+i).val(+points);
                    $('#add_points_'+i).attr('value', +add_points);
                    $('#add_points_'+i).val(+add_points);


                    updateTotal(i);
            }

            if($('#FK_field_0').attr('value') != ''){
                if($('#FK_field_0').attr('value') == i){
                    var bmp = 0;
                    switch($('#role_field_'+i).attr('value')){
                        case 'c':
                            bmp += first_killed[0];
                            switch(get_cnt_bm()){
                                case 0:
                                    bmp += bm_03[0];
                                break;
                                case 1:
                                    bmp += bm_13[0];
                                break;
                                case 2:
                                    bmp += bm_23[0];
                                break;
                                case 3:
                                    bmp += bm_33[0];
                                break;
                            }
                        break;
                        case 's':
                            bmp += first_killed[0];
                            switch(get_cnt_bm()){
                                case 0:
                                    bmp += bms_03[0];
                                break;
                                case 1:
                                    bmp += bms_13[0];
                                break;
                                case 2:
                                    bmp += bms_23[0];
                                break;
                                case 3:
                                    bmp += bms_33[0];
                                break;
                            }
                        break;
                    }

                    if(bmp_target[0] == 0){
                        points += bmp;
                    } else {
                        add_points += bmp;
                    }
                }
            }

            points = points.toFixed(6);
            add_points = add_points.toFixed(6);

            $('#points_'+i).attr('value', +points);
            $('#points_'+i).val(+points);
            $('#add_points_'+i).attr('value', +add_points);
            $('#add_points_'+i).val(+add_points);
        }

        $('#winner_field').attr('value', 'c');
        $('#winner_field').val('c');
    }

   	function clear_fk(){
		$('.fk_selected').each(function(){
			$(this).removeClass('fk_selected');
		});

		$('.all_bm_buttons').each(function(){
			$(this).css("display", "none");
		});

		$('.all_bm_actions').each(function(){
			$(this).css("display", "none");
		});

		$('.all_nicks').each(function(){
			$(this).css("display", "table-cell");
		});
	}

    function set_fk(delta){

        var pos = $('.fk_selected').length + $('.miss-select').length;
        if(pos<10){
            var input = $('#FK_field_'+pos);

            if(delta == -1){
                $('.miss-last').each(function(){ $(this).removeClass('miss-last') });
                $('#miss-container').append('<td class="allpos miss-select miss-last" data-misspos="'+pos+'">'+(pos+1)+'</td>');
                $(input).attr('value', delta);
                $(input).val(delta);
            } else {
                var view = $('#fk_'+delta);
                $(view).html((pos+1)+'<i class="fa fa-crosshairs"></i>');
                $('.miss-last').each(function(){ $(this).removeClass('miss-last') });
                $(view).addClass('fk_selected');
                $(view).addClass('allpos');
                $(view).attr('data-misspos', pos);
                _action = true;
                $(view).addClass('miss-last');

                $(input).attr('value', delta);
                $(input).val(delta);

                if(pos == 0){
                    $('.nick_'+delta).css("display", "none");
        			$('.bm_line_'+delta).css("display", "table-cell");
        			$('.hide_'+delta).css("display", "table-cell");
                }
                if(pos == 0) {
                    $('#line_'+delta).addClass('kill');
                }
            }
        }
	}

    function rem_fk(delta){
		var pos = $('.miss-select').length + $('.fk_selected').length-1;
        var input = $('#FK_field_'+pos);

        if(delta == -1){

        }

		var view = $('#fk_'+delta);
        var val = parseInt($(input).val());
        if(pos == 0) {
            $('#line_'+delta).removeClass('kill');
        }
        if(val == delta){
            $(view).html("");
            $(view).removeClass('fk_selected');
            $(input).attr('value', '');
            $(input).val('');

            if(pos == 0){
                $('.nick_'+delta).css("display", "table-cell");
    			$('.bm_line_'+delta).css("display", "none");
    			$('.hide_'+delta).css("display", "none");
            }

        }
	}

    function set_bp(delta){
        var pos = $('.b_pl').length;
        if(pos < best_player.length){
            $('#BP_field_'+pos).attr('value', delta);
            $('#BP_field_'+pos).val(delta);
            $('#bp_'+delta).html((pos+1)+'<i class="fa fa-star"></i>');
            $('#bp_'+delta).addClass('b_pl');

            var tar = (best_player[pos][1] == 0)?"#points_":"#add_points_";
            var points = +$(tar+delta).attr('value');
            points += best_player[pos][0];
            $(tar+delta).attr('value', points);
            $(tar+delta).val(points);
        }
    }

    function rem_bp(delta){
        var pos = $('.b_pl').length - 1;
        if($('#BP_field_'+pos).attr('value') == delta){
            $('#BP_field_'+pos).attr('value', '');
            $('#BP_field_'+pos).val('');
            $('#bp_'+delta).html('&nbsp;');
            $('#bp_'+delta).removeClass('b_pl');

            var tar = (best_player[pos][1] == 0)?"#points_":"#add_points_";
            var points = +$(tar+delta).attr('value');
            points -= best_player[pos][0];
            $(tar+delta).attr('value', points);
            $(tar+delta).val(points);
        }
    }

    function setFall(delta, value) {
        if((value >= 0) && (value <= 4)) {
            var input = $('#fall_field_'+delta);
            var view = $('#falls_view_'+delta);
            $(input).attr('value', value);
            $(input).val(value);
            $(view).attr('class', 'fall_'+value);

            // При 4-м фоле добавляем штраф в поле "Доп"
            if(value === 4) {
                var addPoints = $('#add_points_'+delta);
                var currentPoints = parseFloat(addPoints.val()) || 0;
                var penalty = -0.5;

                // Сохраняем штраф в data-атрибуте
                addPoints.attr('data-fall-penalty', penalty);
                addPoints.val((currentPoints + penalty).toFixed(2));
                addPoints.attr('value', (currentPoints + penalty).toFixed(2));
            }
        }
    }

	Drupal.behaviors.game_actions = {
        attach: function (context, settings) {

        check_all();


        $('#rate-table-type-node-form').on('submit', function(e){
            window.onbeforeunload = null;
        });

        $('.bp_select').click(function(){
            var delta = $(this).data('delta');
            if($(this).hasClass('b_pl')){
                rem_bp(delta);
            } else {
                set_bp(delta);
            }
        });

        $('#mafia').click(function(){
            if(checkValues() == 0){
                set_winner_mafia();
            } else {
                $(this).attr('checked', false);
            }
        });

        $('#citizens').click(function(){
            if(checkValues() == 0){
                set_winner_city();
            } else {
                $(this).attr('checked', false);
            }
        });

        $('#save_day').click(function(){
            save_day();
        });

        $('.vote_butt').click(function(){
            var line = $(this).data('line');
            var nd = $('#vt_'+line+' .vote_nd').length;
            var st = $('#vt_'+line+' .vote_st').length;

            if(nd){
                if($(this).hasClass('vote_nd')){
                    $(this).removeClass('vote_nd');
                    if($(this).hasClass('vote_st')){
                        $(this).removeClass('vote_st');
                    }
                } else {
                    $('#vt_'+line+' .vote_nd').each(function(){
                        $(this).removeClass('vote_nd');
                    });

                    $(this).addClass('vote_nd');
                }
            } else {
                if(st){
                    $(this).addClass('vote_nd');
                } else {
                    $(this).addClass('vote_st');
                }
            }
        });

        $('.to_vote').click(function(){
            var delta = $(this).data('delta');
            put_to_vote(delta);
        });

        $('.voute_p').click(function(){
            var delta = $(this).html();
            rem_from_vote(delta);
        });

            $(document).ready(function() {
                let isVisible = false;
                const button = $('#settingsToggle');

                button.click(function() {
                    isVisible = !isVisible;
                    $('.hs').css('display', isVisible ? 'table-cell' : 'none');
                    button.text(isVisible ? 'Скрыть роли и баллы' : 'Показать роли и баллы');
                });
            });

		$('.callc_pick').click(function(){
			var delta = parseInt($(this).data('delta'));
			var cur = parseInt($(this).data('current'));
			var dir = parseInt($(this).data('target'));
            points_callc(delta, cur, dir);
		});

		$('.bm_pick').click(function(){
			var pos = parseInt($(this).data('pos'));
			set_bm(pos);
		});

		$('.all_hide').click(function(){
			var line = parseInt($(this).data('line'));
			hide_bm(line);
		});

		$('.all_show').click(function(){
			var line = parseInt($(this).data('line'));
			show_bm(line);
		});

        $('.fk_pick').click(function(){
			var delta = $(this).data('delta');
            if(!$(this).hasClass("fk_selected")){
                set_fk(delta);
            }
		});

        $('body').on('click', '.miss-last', function(){
            if(_action){
                _action = false;
            } else {
                var pos = parseInt($(this).attr('data-misspos'));
                var input = $('#FK_field_'+pos);
                var val = parseInt($(input).val());

                if(val == -1){
                    $(this).remove();
                    $('.allpos[data-misspos='+(pos-1)+']').addClass('miss-last');
                    $(input).attr('value', '');
                    $(input).val('');
                } else {
                    var view = $('#fk_'+val);
                    $(view).html("");
                    $(view).removeClass('fk_selected');
                    $(view).removeClass('miss-last');
                    $('.allpos[data-misspos='+(pos-1)+']').addClass('miss-last');
                    $(input).attr('value', '');
                    $(input).val('');

                    if(pos == 0){
                        $('.nick_'+val).css("display", "table-cell");
            			$('.bm_line_'+val).css("display", "none");
            			$('.hide_'+val).css("display", "none");
                    }
                }
            }
		});

        $('#miss-button').click(function(){
			set_fk(-1);

		});

		$('.fall_click').click(function(){
			var delta = $(this).data('delta');
			var val = parseInt($('#fall_field_'+delta).val());
			val = val+1;
			switch(val){
				case 4:
					if($('#line_'+delta).hasClass('fall_active')){
						$('#line_'+delta).removeClass('fall_active');
					} else {
						setFall(delta, val);
					}
				break;
				case 3:
					$('#line_'+delta).addClass('fall_active');
				case 2:
				case 1:
					setFall(delta, val);
				break;
			}
		});

		$('.remove_click').click(function(){
			var delta = $(this).data('delta');
			var val = parseInt($('#fall_field_'+delta).val());
            if((val == 3) && ($('#line_'+delta).hasClass('fall_active'))){
                $('#line_'+delta).removeClass('fall_active');
            } else {
    			val = val-1;
    			setFall(delta, val);
            }
		});

		$('.role').click(function(){
			var delta = $(this).data('delta');
			var val = $('#role_field_'+delta).val();

			switch(val){
				case 'c':
					if($('.role_field_all[value="m"]').length<2){
						setRole(delta, 'm');
						break;
					}
				case 'm':
					if($('.role_field_all[value="d"]').length<1){
						setRole(delta, 'd');
						break;
					}
				case 'd':
					if($('.role_field_all[value="s"]').length<1){
						setRole(delta, 's');
						break;
					}
				case 's':
					setRole(delta, 'c');
				break;
			}
		});
            // Функция для обновления итоговой суммы
            function updateTotal(rowIndex) {
                const points = parseFloat(document.getElementById(`points_${rowIndex}`).value) || 0;
                const addPoints = parseFloat(document.getElementById(`add_points_${rowIndex}`).value) || 0;
                const total = points + addPoints;
                document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
                // Обновляем ячейку с итогом
                document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
            }

// Добавить обработчики событий для всех строк
            for(let i = 0; i < 10; i++) {
                // Для основных баллов
                document.getElementById(`points_${i}`).addEventListener('input', function() {
                    updateTotal(i);
                });

                // Для дополнительных баллов
                document.getElementById(`add_points_${i}`).addEventListener('input', function() {
                    updateTotal(i);
                });
            }

     }
  }
    // Предотвращение случайного зума
    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    }, { passive: false });

// Улучшение отзывчивости кнопок
    document.addEventListener('touchstart', function() {}, {passive: true});
})(jQuery);
$(document).ready(function() {
    $('#settingsToggle').click(function() {
        if($(this).is(':checked')) {
            $('.col5, .col6, .col7, .col8').css('display', 'table-cell');
        } else {
            $('.col5, .col6, .col7, .col8').css('display', 'none');
        }
    });
});
$('#settingsToggle').click(function() {
    $('.hs').toggle();
    $(this).text(function(i, text) {
        return text === "Скрыть роли и баллы" ? "Показать роли и баллы" : "Скрыть роли и баллы";
    });
});
document.getElementById('menuToggle').addEventListener('click', function() {
    document.querySelector('.dropdown-content').classList.toggle('show');
});

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    if (!e.target.matches('#menuToggle')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let dropdown of dropdowns) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }
});
if ('serviceWorker' in navigator) {
    $window.on('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker зарегистрирован');
            })
            .catch(error => {
                console.log('Ошибка регистрации ServiceWorker:', error);
            });
    });
}
var bmp_target = [0];
var best_player = [[0.50, 1], [0.50, 1]];
var city = [1, 0, 0];
var mafia = [1, 0, 0];
var sheriff = [1, 0, 0];
var don = [1, 0, 0];
var first_killed = [0, 0, 0];
var bm_03 = [-1, 0, 0];
var bm_13 = [0, 0, 0];
var bm_23 = [0.25, 0.25, 0];
var bm_33 = [0.5, 0.5, 0];
var bms_03 = [-1, -0.5, 0];
var bms_13 = [0, 1, 0];
var bms_23 = [0.25, 0.25, 0];
var bms_33 = [0.5, 0.5, 0];
var values = [0.10, -1.00, -0.50, 0.50];

$(function() {
    const nicknames = [
        "AMOR", "Asia", "Alien", "Alinellas", "Animag", "Bittir", "Black", "Black Jack", "DULASHA", "Dill",
        "Dizi", "Dushman", "EL", "Fox", "Gremlin", "Geralt", "Gestalter", "Hisoka", "Ivory", "Kai",
        "LIRICA", "Miamore", "Mulan", "Neo", "ProDoc", "Shinobi", "Soza", "Saul Goodman", "Scorpion",
        "TONI MONTANA", "Tam", "ZONDR", "evil", "finnick", "Йору", "Адвокат", "Альтман", "Альфа", "Асур",
        "Бес", "Биполярка", "Булочка", "Валькирия", "Великая", "228Данте69", "Даня", "Дита", "Добрый",
        "Дэва", "Ева", "Завклубом", "Зайка", "Зара", "Знаток", "Зёма", "Кари", "Кир", "Кира", "Кобра",
        "Кову", "Копибара", "Коссмос", "Красавчик", "Лазер", "Лестер", "Лимонная долька", "Белый склон",
        "Луи", "Мрак", "Маркетолог", "Марсело", "Мау", "Мафия", "Минахор", "Нафиля", "Окси", "Пантера",
        "Паранойа", "Подкова", "Подсолнух", "Психолог", "Рокфор", "Руди", "Скорпион", "Саид", "Саймон",
        "Салливан", "Сатору", "Светлячек", "Сирена", "Смурфик", "Статистика", "Темир", "Типсон",
        "Томас Шелби", "Учитель", "Феникс", "Физик", "Фил", "Хейтер", "Штиль", "Элис"
    ];

    $(".user_entity_acp").autocomplete({
        source: nicknames
    });
});

function startTimer(duration) {
    // Timer start logic
}

function pauseTimer() {
    // Timer pause logic
}

function resumeTimer() {
    // Timer resume logic
}

function stopTimer() {
    // Timer stop logic
}

function handleDistribution() {
    if (isFirstDistribution) {
        distributeRoles();
        isFirstDistribution = false;
    } else {
        if (confirm('Вы действительно хотите перераздачу?')) {
            // Redistribution logic
        }
    }
}

document.getElementById('distributeButton').addEventListener('click', handleDistribution);

function distributeRoles() {
    let roles = [
        { display: 'Д', value: 'd' },  // Дон
        { display: 'М', value: 'm' },  // Мафия
        // Other roles
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledRoles = shuffleArray(roles);
    for (let i = 0; i < 10; i++) {
        document.getElementById(`role_field_${i}`).value = shuffledRoles[i].value;
        const roleView = document.getElementById(`role_view_${i}`);
        roleView.textContent = shuffledRoles[i].display;
        roleView.className = 'role';
    }
}

document.getElementById('settingsToggle').addEventListener('click', function() {
    const elements = document.querySelectorAll('.hs');
    elements.forEach(el => {
        el.style.display = el.style.display === 'none' ? 'table-cell' : 'none';
    });
    this.textContent = this.textContent === "Скрыть роли и баллы" ? "Показать роли и баллы" : "Скрыть роли и баллы";
});

function shuffleNicknames() {
    const nicknameInputs = document.querySelectorAll('.nick_acpl');
    let nicknames = Array.from(nicknameInputs).map(input => input.value);

    for (let i = nicknames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nicknames[i], nicknames[j]] = [nicknames[j], nicknames[i]];
    }

    nicknameInputs.forEach((input, index) => {
        input.value = nicknames[index];
    });
}

document.getElementById('shuffleButton').addEventListener('click', function() {
    if (confirm('Вы действительно хотите рассадить игроков?')) {
        for (let i = 0; i < 10; i++) {
            document.getElementById(`role_field_${i}`).value = 'c';
            document.getElementById(`role_view_${i}`).textContent = '';
            document.getElementById(`role_view_${i}`).className = 'role';
        }

        const nickInputs = document.querySelectorAll('.nick_acpl');
        const nicknames = Array.from(nickInputs).map(input => input.value);
        const shuffled = nicknames.sort(() => Math.random() - 0.5);

        nickInputs.forEach((input, index) => {
            input.value = shuffled[index];
        });
    }
});

document.getElementById('resetAllForms').addEventListener('click', function() {
    localStorage.clear();
    location.reload();
});

$('#mafia, #citizens').click(function() {
    setTimeout(function() {
        for (let i = 0; i < 10; i++) {
            updateTotal(i);
        }
    }, 0);
});