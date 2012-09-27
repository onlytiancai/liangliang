(function(){
    var define_test = liangliang.define_test;

    $(window).locationchange($('#frm_test')[0].contentWindow, function(){
        console.log($('#frm_test')[0].contentWindow.location.href); 
    })

    define_test('simple test', 'test_cases/betest.html')
    .action(function(win, t) {
        var $ = win.$;

        var check_result = function(){
            var p_text = win.$('p').text();
            if (p_text === 'haha'){
                t.ok();
            }else{
                $('p').one("DOMSubtreeModified", check_result);
            }
        };

        var test_action = function(){
            $('button').click();
        };

        $('p').one("DOMSubtreeModified", check_result);
        test_action();
    });

    define_test('add todo item', 'test_cases/backbone_todo.html', 'todo')
    .action(function(win, t) {
        var $ = win.$;

        var check_result = function(){
            var last_todo = $('#todo-list .view:last label');
            var txt = last_todo.text();
            if(txt == 'aaaa'){
                t.ok(); 
            }
        };

        var trigger_keypress_enter = function(dom){
            var e = win.jQuery.Event("keypress");
            e.which = 13;
            e.keyCode = 13;
            dom.trigger(e);
        };

        var test_action = function(){
            var new_todo = win.$('#new-todo');
            new_todo.val('aaaa');
            trigger_keypress_enter(new_todo);
        };

        $('#todo-list').one("DOMSubtreeModified", check_result);
        test_action();
    });

    define_test('remove todo item', 'test_cases/backbone_todo.html', 'todo')
    .action(function(win, t) {
        var $ = win.$, that = this;
        var todos = win.$('#todo-list .view'), len_todo = todos.length;

        var check_result = function(){
            var todos = win.$('#todo-list .view');
            if (todos.length == len_todo - 1){
                t.ok();
            }
        };

        var test_action = function(){
            var last_todo = win.$('#todo-list .view:last .destroy');
            last_todo.click();
        };

        $('#todo-list').one("DOMSubtreeModified", check_result);
        test_action();

    });
})();
