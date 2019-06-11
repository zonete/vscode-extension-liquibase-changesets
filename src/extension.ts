// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function GetDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join("");
}

function changeId(code : string): string{
	var date = GetDate();
	var count = 0;
	//return  code.replace(/id="[^"]*"/gmi,function(value){
	return  code.replace(/<changeSet\s*id="[^"]*"/gmi,function(value){
		var regex = value.match(/id="([^']+)"/gmi);

		if(regex !== null && regex[0]!= null && regex[0].length > 6 && regex[0].indexOf(date) < 0 ){
			return value;		
		}

		count++;
		return '<changeSet id="'+date+'-'+count + '"';
	});
	
}

function changeAuthor(code : string, author: string): string{	
	//return  code.replace(/id="[^"]*"/gmi,function(value){
	return  code.replace(/author="[^"]*"/gmi,function(value){
		var regex = value.match(/"[^"]*"/gmi);

		if(regex !== null && regex[0]!= null && regex[0].trim() != '""'  && regex[0].trim() != "${author}" ){
			return value;		
		}		
		return 'author="'+author+'"';
	});
	
}


export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "fixchangesetsids" is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.fixChangeSetIds', () => {
		
		// The code you place here will be executed every time your command is executed
		var editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		let result = changeId(editor.document.getText());
		
		var range = new vscode.Range(0,0,editor.document.lineCount, editor.document.getText().length);
		editor.edit(builder => builder.replace(range, result))
		// Display a message box to the user		
		vscode.window.showInformationMessage("Ids foram alterados com Sucesso!");
	});
	
	let disposableFillAuthor = vscode.commands.registerCommand('extension.fillAuthor', () => {
		
		vscode.window.showInputBox({ placeHolder: 'Digite o nome do Autor?' }).then((author)=>{
				// The code you place here will be executed every time your command is executed
			var editor = vscode.window.activeTextEditor;
			if (!editor || author == undefined) {
				return; // No open text editor
			}

			let result = changeAuthor(editor.document.getText(), author);
			
			var range = new vscode.Range(0,0,editor.document.lineCount, editor.document.getText().length);
			editor.edit(builder => builder.replace(range, result))
			// Display a message box to the user		
			vscode.window.showInformationMessage("Autor("+author+") preenchido com Sucesso!");
		});
		
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableFillAuthor);
}

// this method is called when your extension is deactivated
export function deactivate() {}
