const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query('SELECT * FROM industries');
        return res.json({industries: results.rows})}
    catch(err){
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try{
        const { code, industry } = req.body;
        const results = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *', [code, industry])
        return res.status(201).json({industry: results.rows[0]})
    } catch(err){
        return next(err);
    }
});

router.post('/:code', async (req, res, next) => {
    try{
        let company_code = req.params.code
        const { industry_code } = req.body;
        const results = await db.query('INSERT INTO company_industries (company_code, industry_code) VALUES ($1, $2) RETURNING *', [company_code, industry_code])
        return res.status(201).json({company_industry: results.rows[0]})
    } catch(err){
        return next(err);
    }
});

module.exports = router;
