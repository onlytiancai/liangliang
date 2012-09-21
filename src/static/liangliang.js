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
        var frm = $('#frm_test'), html = '', result = null;

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
            html = test.suite + '(' + test.name + '):' + (result == undefined? 'ok': result) + '\r\n';
        }
        catch(e){
            html = test.suite + '(' + test.name + ')error:' + e.message + '\r\n';
        }

        $('#result').append(html);
    }));

    var run = function(){
        var AllTaskAsync = eval(Wind.compile("async", function() {
            for (var i in tests){
                var test_case = tests[i];
                $await(TestTask(test_case));
            }
        }));

        AllTaskAsync().start();
    };

    liangliang.define_test = define_test;
    liangliang.run = run;
})();
