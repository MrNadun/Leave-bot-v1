
const SETTING = require('./setting')
const keywords = require('../lib/validator/allKeywords')

let modul = SETTING['modul'];
let getreq = SETTING['file'];
const chalk = modul['chalk'];
const fs = modul['fs'];
const util = modul['util'];
const https = modul['https'];
const axios = modul['axios'];
const ytsr = modul['ytsr'];
const { spawn, exec, execSync } = modul['child'];
const { downloadContentFromMessage, WA_DEFAULT_EPHEMERAL, getLastMessageInChat, MessageType, generateWAMessageFromContent, prepareWAMessageMedia, proto } = modul['baileys'];
const moment = modul['time'];
const time = moment.tz('Asia/colombo').format('DD/MM HH:mm:ss')
const speed = modul['speed'];
const request = modul['request'];
const path = modul['path'];
const ms = modul['premium'];
const cheerio = require('cheerio');
const _prem = require('.' + getreq['prem']);
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require('.' + getreq['limit']);
const { color, bgcolor, ConsoleLog, biocolor } = require('.' + getreq['color']);
const { formatSize, sleep, readTime, reSize, runtime, getBuffer, getRandom, pickRandom, fetchJson, isUrl, genMath, formatp } = require('.' + getreq['funct']);
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif, writeExifStc } = require('.' + getreq['exif']);

//SCRAPE
const { upload } = require('../lib/scrape/uploader.js');

//nexaDB 
var balance = JSON.parse(fs.readFileSync('./nexaDB/balance.json'));
var limit = JSON.parse(fs.readFileSync('./nexaDB/limit.json'));
var glimit = JSON.parse(fs.readFileSync('./nexaDB/glimit.json'));
var premium = JSON.parse(fs.readFileSync('./nexaDB/premium.json'));
var pendaftar = JSON.parse(fs.readFileSync('./nexaDB/user.json'));
const db_api = JSON.parse(fs.readFileSync('./nexaDB/api.json'));
const afk = require("../lib/afk");
let _afk = JSON.parse(fs.readFileSync("./nexaDB/afk.json"));

//SETUP
module.exports = async(m, conn, from, store) => { 
   const isGrouP = from.endsWith('@g.us')
   const sender = isGrouP ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
   const pushname = m.pushName || "No Name"
   const CMD = (m.xtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.xtype == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (m.xtype == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : (m.xtype == 'extendedTextMessage') && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : (m.xtype == 'buttonsResponseMessage') && m.message.buttonsResponseMessage.selectedButtonId ? m.message.buttonsResponseMessage.selectedButtonId : (m.xtype == 'listResponseMessage') && m.message.listResponseMessage.singleSelectReply.selectedRowId? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.xtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : ''.slice(1).trim().split(/ +/).shift().toLowerCase()
   const prefix = /^[#!.,®©¥€¢£/\∆✓]/.test(CMD) ? CMD.match(/^[#!.,®©¥€¢£/\∆✓]/gi) : '#'   
	 global.prefix = prefix
   const chatmessage = (m.xtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.xtype == 'imageMessage') ? m.message.imageMessage.caption : (m.xtype == 'videoMessage') ? m.message.videoMessage.caption : (m.xtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.xtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.xtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.xtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.xtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
   const ordermessage = (m.xtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.xtype == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (m.xtype == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : (m.xtype == 'extendedTextMessage') && m.message.extendedTextMessage.text.startsWith(prefix) ? m.message.extendedTextMessage.text : (m.xtype == 'buttonsResponseMessage') && m.message.buttonsResponseMessage.selectedButtonId.startsWith(prefix) ? m.message.buttonsResponseMessage.selectedButtonId : (m.xtype == 'listResponseMessage') && m.message.listResponseMessage.singleSelectReply.selectedRowId.startsWith(prefix) ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.xtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId.startsWith(prefix) ? m.message.templateButtonReplyMessage.selectedId : ''   
   const chats = (m.xtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.xtype == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (m.xtype == 'documentMessage') && m.message.documentMessage.caption ? m.message.documentMessage.caption : (m.xtype == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : (m.xtype == 'extendedTextMessage') && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : (m.xtype == 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ? m.message.buttonsResponseMessage.selectedButtonId : (m.xtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : ''   	
   const args = ordermessage.trim().split(/ +/).slice(1)         
   const order = ordermessage.slice(0).trim().split(/ +/).shift().toLowerCase()	   
   const isCmd = ordermessage.startsWith(prefix)   
   const command = isCmd ? ordermessage.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
   const text = q = args.join(' ')   
   const fatkuns = (m.quoted || m)
   const quoted = (fatkuns.xtyp == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.xtyp == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.xtyp == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m   
   const content = JSON.stringify(m.message)
   const orderPlugins = isCmd ? ordermessage.slice(1).trim().split(/ +/).shift().toLowerCase() : null
   const isGroup = from.endsWith(keywords[0]['chats'][1])
   const isChanel = from.endsWith('@newsletter')
   const botNumber = conn.user.id.split(':')[0] + keywords[0]['chats'][0]
   const mime = (quoted.m || quoted).mimetype || '' 
   const isMedia = /image|video|sticker|audio/.test(mime)
   const itulho = isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid  
   const isOwner = [botNumber, ...global.ownerNumber].map(jid => jid.replace(/[^0-9]/g, '') + keywords[0]['chats'][0]).includes(itulho)
   const groupMetdata = isGroup ? await conn.groupMetadata(from) : ''
         conn.groupMembers = isGroup ? groupMetdata.participants : ''
         conn.groupName = isGroup ? await groupMetdata.subject : ''   
         conn.groupAdmins = isGroup ? m.getGroupAdmins(conn.groupMembers) : ''
   const isBotGroupAdmins = conn.groupAdmins.includes(botNumber) || false
   const isGroupAdmins = conn.groupAdmins.includes(m.sender)
   const isPremium = isOwner ? true : _prem.checkPremiumUser(sender, premium)
   const gcounti = SETTING.gcount
   const gcount = isPremium ? gcounti.prem : gcounti.user
   const limitCount = SETTING.limitCount
   const isUser = pendaftar.includes(sender)
   const isAfkOn = afk.checkAfkUser(m.sender, _afk)
   _prem.expiredCheck(conn, premium)
   const mentionByTag = m.xtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.mentionedJid : []
   const mentionByreply = m.xtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.participant || "" : ""
  const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByreply) : []
  const mentionUser = mention != undefined ? mention.filter(n => n) : false
  const today = moment().tz("Asia/colombo")
  const day = today.format('dddd');
  const datee = today.format('D');
  const month = today.format('MMMM');
  const year = today.format('YYYY');

//FUNCTION
  const contact = { 
    key: {
        fromMe: false, 
        participant: "0@s.whatsapp.net", 
        ...(from ? { remoteJid: "status@broadcast" } : {})
    }, 
    message: { 
        contactMessage: { 
            displayName: `${m.sayingtime + m.timoji}\n☏User: ${pushname}`, 
            vcard: 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + `item1.TEL;waid=${sender.split("@")[0]}:+${sender.split("@")[0]}\n` + 'item1.X-ABLabel:Ponsel\n' + 'END:VCARD' 
        } 
    } 
  }

//CONFIG AFK
if (m.isGroup) {
let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
for (let ment of mentionUser) {
if (afk.checkAfkUser(ment, _afk)) {
let getId2 = afk.getAfkId(ment, _afk)
let getReason2 = afk.getAfkReason(getId2, _afk)
let getTime = Date.now() - afk.getAfkTime(getId2, _afk)
let heheh2 = await readTime(getTime)
m.reply(` *[ ⛔ WARNING ⛔ ]*

📝 *Note:* Don't tag him, he's currently afk
💡 *Reason*: ${getReason2}
🕛 *During*: ${heheh2.hours} hours, ${heheh2.minutes} minutes, ${heheh2.seconds} seconds ago`)
}
}
if (afk.checkAfkUser(m.sender, _afk)) {
let getId = afk.getAfkId(m.sender, _afk)
let getReason = afk.getAfkReason(getId, _afk)
let getTime = Date.now() - afk.getAfkTime(getId, _afk)
let heheh = await readTime(getTime)
_afk.splice(afk.getAfkPosition(m.sender, _afk), 1)
fs.writeFileSync('./nexaDB/afk.json', JSON.stringify(_afk))
conn.sendTextWithMentions(m.chat,`*[ 👑 BACK FROM AFK 👑 ]*

👤 *User* : @${m.sender.split('@')[0]}
💡 *Reason* : ${getReason}
🕛 *During* : ${heheh.hours} hours, ${heheh.minutes} minutes, ${heheh.seconds} seconds ago`, m)
}
}

//EVALED & EXEC
if (chatmessage.startsWith('<')) {
    if (!isOwner) return
    if (!q) return m.reply('Enter Parameter Code!')
    let kode = chatmessage.trim().split(/ +/)[0]
    let teks
    try {
        teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
    } catch (e) {
        teks = e
    } finally {
        await m.reply(require('util').format(teks))
    }
}
if (chatmessage.startsWith('=>')) {
    if (!isOwner) return
    function Return(sul) {
        sat = JSON.stringify(sul, null, 2)
        bang = util.format(sat)
        if (sat == undefined) {
            bang = util.format(sul)
        }
        return m.reply(bang)
    }
    try {
        m.reply(util.format(eval(`(async () => { ${chatmessage.slice(3)} })()`)))
    } catch (e) {
        m.reply(String(e))
    }
}
if (chatmessage.startsWith('>')) {
    if (!isOwner) return
    try {
        let evaled = await eval(chatmessage.slice(2))
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
        await m.reply(evaled)
    } catch (err) {
        m.reply(String(err))
    }
}
if (chatmessage.startsWith('$')) {
    if (!isOwner) return
    exec(chatmessage.slice(2), (err, stdout) => {
        if(err) return conn.sendMessage(from, {text :String(err)}, {quoted:m})
        if (stdout) return m.reply(stdout)
    })
}

//AUTO REGISTER
if (m.message && m.text && !isUser && !isGroup) {
    pendaftar.push(sender)
    fs.writeFileSync('./nexaDB/user.json', JSON.stringify(pendaftar, null, 2))
}

//ONLYGC
const onlygc = () => {
  conn.sendMessage(m.chat, {
    text: `_ʜᴀʟᴏ ${pushname}, *xʙᴏᴛ-ɴᴇxᴛ ᴠᴇʀꜱɪᴏɴ* ʜᴀɴʏᴀ ʙɪꜱᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ ᴅᴀʟᴀᴍ ɢʀᴏᴜᴘ ꜱᴀᴊᴀ, ᴊɪᴋᴀ ɪɴɢɪɴ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴɴʏᴀ ᴅɪ ᴘʀɪᴠᴀᴛ ᴄʜᴀᴛ ᴘᴇʀᴛɪᴍʙᴀɴɢᴋᴀɴ ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴇʟɪ ʜᴀᴋ ᴀᴋꜱᴇꜱ ᴘʀᴇᴍɪᴜᴍ ᴀᴛᴀᴜ ᴍᴇᴍʙᴇʟɪ ꜱᴄʀɪᴘᴛ ɴʏᴀ_`,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true, 
        title: `AKSES DILARANG 🚫`,
        body: "Only In Group Chat",
        thumbnailUrl: "https://endpoint.web.id/server/file/Zy853r7VXWBRHTnM.jpg",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  })
}

//NYALAKAN INI JIKA INGIN ONLYGC
/*if (order) {
  if (!isOwner && !m.isGroup && !m.isChanel) return onlygc();
}*/

//CMD
if (m.message) {
  if (isCmd && !m.isGroup) {
    console.log(chalk.white(`===================================================
    📆 DATE: ${new Date().toLocaleString()}
    💭 MESSAGE : ${m.body || m.mtype}
    👤️ FROM : ${pushname}
    🔖 USER JID : ${m.sender}`));
  } else if (isCmd && m.isGroup) {
    console.log(chalk.white(`===================================================
    📆 DATE: ${new Date().toLocaleString()}
    💭 MASSAGE : ${m.body || m.mtype}
    👤 FROM : ${pushname}
    🔖 USER JID : ${m.sender}
    💡 LOCATION : ${conn.groupName}`));
  }
}

//CONFIG ANTILINK
let antilinkStatus = false;
const saveAntilinkStatus = () => {
    fs.writeFileSync('./nexaDB/antilink.json', JSON.stringify({ status: antilinkStatus }));
};
const loadAntilinkStatus = () => {
    if (fs.existsSync('./nexaDB/antilink.json')) {
        const data = JSON.parse(fs.readFileSync('./nexaDB/antilink.json'));
        antilinkStatus = data.status;
    }
};
loadAntilinkStatus();
// ====== Paths ======
    const leaveDBPath = path.join(__dirname, "nexaDB", "leave.json");
    const leaveDir = path.dirname(leaveDBPath);

    // ====== Ensure Directory Exists ======
    if (!fs.existsSync(leaveDir)) {
      fs.mkdirSync(leaveDir, { recursive: true });
      console.log("Created 'nexaDB' folder.");
    }

    // ====== Load Leave Database Safely ======
    function loadLeaveDB() {
      const defaultDB = { fullLeaves: [], halfLeaves: [] };

      if (!fs.existsSync(leaveDBPath)) {
        fs.writeFileSync(leaveDBPath, JSON.stringify(defaultDB, null, 2));
        console.log("Initialized new leave.json file.");
        return defaultDB;
      }

      const content = fs.readFileSync(leaveDBPath, "utf8");
      try {
        const parsed = JSON.parse(content || "{}");
        return {
          fullLeaves: Array.isArray(parsed.fullLeaves) ? parsed.fullLeaves : [],
          halfLeaves: Array.isArray(parsed.halfLeaves) ? parsed.halfLeaves : [],
        };
      } catch (err) {
        console.error("Invalid JSON in leave.json. Reinitializing...");
        fs.writeFileSync(leaveDBPath, JSON.stringify(defaultDB, null, 2));
        return defaultDB;
      }
    }

    // ====== Save Leave Database ======
    function saveLeaveDB(db) {
      try {
        fs.writeFileSync(leaveDBPath, JSON.stringify(db, null, 2));
        console.log("Database saved successfully.");
      } catch (err) {
        console.error("Error saving database:", err);
      }
    }

    // ====== Helper: Date Generator ======
    function generateNextDates(count = 14) {
      const now = new Date();
      const dates = [];
      for (let i = 0; i < count; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        const dateStr = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
        dates.push(dateStr);
      }
      return dates;
    }

    // ====== Example Usage ======
    function addTodayToFullLeaves() {
      const db = loadLeaveDB();
      const today = generateNextDates(1)[0];

      if (!db.fullLeaves.includes(today)) {
        db.fullLeaves.push(today);
        console.log(`Added ${today} to fullLeaves.`);
        saveLeaveDB(db);
      } else {
        console.log(`${today} is already in fullLeaves.`);
      }
    }
//COMMAND 
    switch(order) {    
  case prefix + 'menu1': case prefix + 'menuall': case prefix + 'allmenu': {    
      conn.sendMessage(m.chat, {
        document: fs.readFileSync('./img.jpg'), 
        fileName: 'ʏᴜʀɪɪ - ᴍᴅ 🌸',
        mimetype: 'image/jpeg',
        caption: 'ʜᴀʟᴏᴏ sᴀʏᴀ ᴀᴅᴀʟᴀʜ ʏᴜʀɪɪ-ᴍᴅ, ꜱᴇʙᴜᴀʜ ʙᴏᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ ʏᴀɴɢ ᴄᴀɴɢɢɪʜ ᴅᴀɴ ᴍᴏᴅᴇʀɴ, ꜱɪʟᴀʜᴋᴀɴ ᴍᴇʟᴀɴᴊᴜᴛᴋᴀɴ ᴅᴇɴɢᴀɴ ᴍᴇᴍɪʟɪʜ ᴏᴘꜱɪ ᴅɪ ʙᴀᴡᴀʜ ɪɴɪ',
        contextInfo: {
            externalAdReply: {
                title: '𝑩𝒂𝒔𝒆𝒅 𝑶𝒏 𝑬𝒔𝒎 𝑴𝒐𝒅𝒖𝒍𝒆',
                body: time,
                thumbnailUrl: 'https://img1.pixhost.to/images/9296/649396846_lily.jpg',
                mediaType: 1,
                renderLargerThumbnail: false
            }
        },
        footer: '@ ʙᴀsᴇᴅ ʙʏ ғᴀʟʟᴢx',
        buttons: [
            {
                buttonId: ".listmenu",    
                buttonText: { 
                    displayText: 'List Feature' 
                }
            },
            {
                buttonId: ".owner",    
                buttonText: { 
                    displayText: 'Creator' 
                }
            }
        ],
        viewOnce: true,
        headerType: 1,
      }, { quoted: m, ephemeralExpiration: 86400 });
  }
  break
  case 'menu': {
    let help = 
`👋 𝙷𝚎𝚕𝚕𝚘 *${pushname}.* Don't you understand how I'm being used?🙂\n> ❮ 𝙷𝚘𝚠 𝚝𝚘 𝚞𝚜𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜 ❯          \n\n
╭──☉ ❮ 📜 𝙈𝙚𝙣𝙪 ❯
│┬🍀 .𝘭𝘦𝘢𝘷𝘦 
│╰╴╴✪ < Request a leave >
│┬🍀 .𝘱𝘳𝘪𝘷𝘢𝘵𝘦 
│╰╴╴✪ < Work only private >
│┬🍀 .𝘱𝘶𝘣𝘭𝘪𝘤
│╰╴╴✪ < Work only public >
│┬🍀 .𝘩𝘪𝘥𝘦𝘵𝘢𝘨
│╰╴╴✪ Tagging group members invisibly
│┬🍀 .𝘵𝘢𝘨𝘢𝘭𝘭
│╰╴╴✪ tagging all group members
│┬🍀 .𝘷𝘷
│╰╴╴✪ Read view ones msg
╰─────────────☉`;
conn.sendMessage(m.chat, {
                    document: fs.readFileSync('./img.jpg'), 
                    fileName: filename,
                    mimetype: 'image/jpeg',
                    caption: help,
                    contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                        externalAdReply: {
                            title: title,
                            body: time,
                            thumbnailUrl: thumbnail,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    },
                    footer: footer,
                     buttons: [{
                            "name": "cta_url",
                            "buttonParamsJson": `{\"display_text\":\"github\",\"url\":\"https://github.com\",\"merchant_url\":\"https://www.google.com\"}`
                        }];
                        viewOnce: true,
        headerType: 1,
      }, { quoted: m, ephemeralExpiration: 86400 });
  }
            case prefix + 'leave':
            case prefix +'l': {
              // 🕓 Get current date info
              const now = new Date();
              const year = now.getFullYear();
              const month = String(now.getMonth() + 1).padStart(2, "0"); // 01 - 12

              // Generate the next 14 days dynamically
              const dateRows = [];
              for (let i = 0; i < 14; i++) {
                const future = new Date(now);
                future.setDate(now.getDate() + i);
                const y = future.getFullYear();
                const m = String(future.getMonth() + 1).padStart(2, "0");
                const d = future.getDate();
                dateRows.push({
                  title: `📅 ${y}.${m}.${d}`,
                  id: `.gl ${y}.${m}.${d}`
                });
              }

              // 🧠 Build the message
              let requestLeave = 
            `🤓 Hey *${pushname},* Do you want a leave?\n📅 Then choose the day you want a Leave. `;

              //  Build the button section dynamically
              const leaveSelect = {
                buttonId: "action",
                buttonText: { displayText: "📅 Click Here" },
                type: 4,
                nativeFlowInfo: {
                  name: "single_select",
                  paramsJson: JSON.stringify({
                    title: "📅 Click Here",
                    sections: [
                      {
                        title: "🙂 Select Your Leave 👇",
                        rows: dateRows, // ← dynamic date list
                      },
                    ],
                  }),
                },
              };

              // Send message
                conn.sendMessage(m.chat, {
                    document: fs.readFileSync('./package.json'), 
                    fileName: filename,
                    mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    fileLength: 999999999999999999999999999999999999999999999999,
                    caption: requestLeave,
                    contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
   mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"], 
   forwardedNewsletterMessageInfo: {
   newsletterJid: chID,
   newsletterName: chName,
                        externalAdReply: {
                            title: title,
                            body: time,
                            thumbnailUrl: thumbnail,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    },
                    footer: footer,
                    buttons: [
                        {
                          buttonId: `.owner`,
                          buttonText: { displayText: "❮ 👤Owner ❯" },
                          type: 1,
                        },
                        {
                          buttonId: `.menu`,
                          buttonText: { displayText: "❮ 📜Menu ❯" },
                          type: 1,
                        },
                        leaveSelect, // dynamic button
                      ],
                    viewOnce: true,
                    headerType: 1,
                  }, { quoted: m, ephemeralExpiration: 86400 });
}
 break
                case prefix + 'gl': {
  let giveLeave = 
`📅 *A Leave Request* 📅

╔══❮ 𝙻𝚎𝚊𝚟𝚎 𝚒𝚗𝚏𝚘 ❯
║👤 User :- ${pushname}
║📝 Leave Date :- *${text}*
║⏰ Requested Time :- ${new Date().toLocaleString()}
╚════════─────○

> Dear ${pushname}, Your leave is currently pending. Please wait until it is approved or rejected.`;
                conn.sendMessage(m.chat, {
                    document: fs.readFileSync('./img.jpg'), 
                    fileName: filename,
                    mimetype: 'image/jpeg',
                    caption: giveLeave,
                    contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                        externalAdReply: {
                            title: title,
                            body: time,
                            thumbnailUrl: thumbnail,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    },
                    footer: footer,
                    buttons: [
      { buttonId: `.approve ${m.key.id}`, buttonText: { displayText: '❮ ✅ Approve ❯' }, type: 1 },
      { buttonId: `.reject ${m.key.id}`, buttonText: { displayText: '❮ ❌ Reject ❯' }, type: 1 }
    ],
                    viewOnce: true,
                    headerType: 1,
                  }, { quoted: m, ephemeralExpiration: 86400 });
                   // store message ID to use later
  global.lastLeaveMsg = { chat: m.chat, key: sentMsg.key }
  const db = loadLeaveDB();
  db.fullLeaves.push({
    user: m.sender,
    name: pushname,
    date: text,
    status: "pending",
    requestedAt: new Date().toISOString()
  });
  saveLeaveDB(db);

  global.lastLeaveMsg = { chat: m.chat, key: sentMsg.key, user: m.sender, name: pushname, date: text }
}
break
 case prefix + 'approve': {
           // Check if there's a pending leave request
           if (!global.lastLeaveMsg) {
               return reply("❌ No pending leave requests found. Please make sure a leave request is currently waiting for approval.");
           }

           // Validate lastLeaveMsg structure
           if (!global.lastLeaveMsg.user || !global.lastLeaveMsg.chat || !global.lastLeaveMsg.key) {
               delete global.lastLeaveMsg; // Clear corrupted data
               return reply("❌ Invalid leave request data. Please ask the user to submit a new leave request.");
           }

           const senderNumber = m.sender.split("@")[0];
           if (!global.admins.includes(senderNumber)) {
               return reply("❌ Sorry, you are not authorized to approve leave requests.");
           }

           const { chat, key, user, name, date } = global.lastLeaveMsg;

           try {
               // Delete the original leave message
               await conn.sendMessage(chat, { delete: key });

               // Update database
               const db = loadLeaveDB();
               const leaveIndex = db.fullLeaves.findIndex(leave => 
                   leave.user === user && leave.status === "pending"
               );

               if (leaveIndex !== -1) {
                   db.fullLeaves[leaveIndex].status = "approved";
                   db.fullLeaves[leaveIndex].approvedBy = m.sender;
                   db.fullLeaves[leaveIndex].approvedAt = new Date().toISOString();
                   saveLeaveDB(db);
               }

               // Notify in group
               await conn.sendMessage(m.chat, {
                   text: `✅ Leave request from @${user.split("@")[0]} has been *approved*! 🎉\n📅 Date: ${date || 'Not specified'}`,
                   mentions: [user],
               });

               // DM the requester
               await conn.sendMessage(user, {
                   text: `🎉 Hello *${name}*, your leave request has been *approved* by management! Enjoy your time off 😎\n📅 Date: ${date || 'Not specified'}`,
               });

               // Clear the stored message
               delete global.lastLeaveMsg;

           } catch (error) {
               console.error("Error approving leave:", error);
               reply("❌ Failed to process approval. Please try again.");
           }
       }
       break;

case prefix + 'reject': {
  if (!global.lastLeaveMsg) return m.reply("No pending leave requests found.");

  const senderNumber = m.sender.split("@")[0];
  if (!global.admins.includes(senderNumber)) {
    return m.reply("❌ Sorry, you are not an owner.");
  }

  const requester = global.lastLeaveMsg.user;
  const requesterName = global.lastLeaveMsg.name;
  const { chat, key, user, date } = global.lastLeaveMsg;

  await conn.sendMessage(chat, { delete: key });

  const db = loadLeaveDB();
  const leaveIndex = db.fullLeaves.findIndex(leave => 
    leave.user === user && leave.status === "pending"
  );
  if (leaveIndex !== -1) {
    db.fullLeaves[leaveIndex].status = "rejected";
    db.fullLeaves[leaveIndex].rejectedBy = m.sender;
    db.fullLeaves[leaveIndex].rejectedAt = new Date().toISOString();
    saveLeaveDB(db);
  }

  await conn.sendMessage(m.chat, {
    text: `❌ The leave request from @${requester.split("@")[0]} has been *rejected*.`,
    mentions: [requester],
  });

  await conn.sendMessage(requester, {
    text: `😞 Hello *${requesterName}*, unfortunately your leave request was *rejected* by your manager.`,
  });

  delete global.lastLeaveMsg;
}
break;
case prefix + 'halfleave':
case prefix + 'hl': {
  let requestHalfLeave = `
🕒 Hey *${pushname}.* \nDo you want a half leave? 😁 Then choose the time you want.✨`;

  //Define possible time slots
  const timeSlots = [
    "08:00 AM - 13:00 PM", 
    "13:00 PM - 18:00 PM",
  ];

  // Convert time slots to selectable rows
  const timeRows = timeSlots.map((time) => ({
    title: `🕐 ${time}`,
    id: `.halfconfirm ${time}`,
  }));

  // Build interactive button (native select menu)
  const halfSelect = {
    buttonId: "action",
    buttonText: { displayText: "🕐 Select Time" },
    type: 4,
    nativeFlowInfo: {
      name: "single_select",
      paramsJson: JSON.stringify({
        title: "🕐 Select Your Half Leave Time",
        sections: [
          {
            title: "🕘 Choose When You’ll Leave",
            rows: timeRows,
          },
        ],
      }),
    },
  };  
   conn.sendMessage(m.chat, {
                    document: fs.readFileSync('./img.jpg'), 
                    fileName: filename,
                    mimetype: 'image/jpeg',
                    caption: requestHalfLeave,
                    contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                        externalAdReply: {
                            title: title,
                            body: time,
                            thumbnailUrl: thumbnail,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    },
                    footer: footer,
                          buttons: [
        {
          buttonId: `.owner`,
          buttonText: { displayText: "❮ 👤Owner ❯" },
          type: 1,
        },
        {
          buttonId: `.menu`,
          buttonText: { displayText: "❮ 📜Menu ❯" },
          type: 1,
        },
        halfSelect,
      ],
      viewOnce: true,
                    headerType: 1,
                  }, { quoted: m, ephemeralExpiration: 86400 });
                  }
                  break;
  case prefix + 'halfconfirm": {
  let time = text.trim();
  let halfLeaveMessage = `
🕒 *Half Leave Request* 🕒

👤 User: ${pushname}
⏰ Time: *${time}*
📅 Requested: ${new Date().toLocaleString()}

> Dear ${pushname}, your half-leave request is pending. Please wait until it’s approved or rejected.
`;
conn.sendMessage(m.chat, {
                    document: fs.readFileSync('./img.jpg'), 
                    fileName: filename,
                    mimetype: 'image/jpeg',
                    caption: HalfLeaveMessage,
                    contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                        externalAdReply: {
                            title: title,
                            body: time,
                            thumbnailUrl: thumbnail,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    },
                    footer: footer,
                    buttons: [
      {
        buttonId: `.approvehalf ${m.sender}`,
        buttonText: { displayText: "✅ Approve" },
        type: 1,
      },
      {
        buttonId: `.rejecthalf ${m.sender}`,
        buttonText: { displayText: "❌ Reject" },
        type: 1,
      },
    ],
    viewOnes: true,
    headerType: 1
    });
    const db = loadLeaveDB();
  db.halfLeaves.push({
    user: m.sender,
    name: pushname,
    time: time,
    status: "pending",
    requestedAt: new Date().toISOString()
  });
  saveLeaveDB(db);

  global.lastHalfLeave = {
    chat: m.chat,
    key: sentMsg.key,
    user: m.sender,
    name: pushname,
    time: time,
  };
}
break;
case prefix + 'approvehalf': {
  const senderNumber = m.sender.split("@")[0];
  if (!global.admins.includes(senderNumber))
    return m.reply("❌ Sorry, you are not an owner.");

  if (!global.lastHalfLeave) return m.reply("No pending half-leave requests.");

  const { chat, key, user, name, time } = global.lastHalfLeave;

  await conn.sendMessage(chat, { delete: key });

  const db = loadLeaveDB();
  const leaveIndex = db.halfLeaves.findIndex(leave => 
    leave.user === user && leave.status === "pending"
  );
  if (leaveIndex !== -1) {
    db.halfLeaves[leaveIndex].status = "approved";
    db.halfLeaves[leaveIndex].approvedBy = m.sender;
    db.halfLeaves[leaveIndex].approvedAt = new Date().toISOString();
    saveLeaveDB(db);
  }

  await conn.sendMessage(m.chat, {
    text: `✅ Half leave request from @${user.split("@")[0]} for *${time}* has been approved! 🎉`,
    mentions: [user],
  });

  await conn.sendMessage(user, {
    text: `🎉 Hello *${name}*, your half-leave request for *${time}* has been *approved*! Enjoy your time off 😎`,
  });

  delete global.lastHalfLeave;
}
break;

case prefix + 'rejecthalf': {
  const senderNumber = m.sender.split("@")[0];
  if (!global.admins.includes(senderNumber))
    return m.reply("❌ Sorry, you are not an owner.");

  if (!global.lastHalfLeave) return m.reply("No pending half-leave requests.");

  const { chat, key, user, name, time } = global.lastHalfLeave;

  await conn.sendMessage(chat, { delete: key });

  const db = loadLeaveDB();
  const leaveIndex = db.halfLeaves.findIndex(leave => 
    leave.user === user && leave.status === "pending"
  );
  if (leaveIndex !== -1) {
    db.halfLeaves[leaveIndex].status = "rejected";
    db.halfLeaves[leaveIndex].rejectedBy = m.sender;
    db.halfLeaves[leaveIndex].rejectedAt = new Date().toISOString();
    saveLeaveDB(db);
  }

  await conn.sendMessage(m.chat, {
    text: `❌ Half leave request from @${user.split("@")[0]} for *${time}* has been rejected.`,
    mentions: [user],
  });

  await conn.sendMessage(user, {
    text: `😞 Hello *${name}*, your half-leave request for *${time}* has been *rejected* by your manager.`,
  });

  delete global.lastHalfLeave;
}
break;
case 'leavelogs'
case 'll': {
  if (!global.admins.includes(senderNumber)) return reply("❌ Sorry, you are not an owner.");
  const db = loadLeaveDB();

  const fullList = db.fullLeaves
    .map((x, i) => `📅 ${i + 1}. ${x.name}\nDate: ${x.date}\nStatus: ${x.status}`)
    .join("\n\n");
  const halfList = db.halfLeaves
    .map((x, i) => `🕐 ${i + 1}. ${x.name}\nTime: ${x.time}\nStatus: ${x.status}`)
    .join("\n\n");

  const msg = `📁 *BuyMore Leave Records*\n\n🌕 *Full Day Leaves:*\n${fullList || "_No full leaves_"}\n\n🌗 *Half Day Leaves:*\n${halfList || "_No half leaves_"}`;
  reply(msg);
}
break;
  case prefix + 'listmenu': {
    let { menu } = require('../lib/menu.js')
    let menunya = menu(isPremium, time, sender, prefix, pushname);
    conn.sendMessage(m.chat, {
      image: { url: 'https://img1.pixhost.to/images/9296/649396846_lily.jpg' },
      caption: menunya,
      gifPlayback: false,
      footer: '@ ʙᴀsᴇᴅ ʙʏ ғᴀʟʟᴢx'
    }, { quoted: m });
  }
  break
case prefix + 'addcase': {
    if (!isOwner) return m.reply(mess.owner)
    if (!text) return m.reply(`*PERMINTAAN ERROR!! CONTOH :*\n> .addcase case 'test': {\n> m.reply('hello world')\n> }\n> break`)

    const fileName = 'system/case.js';
    const newCase = `${text}`;

    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.error('*ERROR SAAT MEMBACA FILE*', err);
            return;
        }

        const posisiAwal = data.indexOf("case prefix + ['addcase']:");
        if (posisiAwal !== -1) {
            const kodeBaru = data.slice(0, posisiAwal) + '\n' + newCase + '\n' + data.slice(posisiAwal);

            fs.writeFile(fileName, kodeBaru, 'utf8', (err) => {
                if (err) {
                    m.reply('*TERJADI KESALAHAN SAAT MENULIS CASE* :', err);
                } else {
                    m.reply('*CASE SUKSES DITAMBAHKAN*');
                }
            });

        } else {
            m.reply('*CASE ADDCASE TIDAK DITEMUKAN');
        }
    });
}
break;
case prefix + 'sticker': {
    if (!quoted) return m.reply(`Send/Reply Images/Videos/Gifs With Captions ${prefix + command}\nVideo Duration 1-9 Seconds`)

    if (/image/.test(mime)) {
        let media = await quoted.download()
        let encmedia = await conn.sendImageAsSticker(m.chat, media, m, {
            packname: global.packname,
            author: global.author
        })
    } else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 11)
            return m.reply(`Send/Reply Images/Videos/Gifs With Captions ${prefix + command}\nVideo Duration 1-9 Seconds`)

        let media = await quoted.download()
        let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, {
            packname: global.packname,
            author: global.author
        })
    } else {
        m.reply(`Send/Reply Images/Videos/Gifs With Captions ${prefix + command}\nVideo Duration 1-9 Seconds`)
    }
}
break
case prefix + 'tiktok': {
    let momok = "`𝗧 𝗜 𝗞 𝗧 𝗢 𝗞 - 𝗗 𝗢 𝗪 𝗡 𝗟 𝗢 𝗔 𝗗`"
    if (!text.startsWith("https://")) return m.reply("url")

    const { tiktokDl } = require('../lib/scrape/scraper1');
    await tiktokDl(q).then(async (result) => {
        await conn.sendMessage(m.chat, { react: { text: '🕖', key: m.key } })

        if (!result.status) return m.reply("Error!")

        if (result.durations == 0 && result.duration == "0 Seconds") {
            let araara = new Array()
            let urutan = 0

            for (let a of result.data) {
                let imgsc = await prepareWAMessageMedia({ image: { url: `${a.url}` } }, { upload: conn.waUploadToServer })
                await araara.push({
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: `Foto Slide Ke *${urutan += 1}*`,
                        hasMediaAttachment: true,
                        ...imgsc
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                        buttons: [{
                            "name": "cta_url",
                            "buttonParamsJson": `{\"display_text\":\"Link Tautan Foto\",\"url\":\"${a.url}\",\"merchant_url\":\"https://www.google.com\"}`
                        }]
                    })
                })
            }

            const msgii = await generateWAMessageFromContent(m.chat, {
                viewOnceMessageV2Extension: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.fromObject({
                                text: "*TIKTOK - DOWNLOADER*"
                            }),
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                cards: araara
                            })
                        })
                    }
                }
            }, { userJid: m.sender, quoted: m })

            await conn.relayMessage(m.chat, msgii.message, {
                messageId: msgii.key.id
            })

        } else {
            let urlVid = await result.data.find(e => e.type == "nowatermark_hd" || e.type == "nowatermark")

            await conn.sendMessage(m.chat, {
                video: { url: urlVid.url },
                caption: momok,
                footer: `\n${global.botname}`,
                buttons: [
                    {
                        buttonId: `.ttaudio ${text}`,
                        buttonText: {
                            displayText: "sᴏᴜɴᴅ 🔊"
                        }
                    },
                ],
                viewOnce: true,
            }, {
                quoted: m
            });
        }

    }).catch(e => console.log(e))

    await conn.sendMessage(m.chat, { react: { text: '🐬', key: m.key } })
}
break
case prefix + 'twitterdl': {
    if (!q) return m.reply('https://x.com/Indomielovers/status/1917826490068279736')
    m.reply('Tunggu sebentar, sedang memproses...')

    try {
        const axios = require('axios')
        const cheerio = require('cheerio')

        const res = await axios.post('https://twmate.com/', new URLSearchParams({
            page: q,
            ftype: 'all',
            ajax: '1'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://twmate.com/',
            }
        })

        const $ = cheerio.load(res.data)
        const videoLinks = []

        $('.btn-dl').each((index, element) => {
            const quality = $(element).parent().prev().text().trim()
            const downloadUrl = $(element).attr('href')
            if (downloadUrl.includes('.mp4')) {
                videoLinks.push({ quality, downloadUrl })
            }
        })

        if (videoLinks.length === 0) return m.reply('Gagal mengambil video. Pastikan URL benar dan video publik.')

        const best = videoLinks[0]
        let caption = `*Download Twitter/X*\n\n`
        caption += `*Quality:* ${best.quality}\n`
        caption += `*Source:* ${q}\n\n`
        caption += `*Link Alternatif:*\n`

        videoLinks.forEach((v, i) => {
            caption += `${i + 1}. ${v.quality}: ${v.downloadUrl}\n`
        })

        await conn.sendMessage(m.chat, {
            video: { url: best.downloadUrl },
            caption: caption.trim()
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan saat memproses video.')
    }
}
break

  default:
 }

if (antilinkStatus) {
let gc = `https://`
if (chatmessage.includes(gc)) {
    m.reply('*sebuah link terdeteksi maaf kamu harus di kick ⛔*');
    let gclink = (`https://chat.whatsapp.com/` + await conn.groupInviteCode(m.chat))
    let isLinkThisGc = new RegExp(gclink, 'i')
    let isgclink = isLinkThisGc.test(m.text)
    if (isgclink) return m.reply(`Ohh, Link Group Ini Ternyata`)
    if (!isBotGroupAdmins) return m.reply(`Duhh bot bukan admin`)
    if (isGroupAdmins) return m.reply(`Ternyata kamu admin, maaf min`)
    if (isOwner) return m.reply(`Ternyata kamu owner, maaf king`)
    conn.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,
                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })
    conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
}
}

}

let file = require.resolve(__filename)
 fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log('===================================================');
	console.log(chalk.red(`    New ${__filename}`))
	delete require.cache[file]
	require(file)
})