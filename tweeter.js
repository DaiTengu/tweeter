// this file should be dropped in /sbbs/xtrn/twitter/
// it is based around echicken's twitter script

load('sbbsdefs.js');
load('twitter.js');
var options = load({}, "modopts.js", 'twitter');

var td = strftime("%r"); // human readable time for twitter
var tFile = system.data_dir + "tweet.lst";

if (argv.length < 1) exit(); // if we're missing args, just die.

if (options.tw_throttle_time == undefined)  {
	options.tw_throttle_time = 10; // set default throttle to 10 seconds
        }

// checks ../data/tweet.lst's last modified time becasue we don't want to spam twitter.
function throttleCheck() {
        var throttleTime = time() - options.tw_throttle_time;
        if (file_exists(tFile)) {
                if (file_date(tFile) >= throttleTime) {
                        return true;
                }
        }
        else {
                return false;
        }

}

// this is basically a wrapper around the tweet function written by echicken
function twrap(msg) {
	if (!throttleCheck() && options.tw_on_sysop) {
		new Twitter(
   			options.consumer_key, options.consumer_secret,
                	options.access_token, options.access_token_secret
		        ).tweet({ status : msg });
		file_touch(tFile);
		} 
	else if (!options.tw_on_sysop && !user.is_sysop) {
	        new Twitter(
	                options.consumer_key, options.consumer_secret,
	               	options.access_token, options.access_token_secret
		        ).tweet({ status : msg });
	        file_touch(tFile);
		} 
}


switch (argv[0].toLowerCase()) {
	case "logon":
		var m = '[' + td + '] ' + user.alias + ' logged on to node ' + bbs.node_num + '.';
		twrap(m);
		break;
	case "logoff":
		var m = '[' + td + '] ' + user.alias + ' logged off of node ' + bbs.node_num + '.';
		twrap(m);
		break;
	case "door":
		var m = '[' + td + '] ' + user.alias + ' is running an external program: ' + argv[1] + '.';
		twrap(m);
		break;
	case "upload":
		var m = '[' + td + '] ' + user.alias + '  uploaded a file to ' + file_area.lib_list[bbs.curlib].description + ': ' + file_area.dir[bbs.curdir_code].description + '.';
		twrap(m);
		break;
	case "download":
		var m = '[' + td + '] ' + user.alias + ' downloaded a file from ' + file_area.lib_list[bbs.curlib].description + ': ' + file_area.dir[bbs.curdir_code].description + '.';
		twrap(m);
		break;
	case "post":
		var m = '[' + td + '] ' + user.alias + ' posted a message on ' + bbs.smb_group_desc + ': ' + bbs.smb_sub_desc + '.';
		twrap(m);
}
