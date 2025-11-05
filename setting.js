/*
🌸 𝗦𝗖𝗥𝗜𝗣𝗧 𝗜𝗡𝗙𝗢 🌸  
┌───────────────────────────────┐
│ 💫 𝗝𝘂𝗱𝘂𝗹 : Yurii-Md  
│ 👑 𝗖𝗿𝗲𝗮𝘁𝗼𝗿 : FallZx Infinity  
│ ⚠️ 𝗡𝗼𝘁𝗲 : Jangan hapus credit ini!  
│     Hargai creator dengan tetap mencantumkan nama.  
└───────────────────────────────┘
✨ Terima kasih telah menggunakan script ini!
*/
"use strict";
// main
const fs = require('fs')
const chalk = require('chalk')
global.admins = ["94781352903", "94760405102"]
global.owner = "94760405102"
global.ownername = "Mr.Nadun"
global.botfullname = "Miss Nexa"
global.botname = "Miss Nexa"
global.filename = "</> 𝙽𝚎𝚡𝚊 𝙻𝚊𝚋"
global.footer = "© created by buymore tecnical team"
module.exports = {
  sesionName: "session",
  banchats: false,
  autoreadsw: false,
  anticall: true,
  banned: {
   maroko: true,
   india: false,
  },  
  // sticker
  author: `MrNadun`,
  packname: `Nexa Bot`,
  // optional 
  gcount: { "prem": 30, "user": 20 },
  limitCount: 20,
  module: {
    baileys: require("@whiskeysockets/baileys"),
    boom: require('@hapi/boom'),
    chalk: require('chalk'),
    child: require('child_process'),
    fs: require('fs'),
    pino: require("pino"),
    path: require("path"),
    phonenumber: require('awesome-phonenumber'),
    time: require("moment-timezone"),
    jimp: require('jimp'),
    speed: require('performance-now'),
    util: require("util"),
    https: require('https'),
    sizeFormater: require('human-readable'),
    axios: require('axios'),
    ytsr: require('yt-search'),           
    readline: require("readline"),
    nodecache: require("node-cache"),
    premium: require('parse-ms'),
   },
  file: {
    load: './connection/starting',
    color: './lib/color',
    move: './lib/simple.js', 
    set: './lib/myfunc',
    funct: './lib/function',
    exif: './lib/exif',
    list: './lib/list',
    scrapp: './lib/scraper',
    prem: './lib/premium',
    limit: './lib/limit',
  },

}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.yellow(`New ${__filename}`))
	delete require.cache[file]
	require(file)
})
