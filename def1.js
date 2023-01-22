const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs/promises')
const sql = require('mssql');

function compareAndRemove(mainArray, removeArray) {
  let removeSet = new Set(removeArray);
  return mainArray.filter(element => !removeSet.has(element));
}

const main = async () => {

}

main()
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
       .map(element => element.textContent.replace(/[\t\n]/g, '')).slice(0, 3).join('--')

      return { word: word, data: datas }
    }
    return { word: null, data: null }
   }


    
   sql.connect(config, async (err) => {
       if (err) console.log(err);
       const word = await fs.readFile('./dictionnaire/exemple.txt', 'utf-8')
       const result = JSON.parse(word).flat().filter(x => x)
       const request = new sql.Request();
       //const dicoBdd = await request.query(`SELECT name from def`)
       //const list = dicoBdd.recordset.map(x => x.name)
       //const dictionnaire = await compareAndRemove(word, list ).sort()
        try {
            let name, def; len = result.length
            for(let i = len - 1;  len > 0 ; i--) {
                let elements = await req(result[i])
                name= elements.word 
                def = elements.data
                request.input("name_" + i, sql.VarChar(150), name);
                request.input("def_" + i, sql.VarChar(1000), def);
                request.query(`INSERT INTO def (name, description) VALUES (@name_${i}, @def_${i})`, (err, result) => {
                    if (err) console.log(err);
                });
            }
            
            sql.close();
            
        } catch(error) {
          console.error(error)
        }
   });
    
    
    