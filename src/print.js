function Printer() {
	this.appendNewLine = appendNewLine;
	this.print = print;
}

var printer = new Printer();

function print(text){
	process.stdout.write(text || '');
	return printer
}

function appendNewLine(){
	process.stdout.write('\n');
	return printer;
}

module.exports = print;