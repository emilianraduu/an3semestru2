let AWS = require('aws-sdk');
const region = 'us-east-2'
const qs = require('querystring')

AWS.config.update({ region });

let docClient = new AWS.DynamoDB.DocumentClient();

const requests = async ({ req, res, route }) => {
    if (req.method === 'GET') {
        if (route.length === 1) {
            getItems({ req, res, route })
        }
        if (route.length === 2) {
            getItem({ req, res, route })
        }
        if (route.length !== 1 && route.length !== 2) {
            res.writeHead(400)
            res.write(JSON.stringify({ error: 'Inexisting route' }))
            res.end()
            return;
        }
    }
    if (req.method === 'POST') {
        if (route.length > 1) {
            res.writeHead(200)
            res.write(JSON.stringify({ error: 'Inexisting route' }))
            res.end()
        }
        else {
            makePost({ req, res, route })
        }
    }
    if (req.method === 'PUT') {
        if (route.length === 2) {
            makePut({ req, res, route })
        } else {
            res.writeHead(200)
            res.write(JSON.stringify({ error: 'Inexisting route' }))
            res.end()
        }
    }
    if (req.method === 'DELETE') {
        if (route.length === 2) {
            deleteItem({ req, res, route })
        }
        else {
            res.writeHead(400)
            res.write(JSON.stringify({ error: 'Inexisting route' }))
            res.end()
            return;
        }
    }


    // res.write(JSON.stringify(route));
    // res.end();
};

const deleteItem = ({ req, res, route }) => {
    getItem({
        req, res, route, feedback: false, callback: (item) => {
            let params = {
                TableName: route[0],
                Key: item
            };
            docClient.delete(params, function (err, data) {
                if (err) {
                    console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    res.writeHead(200)
                    res.write(JSON.stringify({ message: `Deleted ${route[0]}` }));
                    res.end()

                }
            });
        }
    })
}


const makePut = ({ req, res, route }) => {
    getItem({
        req, res, route, feedback: false, callback: (dbItem) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                if (body) {
                    body = JSON.parse(body)
                    let keys = Object.keys(body)
                    let item = {}
                    keys.forEach(k => {
                        item[k] = body[k]
                    })
                    let params = {
                        TableName: route[0],
                        Key: { ...dbItem, ...item }
                    }
                    docClient.update(params, function (err, data) {
                        if (err) {
                            res.writeHead(400)
                            res.write(JSON.stringify({ error: err }));
                            res.end()
                        } else {
                            console.log(`Added ${route[0]}`)
                            res.writeHead(201)
                            res.write(JSON.stringify({ message: `Updated ${route[0]}` }));
                            res.end()
                        }
                    });
                } else {
                    res.writeHead(401)
                    res.write(JSON.stringify({ error: 'You cannot post without a body' }))
                    res.end()
                }
            }
            );
        }
    })
}


const makePost = ({ req, res, route }) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        if (body) {
            body = JSON.parse(body)
            let keys = Object.keys(body)
            console.log(keys)
            let item = {}
            keys.forEach(k => {
                item[k] = body[k]
            })
            let params = {
                TableName: route[0],
                Item: item
            }
            docClient.put(params, function (err, data) {
                if (err) {
                    res.writeHead(400)
                    res.write(JSON.stringify({ error: err }));
                    res.end()
                } else {
                    console.log(`Added ${route[0]}`)
                    res.writeHead(201)
                    res.write(JSON.stringify({ message: `Added ${route[0]}` }));
                    res.end()
                }
            });
        } else {
            res.writeHead(401)
            res.write(JSON.stringify({ error: 'You cannot post without a body' }))
            res.end()
        }
    }
    );
}
const getItems = ({ req, res, route }) => {
    var params = {
        TableName: route[0]
    };

    docClient.scan(params, function (err, data) {
        if (err) {
            res.writeHead(400)
            res.write(JSON.stringify({ error: err }));
            res.end()
        } else {
            res.write(JSON.stringify(data.Items));
            res.end()
        }
    });
}

const getItem = ({ req, res, route, feedback = true, callback = () => { } }) => {
    let fields = route[1].split('=')
    let item = undefined
    if (fields.length !== 2) {
        res.writeHead(400)
        res.write(JSON.stringify({ error: 'Error' }));
        res.end()
    } else {
        fields[1] = Number(fields[1]) ? Number(fields[1]) : fields[1]
        let params = {
            TableName: route[0],
            FilterExpression: `${fields[0]} = :value`,
            ExpressionAttributeValues: { ":value": fields[1] }
        };

        docClient.scan(params, function (err, data) {
            if (err) {
                res.writeHead(400)
                res.write(JSON.stringify({ error: err }));
                res.end()
            } else {
                if (data.Items[0]) {
                    if (feedback) {
                        res.writeHead(200)
                        res.write(JSON.stringify(data.Items[0]));
                        res.end()
                    }
                    else {
                        callback(data.Items[0])
                    }


                } else {
                    res.writeHead(404)
                    res.write(JSON.stringify({ error: 'No data found' }))
                    res.end()
                }



            }

        });

    }
}

module.exports = requests;
