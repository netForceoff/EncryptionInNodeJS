const app = require('electron').remote;
const dialog = app.dialog;
const fs = require('fs');
const crypto = require('crypto');

const remote = require('electron').remote;
const main = remote.require('./main.js');

initText(dialog, fs, crypto, main);

function initText(dialog, fs, crypto, main) {
    let text = document.querySelector('textarea');
    let inputText = document.querySelector('input');

    let saveAsButton = document.querySelector('.saveAs');
    let openButton = document.querySelector('.open');
    let saveButton = document.querySelector('.save');
    let buttonEncode = document.querySelector('.encode');
    let buttonDecrypt = document.querySelector('.decrypt');

    getTextInTextArea(text, inputText);
    saveAsFile(saveAsButton, dialog, fs, text);
    openFile(saveButton, openButton, dialog, fs, text);
    getEncode(crypto, buttonEncode, text, main);
    getDecrypt(crypto, buttonDecrypt, text, main);

    
}

function getTextInTextArea(text, inputText) {
    inputText.addEventListener('keyup', () => {
        if (event.keyCode == 13 && inputText.value != '') {
            text.value += inputText.value + '\n';
            inputText.value = '';
        }
    });
}

function saveAsFile(saveAsButton, dialog, fs, text) {
    saveAsButton.addEventListener('click', () => {
        dialog.showSaveDialog((fileName) => {
            if (fileName === undefined) {
                alert('Вы не сохранили файл!');
                return;
            }

            fs.writeFile(fileName, text.value, err => {
                if (err) console.log(err);
                alert('Файл сохранен!');
            });
        });
    });
}

function openFile (saveButton, openButton, dialog, fs, text) {
    openButton.addEventListener('click', () => {
        dialog.showOpenDialog((fileNames) => {
            if (fileNames === undefined) alert('Файл не выбран!');

            readFile(fileNames[0], fs, text);
        });
    });

    function readFile(filepath, fs, text) {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) {
                console.log('Произошла ошибка при открытии!');
                return;
            } 
            text.value = data;
        });

        saveFile(saveButton, filepath, fs, text);

        function saveFile(saveButton, filepath, fs, text) {
            saveButton.addEventListener('click', () => {
                    if (filepath === undefined) {
                        alert('Файл не выбран!');
                        return;
                    } else {
                        fs.writeFile(filepath, text.value, err => {
                            if (err) {
                                alert('Ошибка при сохранении файла!');
                                return;
                            }
                            alert('Файл сохранен!');
                        });
                    }
                });
        }

    }

}

function getEncode(crypto, buttonEncode, text, main) {
    const cipher = crypto.createCipher('aes-256-ctr', 'd6F3Efeq');

    buttonEncode.addEventListener('click', () => {
        let encrypted = cipher.update(text.value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        text.value = encrypted;
    });
}

function getDecrypt(crypto, buttonDecrypt, text, main) {
    const decipher = crypto.createCipher('aes-256-ctr', 'd6F3Efeq');

    buttonDecrypt.addEventListener('click', () => {
            var dec = decipher.update(text.value,'hex','utf8');
            dec += decipher.final('utf8');
            text.value = dec;
    });
}




