

/*
const test_contoller = async (req,res) =>{
   console.log('dasjsad');
    try{
        console.log('inside index...');
        res.status(200).send('test_contoller is alive')
    }catch(err){
        console.log('error');
    }
    // next();
 }
*/

//  module.exports = test_contoller;
exports.test_contoller = async (req,res) =>{
    console.log('dasjsad');
     try{
         console.log('inside index...');
         res.status(200).send('test_contoller is alive')
     }catch(err){
         console.log('error');
     }
     // next();
  }