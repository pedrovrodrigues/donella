/*
Linguagem de especificação de modelagem de sistemas Donella

Especificações léxicas:
  Palavras Reservadas:
    stocks, flows, links, variables, relations, out, in, val, der, int, calc, fix
  Símbolos:
    { } , : ; = ( ) ~ !
    + - * / % ^
  Regex:
    id = [a-zA-z][a-zA-z0-9_]*
Especificações sintáticas:
  Program: ID { StockDecl FlowDecl LinkDecl VarDecl RelDecl }
  StockDecl: STOCKS { ListId }
  FlowDecl: FLOWS { ListId }
  VarDecl: VARS { ListVar }
  RelDecl: RELATIONS { ListRel }
  ListId: ID | ListId , ID
  ListVar: Var | Var ListVar
  Var: ID : CALC | ID : FIX |
  ListRel: Rel; ListRel | ""

  Rel: ID = Expression |
       ID ~ ID
*/
var erro, nomearq, codigo, carac, cadeia, nCadeia, atom, nCode;

const MAXCADEIA = 50;
const NCLASSHASH = 23;

const MAIS        = 1;
const MENOS       = 2;
const VEZES       = 3;
const DIV         = 4;
const MOD         = 5;

const STOCKS      = 1;
const FLOWS       = 2;
const VARIABLES   = 3;
const RELATIONS   = 4;
const IN          = 5;
const OUT         = 6;
const CALC        = 7;
const FIX         = 8;

const ID          = 9;
const INTCT       = 10;
const FLOATCT     = 11;
const OPAD        = 12;
const OPMULT      = 13;
const POW         = 14;
const ABCHAV      = 15;
const FCHAV       = 16;
const VIRGULA     = 17;
const PVIRG       = 18;
const DPONTS      = 19;
const IGUAL       = 20;
const ABPAR       = 21;
const FPAR        = 22;
const LINK        = 23;
const FINAL       = 24;
const INVAL       = 25;

const palsReserv = ["",
    "stocks",   "flows",  "variables","relations",
    "in",       "out",    "calc",     "fix"
  ];
const tipos = ["",
    "STOCKS",   "FLOWS", "VARIABLES",
    "RELATIONS","IN",     "OUT",    "CALC",   "FIX",
    "ID",       "INTCT",  "FLOATCT","OPAD",
    "OPMULT",   "POW",    "ABCHAV", "FCHAV",
    "VIRGULA",  "PVIRG",  "DPONTS", "IGUAL",
    "ABPAR",    "FPAR",   "LINK",
    "FINAL",    "INVAL"
  ];
const atributos = ["",
    "MAIS",     "MENOS",    "VEZES",    "DIV",  "MOD"
  ];

var simb, tabsimb;

function atomo(tipo, atrib){
  this.tipo = tipo;
  this.atrib = atrib;
}
function simbolo(cadeia, tid, tvar){
  this.cadeia = cadeia;
  this.tid = tid;
  this.tvar = tvar;
  this.inic = false;
  this.ref = false;
}

function Stock(name) {
  this.name = name;
  this.ini = 0;
  this.input = undefined;
}
function Flow(name) {
  this.name = name;
  this.ini = 0;
  this.in = undefined;
  this.out = undefined;
  this.input = undefined;
}
function Variable(name) {
  this.name = name;
  this.ini = 0;
  this.input = undefined;
  this.type = ""; // 'fix' ou 'calc'
  this.expression = "";
  this.link = undefined;
}
var stocks, flows, variables;

function initDon() {
  stocks = [];
  flows = [];
  variables = [];
  erro = false;
  atom = new atomo();
  var simb = new simbolo();
  var tabsimb = [];
  for (var i = 0; i < NCLASSHASH; i++) {
    tabsimb.push([]);
  }
}
// Funções de checar letras/numeros
function isalpha(inputtxt){
 var letterNumber = /^[a-zA-Z]+$/;
 return inputtxt.match(letterNumber);
}
function isalnum(inputtxt){
 var letterNumber = /^[0-9a-zA-Z]+$/;
 return inputtxt. match(letterNumber);
}
function isdigit(inputtxt){
 var letterNumber = /^[0-9]+$/;
 return inputtxt.match(letterNumber);
}
function isspace(inputtxt){
 var letterNumber = /^[ \n\r\t]+$/;
 return inputtxt.match(letterNumber);
}

// Análise Léxica
function NovoCarac(){
  var novo;
  if(nCode >= codigo.length){
    novo = '\0';
  }
  else{
    novo = codigo[nCode];
    nCode++;
  }
  console.log(novo);
  return novo;
}
function NovoAtomo(){
  var estado = 1;
  cadeia = "";
  while(estado != 3){
    switch (estado) {
      case 1:
        switch (carac) {
          case '{': case '}': case ',': case ':': case ';': case '=': case '(': case ')': case '+': case '~': case '*': case '/': case '%': case '^':
            atom = Classifica();
            carac = NovoCarac();
            estado = 3;
            break;
          case '\0':
            atom.tipo = FINAL;
            estado = 3;
            break;
          case '-':
            prox = NovoCarac();
            while(isspace(prox)){
              prox = NovoCarac();
            }
            if(isdigit(prox)){
              FormaCadeia();
              carac = prox;
              FormaCadeia();
              estado = 4;
              carac = NovoCarac();
            }
            else{
              atom = Classifica();
              carac = prox;
              estado = 3;
            }
            break;
          default:
            if(isalpha(carac)){
              FormaCadeia();
              carac = NovoCarac();
              estado = 2;
            }
            else if(isdigit(carac)){
              FormaCadeia();
              carac = NovoCarac();
              estado = 4;
            }
            else if(isspace(carac)){
              carac = NovoCarac();
              estado = 1;
            }
            else{
              atom.tipo = INVAL;
              atom.atrib = carac;
              carac = NovoCarac();
              estado = 3;
            }
        }
        break;
      case 2:
        if (isalnum (carac) || carac == '_') {
            FormaCadeia ();
            carac = NovoCarac();
            estado = 2;
        }
        else {
            atom = ClassificaCadeia ();
            estado = 3;
        }
        break;
      case 3:
        break;
      case 4:
        if (isdigit (carac)) {
            FormaCadeia ();
            carac = NovoCarac();
            estado = 4;
        }
        else {
            atom = FormaNumero ();
            estado = 3;
        }

        break;
    }
  }
  ImprimeAtomo();
}
function ImprimeAtomo(){
  var i, cad, tipo, atr, debug = cadeia;
  cad = cadeia;
  tipo = tipos[atom.tipo];

  switch(atom.tipo){
      case OPAD: case OPMULT:
          atr = atributos[atom.atrib];
          break;
      case INTCT: case FLOATCT:
          atr = atom.atrib;
          break;
      case INVAL:
          atr = atom.atrib;
          break;
      case ID:
          atr = atom.atrib;
          break;
      default:
          atr = ""
          break;
  }
  console.log(cad + "|" + tipo + "|" + atr + "|");
}
function FormaCadeia(){
  cadeia = cadeia + carac;
}
function ClassificaCadeia(){
  var x = PalavraReservada();
  if(x==0){
    atom.tipo = ID;
    atom.atrib = cadeia;
  }
  else{
    atom.tipo = x;
  }
  return atom;
}
function FormaNumero(){
  atom.tipo = INTCT;
  atom.atrib = parseInt(cadeia);
  return atom;
}
function Classifica(){
  switch (carac) {
    case '+':
      atom.atrib = MAIS;
      atom.tipo = OPAD;
      break;
    case '-':
      atom.atrib = MENOS;
      atom.tipo = OPAD;
      break;
    case '*':
      atom.atrib = VEZES;
      atom.tipo = OPMULT;
      break;
    case '/':
      atom.atrib = DIV;
      atom.tipo = OPMULT;
      break;
    case '%':
      atom.atrib = MOD;
      atom.tipo = OPMULT;
      break;
    case '=':
      atom.tipo = IGUAL;
      break;
    case ';':
      atom.tipo = PVIRG;
      break;
    case ':':
      atom.tipo = DPONTS;
      break;
    case ',':
      atom.tipo = VIRGULA;
      break;
    case '(':
      atom.tipo = ABPAR;
      break;
    case ')':
      atom.tipo = FPAR;
      break;
    case '{':
      atom.tipo = ABCHAV;
      break;
    case '}':
      atom.tipo = FCHAV;
      break;
    case '^':
      atom.tipo = POW;
      break;
    case '~':
      atom.tipo = LINK;
      break;
  }
  return atom;
}
function PalavraReservada(){
  var i;
  // Palavras reservadas
  for(i=1;i<=12;i++){
      if(cadeia == palsReserv[i])
          return i;
  }
  return 0;
}

// An�lise Sint�tica
function ExecProg(){
  estado = 1;
  while(estado != 9){
    switch (estado) {
      case 1:
        if(atom.tipo == ID){
          estado = 2;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 2:
        if(atom.tipo == ABCHAV){
          estado = 3;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 3:
        ExecStockDecls();
        estado = 4;
        break;
      case 4:
        ExecFlowDecls();
        estado = 6;
        break;
      case 6:
        ExecVarDecls();
        estado = 7;
        break;
      case 7:
        ExecRelDecls();
        estado = 9;
        break;
      case 8:
        if(atom.tipo == FCHAV){
          estado = 9;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 9:
        if(atom.tipo == FINAL){
          estado = 10;
        }
        else{
          throw 1;
        }
        break;
    }
  }
}
function ExecStockDecls() {
  estado = 1;
  while(estado != 5){
    switch (estado) {
      case 1:
        if(atom.tipo == STOCKS){
          NovoAtomo();
          estado = 2;
        }
        else{
          throw 1;
        }
        break;
      case 2:
        if(atom.tipo == ABCHAV){
          NovoAtomo();
          estado = 3;
        }
        else{
          throw 1;
        }
        break;
      case 3:
        ExecListId('stock');
        estado = 4;
        break;
      case 4:
        if(atom.tipo == FCHAV){
          NovoAtomo();
          estado = 5;
        }
        else{
          throw 1;
        }
        break;
    }
  }
}
function ExecFlowDecls() {
  estado = 1;
  while(estado != 5){
    switch (estado) {
      case 1:
        if(atom.tipo == FLOWS){
          NovoAtomo();
          estado = 2;
        }
        else{
          throw 1;
        }
        break;
      case 2:
        if(atom.tipo == ABCHAV){
          NovoAtomo();
          estado = 3;
        }
        else{
          throw 1;
        }
        break;
      case 3:
        ExecListId('flow');
        estado = 4;
        break;
      case 4:
        if(atom.tipo == FCHAV){
          NovoAtomo();
          estado = 5;
        }
        else{
          throw 1;
        }
        break;
    }
  }
}
function ExecVarDecls() {
  estado = 1;
  while(estado != 5){
    switch (estado) {
      case 1:
        if(atom.tipo == VARIABLES){
          NovoAtomo();
          estado = 2;
        }
        else{
          throw 1;
        }
        break;
      case 2:
        if(atom.tipo == ABCHAV){
          NovoAtomo();
          estado = 3;
        }
        else{
          throw 1;
        }
        break;
      case 3:
        ExecListVar();
        estado = 4;
        break;
      case 4:
        if(atom.tipo == FCHAV){
          NovoAtomo();
          estado = 5;
        }
        else{
          throw 1;
        }
        break;
    }
  }

}
function ExecRelDecls() {
  estado = 1;
  while(estado != 5){
    switch (estado) {
      case 1:
        if(atom.tipo == RELATIONS){
          NovoAtomo();
          estado = 2;
        }
        else{
          throw 1;
        }
        break;
      case 2:
        if(atom.tipo == ABCHAV){
          NovoAtomo();
          estado = 3;
        }
        else{
          throw 1;
        }
        break;
      case 3:
        ExecListDecl();
        estado = 4;
        break;
      case 4:
        if(atom.tipo == FCHAV){
          NovoAtomo();
          estado = 5;
        }
        else{
          throw 1;
        }
        break;
    }
  }
}
function ExecListId(tipo) {
  var estado = 1, nv;
  while (estado != 5) {
    switch (estado) {
      case 1:
        if(atom.tipo == ID){
          if(tipo == 'stock'){
            nv = new Stock(atom.atrib);
            stocks.push(nv);
          } else if (tipo == 'flow') {
            nv = new Flow(atom.atrib);
            flows.push(nv);
          }
          estado = 2;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 2:
        if(atom.tipo == IGUAL){
          estado = 3;
          NovoAtomo();
        }
        else {
          estado = 4;
        }
        break;
      case 3:
        if (atom.tipo == INTCT) {
          nv.ini = atom.atrib;
          estado = 4;
          NovoAtomo();
        }
        break;
      case 4:
        if(atom.tipo == VIRGULA){
          estado = 1;
          NovoAtomo();
        }
        else{
          estado = 5;
        }
        break;
    }
  }
}
function ExecListVar() {
  var estado = 1, vr;
  while (estado != 5) {
    switch (estado) {
      case 1:
        if(atom.tipo == ID){
          vr = new Variable(atom.atrib)
          variables.push(vr);
          estado = 2;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 2:
        if(atom.tipo == DPONTS){
          estado = 3;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 3:
        if(atom.tipo == FIX ) {
          vr.type = 'fix';
          vr.ini = 0;
          estado = 4;
          NovoAtomo();
        }
        else if(atom.tipo == INTCT){
          vr.type = 'fix';
          vr.ini = atom.atrib;
          estado = 4;
          NovoAtomo();
        }
        else if (atom.tipo == CALC){
          vr.type = 'calc';
          estado = 4;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 4:
        if(atom.tipo == VIRGULA){
          estado = 1;
          NovoAtomo();
        }
        else {
          estado = 5;
        }
        break;
    }
  }
}
function ExecListDecl() {
  var estado = 1;
  while(estado != 2){
    switch (estado) {
      case 1:
        if(atom.tipo == FCHAV){
          estado = 2;
          NovoAtomo();
        }
        else{
          ExecDecl();
        }
        break;
    }
  }
}
function ExecDecl() {
  var estado = 1, left;
  while(estado != 6){
    switch (estado) {
      case 1:
        if(atom.tipo == ID){
          estado = 2;
          left = atom.atrib;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 2:
        if(atom.tipo == IGUAL){
          estado = 4;
          NovoAtomo();
        }
        else if (atom.tipo = LINK) {
          estado = 3;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 3:
        if(atom.tipo == ID){
          vr = variables.find(function(v){
            return v.name == left;
          });
          fl = flows.find(function(f){
            return f.name == atom.atrib;
          });
          vr.link = fl;
          estado = 5;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
      case 4:
        ExecExpr(left);
        estado = 5;
        break;
      case 5:
        if(atom.tipo == PVIRG){
          estado = 6;
          NovoAtomo();
        }
        else{
          throw 1;
        }
        break;
    }
  }
}

function ExecExpr(left){
	var estado = 71, op, str = '';
	while (estado != 74){
		switch (estado) {
			case 71:
        if(atom.tipo == IN){
          estado = 75;
          op = 'in';
          NovoAtomo();
        }
        else if (atom.tipo == OUT) {
          estado = 75;
          op = 'out';
          NovoAtomo();
        }
        else{
          str = ExecExprSimples(false);
          var vr = variables.find(function(v){
            return v.name == left;
          });
          if (vr != undefined) {
            vr.expression = str;
          }
          estado = 74;
        }
        break;
    case 75:
      if(atom.tipo == ABPAR){
        NovoAtomo();
        estado = 76;
      }
      else{
        throw 1;
      }
      break;
    case 76:
      if(atom.tipo == ID){
        var fl = flows.find(function(f){
          return f.name == left;
        });
        var st = stocks.find(function(s){
          return s.name == atom.atrib;
        });
        if(op == 'in'){
          fl.in = st;
        }
        else if (op == 'out') {
          fl.out = st;
        }
        NovoAtomo();
        estado = 77;
      }
      else{
        throw 1;
      }
      break;
    case 77:
      if(atom.tipo == FPAR){
        NovoAtomo();
        estado = 74;
      }
      else{
        throw 1;
      }
      break;
    }
	}
}

function ExecExprSimples(calculating) {
  var estado = 72, ret = 0, ret1 = 0, oper = 0, str = "";
  while (estado != 74) {
    switch (estado) {
      case 72:
        if(calculating){
          ret1 = ExecTerm(calculating);
          if(oper == MAIS) {
            ret += ret1;
          }
          else if (oper == MENOS) {
            ret -= ret1;
          }
          else {
            ret = ret1;
          }
        }
        else{
          str = str + ExecTerm(calculating);
        }
        estado = 73;
        break;
      case 73:
          if (atom.tipo == OPAD) {
            oper = atom.atrib;
            if(!calculating){
              if(oper == MAIS){
                str += '+';
              }
              else if (oper == MENOS) {
                str += '-';
              }
            }
            NovoAtomo ();
            estado = 72;
          }
          else {
            estado = 74;
          }
          break;
    }
  }
  return calculating ? ret : str;
}

function ExecTerm(calculating){
	var estado = 75, ret = 0, ret1 = 0, oper = 0, str = "";
	while (estado != 77){
		switch (estado) {
			case 75:
        if (calculating) {
          ret1 = ExecFat(calculating);
          if(oper == VEZES){
            ret *= ret1;
          }
          else if (oper == DIV) {
            ret /= ret1;
          }
          else {
            ret = ret1;
          }
        }
        else {
		      str += ExecFat(calculating);
        }
		    estado = 76;
        break;
			case 76:
		    if (atom.tipo == OPMULT) {
          oper = atom.atrib;
          if(!calculating){
            if(oper == VEZES){
              str += '*';
            }
            else if (oper == DIV) {
              str += '/';
            }
          }

          NovoAtomo();
          estado = 75;
        }
        else {
        	estado = 77;
        }
        break;
    }
	}
  return calculating?ret:str;
}

function ExecFat(calculating){
	var estado = 78, ret = 0, ret1 = 0, str = "";
	while (estado != 81){
		switch (estado) {
			case 78:
        if (atom.tipo == ID) {
          if(calculating){
            st = stocks.find(function(s){
              return s.name == atom.atrib;
            });
            if (st == undefined) {
              fl = flows.find(function(f) {
                return f.name == atom.atrib;
              });
              if(fl == undefined){
                vr = variables.find(function(v){
                  return v.name == atom.atrib;
                });
                if (vr == undefined) {
                  throw 1;
                }
                else{
                  if(vr.type == 'fix'){
                    ret = parseFloat(vr.input.value);
                  }
                  else{
                    // calcular expressão
                    ret = 0;
                  }
                }
              }
              else {
                ret = parseFloat(fl.input.value);
              }
            }
            else {
              ret = parseFloat(st.input.value);
            }
          }
          else {
            str += cadeia;
          }
          NovoAtomo ();
          estado = 83;
        }
        else if (atom.tipo == MENOS) {
          estado = 85;
          NovoAtomo();
        }
        else if (atom.tipo == INTCT) {
          ret = atom.atrib;
          str += atom.atrib.toString();
          NovoAtomo ();
          estado = 83;
        }
        else if (atom.tipo == ABPAR) {
          str += '(';
          NovoAtomo ();
          estado = 79;
        }
        else {
            Esperado ("FATOR");
	          estado = 82;
        }
        break;
			case 79:
        if(calculating){
          ret = ExecExprSimples(calculating);
        }
        else{
          str += ExecExprSimples(calculating);
        }
		    estado = 80;
		    break;
			case 80:
		    if (atom.tipo == FPAR) {
          str += ')';
          NovoAtomo ();
          estado = 83;
        }
        else {
          Esperado ("FPAR");
          estado = 82;
        }
		    break;
			case 82:
		    if (atom.tipo == PVIRG || atom.tipo == VIRGULA || atom.tipo == FINAL) {
          estado = 81;
        }
        else {
          NovoAtomo();
          estado = 82;
        }
        break;
      case 83:
        if(atom.tipo == POW){
          str += '^';
          estado = 84;
          NovoAtomo();
        }
        else {
          estado = 81;
        }
        break;
      case 84:
        if (calculating) {
          ret1 = ExecFat(calculating);
          ret = Math.pow(ret, ret1);
        }
        else {
          str += ExecFat(calculating);
        }
        estado = 81;
        break;
      case 85:
        if (calculating) {
          ret = -1*ExecFat(calculating);
        }
        else {
          str = '-'+ExecFat(calculating);
        }
        estado = 81;
        break;
		}
	}
  return calculating?ret:str;
}

// Erros
function Esperado(str){
    console.log("Esperado " + str);
    erro = true;
}

function DuplaDeclaracao(str){
    console.log("Variavel ja declarada: " + str);
    erro = true;
}

function NaoDeclarado(str){
    console.log("Variavel nao declarada: " + str);
    erro = true;
}

function NaoInicializada(str){
    console.log("Variavel nao inicializada: " + str);
    erro = true;
}

function NaoReferenciada(str){
    console.log("Variavel nao referenciada: " + str);
    erro = true;
}

function TipoInadequado(str){
    console.log("Tipo inadequado: " + str);
    erro = true;
}

function Incompatibilidade(tipo, oper){
    if(tipo == OPAD || tipo == OPMULT){
        console.log("Operando incompativel com operador " + atributos[oper]);
    }
    else{
        console.log("Operando incompativel com comando " + tipos[tipo]);
    }
    erro = true;
}

// An�lise sem�ntica
function hashing(str){
  var i, hsh = 0;
  for(i = 0; str[i] != '\0' && i < str.length; i++)
    hsh += str[i];
  return hsh % NCLASSHASH;
}
function InsereSimb(str, tipo){
  var novo = new simbolo();
  novo.cadeia = str;
  novo.tid = tipo;
  var hsh = hashing(novo.cadeia);
  tabsimb[hsh].push(novo);
  return novo;
}
function ProcuraSimb(str){
  var hsh = hashing(str);
  test = function(p){
    return p.cadeia == str;
  }
  var s = tabsimb[hsh].find(test);
  return s;
}

/// MAIN
function main(code) {
  console.log("Analise iniciando...");
  initDon();
  /* fs.readFile('code.txt', (err, data) => {
      if (err) throw err;
      codigo = data.toString().split("");
      console.log(data.toString());
  });
  */
  codigo = code.split("");
  console.log(codigo);
  erro = false;
  cadeia = "";
  atom.tipo = INVAL;
  nCode = 0;
  carac = NovoCarac();
  NovoAtomo();
  ExecProg();
  console.log("\nAnalise do codigo encerrada.");
  alert("\nAnalise do codigo encerrada.");
  if(erro){
    console.log("PROGRAMA COM ERROS!!");
  }
  return [stocks, flows, variables];
}
