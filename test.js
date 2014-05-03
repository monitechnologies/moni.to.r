var data = '{"ref":"refs/heads/master","after":"789b99b18f1f4fa38de1bbbd746e3032d6f3094a","before":"2f40eef78044c846f6142e02f00d132ad8d566e6","created":false,"deleted":false,"forced":true,"compare":"https://github.com/monitechnologies/moni.to.r/compare/2f40eef78044...789b99b18f1f","commits":[{"id":"789b99b18f1f4fa38de1bbbd746e3032d6f3094a","distinct":true,"message":"test","timestamp":"2014-05-02T21:52:44+01:00","url":"https://github.com/monitechnologies/moni.to.r/commit/789b99b18f1f4fa38de1bbbd746e3032d6f3094a","author":{"name":"Michael Donat","email":"michael@monitechnologies.com","username":"thornag"},"committer":{"name":"Michael Donat","email":"michael@monitechnologies.com","username":"thornag"},"added":["package.json","server.js","src/adapters/ci.js","src/adapters/gh.js","src/adapters/hipchat.js","src/ci/server.js","src/monibot/client.js"],"removed":[".gitignore"],"modified":["README.md"]}],"head_commit":{"id":"789b99b18f1f4fa38de1bbbd746e3032d6f3094a","distinct":true,"message":"test","timestamp":"2014-05-02T21:52:44+01:00","url":"https://github.com/monitechnologies/moni.to.r/commit/789b99b18f1f4fa38de1bbbd746e3032d6f3094a","author":{"name":"Michael Donat","email":"michael@monitechnologies.com","username":"thornag"},"committer":{"name":"Michael Donat","email":"michael@monitechnologies.com","username":"thornag"},"added":["package.json","server.js","src/adapters/ci.js","src/adapters/gh.js","src/adapters/hipchat.js","src/ci/server.js","src/monibot/client.js"],"removed":[".gitignore"],"modified":["README.md"]},"repository":{"id":19211855,"name":"moni.to.r","url":"https://github.com/monitechnologies/moni.to.r","description":"moni.to.r","homepage":"","watchers":0,"stargazers":0,"forks":0,"fork":false,"size":0,"owner":{"name":"monitechnologies","email":"tech-team@moni.to"},"private":false,"open_issues":0,"has_issues":true,"has_downloads":true,"has_wiki":true,"created_at":1398620916,"pushed_at":1399063977,"master_branch":"master","organization":"monitechnologies"},"pusher":{"name":"thornag","email":"thornag@gmail.com"}}';

var headers = {
    'X-GitHub-Delivery': 'bdbf86fe-d23b-11e3-84d0-0e6f6094bc08',
    'X-GitHub-Event': 'push',
    'X-Hub-Signature': 'sha1=df34205043577d200c1d79cdd2e337d6818fa4d4'
};


var http = require('http');

var options = {
    host: '87.81.130.114',
    port: 8080,
    path: '/api/github/v1',
    method: 'POST',
    headers: headers
};


callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        console.log(str);
    });
}

var req = http.request(options, callback);
req.write(data);
req.end();