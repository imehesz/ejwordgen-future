/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!
 * !!! PROD NOTE WARNING !!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * move this file somewhere safe!!!
 */

const fs = require("fs")

const = APP_PATH = "PATH/TO/APP"

const FILE_ALL_WORDS_PATH           = APP_PATH + ""
const FILE_ARCHIVED_WORDS_PATH      = APP_PATH + ""
const FILE_ERROR_LOG                = APP_PATH + ""


const ALL_WORDS = require( FILE_ALL_WORDS_PATH )
const ARCHIVED_WORDS = fs.readFileSync( FILE_ARCHIVED_WORDS_PATH )

const MAX_TRIES = 10
const NO_REPEAT_FOR_DAYS = 30
const SCRIPT_TIMESTAMP = new Date()
const WORD_TIMESTAMP = new Date(new Date().setDate(new Date().getDate() + 7))

var allWordsArr = []
var archivedWordsArr = []
var allArchivedWordsArr = []
var tries = 0
var randWord = ""
var tempWord = ""

var dailyWord = ""
var dailyWordObj = {
    word: "",
    timestamp: WORD_TIMESTAMP
}

const logError = (errorStr) => {
    fs.appendFile(FILE_ERROR_LOG, `${SCRIPT_TIMESTAMP}\t${errorStr}\n`, (err, data) => {
        if(err) {
            console.log("MEGA FAIL!!!")
            return console.log(err)
        }
    })
}

if( ALL_WORDS && ALL_WORDS.values && ALL_WORDS.values.length ) {
    allWordsArr = ALL_WORDS.values.map(el => el[0])
    allArchivedWordsArr = ARCHIVED_WORDS.toString().split("\n")

    if( allArchivedWordsArr && allArchivedWordsArr.length ) {
        // filtering the last X number of words
        archivedWordsArr = allArchivedWordsArr.slice(Math.max(allArchivedWordsArr.length - NO_REPEAT_FOR_DAYS, 0)).map( el => el.split("\t")[0]).filter(el => el != "")

        do {
            tempWord = allWordsArr[Math.floor(Math.random() * allWordsArr.length)]

            if ( archivedWordsArr.indexOf( tempWord ) == -1 ) dailyWord = tempWord

            tries++
        }
        while( dailyWord == "" && tries < MAX_TRIES)

    }

    // this should never happen, but who knows :)
    if ( !dailyWord ) {
        logError("ERR: something went wrong! (or a random word was not found!")
        dailyWord = allWordsArr[Math.floor(Math.random() * allWordsArr.length)]
    }

    // writing sh*t out :)
    fs.appendFile(FILE_ARCHIVED_WORDS_PATH, `${dailyWord}\t${WORD_TIMESTAMP}\n`, (err, data) => {
        if(err) {
            return logError(err)
        }
    })
}
