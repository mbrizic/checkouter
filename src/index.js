#!/usr/bin/env node
process.stdin.resume();
process.stdin.setEncoding('utf8');

var exec = require('child_process').exec;
var colors = require('colors');
var util = require('util');
var print = require('./print')

var displayBranchesCommand = 'git branch';

var branches = [];
var lines = [];

var getBranchById = function (index) {
	return branches.filter(function (branch) {
		return branch.index === index;
	})[0];
}

var buildBranchesFromInput = function (input) {
	lines = input
		.split('\n')
		.filter(function (x) {
			return x != "";
		});

	branches = lines
		.map(function (name, index) {
			return {
				index: index+1,
				name: name.slice(2),
				active: name[0] === "*" 
			}
		});
};

var printBranches = function () {
	branches.forEach(function (branch) {
		var output = branch.index + ") " + branch.name;

	  	if(branch.active)
	  		output = output.green;

	  	print(output).appendNewLine();
	});

	print('Select index of branch you want to check out and press enter: ');
};

exec(displayBranchesCommand, function(error, stdout, stderr) {
	buildBranchesFromInput(stdout);
	printBranches();
});

process.stdin.on('data', function (input) {
	var index = parseInt(input);

	if(!index){
		process.exit();
		return;
	}
	
	var branch = getBranchById(index);

	if(!branch) {
		print("No branch with that index. Exiting.".yellow).appendNewLine();
		process.exit();
		return;
	}

	var gitCheckoutCommand = 'git checkout ' + branch.name;

	exec(gitCheckoutCommand, function (error, stdout, stderr) {
		print().appendNewLine();

		if(error)
			print(error.red).appendNewLine();

		if(stdout){
			if(stdout.indexOf('up-to-date') > -1)
				print(stdout.green).appendNewLine();
			else
				print(stdout).appendNewLine();
		} 

		if(stderr){
			if(stderr.indexOf('Switched to branch') > -1){
				print(stderr.green).appendNewLine();
			} else {
				print(stderr.yellow).appendNewLine();
			}
		}

		process.exit();
	});
});
