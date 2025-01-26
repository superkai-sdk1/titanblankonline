(function($){
    var _action = false;
	var roles = {
		'c': '&nbsp;',
		'm': 'М',
		'd': 'Д',
		's': 'Ш'
	}
    
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

	function setFall(delta, value){
		if((value >= 0) && (value <= 4)){
			var input = $('#fall_field_'+delta);
			var view = $('#falls_view_'+delta);
			$(input).attr('value', value);
            $(input).val(value);
			$(view).attr('class', 'fall_'+value);
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

	function in_bm(mass, elem){
		for(var i=0; i<mass.length; i++){
			if(mass[i] == elem){
				return i;
			}
		}

		return -1;
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
            var str = pl;
            if($(st).length){
                tmp = ($(st).data('pos')+1);
                if(tmp == 6){ tmp += '+'; }
                str = str + " - " + tmp;
            } else {
                str = str + " - 0";
            }
            
            if($(nd).length){
                tmp = ($(nd).data('pos')+1);
                if(tmp == 6){ tmp += '+'; }
                str = str + "/" + tmp;
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
        
        $('#show_setts').click(function(){
            $('.hs').css('display', 'table-cell');
            $('#hide_setts').css('display', 'table-cell');
            $(this).css('display', 'none');
        });
        
        $('#hide_setts').click(function(){
            $('.hs').css('display', 'none');
            $('#show_setts').css('display', 'table-cell');
            $(this).css('display', 'none');
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
// Обновляем ячейку с итогом
                document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
            }
            // Добавляем обработчики событий для всех полей ввода
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
    $('#settingsToggle').change(function() {
        if($(this).is(':checked')) {
            $('.hs').css('display', 'table-cell');
        } else {
            $('.hs').css('display', 'none');
        }
    });
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker зарегистрирован');
            })
            .catch(error => {
                console.log('Ошибка регистрации ServiceWorker:', error);
            });
    });
}