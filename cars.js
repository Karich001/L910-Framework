const path = require("path");
const fs = require("fs");

module.exports = (app) => {
    const filePath = path.join(__dirname, 'cars.json');

    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    app.setErrorHandler((err, req, res) => {
        console.error('Ошибка:', err);
        res.status(500).json({ error: err.message });
    });

    const readData = (callback) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return callback(err, null);
            }
            try {
                const jsonData = JSON.parse(data);
                callback(null, jsonData);
            } catch (parseErr) {
                callback(parseErr, null);
            }
        });
    };

    const writeData = (jsonData, res, successCallback) => {
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Ошибка записи файла' });
            }
            successCallback();
        });
    };
    
    app.get('/owners', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            res.json({ data: jsonData.owners });
        });
    });

    app.get('/owners/:id', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const owner = jsonData.owners.find(o => o.id === req.params.id);
            if (!owner) {
                return res.status(404).json({ error: 'Владелец не найден' });
            }
            res.json({ data: owner });
        });
    });

    app.post('/owners', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const newOwner = { ...req.body, registeredAt: new Date().toISOString() };
            jsonData.owners.push(newOwner);
            writeData(jsonData, res, () => {
                res.status(201).json({ message: 'Владелец успешно добавлен', owner: newOwner });
            });
        });
    });

    app.put('/owners/:id', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const ownerIndex = jsonData.owners.findIndex(o => o.id === req.params.id);
            if (ownerIndex === -1) {
                return res.status(404).json({ error: 'Владелец не найден' });
            }
            jsonData.owners[ownerIndex] = { ...jsonData.owners[ownerIndex], ...req.body };
            writeData(jsonData, res, () => {
                res.status(200).json({ message: 'Владелец успешно обновлен', owner: jsonData.owners[ownerIndex] });
            });
        });
    });

    app.patch('/owners/:id', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const ownerIndex = jsonData.owners.findIndex(o => o.id === req.params.id);
            if (ownerIndex === -1) {
                return res.status(404).json({ error: 'Владелец не найден' });
            }
            
            const owner = jsonData.owners[ownerIndex];
            if (req.body.age !== undefined) owner.age += req.body.age;
            if (req.body.name) owner.name = req.body.name;
            if (req.body.hasLicense !== undefined) owner.hasLicense = req.body.hasLicense;
            if (req.body.cars) owner.cars = req.body.cars;
            owner.registeredAt = new Date().toISOString();
            
            writeData(jsonData, res, () => {
                res.status(200).json({ message: 'Владелец частично обновлен', owner });
            });
        });
    });

    app.delete('/owners/:id', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const ownerIndex = jsonData.owners.findIndex(o => o.id === req.params.id);
            if (ownerIndex === -1) {
                return res.status(404).json({ error: 'Владелец не найден' });
            }
            const deletedOwner = jsonData.owners[ownerIndex];
            jsonData.owners.splice(ownerIndex, 1);
            
            writeData(jsonData, res, () => {
                res.status(200).json({ message: 'Владелец успешно удален', owner: deletedOwner });
            });
        });
    });

    app.get('/cars', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            res.json({ data: jsonData.cars });
        });
    });

    app.get('/cars/:id', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const car = jsonData.cars.find(c => c.id === req.params.id);
            if (!car) {
                return res.status(404).json({ error: 'Автомобиль не найден' });
            }
            res.json({ data: car });
        });
    });

    app.post('/cars', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const newCar = { ...req.body, manufacturedAt: new Date().toISOString() };
            jsonData.cars.push(newCar);
            writeData(jsonData, res, () => {
                res.status(201).json({ message: 'Автомобиль успешно добавлен', car: newCar });
            });
        });
    });

    app.put('/cars/:id', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const carIndex = jsonData.cars.findIndex(c => c.id === req.params.id);
            if (carIndex === -1) {
                return res.status(404).json({ error: 'Автомобиль не найден' });
            }
            jsonData.cars[carIndex] = { ...jsonData.cars[carIndex], ...req.body };
            writeData(jsonData, res, () => {
                res.status(200).json({ message: 'Автомобиль успешно обновлен', car: jsonData.cars[carIndex] });
            });
        });
    });

    app.patch('/cars/:id', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const carIndex = jsonData.cars.findIndex(c => c.id === req.params.id);
            if (carIndex === -1) {
                return res.status(404).json({ error: 'Автомобиль не найден' });
            }
            
            const car = jsonData.cars[carIndex];
            if (req.body.year !== undefined) car.year += req.body.year;
            if (req.body.model) car.model = req.body.model;
            if (req.body.isElectric !== undefined) car.isElectric = req.body.isElectric;
            if (req.body.features) car.features = req.body.features;
            car.manufacturedAt = new Date().toISOString();
            
            writeData(jsonData, res, () => {
                res.status(200).json({ message: 'Автомобиль частично обновлен', car });
            });
        });
    });

    app.delete('/cars/:id', (req, res) => {
        readData((err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка чтения файла' });
            }
            const carIndex = jsonData.cars.findIndex(c => c.id === req.params.id);
            if (carIndex === -1) {
                return res.status(404).json({ error: 'Автомобиль не найден' });
            }
            const deletedCar = jsonData.cars[carIndex];
            jsonData.cars.splice(carIndex, 1);
            
            writeData(jsonData, res, () => {
                res.status(200).json({ message: 'Автомобиль успешно удален', car: deletedCar });
            });
        });
    });
};
