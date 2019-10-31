! function($) {
    'use strict';

    $.fn['selectlt'] = function(method) {
        var methods = {
            init: function(option) {
                option = $.extend({},{
                    selectedValue:undefined,
                    isfiltration:false, //是否开启条件搜索
                    isdisabled:false  //是否禁用
                },option)
                return this.each(function() {
                    var $element = $(this),
                        $valCol, $valInput,$selectList,$ul,backupsUlHtml,$select = $element.find('select'),
                        $selectOptions = $select.find('option');

                    $element.empty();
                    $valCol = $('<div>').addClass('val-col');
                    $valInput = $('<input type="text" readonly>');
                    
                    $selectList = $('<div class="select-list-b">');
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

                    if(option.selectedValue !== undefined){
                        $element.find('li[data-value=' + option.selectedValue + ']').trigger('click');
                    }
                    if(!option.isdisabled){
                        $element.on('click', function(e) {
                            e.stopPropagation();
                            if ($(this).hasClass('st-dropdown')) {
                                $(this).removeClass('st-dropdown');
                            } else {
                                $(this).addClass('st-dropdown');
                            }
                            var elementHeight = $(this).outerHeight() + 5;
                            $(this).find('.select-list-b').css('top', elementHeight);                        
                        });
                       
                        $element.on('keyup', '.filtrate-input', throttle(function(e){
                            e.stopPropagation(); 
                            $element.find('li').removeClass('active');
                            $element.find('select').val('show-placeholder');
                            $valInput.val('');
                            $ul.empty().html(backupsUlHtml);
                            var tepli = '',keyword = $(this).val().trim();
                            if(keyword != ''){
                                $ul.find('li').each(function(){
                                    if($(this).text().trim().indexOf(keyword) > -1){
                                        tepli+= $(this).context.outerHTML;
                                    }
                                }); 
                                $ul.empty().html(tepli);
                            }    
                        },800));
                        $element.on('click', '.select-list-b',function(e){
                            e.stopPropagation();
                        });
                        $(document).on('click',function(e){
                            var target = $(e.target)
                            if(target.closest('.select-lt').length === 0){
                                $('.select-lt').removeClass('st-dropdown')
                            }else if(target.closest($element).length === 1){
                                $element.addClass('st-dropdown')
                            }
                        });
                    }
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
        function throttle(func, delay) {
            var run = true;
            return function () {
              if (!run) {
                return;
              }
              run = false;
              setTimeout(() => {
                func.apply(this, arguments);
                run = true;
              }, delay);
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