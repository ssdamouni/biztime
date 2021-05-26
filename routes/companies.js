const express = require('express');
const slugify = require('slugify');
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query('SELECT * FROM companies');
        return res.json({companies: results.rows})}
    catch(err){
        next(err);
    }
});

router.get('/:code', async (req, res, next) => {
    try{
        let code =  req.params.code
        const results = await db.query("SELECT * FROM companies WHERE code = $1", [code]);
        if (results.rows.length == 0){
            throw new ExpressError (`Company with code ${code} cannot be found`, 404 )
        }
        return res.send({companies: results.rows})
    } catch(err){
        return next(err)
    }
});

router.post('/', async (req, res, next) => {
    try{
        const { code, name, description } = req.body;
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description])
        return res.status(201).json({user: results.rows[0]})
    } catch(err){
        return next(err);
    }
})

router.patch('/:code', async (req, res, next) => {
    try{
        const {name, description} = req.body;
        const {code} = req.params;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *', [name, description, code])
        return res.json(results.rows[0])
    } catch(err){
        return next(err)
    }
});

router.delete('/:code', async (req, res, next) => {
    try{
        const results = await db.query("DELETE FROM companies WHERE code = $1", [req.params.code]);
        return res.send({msg:"dELETED"})
    } catch(err){
        return next(err)
    }
})

module.exports = router;