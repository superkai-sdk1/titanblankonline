$(document).ready(function() {
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

    function generatePlayerRow(index) {
        return `
            <tr id="line_${index}" class="active_line">
                <td id="vpl_${index}" class="col1 to_vote" data-delta="${index}" data-invote="0">${index + 1}</td>
                <td class="col2 nss">
                    <table class="bm_nick">
                        <tbody>
                            <tr>
                                ${Array.from({ length: 10 }, (_, i) => `<td class="bm_pick bm_line_${index} bm_pos_${i} all_bm_buttons" data-pos="${i}" data-line="${index}">${i + 1}</td>`).join('')}
                                <td class="hide_${index} all_hide all_bm_actions" data-line="${index}"><img src="/blank/images/hide.png" alt="hide icon"></td>
                                <td class="show_${index} all_show all_bm_actions" data-line="${index}"><img src="/blank/images/show.png" alt="show icon"></td>
                                <td class="nick_${index} all_nicks">
                                    <div class="form-item form-type-textfield form-item-field-rate-game-players-und-${index}-target-id">
                                        <input class="user_entity_acp nick_acpl selected form-text form-autocomplete" data-delta="${index}" type="text" name="field_rate_game_players[und][${index}][target_id]" value="" maxlength="1024">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td width="90px" class="col3 nss">
                    <input id="fall_field_${index}" type="hidden" name="field_falls[und][${index}][value]" value="0">
                    <table class="falls_widget">
                        <tbody>
                            <tr>
                                <td data-delta="${index}" class="fall_click border_0">
                                    <div id="falls_view_${index}" class="fall_0"> </div>
                                </td>
                                <td width="20px" class="remove_click border_0" data-delta="${index}">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td id="fk_${index}" class="col4 fk_pick nss" data-delta="${index}"> </td>
                <td class="col5 hs">
                    <input id="role_field_${index}" class="role_field_all" type="hidden" name="field_role[und][${index}][value]" value="c">
                    <div id="role_view_${index}" class="role" data-delta="${index}"> </div>
                </td>
                <td class="col6 hs">
                    <div class="form-item form-type-textfield form-item-field-points-und-${index}-value">
                        <input id="points_${index}" type="text" name="field_points[und][${index}][value]" value="" size="60" maxlength="128" class="form-text">
                    </div>
                </td>
                <td class="col7 hs">
                    <div class="form-item form-type-textfield form-item-field-add-points-und-${index}-value">
                        <input id="add_points_${index}" type="text" name="field_add_points[und][${index}][value]" value="" size="60" maxlength="128" class="form-text">
                    </div>
                </td>
                <td id="bp_${index}" class="col8 bp_select hs" data-delta="${index}" readonly></td>
            </tr>`;
    }

    // Generate 10 player rows
    for (let i = 0; i < 10; i++) {
        $('#player-rows').append(generatePlayerRow(i));
    }

    $(".user_entity_acp").autocomplete({
        source: nicknames
    });
});