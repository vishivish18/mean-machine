
function isAuthenticated (req, res, next) {
    
    if (true)
        return next();
   
    res.redirect('/');
}

function checkTwo (req, res, next) {
    
    if (true)
    console.log("in two");
   
    
}


module.exports = isAuthenticated;
module.exports = checkTwo;