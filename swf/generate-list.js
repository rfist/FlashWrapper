const fs = require('fs');
let versions = [];
fs.readdirSync('.').forEach(file => {
    if (file.indexOf('.swf') > -1) {
        let regexp = /\d.\d*.\d*/ig;
        let version = regexp.exec(file);
        if (version && version.length > 0) {
            versions.push(version[0]);
        }
    }
});
let versionData = 'exports.versions = [';
versions.forEach(version => versionData += '"' + version + '",');
versionData += ']';
fs.writeFile("version-list.js", versionData, function(err) {
    if(err) {
        return console.log(err);
    }
});