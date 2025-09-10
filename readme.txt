>>>  global middleware for req prohibit 2-commom hacking techniques using using "rate-limit" package
1. DDos
2. bruet-Force-Attack 


code : 

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowsMs: 1000 * 60 * 1,
  max:5,
  message:"Too many request from this ip, please try again later..."
});

app.use(limiter)  

__________________________________________________

HAcking techniques : 

3. XSS (cross-site-scripting) >> form me js-code dalna & website ki image of css ko use karna jise site p load bdega bcoz of same url

4. clickjacking : apki website k page, hacker apni website me iframe ki madat s khol leta h and multiple click karane lg  jata

5. MIME-sniffing attack : each req k base pe hacker response ko guess karke use change karne ki kosis karte h

6. information discloser : hacker or normal user can find which technologies you have used to build this application. 

using Security-Headers we can prevent these or we can use "Helmet" package as well

code : 
>> npm i helmet

const helmet = require("helmeet")

app.use(helmet()); //as global middleware

 or

app.use(helmet({
	ContentSecurityPolicy:false,
	xDownloadOptions:false,
}))