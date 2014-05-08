var Idelo = {
    pageSize: 5,
    query: function(name, params) {
        var url = name + '/Otsi?';
        for (var key in params) url += '' + key + '=' + params[key] + '&';
        var resultSet = null;
        $.ajax({
            url: url,
            async: false,
            success: function(content) {
                resultSet = eval('x=' + content);
            }
        });
        return resultSet;
    },
    queryOne: function(name, params) {
        var resultSet = Idelo.query(name, params);
        return resultSet.total > 0 ? resultSet.items[0] : null;
    }
};

function getParameter(name) {
    var query = window.location.search.substring(1);
    var variables = query.split('&');
    for (var i = 0; i < variables.length; i++) {
        var variableName = variables[i].split('=');
        if (variableName[0] == name) {
            return variableName[1];
        }
    }
    return null;
}

function registerRoutes() {
    function route(template, scripts) {
        return { template: template, scripts: scripts };
    }

    return {
        anonymous: {
            register:
                route('register', ['::navbar', 'register']),
            register_success:
                route('index', ['::navbar', 'register_success']),
            login_failure:
                route('index', ['::navbar', 'login_failure']),
            default:
                route('index', ['::navbar', 'index'])
        },
        citizen: {
            new_complaint:
                route('new_complaint', ['::navbar', 'new_complaint']),
            default:
                route('index', ['::navbar', 'index'])
        },
        official: {
            default:
                route('index', ['::navbar', 'index'])
        }
    };
}

function getAction() {
    var role = $.cookie("username") ? ($.cookie("role") == "official" ? "official" : "citizen") : "anonymous";
    var routes = registerRoutes();
    var route = routes[role];
    var page = getParameter('page');
    var conf = route[page] || route.default;

    var template = 'app/views/' + role + '/' + conf.template + '.htm';

    var scripts = [];
    for (var i = 0; i < conf.scripts.length; i++) {
        if (conf.scripts[i].substring(0, 2) == '::') {
            scripts[i] = conf.scripts[i].substring(2);
        } else {
            scripts[i] = role + '/' + conf.scripts[i];
        }
    }

    function createFunc(name, fun) {
        return function() {
            console.log(name);
            $.getScript('app/js/' + name + '.js', fun)
        };
    }

    var fun = [];
    for (var i = scripts.length - 1; i >= 0; i--) {
        fun[i] = createFunc(scripts[i], fun[i + 1]);
    }

    return { template: template, execute: fun[0] };
}
