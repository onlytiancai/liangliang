$(function(){
    var get_suites = function(){
        var tests = liangliang.tests;
        var suites_map = {}, suites = [], i = 0;
        $.each(tests, function(){
            if(!suites_map[this.suite]) {
                suites_map[this.suite] = i++;
                suites.push({name: this.suite, tests: []});
            }
            var suite_index = suites_map[this.suite];
            suites[suite_index].tests.push(this);
        });
        return suites;
    };

    var show_suites = function(){
        var html, tpl_suites = $('#tpl-suites').html();
        var suites = get_suites();
        html = Mustache.render(tpl_suites, {suites:suites});
        $('.row-fluid .silder').html(html);
    }; 

    var get_selected_tests = function(){
        var get_test_names = function(){
            var chk_tests = $('.suite ul li input[type="checkbox"]');
            var test_names = [];
            $.each(chk_tests, function(){
                if($(this).attr('checked')){
                    test_names.push($(this).val()); 
                }
            });
            return test_names;
        };

        var get_tests_by_names= function(){
            var test_names = get_test_names();
            var tests = liangliang.tests;
            var selected_tests = $.grep(tests, function(test, i){
                var name = test.suite + '-'  + test.name;
                return $.inArray(name, test_names) != -1;
            });
            return selected_tests;
        };

        return get_tests_by_names();
    };

    var start_test = function(){
        var tests = liangliang.tests;
        var selected_tests = get_selected_tests();
        var when_test_complete = function(){
            var ok_tests = $.grep(selected_tests, function(test){return test.test_result == 'ok'});
            var faild_tests = $.grep(selected_tests, function(test){return test.test_result != 'ok'});
            var tpl_result = $('#tpl-result').html();

            var html = Mustache.render(tpl_result, {
                ok_count: ok_tests.length,
                faild_count: faild_tests.length,
                total_count: tests.length,
                ok_tests: ok_tests,
                faild_tests: faild_tests
            });
            $('.row-fluid .result .well').html(html);
        };

        $('.row-fluid .result .well').html('');
        liangliang.run(selected_tests, when_test_complete);
    };

    var select_all = function(){
        var chk_tests = $('.suite ul li input[type="checkbox"]');
        $.each(chk_tests, function(){
            $(this).attr('checked', true);
        });
    };

    var attach_ui_events = function(){
        $('button.start_test').click(start_test); 
        $('button.select_all').click(select_all); 
    };

    show_suites();
    attach_ui_events();

});
