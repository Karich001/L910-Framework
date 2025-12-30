const fs = require("fs");
const path = require("path");

module.exports = (app) => {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
    app.setErrorHandler((err, req, res) => {
        console.error('Ошибка:', err);
        return res.status(500).json({ error: err.message });
    });



    app.get('/tuorAgenstva', (req, res) => {
    const file = path.join(__dirname, 'tuorAgenstvo.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err)
        {
            return res.status(500).json({error: 'Не получилось прочесть файл'});
        } 
        else {
            try {
                const JsonData = JSON.parse(data);
                res.json({data: JsonData.tuorAgentstva});
            } catch (Err) {
                return res.status(500).json({error: 'Не удача парсинга' + Err});
            }
            }
        });
    });



    app.get('/hotels', (req, res) => {
    const file = path.join(__dirname, 'Hotel.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err)
        {
            return res.status(500).json({error: 'Не получилось прочесть файл'});
        } 
        else {
            try {
                const JsonData = JSON.parse(data);
                res.json({data: JsonData.Hotels});
            } catch (Err) {
                return res.status(500).json({error: 'Не удача парсинга' + Err});
            }
            }
        });
    });



    app.get('/tuorAgenstva/:id', (req, res) => {
    const file = path.join(__dirname, 'tuorAgenstvo.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) 
        {
            return res.status(500).json({error: 'Не получилось прочесть файл'});
        }
        else {
            try {
                const JsonData = JSON.parse(data);
                const agenstvo = JsonData.tuorAgentstva.find(t => t.id === req.params.id);
                if(!agenstvo) return res.status(404).json({ error: 'Такого турагентства нету'});
                res.json({data: agenstvo});
            } catch (Err) {
                return res.status(500).json({error: 'Не удача парсинга' + Err});
            }
            }
        });
    });



    app.get('/hotels/:id', (req, res) => {
    const file = path.join(__dirname, 'Hotel.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) 
        {
            return res.status(500).json({error: 'Не получилось прочесть файл'});
        }
        else {
            try {
                const JsonData = JSON.parse(data);
                const hotel = JsonData.Hotels.find(t => t.id === req.params.id);
                if(!hotel) return res.status(404).json({ error: 'Такого отеля нету'});
                res.json({data: hotel});
            } catch (Err) {
                return res.status(500).json({error: 'Не удача парсинга' + Err});
            }
            }
        });
    });



    app.post('/tuorAgenstva', (req, res) => {
    const file = path.join(__dirname, 'tuorAgenstvo.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err)
        { 
            return res.status(500).json({ error: 'Не удалось прочесть файл' });
        }
        try {
            const JsonData = JSON.parse(data);
            const newAgentstvo = req.body;
            JsonData.tuorAgentstva.push(newAgentstvo);
            fs.writeFile(file, JSON.stringify(JsonData, null, 4), 'utf8', (Err) => {
                if (Err)
                {
                    return res.status(500).json({ error: 'Не удалось записать в файл' });
                }
                res.status(201).json({ message: 'турагентство добавлено', tuorAgenstva: newAgentstvo });
            });
        } catch (Err) {
            return res.status(500).json({ error: 'Не удача парсинга' + Err });
        }
    });
    });



    app.post('/hotels', (req, res) => {
    const file = path.join(__dirname, 'Hotel.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err)
        { 
            return res.status(500).json({ error: 'Не удалось прочесть файл' });
        }
        try {
            const JsonData = JSON.parse(data);
            const newHotel = req.body;
            JsonData.Hotels.push(newHotel);
            fs.writeFile(file, JSON.stringify(JsonData, null, 4), 'utf8', (Err) => {
                if (Err)
                {
                    return res.status(500).json({ error: 'Не удалось записать в файл' });
                }
                res.status(201).json({ message: 'отель добавлен', hotels: newHotel });
            });
        } catch (Err) {
            return res.status(500).json({ error: 'Не удача парсинга' + Err });
        }
    });
    });




    app.put('/tuorAgenstva/:id', (req, res) => {
    const file = path.join(__dirname, 'tuorAgenstvo.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err)
        { 
            return res.status(500).json({ error: 'Не удалось прочесть файл' }); 
        }
        try {
            const JsonData = JSON.parse(data);
            const index = JsonData.tuorAgentstva.findIndex(t => t.id === req.params.id);
            if(index!==-1)
            { 
                JsonData.tuorAgentstva[index]=req.body;
            }
            else return res.status(404).json({ error: 'Такого агентства нету' });
            fs.writeFile(file, JSON.stringify(JsonData, null, 4), 'utf8', (Err) => {
                if (Err)
                {
                    return res.status(500).json({ error: 'Не удалось записать в файл' });
                }
                res.status(200).json({ message: 'Поменли значения агентства', tuorAgentstva: findAgentstvo });
            });
        } catch (Err) {
            return res.status(500).json({ error: 'Не удача парсинга' + Err });
        }
    });
    });



    app.put('/hotels/:id', (req, res) => {
    const file = path.join(__dirname, 'Hotel.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err)
        { 
            return res.status(500).json({ error: 'Не удалось прочесть файл' }); 
        }
        try {
            const JsonData = JSON.parse(data);
            const index = JsonData.Hotels.findIndex(t => t.id === req.params.id);
            if(index!==-1)
            { 
                JsonData.Hotels[index]=req.body;
            }
            else return res.status(404).json({ error: 'Такого отеля нету' });
            fs.writeFile(file, JSON.stringify(JsonData, null, 4), 'utf8', (Err) => {
                if (Err)
                {
                    return res.status(500).json({ error: 'Не удалось записать в файл' });
                }
                res.status(200).json({ message: 'Поменли значения отеля', Hotels: findHotel });
            });
        } catch (Err) {
            return res.status(500).json({ error: 'Не удача парсинга' + Err });
        }
    });
    });



    app.patch('/tuorAgenstva/:id', (req, res) => {
    const file = path.join(__dirname, 'tuorAgenstvo.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err)
        { 
            return res.status(500).json({ error: 'Не удалось прочесть файл' }); 
        }
        try {
            const JsonData = JSON.parse(data);
            const findAgentstvo = JsonData.tuorAgentstva.find(t => t.id === req.params.id);
            if(findAgentstvo)
            { 
                if(req.body.id)findAgentstvo.id = req.body.id; 
                if(req.body.name)findAgentstvo.name = req.body.name;
                if(req.body.IsWork)findAgentstvo.IsWork = req.body.IsWork;
                if(req.body.DateRegistr)findAgentstvo.DateRegistr = req.body.DateRegistr;
                if(req.body.Emails)findAgentstvo.Emails = req.body.Emails;
            } else return res.status(404).json({ error: 'Такого агентства нету' });
            fs.writeFile(file, JSON.stringify(JsonData, null, 4), 'utf8', (Err) => {
                if (Err)
                {
                    return res.status(500).json({ error: 'Не удалось записать в файл' });
                }
                res.status(200).json({ message: 'поменяли значение у турагентства', tuorAgentstva: findAgentstvo });
            });
        } catch (Err) {
            res.status(500).json({ error: 'Не удача парсинга: ' + Err });
        }
    });
    });



    app.patch('/hotels/:id', (req, res) => {
    const file = path.join(__dirname, 'Hotel.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err)
        { 
            return res.status(500).json({ error: 'Не удалось прочесть файл' }); 
        }
        try {
            const JsonData = JSON.parse(data);
            const findHotel = JsonData.Hotels.find(t => t.id === req.params.id);
            if(findHotel)
            { 
                if(req.body.id)findHotel.id = req.body.id; 
                if(req.body.name)findHotel.name = req.body.name;
                if(req.body.IsAllInclusive)findHotel.IsAllInclusive = req.body.IsAllInclusive;
                if(req.body.DateOpening)findHotel.DateOpening = req.body.DateOpening;
                if(req.body.Services)findHotel.Services = req.body.Services;
            } else return res.status(404).json({ error: 'Такого отеля нету' });
            fs.writeFile(file, JSON.stringify(JsonData, null, 4), 'utf8', (Err) => {
                if (Err)
                {
                    return res.status(500).json({ error: 'Не удалось записать в файл' });
                }
                res.status(200).json({ message: 'поменяли значение у отеля', Hotels: findHotel });
            });
        } catch (Err) {
            res.status(500).json({ error: 'Не удача парсинга: ' + Err });
        }
    });
    });



    app.delete('/tuorAgenstva/:id', (req, res) => { 
    const file = path.join(__dirname, 'tuorAgenstvo.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) 
        { 
            return res.status(500).json({ error: 'Не удалось прочесть файл' });
        }
        try {
            const JsonData = JSON.parse(data);
            const findAgentstvo = JsonData.tuorAgentstva.find(t => t.id === req.params.id);
            if(findAgentstvo)
            { 
                const newJsonData=JsonData.tuorAgentstva.filter(t=>t.id!==req.params.id);
                JsonData.tuorAgentstva=newJsonData;
            }
            else return res.status(404).json({ error: 'Такого агентства нету' });
            fs.writeFile(file, JSON.stringify(JsonData, null, 4), 'utf8', (Err) => {
                if (Err) {
                    return res.status(500).json({ error: 'Не удалось записать файл' });
                }
                res.status(200).json({ message: 'Турагентство удалено', tuorAgentstva: findAgentstvo });
            });
        } catch (Err) {
            res.status(500).json({ error: 'Не удача парсинга: ' + Err });
        }
    });
    });



    app.delete('/hotels/:id', (req, res) => {
    const file = path.join(__dirname, 'Hotel.json');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) 
        { 
            return res.status(500).json({ error: 'Не удалось прочесть файл' });
        }
        try {
            const JsonData = JSON.parse(data);
            const findHotel = JsonData.Hotels.find(t => t.id === req.params.id);
            if(findHotel)
            { 
                const newJsonData=JsonData.Hotels.filter(t=>t.id!==req.params.id);
                JsonData.Hotels=newJsonData;
            }
            else return res.status(404).json({ error: 'Такого отеля нету' });
            fs.writeFile(file, JSON.stringify(JsonData, null, 4), 'utf8', (Err) => {
                if (Err) {
                    return res.status(500).json({ error: 'Не удалось записать файл' });
                }
                res.status(200).json({ message: 'Отель удалён', Hotels: findHotel });
            });
        } catch (Err) {
            res.status(500).json({ error: 'Не удача парсинга: ' + Err });
        }
    });
    });
};