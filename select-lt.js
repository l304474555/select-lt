! function($) {
    'use strict';

    $.fn['selectlt'] = function(method) {
        var methods = {
            init: function(option) {
                option = $.extend({},{
                    isfiltration:false
                },option)
                return this.each(function() {
                    var $element = $(this),
                        $valCol, $valInput,$selectList,$ul,backupsUlHtml,$select = $element.find('select'),
                        $selectOptions = $select.find('option');

                    $element.empty();
                    $valCol = $('<div>').addClass('val-col');
                    $valInput = $('<input type="text" readonly>');
                    
                    $selectList = $('<div class="select-list">');
                    $ul = $('<ul>');
                    
                    if ($select.is('[placeholder]')) {
                        var selectArrtPlaceholderText = $select.attr('placeholder');
                        $valInput.attr('placeholder', selectArrtPlaceholderText);
                    }
                    $selectOptions.each(function() {
                        var $el = $(this);
                        var _text = $el.text();
                        var _value = $el.val()
                        var $li = $('<li data-value=' + _value + '>' + _text + '</li>');
                        
                        if ($el.is(':selected') && (_value != '' && _value != null)) {
                            $li.addClass('active');
                            $valInput.val(_text);
                        }
                        $ul.append($li);
                    });                    
                    backupsUlHtml = JSON.parse(JSON.stringify($ul.html()));
                    $valCol.append($valInput).append($select);
                    if(option.isfiltration){
                        $selectList.addClass('f').append($('<input type="text" class="filtrate-input">'));
                    }
                    $selectList.append($ul);
                    $element.append($valCol).append($selectList);
                    $element.unbind();
                    $element.on('click', function(e) {
                        e.stopPropagation();
                        if ($(this).hasClass('st-dropdown')) {
                            $(this).removeClass('st-dropdown');
                        } else {
                            $(this).addClass('st-dropdown');
                        }
                        var elementHeight = $(this).outerHeight() + 5;
                        $(this).find('.select-list').css('top', elementHeight);                        
                    });
                    $element.on('click', 'li', function(e) {
                        e.stopPropagation();
                        var $el = $(this);
                        var selectedValue = $el.data('value');
                        var selectedText = $el.text();
                        if (!$el.hasClass('active')) {
                            $el.siblings().removeClass('active');
                            $el.addClass('active');
                            $select.val(selectedValue);
                            $valInput.val(selectedText);
                        }
                        $element.removeClass('st-dropdown');
                        $element.trigger('select-change', {
                            'el': $select,
                            'data': {
                                text: selectedText,
                                value: selectedValue
                            }
                        });
                    });
                    $element.on('keyup', '.filtrate-input',function(e){
                        e.stopPropagation();
                        $element.find('li').removeClass('active');
                        $element.find('select').val('show-placeholder');
                        $valInput.val('');
                        var keyword = $(this).val().trim();
                        $ul.empty().html(backupsUlHtml);
                        var tepli = '';
                        if(keyword != ''){
                            $ul.find('li').each(function(){
                                if($(this).text().indexOf(keyword) > -1){
                                    tepli+=$(this).context.outerHTML
                                }
                            }); 
                            $ul.empty().html(tepli);
                        }                                          
                    });
                    $element.on('click', '.select-list',function(e){
                        e.stopPropagation();
                    });
                    $(document).bind('click',function(e){
                        var target = $(e.target)
                        if(target.closest('.select-lt').length === 0){
                            $('.select-lt').removeClass('st-dropdown')
                        }else{
                            $element.addClass('st-dropdown')
                        }
                    })
                })
            },
            setSelected(val) {
                $(this).find('li[data-value=' + val + ']').trigger('click');
            },
            getSelected(fuc) {
                var $selectOption = $(this).find('select option:selected');
                var data = {
                    text: $selectOption.text(),
                    value: $selectOption.val()
                }
                if (typeof fuc === 'function') {
                    fuc(data);
                }
                return data;
            }
        }

        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method === 'object' || !method)
            return methods.init.apply(this, arguments);
        else
            $.error('Method ' + method + ' does not exist!');
    };

}(jQuery);