const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs')
const dico = require('./dictionnaire').map(element => element.toLowerCase());
const sql = require('mssql');




const config = {
    user: 'khayyer',
    password: 'Empalot31.',
    server: 'fishfish.database.windows.net',
    database: 'mydb',
    options: {
        encrypt: true
    }
};

const req = async (word = word.toLowerCase(), request) => {
    const LarouseUrl = 'https://www.larousse.fr/dictionnaires/francais/'
    const url = LarouseUrl + word
    const requestelement = await fetch(url)
    if (requestelement.ok) {
    let body = requestelement
       const textbody = await body.text()
       const bodyHTML =  new JSDOM(textbody)
       const datas = [...bodyHTML.window.document.querySelectorAll('#definition > article > ul:nth-child(2) > li')]
       .map(element => element.textContent.replace(/[\t\n]/g, '')).join('--')

      return { word: word, data: datas }
    }
    return { word: null, data: null }
   }

    
   sql.connect(config, async (err) => {
       if (err) console.log(err);
        try {
            let name, def;
            for(let i = 1721; i < dico.length; i++) {
                let elements = await req(dico[i])
                name= elements.word 
                def = elements.data
                const request = new sql.Request();
                request.input("name_" + i, sql.NVarChar, name);
                request.input("def_" + i, sql.NVarChar, def);
                request.query(`INSERT INTO mydef (name, def) VALUES (@name_${i}, @def_${i})`, (err, result) => {
                    if (err) console.log(err);
                });
            }
            
            sql.close();
            
        } catch(error) {
          console.error(error)
        }
   });
    
    
    