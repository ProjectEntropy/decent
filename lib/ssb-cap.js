//this is the key for accessing the ssb protocol.
//this will be updated whenever breaking changes are made.
//(see secret-handshake paper for a full explaination)
module.exports =
  new Buffer('EVRctE2Iv8GrO/BpQCF34e2FMPsDJot9x0j846LjVtc=', 'base64')

//there is nothing special about this value.
//I generated it in the node repl with:
//
// > crypto.randomBytes(32).toString('base64')
//
//and copied it here.

