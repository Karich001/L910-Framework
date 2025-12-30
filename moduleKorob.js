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

    app.get('/Worker', (req, res) => {
        const filePath = path.join(__dirname, 'Worker.json');
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                return res.status(500).json({ error: 'ReadFile error' });
            }
            try {
                const jsonData = JSON.parse(data);
                const workers = jsonData.Worker || [];
                res.json({ data: workers });
            } catch (error) {
                res.status(500).json({ error: 'Getting workers list error' });
            }
        });
    });

    app.get('/Worker/:id', (req, res) => {
        const filePath = path.join(__dirname, 'Worker.json');
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                return res.status(500).json({ error: 'ReadFile error' });
            }
            try {
                const workerId = parseInt(req.params.id);
                const jsonData = JSON.parse(data);
                
                let workersArray;
                if (jsonData.Worker) {
                    workersArray = jsonData.Worker;
                } else if (Array.isArray(jsonData)) {
                    workersArray = jsonData;
                } else {
                    workersArray = [];
                }
                
                const worker = workersArray.find(t => t.id == workerId);
                if (!worker) {
                    return res.status(404).json({ error: 'Worker not found' });
                }
                res.status(200).json(worker);
            } catch (error) {
                res.status(500).json({ error: 'Getting workers list error' });
            }
        });
    });

    function createRandomData() {
        const names = ["Толя", "Оля", "Коля"];
        const skillss = ["Валятся на диване", "Пить пиво", "Спать", "Есть", "существовать"];
        return {
            id: Math.floor(Math.random() * (1000 - 1) + 1),
            name: names[Math.floor(Math.random() * names.length)],
            isActive: Math.floor(Math.random() * 1) == 1 ? true : false,
            hireDate: Date.now(),
            skills: skillss[Math.floor(Math.random() * skillss.length)],
            phoneNumbers: Math.floor(Math.random() * (99999999999 - 1) + 1)
        };
    }

    app.post('/Worker', (req, res) => {
        const filePath = path.join(__dirname, 'Worker.json');
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                return res.status(500).json({ error: 'ReadFile error' });
            }
            try {
                let newWorker = createRandomData();
                let jsonData = JSON.parse(data);
                
                if (!jsonData.Worker) {
                    jsonData.Worker = [];
                }
                
                jsonData.Worker.push(newWorker);
                
                fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        return res.status(500).json({ error: 'Ошибка записи файла' });
                    }
                    res.status(201).json({ message: 'Worker successfully created', Worker: newWorker });
                });
            } catch (error) {
                console.error("Create worker error:", error);
                res.status(500).json({ error: 'Create worker error' + error.message });
            }
        });
    });

    app.put('/Worker/:id', (req, res) => {
        const filePath = path.join(__dirname, 'Worker.json');
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                return res.status(500).json({ error: 'ReadFile error' });
            }
            try {
                let newWorker = createRandomData();
                let jsonData = JSON.parse(data);
                
                if (!jsonData.Worker) {
                    jsonData.Worker = [];
                }
                
                const findWorker = jsonData.Worker.find(p => p.id == req.params.id);
                if (!findWorker) {
                    return res.status(404).json({ error: 'Not found' });
                }
                
                findWorker.id = findWorker.id;
                findWorker.name = newWorker.name;
                findWorker.isActive = newWorker.isActive;
                findWorker.hireDate = newWorker.hireDate;
                findWorker.skills = newWorker.skills;
                findWorker.phoneNumbers = newWorker.phoneNumbers;
                
                fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        return res.status(500).json({ error: 'Ошибка записи файла' });
                    }
                    res.status(200).json({ message: 'Worker successfully updated', Worker: findWorker });
                });
            } catch (error) {
                console.error("Update worker error:", error);
                res.status(500).json({ error: 'Update worker error' + error.message });
            }
        });
    });

    app.patch('/Worker/:id', (req, res) => {
        const filePath = path.join(__dirname, 'Worker.json');
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                return res.status(500).json({ error: 'ReadFile error' });
            }
            try {
                const workerId = parseInt(req.params.id);
                let jsonData = JSON.parse(data);
                
                if (!jsonData.Worker) {
                    jsonData.Worker = [];
                }
                
                const findWorker = jsonData.Worker.find(p => p.id == workerId);
                if (!findWorker) {
                    return res.status(404).json({ error: 'Not found' });
                }
                
                if (req.body.id) findWorker.id = req.body.id;
                if (req.body.name) findWorker.name = req.body.name;
                if (req.body.isActive !== undefined) findWorker.isActive = req.body.isActive;
                if (req.body.hireDate) findWorker.hireDate = req.body.hireDate;
                if (req.body.skills) findWorker.skills = req.body.skills;
                if (req.body.phoneNumbers) findWorker.phoneNumbers = req.body.phoneNumbers;
                
                fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        return res.status(500).json({ error: 'Ошибка записи файла' });
                    }
                    res.status(200).json({ message: 'Successfully changed', Worker: findWorker });
                });
            } catch (error) {
                console.error("error:", error);
                res.status(500).json({ error: 'error' + error.message });
            }
        });
    });

    app.delete('/Worker/:id', (req, res) => {
        const filePath = path.join(__dirname, 'Worker.json');
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                return res.status(500).json({ error: 'ReadFile error' });
            }
            try {
                const workerId = parseInt(req.params.id);
                let jsonData = JSON.parse(data);
                
                if (!jsonData.Worker) {
                    jsonData.Worker = [];
                }
                
                const findWorker = jsonData.Worker.find(p => p.id == workerId);
                if (!findWorker) {
                    return res.status(404).json({ error: 'Not found' });
                }
                
                jsonData.Worker = jsonData.Worker.filter(p => p.id != workerId);
                
                fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        return res.status(500).json({ error: 'Ошибка записи файла' });
                    }
                    res.status(200).json({ message: 'Successfully deleted', Worker: findWorker });
                });
            } catch (error) {
                console.error("error:", error);
                res.status(500).json({ error: 'error' + error.message });
            }
        });
    });
///  йоу если вы не поняли то снизу машины а все на английском чтобы навязать вам мнение о том что все здесь написано нейронкой но это мой гнусный и хитрый план хахахахах
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
    app.setErrorHandler((err, req, res) => {
        console.error('Ошибка:', err);
        res.status(500).json({ error: err.message });
    });

app.get('/Machine', (req, res) => {
    const filePath = path.join(__dirname, 'Machine.json');
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json({ error: 'ReadFile error' });
        }
        try {
            const jsonData = JSON.parse(data);
            const machines = jsonData.Machine || [];
            res.json({ data: machines });
        } catch (error) {
            res.status(500).json({ error: 'Getting machines list error' });
        }
    });
});

app.get('/Machine/:id', (req, res) => {
    const filePath = path.join(__dirname, 'Machine.json');
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json({ error: 'ReadFile error' });
        }
        try {
            const machineId = parseInt(req.params.id);
            const jsonData = JSON.parse(data);
            
            let machinesArray;
            if (jsonData.Machine) {
                machinesArray = jsonData.Machine;
            } else if (Array.isArray(jsonData)) {
                machinesArray = jsonData;
            } else {
                machinesArray = [];
            }
            
            const machine = machinesArray.find(t => t.id == machineId);
            if (!machine) {
                return res.status(404).json({ error: 'Machine not found' });
            }
            res.status(200).json(machine);
        } catch (error) {
            res.status(500).json({ error: 'Getting machines list error' });
        }
    });
});

function createRandomDataM() {
    const models = ["Фрезерный", "Токарный", "Суперкрутой"];
    const maintenanceHistorys = ["никогда", "вчера", "я подумаю", "забыл", "не уверен"];
    return {
        id: Math.floor(Math.random() * (1000 - 1) + 1),
        model: models[Math.floor(Math.random() * models.length)],
        isActive: Math.floor(Math.random() * 1) == 1 ? true : false,
        lastMaintenance: Date.now(),
        maintenanceHistory: maintenanceHistorys[Math.floor(Math.random() * maintenanceHistorys.length)],
        errorCodes: Math.floor(Math.random() * (500 - 100) + 100)
    };
}

app.post('/Machine', (req, res) => {
    const filePath = path.join(__dirname, 'Machine.json');
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json({ error: 'ReadFile error' });
        }
        try {
            let newMachine = createRandomDataM();
            let jsonData = JSON.parse(data);
            
            if (!jsonData.Machine) {
                jsonData.Machine = [];
            }
            
            jsonData.Machine.push(newMachine);
            
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(201).json({ message: 'Machine successfully created', Machine: newMachine });
            });
        } catch (error) {
            console.error("Create machine error:", error);
            res.status(500).json({ error: 'Create machine error' + error.message });
        }
    });
});

app.put('/Machine/:id', (req, res) => {
    const filePath = path.join(__dirname, 'Machine.json');
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json({ error: 'ReadFile error' });
        }
        try {
            let newMachine = createRandomDataM();
            let jsonData = JSON.parse(data);
            
            if (!jsonData.Machine) {
                jsonData.Machine = [];
            }
            
            const findMachine = jsonData.Machine.find(p => p.id == req.params.id);
            if (!findMachine) {
                return res.status(404).json({ error: 'Not found' });
            }
            
            findMachine.id = findMachine.id;
            findMachine.model = newMachine.model;
            findMachine.isActive = newMachine.isActive;
            findMachine.lastMaintenance = newMachine.lastMaintenance;
            findMachine.maintenanceHistory = newMachine.maintenanceHistory;
            findMachine.errorCodes = newMachine.errorCodes;
            
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: 'Machine successfully updated', Machine: findMachine });
            });
        } catch (error) {
            console.error("Update machine error:", error);
            res.status(500).json({ error: 'Update machine error' + error.message });
        }
    });
});

app.patch('/Machine/:id', (req, res) => {
    const filePath = path.join(__dirname, 'Machine.json');
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json({ error: 'ReadFile error' });
        }
        try {
            const machineId = parseInt(req.params.id);
            let jsonData = JSON.parse(data);
            
            if (!jsonData.Machine) {
                jsonData.Machine = [];
            }
            
            const findMachine = jsonData.Machine.find(p => p.id == machineId);
            if (!findMachine) {
                return res.status(404).json({ error: 'Not found' });
            }
            
            if (req.body.id) findMachine.id = req.body.id;
            if (req.body.model) findMachine.model = req.body.model;
            if (req.body.isActive !== undefined) findMachine.isActive = req.body.isActive;
            if (req.body.lastMaintenance) findMachine.lastMaintenance = req.body.lastMaintenance;
            if (req.body.maintenanceHistory) findMachine.maintenanceHistory = req.body.maintenanceHistory;
            if (req.body.errorCodes) findMachine.errorCodes = req.body.errorCodes;
            
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: 'Successfully changed', Machine: findMachine });
            });
        } catch (error) {
            console.error("error:", error);
            res.status(500).json({ error: 'error' + error.message });
        }
    });
});

app.delete('/Machine/:id', (req, res) => {
    const filePath = path.join(__dirname, 'Machine.json');
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json({ error: 'ReadFile error' });
        }
        try {
            const machineId = parseInt(req.params.id);
            let jsonData = JSON.parse(data);
            
            if (!jsonData.Machine) {
                jsonData.Machine = [];
            }
            
            const findMachine = jsonData.Machine.find(p => p.id == machineId);
            if (!findMachine) {
                return res.status(404).json({ error: 'Not found' });
            }
            
            jsonData.Machine = jsonData.Machine.filter(p => p.id != machineId);
            
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Ошибка записи файла' });
                }
                res.status(200).json({ message: 'Successfully deleted', Machine: findMachine });
            });
        } catch (error) {
            console.error("error:", error);
            res.status(500).json({ error: 'error' + error.message });
        }
    });
});
};