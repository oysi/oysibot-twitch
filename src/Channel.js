
const fs = require("fs");

class Channel {
	static list = {};
	
	constructor() {
	}
	
	gen_conf_str() {
		return JSON.stringify(this.conf, null, "\t");
	}
	
	load_conf(path) {
		this.conf = require(path);
		this.conf_path = path;
		this.conf_str = this.gen_conf_str();
		if (!this.conf.commands) {
			this.conf.commands = {};
			this.update_conf();
		}
	}
	
	save_conf(str) {
		if (!str) {
			str = this.gen_conf_str();
		}
		fs.writeFileSync(this.conf_path, str);
	}
	
	update_conf() {
		const new_str = this.gen_conf_str();
		if (new_str != this.conf_str) {
			this.save_conf(new_str);
		}
	}
	
	is_command_enabled(name) {
		if (!this.conf.commands[name]) {
			this.conf.commands[name] = {"enabled": true};
			this.update_conf();
		}
		return this.conf.commands[name].enabled;
	}
	
	static load_channels() {
		console.log("loading channels...");
		fs
		.readdirSync(`${__dirname}/../data/channels/`)
		.forEach((file) => {
			const name = file.slice(0, -5);
			console.log(`loading channel ${name}...`)
			const channel = new Channel();
			channel.load_conf(`${__dirname}/../data/channels/${name}.json`);
			channel.name = name;
			Channel.list[name] = channel;
		})
	}
	
	static get_channel(info) {
		return Channel.list[info.chan];
	}
	
	static get_channels_array() {
		const list = [];
		for (const name in Channel.list) {
			list.push(name);
		}
		return list;
	}
}

module.exports = Channel;
