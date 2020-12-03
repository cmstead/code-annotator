const fs = require('fs');
const path = require('path');
const util = require('util');

const router = require('express').Router();

router.get('/annotate/:fileName', function(request, response) {
    const filePath = path.join(__dirname, '..', 'public', 'html', 'code-annotator.html');

    response.sendFile(filePath);
});

router.route('/:fileName')
    .get(function(request, response) {
        const fileName = request.params.fileName;
        const filePath = path.join(__dirname, '..', 'source', `${fileName}.source`);

        util.promisify(fs.readFile)
            .call(null, filePath, { encoding: 'utf8'})
            .then(function(fileContent){
                const fileLines = fileContent.split('\n');

                response.json(fileLines);
            })
            .catch(function(){
                response.sendStatus(404);
            });
    });

module.exports = router;