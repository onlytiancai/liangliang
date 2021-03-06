(function($){
    $.fn.extend({
        locationchange: function(win, callback) {
            var sh = null
            var checkLocation = function(win){
                var curlocation = win.location.href;
                var inner = function(){
                    if (win.location.href != curlocation){
                        clearInterval(sh);
                        $(window).trigger('locationchange');
                        curlocation = win.location.href;
                    }
                };
                return inner;
            };

            $(window).one('locationchange', callback);
            sh = setInterval(checkLocation(win), 1000);
        }
    });
})(jQuery);


var liangliang = liangliang || {};

(function(){
    var await_timeout = eval(Wind.compile("async", function (task, timeout) {
        var any = $await(Wind.Async.Task.whenAny( task, Wind.Async.sleep(timeout)));
        if (any.key != 0) {
            throw {message:'timeout'};
        }
        return any.task.result;
    }));

    var tests = [];

    var define_test = function(test_name, url, suite, timeout){
        var test = {
            name: test_name,
            url: url,
            suite: suite ? suite : 'default suite',
            timeout: timeout ? timeout : 3000,
            action: function(fun){
                this.test_action = fun;
                return this;
            }
        };
        tests.push(test);
        return test;
    };

    var TestTask = eval(Wind.compile("async", function(test) {
        $('.test_info').html(test.suite +':'+ test.name + '...');
        var frm = $('#frm_test'), result = null;

        var task_wraper = Wind.Async.Task.create(function (t){
            var win = frm[0].contentWindow;
            var context = {
                ok: function(){
                    t.complete("success");
                },
                failure: function(msg){
                    t.complete("success", msg ? msg : 'faild');
                }
            }
                
            test.test_action(win, context);
        });
        
        frm.attr('src', test.url);
        $await(Wind.Async.onEvent(frm[0], "load"));
        try{
            result = $await(await_timeout(task_wraper, test.timeout));
            test.test_result = result == undefined ? 'ok': result;
        }
        catch(e){
            test.test_result = e.message;
        }

    }));

    var run = function(selected_tests, complete){
        var AllTaskAsync = eval(Wind.compile("async", function() {
            $('.test_info').show();
            for (var i in selected_tests){
                var test_case = selected_tests[i];
                $await(TestTask(test_case));
            }
            $('.test_info').html('测试完毕');
            complete();
        }));

        AllTaskAsync().start();
    };

    liangliang.define_test = define_test;
    liangliang.tests = tests;
    liangliang.run = run;
})();
