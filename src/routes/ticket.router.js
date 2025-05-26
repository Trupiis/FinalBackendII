import express from 'express';
import { getTickets, getTicketById, getTicketByCode, createTicket } from '../controller/ticket.controller.js';
import passport from 'passport';
import authorize from '../middlewares/authorization.js';
import { isAuth } from '../middlewares/auth.js';

const router = express.Router();

const JWTauth = isAuth;

router.post('/', JWTauth, createTicket);

router.get('/', JWTauth, authorize('admin'), getTickets); 
router.get('/:tid', JWTauth, getTicketById); 
router.get('/by-code/:code', JWTauth, getTicketByCode); 

export default router;
