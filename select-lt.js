! function($) {
    'use strict';

    $.fn['selectlt'] = function(method) {
        var methods = {
            init: function() {
                return this.each(function() {
                    var $element = $(this),
                        $valCol, $valInput, $selectList, $select = $element.find('select'),
                        $selectOptions = $select.find('option');

                    $element.empty();
                    $valCol = $('<div>').addClass('val-col');
                    $valInput = $('<input type="text" readonly>');
                    $selectList = $('<ul class="select-list">');

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
                        $selectList.append($li);
                    });
                    $valCol.append($valInput).append($select);
                    $element.append($valCol).append($selectList);
                    $element.unbind();
                    $element.on('click', function() {
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

$(function() {
    $('.select-lt')['selectlt']();
});