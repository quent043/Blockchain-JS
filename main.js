 const SHA256 = require('crypto-js/sha256)');

class Block {
    constructor (index, timestamp, data, previousHash =''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash;
    this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash+ this.timestamp + JSON.stringify(this.data).toString() + this.nonce);
    }

    mineBlock(difficulty){
        while(this.hash.subString(0, difficulty) !== Array(difficulty + 1).join("0")){
            // Va retourner un string fait de tous les éléments de l'Array séparés par "0". Vu que l'array 
            // est vide, ça va retourner juste des 0.
            this.nonce++; //On fait ça sinon si on ne change pas au moins une valeur dans le block ,le SHA
            //sera toujours le même. I lfaut que au moins un truc change à chaque itération.
            this.hash = this.calculateHash();    
        }

        console.log("Block mined: " + this.hash + " and its nonce: " + this.nonce);
    }
 }

// On requiert que le SHA commence par un certain nombre de zéros, en gros l'ordi calcule un SHA
// et si ça ne commence pas par 0, il en calcule un autre. Donc plus on requiert de 0 plus ça prend
// du temps.
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock];  //chain est un table de Block
        this.difficulty = 2;
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2020", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash(); ---> Maintenant on va générer le SHA en minant.
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++) { //On commence à 1 car 0 c'est le GenesisBlock
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

            return true;
        }
    }
}


let virtualPognon = new Blockchain();
virtualPognon.addBlock(new Block(1, "16/02/2018", { amount: 4 }));
virtualPognon.addBlock(new Block(2, "30/06/2016", { amount: 16 }));

console.log('Is Blockchain valid? ' + virtualPognon.isChainValid());
console.log(JSON.stringify(virtualPognon, null, 4));

virtualPognon.chain[1].data = { amount: 10000};
virtualPognon.chain[1].hash = virtualPognon.chain[1].calculateHash();

console.log('Is Blockchain valid? ' + virtualPognon.isChainValid());

// On peut faire ça avec le dernier block par contre ? Vu qu'il n'y a pas de block suivant pour check le Hash
// Oui on peut, et même à un block donné on peut le faire si on recalcule de Hash de tous les blocks suivants
// ----> D'où le 'proof of work' = Mining.