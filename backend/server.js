const express = require('express');
const MyRepository = require('./dbRequest');
const app = express();
const cors = require('cors');
const port = 5000;
// const corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200
//
// }
const repository = new MyRepository();
var mas = "1111";
// var mas = [
//     {id: 1, name: "Peter", lastName: "Griffin"},
//     {id: 2, name: "Jack", lastName: "Sparrow"},
//     {id: 3, name: "Steve", lastName: "Smith"}
// ];

app.use(cors());
// app.use(cors(corsOptions));
// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", 'GET,POST,PUT,DELETE,PATCH');
//     next();
// });
app.use(express.json({limit: '1mb'}));

// app.use(function(req, res, next) {
//     var allowedOrigins = '*';
//     // var allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
//     // var origin = req.headers.origin;
//     // if(allowedOrigins.indexOf(origin) > -1) {
//     //     res.setHeader('Access-Control-Allow-Origin', origin);
//     // }
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Credentials', true);
//     return next();
// });

app.listen(port, () => console.log(`Server started on port ${port}`));

app.get('/api/test', async (req, res) => {
    const pkuDataServer = [
        {id: 1, name: "Peter", lastName: "Griffin"},
        {id: 2, name: "Jack", lastName: "Sparrow"},
        {id: 3, name: "Steve", lastName: "Smith"}
    ];
    res.json(pkuDataServer);

});


// app.route('/api/test1')
app.post('/api/test1', async (req, res) => {
    mas = req.body;
    // console.log(req.json(mas));
    // console.log(req.json());
    // console.log(req);
    console.log(mas);
    console.log(req.headers.origin);
    res.send(req.body);
})
app.get('/api/test1', async (req, res) => {
    res.send(mas);
});


app.get('/api/pkuDataServerFirstRoute', async (req, res) => {
    const data = await repository.loadDataForMarkers(1);
    res.json(data);
});

app.get('/api/pkuDataServerSecondRoute', async (req, res) => {
    const data = await repository.loadDataForMarkers(2);
    res.json(data);
});

// app.route('/api/pkuDataServerPKUTable/id')
//     .get(async (req, res) => {
//         const data = await repository.loadDataForTable("ОМТС");
//         res.json(data.rows)
//     })
//     .post(async (req, res) => {
//         res.send(req.body);
//     });

for (let i = 0; i < 40; i++) {
    app.route(`/api/pkuDataServerPKUTable/OMTS/${i}`)
        .get(async (req, res) => {
            const data = await repository.loadDataForTable(i, "ОМТС");
            res.json(data.rows)
        })
        .post(async (req, res) => {
            const data = await repository.uploadDataForTable(i, "ОМТС", req.body);
            res.send(data);
    });
    app.route(`/api/pkuDataServerPKUTable/Montazhniki/Montazhniki1/${i}`)
        .get(async (req, res) => {
            const data = await repository.loadDataForTable(i, "Монтажники1");
            res.json(data.rows);
        })
        .post(async (req, res) => {
            const data = await repository.uploadDataForTable(i, "Монтажники1", req.body);
            res.send(data);
            // res.json(req.body);
        });
    app.route(`/api/pkuDataServerPKUTable/Montazhniki/Montazhniki2/${i}`)
        .get(async (req, res) => {
            const data = await repository.loadDataForTable(i, "Монтажники2");
            res.json(data.rows);
        })
    ;
    app.route(`/api/pkuDataServerPKUTable/PTO/PTO1/${i}`)
        .get(async (req, res) => {
            const data = await repository.loadDataForTable(i, "ПТО1");
            res.json(data.rows);
        })
        .post(async (req, res) => {
            console.log("!!!!!!!!!!!!!!!!!!!!!");
            console.log(req.headers.origin);
            const data = await repository.uploadDataForTable(i, "ПТО1", req.body);
            res.send(data);
    });
    app.route(`/api/pkuDataServerPKUTable/PTO/PTO2/${i}`)
        .get(async (req, res) => {
            const data = await repository.loadDataForTable(i, "ПТО2");
            res.json(data.rows);
        })
        .post(async (req, res) => {
            const data = await repository.uploadDataForTable(i, "ПТО2", req.body);
            // res.send(req.body);
            res.send(data);
    });
    app.get(`/api/pkuDataServerPKUTable/Otchety/Otchety1/${i}`, async (req, res) => {
        const data = await repository.loadDataForTable(i, "Отчеты1");
        res.json(data.rows);
    });
    app.get(`/api/pkuDataServerPKUTable/Otchety/Otchety2/${i}`, async (req, res) => {
        const data = await repository.loadDataForTable(i, "Отчеты2");
        res.json(data.rows);
    });
}

//
// for (let i = 0; i < 40; i++){
//     app.get(`/api/pkuDataServerPKUTable/PTO/${i}`, async (req, res) => {
//         const data = await repository.loadDataForTable(i, "ПТО");
//         res.json(data);
//     });
// }
//

// for (let i = 0; i < 40; i++){
//     app.get(`/api/pkuDataServerPKUTable/Montazhniki/${i}`, async (req, res) => {
//         const data = await repository.loadDataForTable(i, "Монтажники");
//         res.json(data);
//     });
// }

// for (let i = 0; i < 40; i++){
//     app.get(`/api/pkuDataServerPKUTable/Otchety/${i}`, async (req, res) => {
//         const data = await repository.loadDataForTable(i, "Отчеты");
//         res.json(data);
//     });
// }




