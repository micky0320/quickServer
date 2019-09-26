
var http=require('http');
var fs = require('fs');
var url = require('url');
var ip = require('ip');
var c = require('child_process');
var fs = require('fs');
var path = require('path');
var livereload = require('livereload');
var mine = require('./mine').types;
var filePath = './src/html';

//创建服务器
http.createServer(function(request,response) {
    //解析请求，包括文件名
    var pathname= url.parse(request.url).pathname;
    var realPath = path.join("./", pathname);
    console.log(realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    //输出请求的文件名
    // console.log("Request for "+ pathname + "  received.");
    // console.log(request,response, 'res------')
    //从文件系统中都去请求的文件内容
    fs.exists(realPath, function (exists) {
        console.log(exists,'ex-----')
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, function (err, data) {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.end(err);
                }
                else {
                    //HTTP 状态码 200 ： OK
                    //Content Type:text/plain
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, { 'Content-Type': contentType });

                    //写会相应内容
                    response.write(data.toString());
                    //发送响应数据
                    response.end();
                }
            });
        }
    });
}).listen(8081);

fs.readdir(filePath, function(err, list) {
    if(err) throw err;
    var link = 'http://' + ip.address() + ':8081';
    var address = path.join(link, filePath, list[0]);
    console.log('Server running at ' + address);
    c.exec('open ' + address);
});

var server = livereload.createServer();
console.log(__dirname,livereload,'**********************');
server.watch(path.join(__dirname, '../src'));

