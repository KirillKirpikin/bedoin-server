const UserModel = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

const generateAccessToken = (id, role) =>{
    return jwt.sign({_id: id, role}, process.env.SECRET_KEY, {expiresIn:'24h'});
}

class AuthController {   
    async registration(req, res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }
            const {username, password, role} = req.body;
            const candidate = await UserModel.findOne({username});
            if(candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            const hashPassword = await bcrypt.hash(password, 7);
            const user = new UserModel({username, password: hashPassword, role});
            await user.save()
            const token = generateAccessToken(user._id, user.role)
            return res.json({token})
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res){
        try {
            const {username, password} = req.body;
            const user = await UserModel.findOne({username})
            if(!user){
                return res.status(400).json({message: `Пользователь с таким ${username} не найден`})
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword){
                return res.status(400).json({message: 'Некорректный login или password'})
            }
            const token = generateAccessToken(user._id, user.role)
            return res.json({token}) 
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'})
        }
    } 

    async check(req, res){ 
        const token = generateAccessToken(req.user._id, req.user.role);
        return res.json({token});
    }
       
}

module.exports = new AuthController();