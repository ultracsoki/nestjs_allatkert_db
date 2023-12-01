import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2';
import { ujAllatDto } from './ujAllatDTO';
import e, { Response } from 'express';

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'allatkert',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [ adatok ] = await conn.execute('SELECT id, nev, eletkor, fajta FROM allatok');
    console.log(adatok);

    return {
       allatok: adatok, 
      };
  }


  @Get('/ujAllat')
  @Render('ujAllat')
  ujAllatForm() {
    return {messages: ''};
  }

  @Post('/ujAllat')
  @Render('ujAllat')
  async ujAllat(@Body() ujAllat: ujAllatDto, @Res() res: Response) {
    const nev = ujAllat.nev;
    const eletkor = ujAllat.eletkor;
    const fajta = ujAllat.fajta;
    if(nev == "" || eletkor == "" || fajta == "") {
      return { messages: "Minden mezőt kötelező kitölteni!"};
    } else if (parseInt(eletkor) < 0){
      return { messages: "Az életkor nem lehet negatív!"};
    } else {
      const [ adatok ] = await conn.execute('INSERT INTO allatok (nev, eletkor, fajta) VALUES (?, ?, ?)', [ 
        nev,
        eletkor,
        fajta,
      ],
      );
      res.redirect('/');
    }
  }
}
