const Express = require("express");
// const { restart } = require("nodemon");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
// IMPORT THE JOURNAL MODEL
const { LogModel } = require("../models");

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
});

/*
=====================================
    LOG CREATE
=====================================
*/
router.post('/', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    // JournalModel.create(journalEntry)
});

router.get("/about", (req, res) => {
    res.send("This is the about route!")
});



/*
========================
GET LOGS BY USER
========================
*/
router.get("/", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
========================
GET LOGS BY ID
========================
*/
router.get("/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        };

       let found = await LogModel.findAll(query)
       if (found){
        res.status(200).json(found)
       } else {
           res.status(404).json({
               message: "Log ID not found in database"
           })
       }
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

/*
========================
UPDATE A LOG
========================
*/
router.put("/:id", validateJWT, async (req, res) => {
    try {
    ownerId = req.user.id;
    logId = req.params.id;
    const { description, definition, result } = req.body.log

    const query = {
        where: {
            id: logId,
            owner_id: ownerId
        }
    }

    const updatedLog = {
        description,
        definition,
        result
    }

    const logUpdated = await LogModel.update(updatedLog, query)
    if (logUpdated) res.status(200).json({message: `Log at id ${logId} is now updated`, updatedLog})
    else {
        res.status(404).json({
            message: 'Log ID not found in database'
        })
    }
} catch (error) {
    res.status(500).json({
        message: `Error: ${error}`
    })
}
})

/*
==========================
DELETE A LOG
==========================
*/
router.delete("/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        };

       let deleted = await LogModel.destroy(query)
       if (deleted){
        res.status(200).json({ message: "Log Entry Removed "})
       } else {
           res.status(404).json({
               message: "Log ID not found in database"
           })
       }
    } catch (err) {
        res.status(500).json({ error: err });
    }
})


module.exports = router;