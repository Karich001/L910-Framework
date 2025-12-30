const path = require("path");
const fs = require("fs");

module.exports = (app) => {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
    app.setErrorHandler((err, req, res) => {
        console.error('Ошибка:', err);
        res.status(500).json({ error: err.message });
    });

    app.get('/druggists', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({error: 'Ошибка чтения файла'});
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.json({data: jsonData.druggists});
            } catch (parseErr) {
                res.status(500).json({error: 'Ошибка парсинга JSON' + parseErr});
            }
            }
        });
    });

    app.get('/druggists/:id', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({error: 'Ошибка чтения файла'});
        } else {
            try {
                const jsonData = JSON.parse(data);
                const druggist = jsonData.druggists.find(d => d.id === req.params.id);
                if(!druggist) return res.status(404).json({ error: 'Не найден 4vak' });
                res.json({data: druggist});
            } catch (parseErr) {
                res.status(500).json({error: 'Ошибка парсинга JSON' + parseErr});
            }
            }
        });
    });

app.post('/druggists', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Ошибка чтения файла' }); }
        try {
            const jsonData = JSON.parse(data);
            console.log(data)
            const newDruggist = req.body;
            jsonData.druggists.push(newDruggist);
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(201).json({ message: '4vak добавлен', druggist: newDruggist });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Ошибка JSON фу: ' + parseErr });
        }
    });
});

app.put('/druggists/:id', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Ошибка чтения файла' }); }
        try {
            const jsonData = JSON.parse(data);
            console.log(data);
            const findedDruggist = jsonData.druggists.find(d => d.id === req.params.id);
            if(findedDruggist){ 
                findedDruggist.id = req.body.id; 
                findedDruggist.name = req.body.name; 
                findedDruggist.experience = req.body.experience;
                findedDruggist.isWorking = req.body.isWorking;
                findedDruggist.educations = req.body.educations;
                findedDruggist.dateOfBirth = req.body.dateOfBirth;
            }
            else return res.status(404).json({ error: 'Не найден 4vak' });
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: '4vak поменялся', druggist: findedDruggist });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Ошибка JSON фу: ' + parseErr });
        }
    });
});

app.patch('/druggists/:id', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Ошибка чтения файла' }); }
        try {
            const jsonData = JSON.parse(data);
            console.log(data)
            const findedDruggist = jsonData.druggists.find(d => d.id === req.params.id);
            if(findedDruggist){ 
                if(req.body.id) findedDruggist.id = req.body.id; 
                if(req.body.name) findedDruggist.name = req.body.name; 
                if(req.body.experience !== undefined) findedDruggist.experience += req.body.experience;
                if(req.body.isWorking !== undefined) findedDruggist.isWorking = req.body.isWorking;
                if(req.body.educations) findedDruggist.educations = req.body.educations;
                findedDruggist.dateOfBirth = new Date().toISOString();
            } else return res.status(404).json({ error: 'Не найден 4vak' });
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: '4vak чтото поменял', druggist: findedDruggist });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Ошибка JSON фу: ' + parseErr });
        }
    });
});

app.delete('/druggists/:id', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Ошибка чтения файла' }); }
        try {
            const jsonData = JSON.parse(data);
            console.log(data);
            const findedDruggist = jsonData.druggists.find(d => d.id === req.params.id);
            if(findedDruggist){ 
                jsonData.druggists = jsonData.druggists.filter(d=>d.id!==req.params.id); 
            }
            else return res.status(404).json({ error: 'Не найден 4vak' });
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: '4vak удалился', druggist: findedDruggist });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Ошибка JSON фу: ' + parseErr });
        }
    });
});

// снизу тоже самое только для clients поцанов и жаби
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
    app.setErrorHandler((err, req, res) => {
        console.error('Ошибка:', err);
        res.status(500).json({ error: err.message });
    });

    app.get('/clients', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({error: 'Ошибка чтения файла'});
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.json({data: jsonData.clients});
            } catch (parseErr) {
                res.status(500).json({error: 'Ошибка парсинга JSON' + parseErr});
            }
            }
        });
    });

    app.get('/clients/:id', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({error: 'Ошибка чтения файла'});
        } else {
            try {
                const jsonData = JSON.parse(data);
                const client = jsonData.clients.find(c => c.id === req.params.id);
                if(!client) return res.status(404).json({ error: 'Не найден 4vak' });
                res.json({data: client});
            } catch (parseErr) {
                res.status(500).json({error: 'Ошибка парсинга JSON' + parseErr});
            }
            }
        });
    });

app.post('/clients', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Ошибка чтения файла' }); }
        try {
            const jsonData = JSON.parse(data);
            console.log(data)
            const newClient = req.body;
            jsonData.clients.push(newClient);
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(201).json({ message: '4vak добавлен', client: newClient });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Ошибка JSON фу: ' + parseErr });
        }
    });
});

app.put('/clients/:id', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Ошибка чтения файла' }); }
        try {
            const jsonData = JSON.parse(data);
            console.log(data);
            const findedClient = jsonData.clients.find(c => c.id === req.params.id);
            if(findedClient){ 
                findedClient.id = req.body.id; 
                findedClient.name = req.body.name; 
                findedClient.age = req.body.age;
                findedClient.isFirstTime = req.body.isFirstTime;
                findedClient.cart = req.body.cart;
                findedClient.lastPurchase = req.body.lastPurchase;
            }
            else return res.status(404).json({ error: 'Не найден 4vak' });
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: '4vak поменялся', client: findedClient });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Ошибка JSON фу: ' + parseErr });
        }
    });
});

app.patch('/clients/:id', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Ошибка чтения файла' }); }
        try {
            const jsonData = JSON.parse(data);
            console.log(data)
            const findedClient = jsonData.clients.find(c => c.id === req.params.id);
            if(findedClient){ 
                if(req.body.id) findedClient.id = req.body.id; 
                if(req.body.name) findedClient.name = req.body.name; 
                if(req.body.age !== undefined) findedClient.age += req.body.age;
                if(req.body.isFirstTime !== undefined) findedClient.isFirstTime = req.body.isFirstTime;
                if(req.body.cart) findedClient.cart = req.body.cart;
                findedClient.lastPurchase = new Date().toISOString();
            } else return res.status(404).json({ error: 'Не найден 4vak' });
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: '4vak чтото поменял', client: findedClient });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Ошибка JSON фу: ' + parseErr });
        }
    });
});

app.delete('/clients/:id', (req, res) => {
    const filePath = path.join(__dirname, 'drugstore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Ошибка чтения файла' }); }
        try {
            const jsonData = JSON.parse(data);
            console.log(data);
            const findedClient = jsonData.clients.find(c => c.id === req.params.id);
            if(findedClient){ 
                jsonData.clients = jsonData.clients.filter(c=>c.id!==req.params.id); 
            }
            else return res.status(404).json({ error: 'Не найден 4vak' });
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: '4vak удалился', client: findedClient });
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Ошибка JSON фу: ' + parseErr });
        }
    });
});
};