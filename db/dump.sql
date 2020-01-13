PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Product2Sales" (
	"SalesID"	INTEGER,
	"ProductID"	INTEGER,
	PRIMARY KEY("SalesID","ProductID"),
	FOREIGN KEY("SalesID") REFERENCES "Sales"("ID"),
	FOREIGN KEY("ProductID") REFERENCES "Product"("ID")
);
INSERT INTO Product2Sales VALUES(1001,1);
INSERT INTO Product2Sales VALUES(1001,16);
INSERT INTO Product2Sales VALUES(1001,39);
INSERT INTO Product2Sales VALUES(1002,40);
INSERT INTO Product2Sales VALUES(1002,2);
INSERT INTO Product2Sales VALUES(1002,7);
INSERT INTO Product2Sales VALUES(1002,34);
INSERT INTO Product2Sales VALUES(1002,47);
INSERT INTO Product2Sales VALUES(1002,61);
CREATE TABLE IF NOT EXISTS "Sales" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"NetPrice"	REAL,
	"FileName"	TEXT,
	"VATID"	INTEGER NOT NULL,
	"Title"	TEXT, 
	"Details" TEXT
);
INSERT INTO Sales VALUES(1001,394.54,'Winter.jpg',1,'The AWESOME Winter Sale','Enjoy this cold time of the year with the pictures. They will show you how awesome the cold days can be!');
INSERT INTO Sales VALUES(1002,747.54,'Sports.jpg',1,'Let''s do some sports!','HAPPY NEW YEAR! To motivate yourself to do some sports buy this amazing motivation package to see, what you can reach with doing some sport!');
CREATE TABLE IF NOT EXISTS "Product2Tags" (
	"ProductID"	INTEGER NOT NULL,
	"TagID"	INTEGER NOT NULL,
	FOREIGN KEY("TagID") REFERENCES "Tags"("ID"),
	PRIMARY KEY("ProductID","TagID"),
	FOREIGN KEY("ProductID") REFERENCES "Product"("ID")
);
INSERT INTO Product2Tags VALUES(1,8);
INSERT INTO Product2Tags VALUES(1,10);
INSERT INTO Product2Tags VALUES(1,9);
INSERT INTO Product2Tags VALUES(2,14);
INSERT INTO Product2Tags VALUES(2,10);
INSERT INTO Product2Tags VALUES(2,16);
INSERT INTO Product2Tags VALUES(2,8);
INSERT INTO Product2Tags VALUES(2,11);
INSERT INTO Product2Tags VALUES(3,18);
INSERT INTO Product2Tags VALUES(3,8);
INSERT INTO Product2Tags VALUES(3,19);
INSERT INTO Product2Tags VALUES(3,2);
INSERT INTO Product2Tags VALUES(4,8);
INSERT INTO Product2Tags VALUES(4,7);
INSERT INTO Product2Tags VALUES(5,7);
INSERT INTO Product2Tags VALUES(6,8);
INSERT INTO Product2Tags VALUES(6,10);
INSERT INTO Product2Tags VALUES(6,9);
INSERT INTO Product2Tags VALUES(7,16);
INSERT INTO Product2Tags VALUES(7,9);
INSERT INTO Product2Tags VALUES(7,12);
INSERT INTO Product2Tags VALUES(7,11);
INSERT INTO Product2Tags VALUES(8,18);
INSERT INTO Product2Tags VALUES(8,8);
INSERT INTO Product2Tags VALUES(9,7);
INSERT INTO Product2Tags VALUES(10,14);
INSERT INTO Product2Tags VALUES(10,10);
INSERT INTO Product2Tags VALUES(10,9);
INSERT INTO Product2Tags VALUES(10,8);
INSERT INTO Product2Tags VALUES(10,11);
INSERT INTO Product2Tags VALUES(11,5);
INSERT INTO Product2Tags VALUES(11,8);
INSERT INTO Product2Tags VALUES(11,9);
INSERT INTO Product2Tags VALUES(12,3);
INSERT INTO Product2Tags VALUES(12,8);
INSERT INTO Product2Tags VALUES(13,4);
INSERT INTO Product2Tags VALUES(13,7);
INSERT INTO Product2Tags VALUES(14,8);
INSERT INTO Product2Tags VALUES(14,19);
INSERT INTO Product2Tags VALUES(14,17);
INSERT INTO Product2Tags VALUES(15,8);
INSERT INTO Product2Tags VALUES(15,17);
INSERT INTO Product2Tags VALUES(15,9);
INSERT INTO Product2Tags VALUES(16,8);
INSERT INTO Product2Tags VALUES(16,10);
INSERT INTO Product2Tags VALUES(16,9);
INSERT INTO Product2Tags VALUES(17,8);
INSERT INTO Product2Tags VALUES(17,19);
INSERT INTO Product2Tags VALUES(17,2);
INSERT INTO Product2Tags VALUES(18,11);
INSERT INTO Product2Tags VALUES(18,16);
INSERT INTO Product2Tags VALUES(18,12);
INSERT INTO Product2Tags VALUES(19,8);
INSERT INTO Product2Tags VALUES(19,17);
INSERT INTO Product2Tags VALUES(20,7);
INSERT INTO Product2Tags VALUES(21,5);
INSERT INTO Product2Tags VALUES(21,16);
INSERT INTO Product2Tags VALUES(21,7);
INSERT INTO Product2Tags VALUES(22,8);
INSERT INTO Product2Tags VALUES(22,17);
INSERT INTO Product2Tags VALUES(23,8);
INSERT INTO Product2Tags VALUES(23,17);
INSERT INTO Product2Tags VALUES(24,16);
INSERT INTO Product2Tags VALUES(25,4);
INSERT INTO Product2Tags VALUES(25,7);
INSERT INTO Product2Tags VALUES(26,2);
INSERT INTO Product2Tags VALUES(27,8);
INSERT INTO Product2Tags VALUES(27,19);
INSERT INTO Product2Tags VALUES(27,2);
INSERT INTO Product2Tags VALUES(28,5);
INSERT INTO Product2Tags VALUES(28,8);
INSERT INTO Product2Tags VALUES(28,9);
INSERT INTO Product2Tags VALUES(29,18);
INSERT INTO Product2Tags VALUES(29,8);
INSERT INTO Product2Tags VALUES(30,2);
INSERT INTO Product2Tags VALUES(31,8);
INSERT INTO Product2Tags VALUES(31,19);
INSERT INTO Product2Tags VALUES(31,2);
INSERT INTO Product2Tags VALUES(32,3);
INSERT INTO Product2Tags VALUES(32,5);
INSERT INTO Product2Tags VALUES(33,16);
INSERT INTO Product2Tags VALUES(34,11);
INSERT INTO Product2Tags VALUES(34,16);
INSERT INTO Product2Tags VALUES(34,12);
INSERT INTO Product2Tags VALUES(35,8);
INSERT INTO Product2Tags VALUES(35,19);
INSERT INTO Product2Tags VALUES(35,2);
INSERT INTO Product2Tags VALUES(36,3);
INSERT INTO Product2Tags VALUES(37,18);
INSERT INTO Product2Tags VALUES(37,8);
INSERT INTO Product2Tags VALUES(37,16);
INSERT INTO Product2Tags VALUES(38,1);
INSERT INTO Product2Tags VALUES(38,8);
INSERT INTO Product2Tags VALUES(38,9);
INSERT INTO Product2Tags VALUES(39,8);
INSERT INTO Product2Tags VALUES(39,10);
INSERT INTO Product2Tags VALUES(39,9);
INSERT INTO Product2Tags VALUES(40,13);
INSERT INTO Product2Tags VALUES(40,11);
INSERT INTO Product2Tags VALUES(40,16);
INSERT INTO Product2Tags VALUES(41,17);
INSERT INTO Product2Tags VALUES(42,18);
INSERT INTO Product2Tags VALUES(42,8);
INSERT INTO Product2Tags VALUES(42,2);
INSERT INTO Product2Tags VALUES(42,17);
INSERT INTO Product2Tags VALUES(43,20);
INSERT INTO Product2Tags VALUES(44,15);
INSERT INTO Product2Tags VALUES(44,16);
INSERT INTO Product2Tags VALUES(45,5);
INSERT INTO Product2Tags VALUES(45,6);
INSERT INTO Product2Tags VALUES(46,18);
INSERT INTO Product2Tags VALUES(46,8);
INSERT INTO Product2Tags VALUES(47,14);
INSERT INTO Product2Tags VALUES(47,10);
INSERT INTO Product2Tags VALUES(47,16);
INSERT INTO Product2Tags VALUES(47,9);
INSERT INTO Product2Tags VALUES(47,11);
INSERT INTO Product2Tags VALUES(48,1);
INSERT INTO Product2Tags VALUES(48,8);
INSERT INTO Product2Tags VALUES(48,6);
INSERT INTO Product2Tags VALUES(48,9);
INSERT INTO Product2Tags VALUES(49,18);
INSERT INTO Product2Tags VALUES(49,8);
INSERT INTO Product2Tags VALUES(50,1);
INSERT INTO Product2Tags VALUES(50,8);
INSERT INTO Product2Tags VALUES(50,9);
INSERT INTO Product2Tags VALUES(52,8);
INSERT INTO Product2Tags VALUES(52,19);
INSERT INTO Product2Tags VALUES(52,2);
INSERT INTO Product2Tags VALUES(53,1);
INSERT INTO Product2Tags VALUES(53,8);
INSERT INTO Product2Tags VALUES(54,5);
INSERT INTO Product2Tags VALUES(55,5);
INSERT INTO Product2Tags VALUES(55,8);
INSERT INTO Product2Tags VALUES(55,9);
INSERT INTO Product2Tags VALUES(56,5);
INSERT INTO Product2Tags VALUES(56,9);
INSERT INTO Product2Tags VALUES(57,6);
INSERT INTO Product2Tags VALUES(58,15);
INSERT INTO Product2Tags VALUES(58,2);
INSERT INTO Product2Tags VALUES(59,8);
INSERT INTO Product2Tags VALUES(59,2);
INSERT INTO Product2Tags VALUES(60,8);
INSERT INTO Product2Tags VALUES(60,9);
INSERT INTO Product2Tags VALUES(61,11);
INSERT INTO Product2Tags VALUES(61,16);
INSERT INTO Product2Tags VALUES(62,3);
INSERT INTO Product2Tags VALUES(62,7);
INSERT INTO Product2Tags VALUES(63,15);
INSERT INTO Product2Tags VALUES(63,3);
CREATE TABLE IF NOT EXISTS "Product" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"Title"	TEXT NOT NULL,
	"VATID"	INTEGER NOT NULL,
	"Details"	TEXT DEFAULT NULL,
	"NetPrice"	REAL NOT NULL DEFAULT 0.0,
	"FileName"	TEXT,
	"Resolution"	TEXT,
	CONSTRAINT "fk_Product1" FOREIGN KEY("VATID") REFERENCES "VAT"("ID")
);
INSERT INTO Product VALUES(1,'Alps in Winter',1,'A beautiful view of the snowy alps',209.43999999999999772,'DSC_0723.jpg','6000x4000');
INSERT INTO Product VALUES(2,'Snowboard Jump',1,'A women jumping with a snowboard',54.369999999999997441,'0TH_6478.jpg','5497x3096');
INSERT INTO Product VALUES(3,'Koala in a tree',1,'A koala sitting in a tree',154.84999999999999431,'0TH_7839.jpg','6016x4016');
INSERT INTO Product VALUES(4,'The moon',1,'A clear view of the moon',205.28999999999999203,'0TH_1750.jpg','1646x926');
INSERT INTO Product VALUES(5,'The Weser by night',1,'Bremen by night with a ship on the Weser',241.41999999999998749,'0TH_0680.jpg','6016x4016');
INSERT INTO Product VALUES(6,'Farmer house with the Alps in the background',1,'A beautiful day at a farmer''s house with the snowy alps in the background',133.40000000000000568,'0TH_2688.jpg','5436x3058');
INSERT INTO Product VALUES(7,'Muddy Mountainbiker',1,'Muddy Mountainbiker at the Albstadt Mountainbike Cup',139.05000000000001137,'0TH_6828.jpg','6016x4016');
INSERT INTO Product VALUES(8,'Weird growing tree',1,'Weird growing tree in the botanical garden in Australia',151.78999999999999204,'0TH_8235.jpg','3677x5508');
INSERT INTO Product VALUES(9,'The Elphi',1,'The Elphilharmonie in Hamburg by night',11.740000000000000212,'0TH_1100.jpg','5965x2900');
INSERT INTO Product VALUES(10,'High jumping snowboarder',1,'A snowboarder, who jumps very high',58.109999999999999431,'0TH_6585.jpg','5610x3156');
INSERT INTO Product VALUES(11,'View on a hotel in the Yellow Mountains',1,'A view on a hotel in the Chinese Yellow Mountains on a sunny day',55.950000000000002843,'DSC01334.jpg','5472x3648');
INSERT INTO Product VALUES(12,'An abandoned quarry',1,'An abandoned quarry in south Germany',108.70999999999999374,'0TH_2913.jpg','6016x4016');
INSERT INTO Product VALUES(13,'The Colosseum',1,'The Colosseum by night',209.09999999999999431,'0TH_4454.jpg','6016x4016');
INSERT INTO Product VALUES(14,'A beautiful and colorful bird',1,'A beautiful and colorful bird in the wild',44.079999999999998293,'DH5_6452.jpg','6000x4000');
INSERT INTO Product VALUES(15,'View from the Cristo Redentor',1,'View from the Cristo Redentor the statue of Christ in Rio de Janeiro',151.61000000000001364,'DSC_1435.jpg','6000x4000');
INSERT INTO Product VALUES(16,'A zeppelin in the alps',1,'A zeppelin in the alps on a foggy day with the beautiful snowy alps in the background',188.15000000000000568,'0TH_2739.jpg','4901x2757');
INSERT INTO Product VALUES(17,'A landing pidgeon',1,'A landing pidgeon on a street',97.81000000000000227,'DSC_3135 (2).jpg','6016x4016');
INSERT INTO Product VALUES(18,'Mountainbiker going up the hill',1,'Muddy Mountainbiker at the Albstadt Mountainbike Cup going up the hill',133.18000000000000681,'0TH_6709.jpg','6016x4016');
INSERT INTO Product VALUES(19,'The Meeting of the Waters',1,'The Meeting of the Waters where the Rio Negro and the Solimoes River are meeting and becoming the Amazonas River',88.719999999999998863,'DSC_2976.jpg','6000x4000');
INSERT INTO Product VALUES(20,'Nightview from a bridge',1,'Nightview for a bridge in Bremen with a view to the Weser',167.99999999999999999,'0TH_0641-HDR.jpg','5995x4002');
INSERT INTO Product VALUES(21,'Crowdy Shanghai by night',1,'Shanghai at the golden week by night',222.72999999999998977,'0TH_1792.jpg','6016x4016');
INSERT INTO Product VALUES(22,'Foz do Iguazu',1,'Foz do Iguazu Waterfalls in Brasil',48.170000000000001705,'DSC_2040.jpg','6000x4000');
INSERT INTO Product VALUES(23,'Foz do Iguazu 2',1,'Foz do Iguazu Waterfalls in Brasil',100.65000000000000568,'DSC_2099.jpg','6000x4000');
INSERT INTO Product VALUES(24,'A portrait in Berlin',1,'A portrait in Berlin from a smiling girl',168.37000000000000454,'DSC05112.jpg','5472x3648');
INSERT INTO Product VALUES(25,'Streetview of the Colosseum by night',1,'Streetview of the Colosseum by night from a street',12.189999999999999502,'0TH_4458.jpg','5662x3477');
INSERT INTO Product VALUES(26,'A drinking animal',1,'A drinking animal in the zoo#',74.540000000000006252,'DSC02002.jpg','5472x3648');
INSERT INTO Product VALUES(27,'A hummingbird',1,'A hummingbird with its tongue',211.31999999999999317,'DH7_2364.jpg','5335x3557');
INSERT INTO Product VALUES(28,'Yellow Mountains 2',1,'A view from the Yellow Mountains in China',154.21000000000000796,'DSC01345-Pano.jpg','8174x4357');
INSERT INTO Product VALUES(29,'The Twelve Apostels in Australia',1,'The Twelve Apostels in Australia on a cloudy day',189.77000000000001023,'0TH_8592.jpg','6016x4016');
INSERT INTO Product VALUES(30,'Playing elephant babies in the zoo',1,'Playing and cuddling elephant babies',112.79000000000000625,'DSC02048.jpg','5472x3648');
INSERT INTO Product VALUES(31,'A coockabara in Australia',1,'A coockabara in Australia sitting on a stone',189.7599999999999909,'0TH_7645.jpg','6016x4016');
INSERT INTO Product VALUES(32,'Chinese industry',1,'Chinese industry in the 578 Art district',186.3300000000000125,'0TH_4862.jpg','6016x4016');
INSERT INTO Product VALUES(33,'Portrait of a smiling girl in Berlin',1,'Portrait of a smiling girl in Berlin on a cloudy day',95.349999999999994317,'DSC05123.jpg','5472x2984');
INSERT INTO Product VALUES(34,'Muddy Mountainbiker jumping',1,'Muddy Mountainbiker jumping in a race',186.88999999999998635,'0TH_6817.jpg','5655x3181');
INSERT INTO Product VALUES(35,'A baby wild hog',1,'A baby wild hog sniffing the ground',120.28000000000000113,'DH5_6643.jpg','6000x4000');
INSERT INTO Product VALUES(36,'Old electrics',1,'Old electricts in a abandoned place',116.20000000000000284,'0TH_2920.jpg','4016x6016');
INSERT INTO Product VALUES(37,'A guy in his small boat on the Amazonas',1,'A guy in his small boat on the Amazonas trying to get the water out of the boat',63.74000000000000199,'DSC_2765.jpg','6000x4000');
INSERT INTO Product VALUES(38,'The volcano of Tenerife',1,'The volcano of Tenerife at a sunny day',36.170000000000001704,'0TH_1553.jpg','5840x3285');
INSERT INTO Product VALUES(39,'Snowy Alps on a beautiful sunny day',1,'Snowy Alps on a beautiful sunny day and just a view clouds',76.049999999999997159,'DSC_0730.jpg','6000x4000');
INSERT INTO Product VALUES(40,'Handball player throwing a goal',1,'Handball player throwing a goal and lying on the ground',244.94999999999998864,'0TH_6059.jpg','5742x3910');
INSERT INTO Product VALUES(41,'Christ the Redeemer',1,'Christ the Redeemer covered in fog',167.34000000000000341,'DSC_1337.jpg','5734x3823');
INSERT INTO Product VALUES(42,'A small wallaby eating of a human hand',1,'A small wallaby eating some food of a human hand',86.23000000000000398,'0TH_7985.jpg','6016x4016');
INSERT INTO Product VALUES(43,'A table full of aboslutely tasty food',1,'A table full of aboslutely tasty food at a barbecue party',236.99999999999999998,'DSC05899.jpg','3648x5472');
INSERT INTO Product VALUES(44,'An eye',1,'Macro photo of an eye',148.36000000000001364,'DSC_0400.jpg','6000x4000');
INSERT INTO Product VALUES(45,'The big roundabout in Shanghai',1,'The big roundabout in Shanghai on a sunny da',82.48000000000000398,'DSC_4474.jpg','6000x4000');
INSERT INTO Product VALUES(46,'A cliff in Australia',1,'A cliff at the Australian Big Ocean Road',144.71000000000000796,'0TH_8491-Pano.jpg','7952x4584');
INSERT INTO Product VALUES(47,'Jumping Snowboarder',1,'Jumping snowboarder in the alps',218.47999999999998977,'0TH_6586.jpg','5214x2933');
INSERT INTO Product VALUES(48,'A car on the side of the road at Tenerife',1,'A car on the side of the road at Tenerife with a cloudy background',213.44999999999998863,'0TH_1535.jpg','6016x4016');
INSERT INTO Product VALUES(49,'A small river in Australia',1,'A small river in Australia in a forrest',14.249999999999999999,'0TH_8669.jpg','6016x4016');
INSERT INTO Product VALUES(50,'Some Houses with mountains in the background',1,'Some Houses with mountains in the background Tenerife',75.329999999999998293,'0TH_1181.jpg','6016x4016');
INSERT INTO Product VALUES(51,'Cable car in China',1,'Cable car in China in the mountains',61.859999999999999431,'0TH_5188.jpg','4016x6016');
INSERT INTO Product VALUES(52,'The funny brothers',1,'The funny brothers playing',95.989999999999994885,'0TH_0516.jpg','5436x3629');
INSERT INTO Product VALUES(53,'Dry ground of Tenerife',1,'Dry ground of Tenerife with dry plants',90.890000000000000564,'0TH_1586.jpg','6016x4016');
INSERT INTO Product VALUES(54,'The biggest skyscrapers of Shanghai',1,'The skyscraper trio',87.39000000000000057,'0TH_2011.jpg','6016x4016');
INSERT INTO Product VALUES(55,'The Chinese Great Wall',1,'The Chinese Great Wall',56.479999999999996873,'0TH_4969.jpg','6016x4016');
INSERT INTO Product VALUES(56,'Small city on the bottom of the Yellow Mountains',1,'Small city on the bottom of the Yellow Mountains in China',86.810000000000002275,'DSC01507.jpg','5472x3648');
INSERT INTO Product VALUES(57,'A Ferrari',1,'A Ferrari in France',145.0900000000000034,'DSC_0984.jpg','6000x4000');
INSERT INTO Product VALUES(58,'An angry lookin bird',1,'An angry lookin bird with colourful feathers',64.329999999999998294,'DSC_3448.jpg','6000x4000');
INSERT INTO Product VALUES(59,'A sleeping wild hog',1,'A sleeping wild hog covered in mud',177.46999999999999886,'DH5_6634.jpg','6000x4000');
INSERT INTO Product VALUES(60,'Cable car at the German Pfaender',1,'Cable car at the German Pfaender',185.43000000000000681,'0TH_2717.jpg','5833x3975');
INSERT INTO Product VALUES(61,'Windsurfer in Action',1,'Windsurfer in Action on a cloudy day',53.659999999999996589,'0TH_0703.jpg','5984x2921');
INSERT INTO Product VALUES(62,'A ship at the port of Hamburg',1,'Nightview of a ship at the port of Hamburg',131.53999999999999204,'0TH_1109.jpg','5934x3961');
INSERT INTO Product VALUES(63,'Makro view of an abandoned industry controller',1,'Makro view of an abandoned industry controller',225.27000000000001022,'0TH_3043.jpg','6016x4016');
CREATE TABLE IF NOT EXISTS "Tags" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"Name"	TEXT NOT NULL
);
INSERT INTO Tags VALUES(1,'tenerife');
INSERT INTO Tags VALUES(2,'animals');
INSERT INTO Tags VALUES(3,'industry');
INSERT INTO Tags VALUES(4,'rome');
INSERT INTO Tags VALUES(5,'china');
INSERT INTO Tags VALUES(6,'cars');
INSERT INTO Tags VALUES(7,'nightshot');
INSERT INTO Tags VALUES(8,'nature');
INSERT INTO Tags VALUES(9,'mountains');
INSERT INTO Tags VALUES(10,'snow');
INSERT INTO Tags VALUES(11,'sports');
INSERT INTO Tags VALUES(12,'mountainbike');
INSERT INTO Tags VALUES(13,'handball');
INSERT INTO Tags VALUES(14,'skiing');
INSERT INTO Tags VALUES(15,'makro');
INSERT INTO Tags VALUES(16,'humans');
INSERT INTO Tags VALUES(17,'brazil');
INSERT INTO Tags VALUES(18,'australia');
INSERT INTO Tags VALUES(19,'wildlife');
INSERT INTO Tags VALUES(20,'food');
INSERT INTO Tags VALUES(21,'portraits');
CREATE TABLE IF NOT EXISTS "PaymentMethod" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"Title"	TEXT NOT NULL
);
INSERT INTO PaymentMethod VALUES(1,'PayPal');
INSERT INTO PaymentMethod VALUES(2,'Credit Card');
INSERT INTO PaymentMethod VALUES(3,'SEPA');
CREATE TABLE IF NOT EXISTS "VAT" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"Title"	TEXT NOT NULL,
	"Percentage"	REAL NOT NULL DEFAULT 19.0
);
INSERT INTO VAT VALUES(1,'Normal',19.0);
INSERT INTO VAT VALUES(2,'Reduced',7.0);
CREATE TABLE IF NOT EXISTS "Country" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"Code"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL
);
INSERT INTO Country VALUES(1,'AF','Afghanistan');
INSERT INTO Country VALUES(2,'AL','Albania');
INSERT INTO Country VALUES(3,'DZ','Algeria');
INSERT INTO Country VALUES(4,'DS','American Samoa');
INSERT INTO Country VALUES(5,'AD','Andorra');
INSERT INTO Country VALUES(6,'AO','Angola');
INSERT INTO Country VALUES(7,'AI','Anguilla');
INSERT INTO Country VALUES(8,'AQ','Antarctica');
INSERT INTO Country VALUES(9,'AG','Antigua and Barbuda');
INSERT INTO Country VALUES(10,'AR','Argentina');
INSERT INTO Country VALUES(11,'AM','Armenia');
INSERT INTO Country VALUES(12,'AW','Aruba');
INSERT INTO Country VALUES(13,'AU','Australia');
INSERT INTO Country VALUES(14,'AT','Austria');
INSERT INTO Country VALUES(15,'AZ','Azerbaijan');
INSERT INTO Country VALUES(16,'BS','Bahamas');
INSERT INTO Country VALUES(17,'BH','Bahrain');
INSERT INTO Country VALUES(18,'BD','Bangladesh');
INSERT INTO Country VALUES(19,'BB','Barbados');
INSERT INTO Country VALUES(20,'BY','Belarus');
INSERT INTO Country VALUES(21,'BE','Belgium');
INSERT INTO Country VALUES(22,'BZ','Belize');
INSERT INTO Country VALUES(23,'BJ','Benin');
INSERT INTO Country VALUES(24,'BM','Bermuda');
INSERT INTO Country VALUES(25,'BT','Bhutan');
INSERT INTO Country VALUES(26,'BO','Bolivia');
INSERT INTO Country VALUES(27,'BA','Bosnia and Herzegovina');
INSERT INTO Country VALUES(28,'BW','Botswana');
INSERT INTO Country VALUES(29,'BV','Bouvet Island');
INSERT INTO Country VALUES(30,'BR','Brazil');
INSERT INTO Country VALUES(31,'IO','British Indian Ocean Territory');
INSERT INTO Country VALUES(32,'BN','Brunei Darussalam');
INSERT INTO Country VALUES(33,'BG','Bulgaria');
INSERT INTO Country VALUES(34,'BF','Burkina Faso');
INSERT INTO Country VALUES(35,'BI','Burundi');
INSERT INTO Country VALUES(36,'KH','Cambodia');
INSERT INTO Country VALUES(37,'CM','Cameroon');
INSERT INTO Country VALUES(38,'CA','Canada');
INSERT INTO Country VALUES(39,'CV','Cape Verde');
INSERT INTO Country VALUES(40,'KY','Cayman Islands');
INSERT INTO Country VALUES(41,'CF','Central African Republic');
INSERT INTO Country VALUES(42,'TD','Chad');
INSERT INTO Country VALUES(43,'CL','Chile');
INSERT INTO Country VALUES(44,'CN','China');
INSERT INTO Country VALUES(45,'CX','Christmas Island');
INSERT INTO Country VALUES(46,'CC','Cocos (Keeling) Islands');
INSERT INTO Country VALUES(47,'CO','Colombia');
INSERT INTO Country VALUES(48,'KM','Comoros');
INSERT INTO Country VALUES(49,'CD','Democratic Republic of the Congo');
INSERT INTO Country VALUES(50,'CG','Republic of Congo');
INSERT INTO Country VALUES(51,'CK','Cook Islands');
INSERT INTO Country VALUES(52,'CR','Costa Rica');
INSERT INTO Country VALUES(53,'HR','Croatia (Hrvatska)');
INSERT INTO Country VALUES(54,'CU','Cuba');
INSERT INTO Country VALUES(55,'CY','Cyprus');
INSERT INTO Country VALUES(56,'CZ','Czech Republic');
INSERT INTO Country VALUES(57,'DK','Denmark');
INSERT INTO Country VALUES(58,'DJ','Djibouti');
INSERT INTO Country VALUES(59,'DM','Dominica');
INSERT INTO Country VALUES(60,'DO','Dominican Republic');
INSERT INTO Country VALUES(61,'TP','East Timor');
INSERT INTO Country VALUES(62,'EC','Ecuador');
INSERT INTO Country VALUES(63,'EG','Egypt');
INSERT INTO Country VALUES(64,'SV','El Salvador');
INSERT INTO Country VALUES(65,'GQ','Equatorial Guinea');
INSERT INTO Country VALUES(66,'ER','Eritrea');
INSERT INTO Country VALUES(67,'EE','Estonia');
INSERT INTO Country VALUES(68,'ET','Ethiopia');
INSERT INTO Country VALUES(69,'FK','Falkland Islands (Malvinas)');
INSERT INTO Country VALUES(70,'FO','Faroe Islands');
INSERT INTO Country VALUES(71,'FJ','Fiji');
INSERT INTO Country VALUES(72,'FI','Finland');
INSERT INTO Country VALUES(73,'FR','France');
INSERT INTO Country VALUES(74,'FX','France, Metropolitan');
INSERT INTO Country VALUES(75,'GF','French Guiana');
INSERT INTO Country VALUES(76,'PF','French Polynesia');
INSERT INTO Country VALUES(77,'TF','French Southern Territories');
INSERT INTO Country VALUES(78,'GA','Gabon');
INSERT INTO Country VALUES(79,'GM','Gambia');
INSERT INTO Country VALUES(80,'GE','Georgia');
INSERT INTO Country VALUES(81,'DE','Germany');
INSERT INTO Country VALUES(82,'GH','Ghana');
INSERT INTO Country VALUES(83,'GI','Gibraltar');
INSERT INTO Country VALUES(84,'GK','Guernsey');
INSERT INTO Country VALUES(85,'GR','Greece');
INSERT INTO Country VALUES(86,'GL','Greenland');
INSERT INTO Country VALUES(87,'GD','Grenada');
INSERT INTO Country VALUES(88,'GP','Guadeloupe');
INSERT INTO Country VALUES(89,'GU','Guam');
INSERT INTO Country VALUES(90,'GT','Guatemala');
INSERT INTO Country VALUES(91,'GN','Guinea');
INSERT INTO Country VALUES(92,'GW','Guinea-Bissau');
INSERT INTO Country VALUES(93,'GY','Guyana');
INSERT INTO Country VALUES(94,'HT','Haiti');
INSERT INTO Country VALUES(95,'HM','Heard and Mc Donald Islands');
INSERT INTO Country VALUES(96,'HN','Honduras');
INSERT INTO Country VALUES(97,'HK','Hong Kong');
INSERT INTO Country VALUES(98,'HU','Hungary');
INSERT INTO Country VALUES(99,'IS','Iceland');
INSERT INTO Country VALUES(100,'IN','India');
INSERT INTO Country VALUES(101,'IM','Isle of Man');
INSERT INTO Country VALUES(102,'ID','Indonesia');
INSERT INTO Country VALUES(103,'IR','Iran (Islamic Republic of)');
INSERT INTO Country VALUES(104,'IQ','Iraq');
INSERT INTO Country VALUES(105,'IE','Ireland');
INSERT INTO Country VALUES(106,'IL','Israel');
INSERT INTO Country VALUES(107,'IT','Italy');
INSERT INTO Country VALUES(108,'CI','Ivory Coast');
INSERT INTO Country VALUES(109,'JE','Jersey');
INSERT INTO Country VALUES(110,'JM','Jamaica');
INSERT INTO Country VALUES(111,'JP','Japan');
INSERT INTO Country VALUES(112,'JO','Jordan');
INSERT INTO Country VALUES(113,'KZ','Kazakhstan');
INSERT INTO Country VALUES(114,'KE','Kenya');
INSERT INTO Country VALUES(115,'KI','Kiribati');
INSERT INTO Country VALUES(116,'KP','Korea, Democratic People''s Republic of');
INSERT INTO Country VALUES(117,'KR','Korea, Republic of');
INSERT INTO Country VALUES(118,'XK','Kosovo');
INSERT INTO Country VALUES(119,'KW','Kuwait');
INSERT INTO Country VALUES(120,'KG','Kyrgyzstan');
INSERT INTO Country VALUES(121,'LA','Lao People''s Democratic Republic');
INSERT INTO Country VALUES(122,'LV','Latvia');
INSERT INTO Country VALUES(123,'LB','Lebanon');
INSERT INTO Country VALUES(124,'LS','Lesotho');
INSERT INTO Country VALUES(125,'LR','Liberia');
INSERT INTO Country VALUES(126,'LY','Libyan Arab Jamahiriya');
INSERT INTO Country VALUES(127,'LI','Liechtenstein');
INSERT INTO Country VALUES(128,'LT','Lithuania');
INSERT INTO Country VALUES(129,'LU','Luxembourg');
INSERT INTO Country VALUES(130,'MO','Macau');
INSERT INTO Country VALUES(131,'MK','North Macedonia');
INSERT INTO Country VALUES(132,'MG','Madagascar');
INSERT INTO Country VALUES(133,'MW','Malawi');
INSERT INTO Country VALUES(134,'MY','Malaysia');
INSERT INTO Country VALUES(135,'MV','Maldives');
INSERT INTO Country VALUES(136,'ML','Mali');
INSERT INTO Country VALUES(137,'MT','Malta');
INSERT INTO Country VALUES(138,'MH','Marshall Islands');
INSERT INTO Country VALUES(139,'MQ','Martinique');
INSERT INTO Country VALUES(140,'MR','Mauritania');
INSERT INTO Country VALUES(141,'MU','Mauritius');
INSERT INTO Country VALUES(142,'TY','Mayotte');
INSERT INTO Country VALUES(143,'MX','Mexico');
INSERT INTO Country VALUES(144,'FM','Micronesia, Federated States of');
INSERT INTO Country VALUES(145,'MD','Moldova, Republic of');
INSERT INTO Country VALUES(146,'MC','Monaco');
INSERT INTO Country VALUES(147,'MN','Mongolia');
INSERT INTO Country VALUES(148,'ME','Montenegro');
INSERT INTO Country VALUES(149,'MS','Montserrat');
INSERT INTO Country VALUES(150,'MA','Morocco');
INSERT INTO Country VALUES(151,'MZ','Mozambique');
INSERT INTO Country VALUES(152,'MM','Myanmar');
INSERT INTO Country VALUES(153,'NA','Namibia');
INSERT INTO Country VALUES(154,'NR','Nauru');
INSERT INTO Country VALUES(155,'NP','Nepal');
INSERT INTO Country VALUES(156,'NL','Netherlands');
INSERT INTO Country VALUES(157,'AN','Netherlands Antilles');
INSERT INTO Country VALUES(158,'NC','New Caledonia');
INSERT INTO Country VALUES(159,'NZ','New Zealand');
INSERT INTO Country VALUES(160,'NI','Nicaragua');
INSERT INTO Country VALUES(161,'NE','Niger');
INSERT INTO Country VALUES(162,'NG','Nigeria');
INSERT INTO Country VALUES(163,'NU','Niue');
INSERT INTO Country VALUES(164,'NF','Norfolk Island');
INSERT INTO Country VALUES(165,'MP','Northern Mariana Islands');
INSERT INTO Country VALUES(166,'NO','Norway');
INSERT INTO Country VALUES(167,'OM','Oman');
INSERT INTO Country VALUES(168,'PK','Pakistan');
INSERT INTO Country VALUES(169,'PW','Palau');
INSERT INTO Country VALUES(170,'PS','Palestine');
INSERT INTO Country VALUES(171,'PA','Panama');
INSERT INTO Country VALUES(172,'PG','Papua New Guinea');
INSERT INTO Country VALUES(173,'PY','Paraguay');
INSERT INTO Country VALUES(174,'PE','Peru');
INSERT INTO Country VALUES(175,'PH','Philippines');
INSERT INTO Country VALUES(176,'PN','Pitcairn');
INSERT INTO Country VALUES(177,'PL','Poland');
INSERT INTO Country VALUES(178,'PT','Portugal');
INSERT INTO Country VALUES(179,'PR','Puerto Rico');
INSERT INTO Country VALUES(180,'QA','Qatar');
INSERT INTO Country VALUES(181,'RE','Reunion');
INSERT INTO Country VALUES(182,'RO','Romania');
INSERT INTO Country VALUES(183,'RU','Russian Federation');
INSERT INTO Country VALUES(184,'RW','Rwanda');
INSERT INTO Country VALUES(185,'KN','Saint Kitts and Nevis');
INSERT INTO Country VALUES(186,'LC','Saint Lucia');
INSERT INTO Country VALUES(187,'VC','Saint Vincent and the Grenadines');
INSERT INTO Country VALUES(188,'WS','Samoa');
INSERT INTO Country VALUES(189,'SM','San Marino');
INSERT INTO Country VALUES(190,'ST','Sao Tome and Principe');
INSERT INTO Country VALUES(191,'SA','Saudi Arabia');
INSERT INTO Country VALUES(192,'SN','Senegal');
INSERT INTO Country VALUES(193,'RS','Serbia');
INSERT INTO Country VALUES(194,'SC','Seychelles');
INSERT INTO Country VALUES(195,'SL','Sierra Leone');
INSERT INTO Country VALUES(196,'SG','Singapore');
INSERT INTO Country VALUES(197,'SK','Slovakia');
INSERT INTO Country VALUES(198,'SI','Slovenia');
INSERT INTO Country VALUES(199,'SB','Solomon Islands');
INSERT INTO Country VALUES(200,'SO','Somalia');
INSERT INTO Country VALUES(201,'ZA','South Africa');
INSERT INTO Country VALUES(202,'GS','South Georgia South Sandwich Islands');
INSERT INTO Country VALUES(203,'SS','South Sudan');
INSERT INTO Country VALUES(204,'ES','Spain');
INSERT INTO Country VALUES(205,'LK','Sri Lanka');
INSERT INTO Country VALUES(206,'SH','St. Helena');
INSERT INTO Country VALUES(207,'PM','St. Pierre and Miquelon');
INSERT INTO Country VALUES(208,'SD','Sudan');
INSERT INTO Country VALUES(209,'SR','Suriname');
INSERT INTO Country VALUES(210,'SJ','Svalbard and Jan Mayen Islands');
INSERT INTO Country VALUES(211,'SZ','Swaziland');
INSERT INTO Country VALUES(212,'SE','Sweden');
INSERT INTO Country VALUES(213,'CH','Switzerland');
INSERT INTO Country VALUES(214,'SY','Syrian Arab Republic');
INSERT INTO Country VALUES(215,'TW','Taiwan');
INSERT INTO Country VALUES(216,'TJ','Tajikistan');
INSERT INTO Country VALUES(217,'TZ','Tanzania, United Republic of');
INSERT INTO Country VALUES(218,'TH','Thailand');
INSERT INTO Country VALUES(219,'TG','Togo');
INSERT INTO Country VALUES(220,'TK','Tokelau');
INSERT INTO Country VALUES(221,'TO','Tonga');
INSERT INTO Country VALUES(222,'TT','Trinidad and Tobago');
INSERT INTO Country VALUES(223,'TN','Tunisia');
INSERT INTO Country VALUES(224,'TR','Turkey');
INSERT INTO Country VALUES(225,'TM','Turkmenistan');
INSERT INTO Country VALUES(226,'TC','Turks and Caicos Islands');
INSERT INTO Country VALUES(227,'TV','Tuvalu');
INSERT INTO Country VALUES(228,'UG','Uganda');
INSERT INTO Country VALUES(229,'UA','Ukraine');
INSERT INTO Country VALUES(230,'AE','United Arab Emirates');
INSERT INTO Country VALUES(231,'GB','United Kingdom');
INSERT INTO Country VALUES(232,'US','United States');
INSERT INTO Country VALUES(233,'UM','United States minor outlying islands');
INSERT INTO Country VALUES(234,'UY','Uruguay');
INSERT INTO Country VALUES(235,'UZ','Uzbekistan');
INSERT INTO Country VALUES(236,'VU','Vanuatu');
INSERT INTO Country VALUES(237,'VA','Vatican City State');
INSERT INTO Country VALUES(238,'VE','Venezuela');
INSERT INTO Country VALUES(239,'VN','Vietnam');
INSERT INTO Country VALUES(240,'VG','Virgin Islands (British)');
INSERT INTO Country VALUES(241,'VI','Virgin Islands (U.S.)');
INSERT INTO Country VALUES(242,'WF','Wallis and Futuna Islands');
INSERT INTO Country VALUES(243,'EH','Western Sahara');
INSERT INTO Country VALUES(244,'YE','Yemen');
INSERT INTO Country VALUES(245,'ZM','Zambia');
INSERT INTO Country VALUES(246,'ZW','Zimbabwe');
CREATE TABLE IF NOT EXISTS "Order" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"OrderDate"	TEXT NOT NULL,
	"CustomerID"	INTEGER DEFAULT NULL,
	"PaymentID"	INTEGER NOT NULL,
	CONSTRAINT "fk_Order2" FOREIGN KEY("PaymentID") REFERENCES "PaymentMethod"("ID"),
	CONSTRAINT "fk_Order1" FOREIGN KEY("CustomerID") REFERENCES "Customer"("ID")
);
CREATE TABLE IF NOT EXISTS "OrderPosition" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"OrderID"	INTEGER NOT NULL,
	"ProductID"	INTEGER NOT NULL,
	"Amount"	INTEGER NOT NULL DEFAULT 1,
	"UUID"		TEXT,
	CONSTRAINT "fk_OrderPosition2" FOREIGN KEY("ProductID") REFERENCES "Product"("ID"),
	CONSTRAINT "fk_OrderPosition1" FOREIGN KEY("OrderID") REFERENCES "Order"("ID")
);
CREATE TABLE IF NOT EXISTS "Customer" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"Title"	INTEGER NOT NULL DEFAULT 0,
	"Name"	TEXT NOT NULL,
	"Surname"	TEXT NOT NULL,
	"addressID"	INTEGER NOT NULL,
	"PhoneNumber"	TEXT NOT NULL,
	"Mail"	TEXT NOT NULL,
	"DateOfBirth"	TEXT DEFAULT NULL,
	"Newsletter"	INTEGER,
	CONSTRAINT "fk_Person1" FOREIGN KEY("addressID") REFERENCES "Address"("ID")
);
CREATE TABLE IF NOT EXISTS "Address" (
	"ID"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"Street"	TEXT NOT NULL,
	"Number"	TEXT NOT NULL,
	"AdditionalAddressInfo"	TEXT NOT NULL,
	"ZIP"	TEXT NOT NULL,
	"City"	TEXT NOT NULL,
	"CountryID"	INTEGER NOT NULL,
	CONSTRAINT "fk_address1" FOREIGN KEY("CountryID") REFERENCES "Country"("ID")
);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Sales',2);
INSERT INTO sqlite_sequence VALUES('Product',63);
INSERT INTO sqlite_sequence VALUES('Tags',21);
INSERT INTO sqlite_sequence VALUES('VAT',2);
INSERT INTO sqlite_sequence VALUES('Country',246);
INSERT INTO sqlite_sequence VALUES('Customer',0);
INSERT INTO sqlite_sequence VALUES('Address',0);
INSERT INTO sqlite_sequence VALUES('PaymentMethod',3);
COMMIT;
